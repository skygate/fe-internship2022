const { expect } = require("chai");
const { ethers } = require("hardhat");
const { getGasUsedForLastTx, calculatePercentageInWei } = require("../utils");

describe("TEST BaseERC721", async () => {
    const metadataURI = "cid/test.png";
    const addrNull = "0x0000000000000000000000000000000000000000";

    const DECIMALS = "18";
    const INITIAL_PRICE = "200000000000000000000";

    let myBaseERC721;
    let owner;
    let addr1;
    let addr2;
    let addrs;

    beforeEach(async () => {
        const MyMockV3Aggregator = await ethers.getContractFactory(
            "MyMockV3Aggregator"
        );
        myMockV3Aggregator = await MyMockV3Aggregator.deploy(
            DECIMALS,
            INITIAL_PRICE
        );
        await myMockV3Aggregator.deployed();

        const BaseERC721 = await ethers.getContractFactory("BaseERC721");
        myBaseERC721 = await BaseERC721.deploy(
            "My base ERC721",
            "Base ERC721",
            myMockV3Aggregator.address
        );
        await myBaseERC721.deployed();
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    });

    describe("TEST V3Aggregator", async () => {
        it("PASS - getLatestPrice()", async () => {
            let result = await myBaseERC721.getLatestPrice();
            expect(new ethers.BigNumber.from(result._hex).toString())
                .equals(INITIAL_PRICE)
                .toString();
        });
    });

    describe("TEST payToMint()", async () => {
        it("PASS", async () => {
            let balance = await myBaseERC721
                .connect(addr1)
                .balanceOf(addr1.address);
            expect(balance).to.equal(0);

            const newlyMintedToken = await myBaseERC721
                .connect(addr1)
                .payToMint(addr1.address, metadataURI, {
                    value: ethers.utils.parseEther("0.05"),
                });
            await newlyMintedToken.wait();

            balance = await myBaseERC721
                .connect(addr1)
                .balanceOf(addr1.address);
            expect(balance).to.equal(1);

            const nft_owner = await myBaseERC721.connect(addr1).ownerOf(0);
            expect(nft_owner).to.equal(addr1.address);

            const currentCounter = await myBaseERC721.connect(addr1).count();
            expect(currentCounter).to.equal(1);
        });
    });

    describe("TEST safeMint()", async () => {
        it("PASS - for owner", async () => {
            let balance = await myBaseERC721
                .connect(owner)
                .balanceOf(owner.address);
            expect(balance).to.equal(0);

            const newlyMintedToken = await myBaseERC721
                .connect(owner)
                .safeMint(owner.address, metadataURI);
            await newlyMintedToken.wait();

            balance = await myBaseERC721
                .connect(owner)
                .balanceOf(owner.address);
            expect(balance).to.equal(1);

            const nft_owner = await myBaseERC721.connect(owner).ownerOf(0);
            expect(nft_owner).to.equal(owner.address);

            const currentCounter = await myBaseERC721.connect(owner).count();
            expect(currentCounter).to.equal(1);
        });

        it("FAIL - for not owner", async () => {
            let balance = await myBaseERC721
                .connect(addr2)
                .balanceOf(addr2.address);
            expect(balance).to.equal(0);

            await expect(
                myBaseERC721.connect(addr2).safeMint(addr2.address, metadataURI)
            ).to.be.revertedWith("Ownable: caller is not the owner");

            balance = await myBaseERC721
                .connect(addr2)
                .balanceOf(addr2.address);
            expect(balance).to.equal(0);

            const currentCounter = await myBaseERC721.connect(addr2).count();
            expect(currentCounter).to.equal(0);
        });
    });

    describe("TEST startSale()", async () => {
        it("PASS", async () => {
            const sellPrice = ethers.utils.parseEther("0.5");
            const tokenId = 0;
            const mintTx = await myBaseERC721
                .connect(addr1)
                .payToMint(addr1.address, metadataURI, {
                    value: ethers.utils.parseEther("0.05"),
                });
            await mintTx.wait();

            const putOnSaleTx = await myBaseERC721
                .connect(addr1)
                .startSale(tokenId, sellPrice);
            await putOnSaleTx.wait();

            expect(
                await myBaseERC721.connect(addr1).tokenIdToPriceOnSale(tokenId)
            ).to.equal(sellPrice);
            expect(await myBaseERC721.connect(addr1).ownerOf(tokenId)).to.equal(
                myBaseERC721.address
            );
            expect(
                await myBaseERC721
                    .connect(addr1)
                    .tokenIdToOwnerAddressOnSale(tokenId)
            ).to.equal(addr1.address);
        });

        it("FAIL - not onwer of token", async () => {
            const sellPrice = ethers.utils.parseEther("0.5");
            const tokenId = 0;
            const mintTx = await myBaseERC721
                .connect(addr1)
                .payToMint(addr1.address, metadataURI, {
                    value: ethers.utils.parseEther("0.05"),
                });
            await mintTx.wait();

            await expect(
                myBaseERC721.connect(addr2).startSale(tokenId, sellPrice)
            ).to.be.revertedWith(
                "Cant perform this action, you must be owner of this token!"
            );

            expect(
                await myBaseERC721.connect(addr1).tokenIdToPriceOnSale(tokenId)
            ).to.equal(0);
            expect(await myBaseERC721.connect(addr1).ownerOf(tokenId)).to.equal(
                addr1.address
            );
            expect(
                await myBaseERC721
                    .connect(addr1)
                    .tokenIdToOwnerAddressOnSale(tokenId)
            ).to.equal(addrNull);
        });

        it("FAIL - sale for 0 ETH", async () => {
            const tokenId = 0;
            const mintTx = await myBaseERC721
                .connect(addr1)
                .payToMint(addr1.address, metadataURI, {
                    value: ethers.utils.parseEther("0.05"),
                });
            await mintTx.wait();

            await expect(
                myBaseERC721.connect(addr1).startSale(tokenId, 0)
            ).to.be.revertedWith("Can not sale for 0 ETH!");

            expect(
                await myBaseERC721.connect(addr1).tokenIdToPriceOnSale(tokenId)
            ).to.equal(0);
            expect(await myBaseERC721.connect(addr1).ownerOf(tokenId)).to.equal(
                addr1.address
            );
            expect(
                await myBaseERC721
                    .connect(addr1)
                    .tokenIdToOwnerAddressOnSale(tokenId)
            ).to.equal(addrNull);
        });
    });

    describe("TEST cancelSale()", async () => {
        it("PASS", async () => {
            const sellPrice = ethers.utils.parseEther("0.5");
            const tokenId = 0;
            const mintTx = await myBaseERC721
                .connect(addr1)
                .payToMint(addr1.address, metadataURI, {
                    value: ethers.utils.parseEther("0.05"),
                });
            await mintTx.wait();

            const putOnSaleTx = await myBaseERC721
                .connect(addr1)
                .startSale(tokenId, sellPrice);
            await putOnSaleTx.wait();

            const cancelTheSaleTX = await myBaseERC721
                .connect(addr1)
                .cancelSale(tokenId);
            await cancelTheSaleTX.wait();

            expect(await myBaseERC721.connect(addr1).ownerOf(tokenId)).to.equal(
                addr1.address
            );
            expect(
                await myBaseERC721
                    .connect(addr1)
                    .tokenIdToOwnerAddressOnSale(tokenId)
            ).to.equal(addrNull);
            expect(
                await myBaseERC721.connect(addr1).tokenIdToPriceOnSale(tokenId)
            ).to.equal(0);
        });

        it("FAIL - not onwer of token", async () => {
            const sellPrice = ethers.utils.parseEther("0.5");
            const tokenId = 0;
            const mintTx = await myBaseERC721
                .connect(addr1)
                .payToMint(addr1.address, metadataURI, {
                    value: ethers.utils.parseEther("0.05"),
                });
            await mintTx.wait();

            const putOnSaleTx = await myBaseERC721
                .connect(addr1)
                .startSale(tokenId, sellPrice);
            await putOnSaleTx.wait();

            await expect(
                myBaseERC721.connect(addr2).cancelSale(tokenId)
            ).to.be.revertedWith(
                "Cant perform this action, you must be owner of this token!"
            );

            expect(
                await myBaseERC721.connect(addr1).tokenIdToPriceOnSale(tokenId)
            ).to.equal(sellPrice);
            expect(await myBaseERC721.connect(addr1).ownerOf(tokenId)).to.equal(
                myBaseERC721.address
            );
            expect(
                await myBaseERC721
                    .connect(addr1)
                    .tokenIdToOwnerAddressOnSale(tokenId)
            ).to.equal(addr1.address);
        });

        it("FAIL - sale not started", async () => {
            const tokenId = 0;
            const mintTx = await myBaseERC721
                .connect(addr1)
                .payToMint(addr1.address, metadataURI, {
                    value: ethers.utils.parseEther("0.05"),
                });
            await mintTx.wait();

            await expect(
                myBaseERC721.connect(addr1).cancelSale(tokenId)
            ).to.be.revertedWith(
                "Cant perform this action, token is not on sale!"
            );

            expect(
                await myBaseERC721.connect(addr1).tokenIdToPriceOnSale(tokenId)
            ).to.equal(0);
            expect(await myBaseERC721.connect(addr1).ownerOf(tokenId)).to.equal(
                addr1.address
            );
            expect(
                await myBaseERC721
                    .connect(addr1)
                    .tokenIdToOwnerAddressOnSale(tokenId)
            ).to.equal(addrNull);
        });
    });

    describe("TEST buyTokenOnSale()", async () => {
        it("PASS", async () => {
            const sellPrice = ethers.utils.parseEther("0.5");
            const tokenId = 0;
            const mintTx = await myBaseERC721
                .connect(addr1)
                .payToMint(addr1.address, metadataURI, {
                    value: ethers.utils.parseEther("0.05"),
                });
            await mintTx.wait();

            const putOnSaleTx = await myBaseERC721
                .connect(addr1)
                .startSale(tokenId, sellPrice);
            await putOnSaleTx.wait();

            const addr1BalanceBefor = await addr1.getBalance();
            const addr2BalanceBefor = await addr2.getBalance();
            const contractBalanceBefor = await ethers.provider.getBalance(
                myBaseERC721.address
            );

            await myBaseERC721
                .connect(addr2)
                .buyTokenOnSale(tokenId, { value: sellPrice });

            const gasUsed = await getGasUsedForLastTx();
            const ethersForContract = await calculatePercentageInWei(
                sellPrice,
                await myBaseERC721.transactionFee()
            );

            expect(await myBaseERC721.connect(addr2).ownerOf(tokenId)).to.equal(
                addr2.address
            );
            expect(
                await myBaseERC721.connect(addr2).tokenIdToPriceOnSale(tokenId)
            ).to.equal(0);
            expect(
                await myBaseERC721
                    .connect(addr2)
                    .tokenIdToOwnerAddressOnSale(tokenId)
            ).to.equal(addrNull);
            expect(await addr1.getBalance()).to.equal(
                BigInt(addr1BalanceBefor) +
                    BigInt(sellPrice) -
                    ethersForContract
            );
            expect(await addr2.getBalance()).to.equal(
                BigInt(addr2BalanceBefor) - BigInt(sellPrice) - gasUsed
            );
            expect(
                await ethers.provider.getBalance(myBaseERC721.address)
            ).to.equal(BigInt(contractBalanceBefor) + ethersForContract);
        });

        it("FAIL - token not for sale", async () => {
            const sellPrice = ethers.utils.parseEther("0.5");
            const tokenId = 0;
            const mintTx = await myBaseERC721
                .connect(addr1)
                .payToMint(addr1.address, metadataURI, {
                    value: ethers.utils.parseEther("0.05"),
                });
            await mintTx.wait();

            const addr1BalanceBefor = await addr1.getBalance();
            const addr2BalanceBefor = await addr2.getBalance();

            await expect(
                myBaseERC721
                    .connect(addr2)
                    .buyTokenOnSale(tokenId, { value: sellPrice })
            ).to.be.revertedWith(
                "Cant perform this action, token is not on sale!"
            );

            const gasForRevertedTx = await getGasUsedForLastTx();

            expect(await myBaseERC721.connect(addr1).ownerOf(tokenId)).to.equal(
                addr1.address
            );
            expect(await addr1.getBalance()).to.equal(addr1BalanceBefor);
            expect(await addr2.getBalance()).to.equal(
                BigInt(addr2BalanceBefor) - gasForRevertedTx
            );
        });

        it("FAIL - send eth to low", async () => {
            const sellPrice = ethers.utils.parseEther("0.5");
            const sendEthAmount = ethers.utils.parseEther("0.05");
            const tokenId = 0;
            const mintTx = await myBaseERC721
                .connect(addr1)
                .payToMint(addr1.address, metadataURI, {
                    value: sendEthAmount,
                });
            await mintTx.wait();

            const putOnSaleTx = await myBaseERC721
                .connect(addr1)
                .startSale(tokenId, sellPrice);
            await putOnSaleTx.wait();

            const addr1BalanceBefor = await addr1.getBalance();
            const addr2BalanceBefor = await addr2.getBalance();

            await expect(
                myBaseERC721
                    .connect(addr2)
                    .buyTokenOnSale(tokenId, { value: sendEthAmount })
            ).to.be.revertedWith(
                "Pleas provide minimum price of this specific token!"
            );

            const gasForRevertedTx = await getGasUsedForLastTx();

            expect(
                await myBaseERC721
                    .connect(myBaseERC721.address)
                    .tokenIdToPriceOnSale(tokenId)
            ).to.equal(sellPrice);
            expect(
                await myBaseERC721
                    .connect(myBaseERC721.address)
                    .tokenIdToOwnerAddressOnSale(tokenId)
            ).to.equal(addr1.address);
            expect(
                await myBaseERC721
                    .connect(myBaseERC721.address)
                    .ownerOf(tokenId)
            ).to.equal(myBaseERC721.address);
            expect(await addr1.getBalance()).to.equal(addr1BalanceBefor);
            expect(await addr2.getBalance()).to.equal(
                BigInt(addr2BalanceBefor) - gasForRevertedTx
            );
        });
    });

    describe("TEST burn()", async () => {
        it("PASS - token not on sale", async () => {
            const sendEthAmount = ethers.utils.parseEther("0.05");
            const tokenId = 0;
            const mintTx = await myBaseERC721
                .connect(addr1)
                .payToMint(addr1.address, metadataURI, {
                    value: sendEthAmount,
                });
            await mintTx.wait();

            expect(await myBaseERC721.ownerOf(tokenId)).to.equal(addr1.address);

            const burnTx = await myBaseERC721.connect(addr1).burn(tokenId);
            await burnTx.wait();

            await expect(myBaseERC721.ownerOf(tokenId)).to.be.revertedWith(
                "'ERC721: owner query for nonexistent token"
            );
        });

        it("PASS - token on sale", async () => {
            const sendEthAmount = ethers.utils.parseEther("0.05");
            const sellPrice = ethers.utils.parseEther("0.5");
            const tokenId = 0;
            const mintTx = await myBaseERC721
                .connect(addr1)
                .payToMint(addr1.address, metadataURI, {
                    value: sendEthAmount,
                });
            await mintTx.wait();

            const putOnSaleTx = await myBaseERC721
                .connect(addr1)
                .startSale(tokenId, sellPrice);
            await putOnSaleTx.wait();

            expect(await myBaseERC721.ownerOf(tokenId)).to.equal(
                myBaseERC721.address
            );

            const burnTx = await myBaseERC721.connect(addr1).burn(tokenId);
            await burnTx.wait();

            expect(
                await myBaseERC721.connect(addr1).tokenIdToPriceOnSale(tokenId)
            ).to.equal(0);
            expect(
                await myBaseERC721
                    .connect(addr1)
                    .tokenIdToOwnerAddressOnSale(tokenId)
            ).to.equal(addrNull);
            await expect(
                myBaseERC721.connect(addr1).ownerOf(tokenId)
            ).to.be.revertedWith("'ERC721: owner query for nonexistent token");
        });

        it("FAIL - not owner of token", async () => {
            const sendEthAmount = ethers.utils.parseEther("0.05");
            const sellPrice = ethers.utils.parseEther("0.5");
            const tokenId = 0;
            const mintTx = await myBaseERC721
                .connect(addr1)
                .payToMint(addr1.address, metadataURI, {
                    value: sendEthAmount,
                });
            await mintTx.wait();

            const putOnSaleTx = await myBaseERC721
                .connect(addr1)
                .startSale(tokenId, sellPrice);
            await putOnSaleTx.wait();

            await expect(
                myBaseERC721.connect(addr2).burn(tokenId)
            ).to.be.revertedWith(
                "Cant perform this action, you must be owner of this token!"
            );

            expect(
                await myBaseERC721.connect(addr1).tokenIdToPriceOnSale(tokenId)
            ).to.equal(sellPrice);
            expect(
                await myBaseERC721
                    .connect(addr1)
                    .tokenIdToOwnerAddressOnSale(tokenId)
            ).to.equal(addr1.address);
            expect(await myBaseERC721.connect(addr1).ownerOf(tokenId)).to.equal(
                myBaseERC721.address
            );
        });
    });

    const feeParematers = [
        { fee: 1, expected: 5_000_000_000_000 },
        { fee: 999, expected: 4_995_000_000_000_000 },
        { fee: 1000, expected: 5_000_000_000_000_000 },
        { fee: 2500, expected: 12_500_000_000_000_000 },
        { fee: 10000, expected: 50_000_000_000_000_000 },
    ];
    describe("TEST setTransactionFee()", async () => {
        feeParematers.forEach(({ fee }) => {
            it(`PASS - ${fee / 1000}%`, async () => {
                expect(await myBaseERC721.transactionFee()).to.be.equal(
                    BigInt(1000)
                );
                const setTransactionFeeTx = await myBaseERC721
                    .connect(owner)
                    .setTransactionFee(fee);
                await setTransactionFeeTx.wait();
                expect(await myBaseERC721.transactionFee()).to.be.equal(fee);
            });
        });

        it(`FAIL - not owner`, async () => {
            expect(await myBaseERC721.transactionFee()).to.be.equal(
                BigInt(1000)
            );
            await expect(
                myBaseERC721.connect(addr1).setTransactionFee(1)
            ).to.be.revertedWith("Ownable: caller is not the owner");
            expect(await myBaseERC721.transactionFee()).to.be.equal(
                BigInt(1000)
            );
        });
    });

    describe("TEST transactionFee", async () => {
        feeParematers.forEach(({ fee, expected }) => {
            it(`PASS - transactionFee ${fee / 1000}%`, async () => {
                const sellPrice = ethers.utils.parseEther("0.5");
                const tokenId = 0;
                const mintTx = await myBaseERC721
                    .connect(addr1)
                    .payToMint(addr1.address, metadataURI, {
                        value: ethers.utils.parseEther("0.05"),
                    });
                await mintTx.wait();

                const setFeeTx = await myBaseERC721
                    .connect(owner)
                    .setTransactionFee(fee);
                await setFeeTx.wait();

                const putOnSaleTx = await myBaseERC721
                    .connect(addr1)
                    .startSale(tokenId, sellPrice);
                await putOnSaleTx.wait();

                const addr1BalanceBefor = await addr1.getBalance();
                const addr2BalanceBefor = await addr2.getBalance();
                const contractBalanceBefor = await ethers.provider.getBalance(
                    myBaseERC721.address
                );

                await myBaseERC721
                    .connect(addr2)
                    .buyTokenOnSale(tokenId, { value: sellPrice });

                const gasUsed = await getGasUsedForLastTx();
                const ethersForContract = await calculatePercentageInWei(
                    sellPrice,
                    await myBaseERC721.transactionFee()
                );

                expect(expected).to.be.equal(Number(ethersForContract));
                expect(await addr1.getBalance()).to.equal(
                    BigInt(addr1BalanceBefor) +
                        BigInt(sellPrice) -
                        ethersForContract
                );
                expect(await addr2.getBalance()).to.equal(
                    BigInt(addr2BalanceBefor) - BigInt(sellPrice) - gasUsed
                );
                expect(
                    await ethers.provider.getBalance(myBaseERC721.address)
                ).to.equal(BigInt(contractBalanceBefor) + ethersForContract);
            });
        });
    });

    describe("TEST withdraw()", async () => {
        it(`PASS`, async () => {
            const amoutPayed = ethers.utils.parseEther("0.05");
            const mintTx = await myBaseERC721
                .connect(addr1)
                .payToMint(addr1.address, metadataURI, { value: amoutPayed });
            await mintTx.wait();

            const contractBalanceBefor = await ethers.provider.getBalance(
                myBaseERC721.address
            );
            const ownerBalanceBefor = await ethers.provider.getBalance(
                owner.address
            );

            const withdrawTx = await myBaseERC721.connect(owner).withdraw();
            await withdrawTx.wait();

            const gasUsed = await getGasUsedForLastTx();

            expect(
                await ethers.provider.getBalance(myBaseERC721.address)
            ).to.be.equal(BigInt(contractBalanceBefor) - BigInt(amoutPayed));
            expect(await ethers.provider.getBalance(owner.address)).to.be.equal(
                BigInt(ownerBalanceBefor) + BigInt(amoutPayed) - gasUsed
            );
        });

        it(`FAIL - not owner`, async () => {
            const amoutPayed = ethers.utils.parseEther("0.05");
            const mintTx = await myBaseERC721
                .connect(addr1)
                .payToMint(addr1.address, metadataURI, { value: amoutPayed });
            await mintTx.wait();

            const contractBalanceBefor = await ethers.provider.getBalance(
                myBaseERC721.address
            );
            const ownerBalanceBefor = await ethers.provider.getBalance(
                owner.address
            );

            await expect(
                myBaseERC721.connect(addr1).withdraw()
            ).to.be.revertedWith("Ownable: caller is not the owner");

            expect(
                await ethers.provider.getBalance(myBaseERC721.address)
            ).to.be.equal(BigInt(contractBalanceBefor));
            expect(await ethers.provider.getBalance(owner.address)).to.be.equal(
                BigInt(ownerBalanceBefor)
            );
        });
    });
});
