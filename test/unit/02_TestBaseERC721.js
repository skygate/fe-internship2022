const { expect } = require("chai");
const { ethers } = require("hardhat");
const { getGasUsedForLastTx } = require("../utils");
const { MerkleTree } = require("merkletreejs");
const { keccak256 } = require("@ethersproject/keccak256");

describe("TEST BaseERC721", async () => {
    const addrNull = "0x0000000000000000000000000000000000000000";
    const DECIMALS = "18";
    const INITIAL_PRICE = "200000000000000000000";
    const baseURI = "ipfs://QmVrAoaZAeX5c7mECGbFS5wSbwFW748F2F6wsjZyLtfhgM/";

    const basicTicketPrice = ethers.utils.parseEther("0.1"); // value set in BaseERC721.js
    const premiumTicketPrice = ethers.utils.parseEther("1"); // basicTicketPrice * 10
    const mintValue = ethers.utils.parseEther("0.05"); // value set in BaseERC721.js

    let myBaseERC721;
    let owner;
    let addr1;
    let addr2;
    let addrs;

    beforeEach(async () => {
        const MyMockV3Aggregator = await ethers.getContractFactory("MyMockV3Aggregator");
        myMockV3Aggregator = await MyMockV3Aggregator.deploy(DECIMALS, INITIAL_PRICE);
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
            let balance = await myBaseERC721.connect(addr1).balanceOf(addr1.address);
            expect(balance).to.equal(0);

            const newlyMintedToken = await myBaseERC721.connect(addr1).payToMint(addr1.address, {
                value: mintValue,
            });
            await newlyMintedToken.wait();

            balance = await myBaseERC721.connect(addr1).balanceOf(addr1.address);
            expect(balance).to.equal(1);

            const nft_owner = await myBaseERC721.connect(addr1).ownerOf(0);
            expect(nft_owner).to.equal(addr1.address);

            const currentCounter = await myBaseERC721.connect(addr1).count();
            expect(currentCounter).to.equal(1);

            expect(await myBaseERC721.tokenURI(currentCounter - 1)).to.be.equal(
                baseURI + (currentCounter - 1)
            );
        });

        it("FAIL - send eth below mintPrice", async () => {
            expect(await myBaseERC721.count()).to.equal(0);

            await expect(
                myBaseERC721.connect(addr1).payToMint(addr1.address, {
                    value: ethers.utils.parseEther("0.00000005"),
                })
            ).to.be.revertedWith("Cant perform this action, you send not enough ETH to mint.");

            expect(await myBaseERC721.count()).to.equal(0);
        });

        it("FAIL - mint limit reached", async () => {
            const mintLimit = BigInt(await myBaseERC721.mintLimit());

            while (BigInt(await myBaseERC721.count()) < mintLimit) {
                await myBaseERC721.connect(addr1).payToMint(addr1.address, {
                    value: mintValue,
                });
            }

            await expect(
                myBaseERC721.connect(addr1).payToMint(addr1.address, {
                    value: mintValue,
                })
            ).to.be.revertedWith("Cant perform this action, limit of mint has been reached.");
        });
    });

    describe("TEST safeMint()", async () => {
        it("PASS - for owner", async () => {
            let balance = await myBaseERC721.connect(owner).balanceOf(owner.address);
            expect(balance).to.equal(0);

            const newlyMintedToken = await myBaseERC721.connect(owner).safeMint(owner.address);
            await newlyMintedToken.wait();

            balance = await myBaseERC721.connect(owner).balanceOf(owner.address);
            expect(balance).to.equal(1);

            const nft_owner = await myBaseERC721.connect(owner).ownerOf(0);
            expect(nft_owner).to.equal(owner.address);

            const currentCounter = await myBaseERC721.connect(owner).count();
            expect(currentCounter).to.equal(1);
        });

        it("FAIL - for not MITNER_ROLE", async () => {
            let balance = await myBaseERC721.connect(addr2).balanceOf(addr2.address);
            expect(balance).to.equal(0);

            await expect(myBaseERC721.connect(addr2).safeMint(addr2.address)).to.be.revertedWith(
                `VM Exception while processing transaction: reverted with reason string 'AccessControl: account ${String(
                    addr2.address
                ).toLowerCase()} is missing role 0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6'`
            );

            balance = await myBaseERC721.connect(addr2).balanceOf(addr2.address);
            expect(balance).to.equal(0);

            const currentCounter = await myBaseERC721.connect(addr2).count();
            expect(currentCounter).to.equal(0);
        });

        it("FAIL - mint limit reached", async () => {
            const mintLimit = BigInt(await myBaseERC721.mintLimit());

            while (BigInt(await myBaseERC721.count()) < mintLimit) {
                await myBaseERC721.connect(owner).safeMint(addr1.address);
            }

            await expect(myBaseERC721.connect(owner).safeMint(addr1.address)).to.be.revertedWith(
                "Cant perform this action, limit of mint has been reached."
            );
        });
    });

    describe("TEST _baseURI()", async () => {
        it("PASS - test incrementing", async () => {
            const mintLimit = BigInt(await myBaseERC721.mintLimit());

            for (counter = 0; counter < mintLimit; counter++) {
                await myBaseERC721.connect(owner).safeMint(addr1.address);
                expect(await myBaseERC721.tokenURI(counter)).to.be.equal(baseURI + counter);
            }
        });
    });

    describe("TEST startSale()", async () => {
        it("PASS", async () => {
            const sellPrice = ethers.utils.parseEther("0.5");
            const tokenId = 0;
            const mintTx = await myBaseERC721.connect(addr1).payToMint(addr1.address, {
                value: mintValue,
            });
            await mintTx.wait();

            const putOnSaleTx = await myBaseERC721.connect(addr1).startSale(tokenId, sellPrice);
            await putOnSaleTx.wait();

            expect(await myBaseERC721.connect(addr1).tokenIdToPriceOnSale(tokenId)).to.equal(
                sellPrice
            );
            expect(await myBaseERC721.connect(addr1).ownerOf(tokenId)).to.equal(
                myBaseERC721.address
            );
            expect(await myBaseERC721.connect(addr1).tokenIdToOwnerAddressOnSale(tokenId)).to.equal(
                addr1.address
            );
        });

        it("FAIL - not onwer of token", async () => {
            const sellPrice = ethers.utils.parseEther("0.5");
            const tokenId = 0;
            const mintTx = await myBaseERC721.connect(addr1).payToMint(addr1.address, {
                value: mintValue,
            });
            await mintTx.wait();

            await expect(
                myBaseERC721.connect(addr2).startSale(tokenId, sellPrice)
            ).to.be.revertedWith("Cant perform this action, you must be owner of this token!");

            expect(await myBaseERC721.connect(addr1).tokenIdToPriceOnSale(tokenId)).to.equal(0);
            expect(await myBaseERC721.connect(addr1).ownerOf(tokenId)).to.equal(addr1.address);
            expect(await myBaseERC721.connect(addr1).tokenIdToOwnerAddressOnSale(tokenId)).to.equal(
                addrNull
            );
        });

        it("FAIL - sale for 0 ETH", async () => {
            const tokenId = 0;
            const mintTx = await myBaseERC721.connect(addr1).payToMint(addr1.address, {
                value: mintValue,
            });
            await mintTx.wait();

            await expect(myBaseERC721.connect(addr1).startSale(tokenId, 0)).to.be.revertedWith(
                "Can not sale for 0 ETH!"
            );

            expect(await myBaseERC721.connect(addr1).tokenIdToPriceOnSale(tokenId)).to.equal(0);
            expect(await myBaseERC721.connect(addr1).ownerOf(tokenId)).to.equal(addr1.address);
            expect(await myBaseERC721.connect(addr1).tokenIdToOwnerAddressOnSale(tokenId)).to.equal(
                addrNull
            );
        });
    });

    describe("TEST cancelSale()", async () => {
        it("PASS", async () => {
            const sellPrice = ethers.utils.parseEther("0.5");
            const tokenId = 0;
            const mintTx = await myBaseERC721.connect(addr1).payToMint(addr1.address, {
                value: mintValue,
            });
            await mintTx.wait();

            const putOnSaleTx = await myBaseERC721.connect(addr1).startSale(tokenId, sellPrice);
            await putOnSaleTx.wait();

            const cancelTheSaleTX = await myBaseERC721.connect(addr1).cancelSale(tokenId);
            await cancelTheSaleTX.wait();

            expect(await myBaseERC721.connect(addr1).ownerOf(tokenId)).to.equal(addr1.address);
            expect(await myBaseERC721.connect(addr1).tokenIdToOwnerAddressOnSale(tokenId)).to.equal(
                addrNull
            );
            expect(await myBaseERC721.connect(addr1).tokenIdToPriceOnSale(tokenId)).to.equal(0);
        });

        it("FAIL - not onwer of token", async () => {
            const sellPrice = ethers.utils.parseEther("0.5");
            const tokenId = 0;
            const mintTx = await myBaseERC721.connect(addr1).payToMint(addr1.address, {
                value: mintValue,
            });
            await mintTx.wait();

            const putOnSaleTx = await myBaseERC721.connect(addr1).startSale(tokenId, sellPrice);
            await putOnSaleTx.wait();

            await expect(myBaseERC721.connect(addr2).cancelSale(tokenId)).to.be.revertedWith(
                "Cant perform this action, you must be owner of this token!"
            );

            expect(await myBaseERC721.connect(addr1).tokenIdToPriceOnSale(tokenId)).to.equal(
                sellPrice
            );
            expect(await myBaseERC721.connect(addr1).ownerOf(tokenId)).to.equal(
                myBaseERC721.address
            );
            expect(await myBaseERC721.connect(addr1).tokenIdToOwnerAddressOnSale(tokenId)).to.equal(
                addr1.address
            );
        });

        it("FAIL - sale not started", async () => {
            const tokenId = 0;
            const mintTx = await myBaseERC721.connect(addr1).payToMint(addr1.address, {
                value: mintValue,
            });
            await mintTx.wait();

            await expect(myBaseERC721.connect(addr1).cancelSale(tokenId)).to.be.revertedWith(
                "Cant perform this action, token is not on sale!"
            );

            expect(await myBaseERC721.connect(addr1).tokenIdToPriceOnSale(tokenId)).to.equal(0);
            expect(await myBaseERC721.connect(addr1).ownerOf(tokenId)).to.equal(addr1.address);
            expect(await myBaseERC721.connect(addr1).tokenIdToOwnerAddressOnSale(tokenId)).to.equal(
                addrNull
            );
        });
    });

    describe("TEST buyTokenOnSale()", async () => {
        it("PASS - without ticket", async () => {
            const sellPrice = ethers.utils.parseEther("0.5");
            const tokenId = 0;
            const mintTx = await myBaseERC721.connect(addr1).payToMint(addr1.address, {
                value: mintValue,
            });
            await mintTx.wait();

            const putOnSaleTx = await myBaseERC721.connect(addr1).startSale(tokenId, sellPrice);
            await putOnSaleTx.wait();

            const addr1BalanceBefor = await addr1.getBalance();
            const addr2BalanceBefor = await addr2.getBalance();
            const contractBalanceBefor = await ethers.provider.getBalance(myBaseERC721.address);

            await myBaseERC721.connect(addr2).buyTokenOnSale(tokenId, {
                value: String(
                    parseInt(sellPrice) +
                        parseInt(
                            await myBaseERC721.calculateTransactionFee(addr2.address, sellPrice)
                        )
                ),
            });

            const gasUsed = await getGasUsedForLastTx();
            const ethersForContract = BigInt(
                await myBaseERC721.calculateTransactionFee(addr2.address, sellPrice)
            );

            expect(await myBaseERC721.connect(addr2).ownerOf(tokenId)).to.equal(addr2.address);
            expect(await myBaseERC721.connect(addr2).tokenIdToPriceOnSale(tokenId)).to.equal(0);
            expect(await myBaseERC721.connect(addr2).tokenIdToOwnerAddressOnSale(tokenId)).to.equal(
                addrNull
            );
            expect(await addr1.getBalance()).to.equal(
                BigInt(addr1BalanceBefor) + BigInt(sellPrice)
            );
            expect(await addr2.getBalance()).to.equal(
                BigInt(addr2BalanceBefor) - BigInt(sellPrice) - gasUsed - ethersForContract
            );
            expect(await ethers.provider.getBalance(myBaseERC721.address)).to.equal(
                BigInt(contractBalanceBefor) + ethersForContract
            );
            expect((await myBaseERC721.addressToBasicTicket(addr2.address))[0]).to.be.equal(0);
        });

        it("PASS - with basic ticket", async () => {
            const sellPrice = ethers.utils.parseEther("0.5");
            const tokenId = 0;
            const mintTx = await myBaseERC721.connect(addr1).payToMint(addr1.address, {
                value: mintValue,
            });
            await mintTx.wait();

            const putOnSaleTx = await myBaseERC721.connect(addr1).startSale(tokenId, sellPrice);
            await putOnSaleTx.wait();

            const addr1BalanceBefor = await addr1.getBalance();
            const addr2BalanceBefor = await addr2.getBalance();
            const contractBalanceBefor = await ethers.provider.getBalance(myBaseERC721.address);

            await myBaseERC721.connect(addr2).buyBasicTicket({ value: basicTicketPrice });
            let gasUsed = await getGasUsedForLastTx();

            await myBaseERC721.connect(addr2).buyTokenOnSale(tokenId, {
                value: sellPrice,
            });
            gasUsed += await getGasUsedForLastTx();

            expect(await myBaseERC721.connect(addr2).ownerOf(tokenId)).to.equal(addr2.address);
            expect(await myBaseERC721.connect(addr2).tokenIdToPriceOnSale(tokenId)).to.equal(0);
            expect(await myBaseERC721.connect(addr2).tokenIdToOwnerAddressOnSale(tokenId)).to.equal(
                addrNull
            );
            expect(await addr1.getBalance()).to.equal(
                BigInt(addr1BalanceBefor) + BigInt(sellPrice)
            );
            expect(await addr2.getBalance()).to.equal(
                BigInt(addr2BalanceBefor) - BigInt(sellPrice) - gasUsed - BigInt(basicTicketPrice)
            );
            expect(await ethers.provider.getBalance(myBaseERC721.address)).to.equal(
                BigInt(contractBalanceBefor) + BigInt(basicTicketPrice)
            );
            expect((await myBaseERC721.addressToBasicTicket(addr2.address))[0]).to.be.equal(
                sellPrice
            );
        });

        it("PASS - with premium ticket", async () => {
            const sellPrice = ethers.utils.parseEther("0.5");
            const tokenId = 0;
            const mintTx = await myBaseERC721.connect(addr1).payToMint(addr1.address, {
                value: mintValue,
            });
            await mintTx.wait();

            const putOnSaleTx = await myBaseERC721.connect(addr1).startSale(tokenId, sellPrice);
            await putOnSaleTx.wait();

            const addr1BalanceBefor = await addr1.getBalance();
            const addr2BalanceBefor = await addr2.getBalance();
            const contractBalanceBefor = await ethers.provider.getBalance(myBaseERC721.address);

            await myBaseERC721.connect(addr2).buyPremiumTicket({ value: premiumTicketPrice });
            let gasUsed = await getGasUsedForLastTx();

            await myBaseERC721.connect(addr2).buyTokenOnSale(tokenId, { value: sellPrice });
            gasUsed += await getGasUsedForLastTx();

            expect(await myBaseERC721.connect(addr2).ownerOf(tokenId)).to.equal(addr2.address);
            expect(await myBaseERC721.connect(addr2).tokenIdToPriceOnSale(tokenId)).to.equal(0);
            expect(await myBaseERC721.connect(addr2).tokenIdToOwnerAddressOnSale(tokenId)).to.equal(
                addrNull
            );
            expect(await addr1.getBalance()).to.equal(
                BigInt(addr1BalanceBefor) + BigInt(sellPrice)
            );
            expect(await addr2.getBalance()).to.equal(
                BigInt(addr2BalanceBefor) - BigInt(sellPrice) - gasUsed - BigInt(premiumTicketPrice)
            );
            expect(await ethers.provider.getBalance(myBaseERC721.address)).to.equal(
                BigInt(contractBalanceBefor) + BigInt(premiumTicketPrice)
            );
            expect((await myBaseERC721.addressToBasicTicket(addr2.address))[0]).to.be.equal(0);
        });

        it("FAIL - token not for sale", async () => {
            const sellPrice = ethers.utils.parseEther("0.5");
            const tokenId = 0;
            const mintTx = await myBaseERC721.connect(addr1).payToMint(addr1.address, {
                value: mintValue,
            });
            await mintTx.wait();

            const addr1BalanceBefor = await addr1.getBalance();
            const addr2BalanceBefor = await addr2.getBalance();

            await expect(
                myBaseERC721.connect(addr2).buyTokenOnSale(tokenId, { value: sellPrice })
            ).to.be.revertedWith("Cant perform this action, token is not on sale!");

            const gasForRevertedTx = await getGasUsedForLastTx();

            expect(await myBaseERC721.connect(addr1).ownerOf(tokenId)).to.equal(addr1.address);
            expect(await addr1.getBalance()).to.equal(addr1BalanceBefor);
            expect(await addr2.getBalance()).to.equal(BigInt(addr2BalanceBefor) - gasForRevertedTx);
        });

        it("FAIL - send eth to low", async () => {
            const sellPrice = ethers.utils.parseEther("0.5");
            const sendEthAmount = ethers.utils.parseEther("0.05");
            const tokenId = 0;
            const mintTx = await myBaseERC721.connect(addr1).payToMint(addr1.address, {
                value: sendEthAmount,
            });
            await mintTx.wait();

            const putOnSaleTx = await myBaseERC721.connect(addr1).startSale(tokenId, sellPrice);
            await putOnSaleTx.wait();

            const addr1BalanceBefor = await addr1.getBalance();
            const addr2BalanceBefor = await addr2.getBalance();

            await expect(
                myBaseERC721.connect(addr2).buyTokenOnSale(tokenId, { value: sendEthAmount })
            ).to.be.revertedWith("Pleas provide minimum price of this specific token!");

            const gasForRevertedTx = await getGasUsedForLastTx();

            expect(
                await myBaseERC721.connect(myBaseERC721.address).tokenIdToPriceOnSale(tokenId)
            ).to.equal(sellPrice);
            expect(
                await myBaseERC721
                    .connect(myBaseERC721.address)
                    .tokenIdToOwnerAddressOnSale(tokenId)
            ).to.equal(addr1.address);
            expect(await myBaseERC721.connect(myBaseERC721.address).ownerOf(tokenId)).to.equal(
                myBaseERC721.address
            );
            expect(await addr1.getBalance()).to.equal(addr1BalanceBefor);
            expect(await addr2.getBalance()).to.equal(BigInt(addr2BalanceBefor) - gasForRevertedTx);
        });

        it("FAIL - send only price without transcation fee and active ticket", async () => {
            const sellPrice = ethers.utils.parseEther("0.5");
            const tokenId = 0;
            const mintTx = await myBaseERC721.connect(addr1).payToMint(addr1.address, {
                value: mintValue,
            });
            await mintTx.wait();

            const putOnSaleTx = await myBaseERC721.connect(addr1).startSale(tokenId, sellPrice);
            await putOnSaleTx.wait();

            const addr1BalanceBefor = await addr1.getBalance();
            const addr2BalanceBefor = await addr2.getBalance();

            await expect(
                myBaseERC721.connect(addr2).buyTokenOnSale(tokenId, { value: sellPrice })
            ).to.be.revertedWith("Pleas provide minimum price of this specific token!");

            const gasForRevertedTx = await getGasUsedForLastTx();

            expect(
                await myBaseERC721.connect(myBaseERC721.address).tokenIdToPriceOnSale(tokenId)
            ).to.equal(sellPrice);
            expect(
                await myBaseERC721
                    .connect(myBaseERC721.address)
                    .tokenIdToOwnerAddressOnSale(tokenId)
            ).to.equal(addr1.address);
            expect(await myBaseERC721.connect(myBaseERC721.address).ownerOf(tokenId)).to.equal(
                myBaseERC721.address
            );
            expect(await addr1.getBalance()).to.equal(addr1BalanceBefor);
            expect(await addr2.getBalance()).to.equal(BigInt(addr2BalanceBefor) - gasForRevertedTx);
        });
    });

    describe("TEST burn()", async () => {
        it("PASS - token not on sale", async () => {
            const tokenId = 0;
            const mintTx = await myBaseERC721.connect(addr1).payToMint(addr1.address, {
                value: mintValue,
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
            const sellPrice = ethers.utils.parseEther("0.5");
            const tokenId = 0;
            const mintTx = await myBaseERC721.connect(addr1).payToMint(addr1.address, {
                value: mintValue,
            });
            await mintTx.wait();

            const putOnSaleTx = await myBaseERC721.connect(addr1).startSale(tokenId, sellPrice);
            await putOnSaleTx.wait();

            expect(await myBaseERC721.ownerOf(tokenId)).to.equal(myBaseERC721.address);

            const burnTx = await myBaseERC721.connect(addr1).burn(tokenId);
            await burnTx.wait();

            expect(await myBaseERC721.connect(addr1).tokenIdToPriceOnSale(tokenId)).to.equal(0);
            expect(await myBaseERC721.connect(addr1).tokenIdToOwnerAddressOnSale(tokenId)).to.equal(
                addrNull
            );
            await expect(myBaseERC721.connect(addr1).ownerOf(tokenId)).to.be.revertedWith(
                "'ERC721: owner query for nonexistent token"
            );
        });

        it("FAIL - not owner of token", async () => {
            const sellPrice = ethers.utils.parseEther("0.5");
            const tokenId = 0;
            const mintTx = await myBaseERC721.connect(addr1).payToMint(addr1.address, {
                value: mintValue,
            });
            await mintTx.wait();

            const putOnSaleTx = await myBaseERC721.connect(addr1).startSale(tokenId, sellPrice);
            await putOnSaleTx.wait();

            await expect(myBaseERC721.connect(addr2).burn(tokenId)).to.be.revertedWith(
                "Cant perform this action, you must be owner of this token!"
            );

            expect(await myBaseERC721.connect(addr1).tokenIdToPriceOnSale(tokenId)).to.equal(
                sellPrice
            );
            expect(await myBaseERC721.connect(addr1).tokenIdToOwnerAddressOnSale(tokenId)).to.equal(
                addr1.address
            );
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
                expect(await myBaseERC721.transactionFee()).to.be.equal(BigInt(1000));
                const setTransactionFeeTx = await myBaseERC721
                    .connect(owner)
                    .setTransactionFee(fee);
                await setTransactionFeeTx.wait();
                expect(await myBaseERC721.transactionFee()).to.be.equal(fee);
            });
        });

        it(`FAIL - not ADMIN_ROLE`, async () => {
            expect(await myBaseERC721.transactionFee()).to.be.equal(BigInt(1000));
            await expect(myBaseERC721.connect(addr1).setTransactionFee(1)).to.be.revertedWith(
                `VM Exception while processing transaction: reverted with reason string 'AccessControl: account ${String(
                    addr1.address
                ).toLowerCase()} is missing role 0xa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c21775'`
            );
            expect(await myBaseERC721.transactionFee()).to.be.equal(BigInt(1000));
        });
    });

    describe("TEST transactionFee", async () => {
        feeParematers.forEach(({ fee, expected }) => {
            it(`PASS - transactionFee transactions ${fee / 1000}%`, async () => {
                const sellPrice = ethers.utils.parseEther("0.5");
                const tokenId = 0;
                const mintTx = await myBaseERC721.connect(addr1).payToMint(addr1.address, {
                    value: mintValue,
                });
                await mintTx.wait();

                const setFeeTx = await myBaseERC721.connect(owner).setTransactionFee(fee);
                await setFeeTx.wait();

                const putOnSaleTx = await myBaseERC721.connect(addr1).startSale(tokenId, sellPrice);
                await putOnSaleTx.wait();

                const addr1BalanceBefor = await addr1.getBalance();
                const addr2BalanceBefor = await addr2.getBalance();
                const contractBalanceBefor = await ethers.provider.getBalance(myBaseERC721.address);

                await myBaseERC721.connect(addr2).buyTokenOnSale(tokenId, {
                    value: String(
                        parseInt(sellPrice) +
                            parseInt(
                                await myBaseERC721.calculateTransactionFee(addr2.address, sellPrice)
                            )
                    ),
                });

                const gasUsed = await getGasUsedForLastTx();
                const ethersForContract = BigInt(
                    await myBaseERC721.calculateTransactionFee(addr2.address, sellPrice)
                );

                expect(expected).to.be.equal(Number(ethersForContract));
                expect(await addr1.getBalance()).to.equal(
                    BigInt(addr1BalanceBefor) + BigInt(sellPrice)
                );
                expect(await addr2.getBalance()).to.equal(
                    BigInt(addr2BalanceBefor) - BigInt(sellPrice) - gasUsed - ethersForContract
                );
                expect(await ethers.provider.getBalance(myBaseERC721.address)).to.equal(
                    BigInt(contractBalanceBefor) + ethersForContract
                );
            });
        });
        it("PASS - transaction fee payToMint()", async () => {
            const ownerFeeBefore = await myBaseERC721.ownerFeeToWithdraw();

            await myBaseERC721.connect(addr1).payToMint(addr1.address, {
                value: mintValue,
            });

            balance = await myBaseERC721.connect(addr1).balanceOf(addr1.address);
            expect(balance).to.equal(1);

            expect(await myBaseERC721.ownerFeeToWithdraw()).to.be.equal(
                BigInt(ownerFeeBefore) + BigInt(mintValue)
            );
        });
    });

    describe("TEST withdrawOwnerFee()", async () => {
        it(`PASS`, async () => {
            const mintTx = await myBaseERC721
                .connect(addr1)
                .payToMint(addr1.address, { value: mintValue });
            await mintTx.wait();

            const contractBalanceBefor = await ethers.provider.getBalance(myBaseERC721.address);
            const ownerBalanceBefor = await ethers.provider.getBalance(owner.address);

            const withdrawTx = await myBaseERC721.connect(owner).withdrawOwnerFee();
            await withdrawTx.wait();

            const gasUsed = await getGasUsedForLastTx();

            expect(await ethers.provider.getBalance(myBaseERC721.address)).to.be.equal(
                BigInt(contractBalanceBefor) - BigInt(mintValue)
            );
            expect(await ethers.provider.getBalance(owner.address)).to.be.equal(
                BigInt(ownerBalanceBefor) + BigInt(mintValue) - gasUsed
            );
        });

        it(`FAIL - not ADMIN_ROLE`, async () => {
            const mintTx = await myBaseERC721
                .connect(addr1)
                .payToMint(addr1.address, { value: mintValue });
            await mintTx.wait();

            const contractBalanceBefor = await ethers.provider.getBalance(myBaseERC721.address);
            const ownerBalanceBefor = await ethers.provider.getBalance(owner.address);

            await expect(myBaseERC721.connect(addr1).withdrawOwnerFee()).to.be.revertedWith(
                `VM Exception while processing transaction: reverted with reason string 'AccessControl: account ${String(
                    addr1.address
                ).toLowerCase()} is missing role 0xa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c21775`
            );

            expect(await ethers.provider.getBalance(myBaseERC721.address)).to.be.equal(
                BigInt(contractBalanceBefor)
            );
            expect(await ethers.provider.getBalance(owner.address)).to.be.equal(
                BigInt(ownerBalanceBefor)
            );
        });
    });

    describe("TEST changeMintPrice()", async () => {
        it(`PASS`, async () => {
            const startingMintPrice = ethers.utils.parseEther("0.0005");
            const newMintPrice = ethers.utils.parseEther("1");

            expect(await myBaseERC721.mintPrice()).to.be.equal(BigInt(startingMintPrice));

            await myBaseERC721.connect(owner).changeMintPrice(newMintPrice);

            expect(await myBaseERC721.mintPrice()).to.be.equal(BigInt(newMintPrice));
        });

        it(`FAIL - not ADMIN_ROLE`, async () => {
            const startingMintPrice = ethers.utils.parseEther("0.0005");
            const newMintPrice = ethers.utils.parseEther("1");

            expect(await myBaseERC721.mintPrice()).to.be.equal(BigInt(startingMintPrice));

            await expect(
                myBaseERC721.connect(addr1).changeMintPrice(newMintPrice)
            ).to.be.revertedWith(
                `VM Exception while processing transaction: reverted with reason string 'AccessControl: account ${String(
                    addr1.address
                ).toLowerCase()} is missing role 0xa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c21775'`
            );

            expect(await myBaseERC721.mintPrice()).to.be.equal(BigInt(startingMintPrice));
        });
    });

    describe("TEST buyBasicTicket()", async () => {
        it("PASS", async () => {
            await myBaseERC721.connect(addr1).buyBasicTicket({ value: basicTicketPrice });

            const blockNumBefore = await ethers.provider.getBlockNumber();
            const blockBefore = await ethers.provider.getBlock(blockNumBefore);
            const timestampBefore = blockBefore.timestamp;

            expect((await myBaseERC721.addressToBasicTicket(addr1.address))[0]).to.be.equal(0);
            expect(
                parseInt((await myBaseERC721.addressToBasicTicket(addr1.address))[1])
            ).to.be.greaterThan(parseInt(timestampBefore));
        });

        it("FAIL - value to low", async () => {
            const belowBasicTicketPrice = ethers.utils.parseEther("0.01");

            await expect(
                myBaseERC721.connect(addr1).buyBasicTicket({ value: belowBasicTicketPrice })
            ).to.be.revertedWith(
                "Cant perform this action, amount send to buy basic ticket to low!"
            );

            expect((await myBaseERC721.addressToBasicTicket(addr1.address))[0]).to.be.equal(0);
            expect(
                parseInt((await myBaseERC721.addressToBasicTicket(addr1.address))[1])
            ).to.be.equal(0);
        });
    });

    describe("TEST buyPremiumTicket()", async () => {
        it("PASS", async () => {
            await myBaseERC721.connect(addr1).buyPremiumTicket({ value: premiumTicketPrice });

            expect(await myBaseERC721.addressToPremiumTicket(addr1.address)).to.be.equal(true);
        });

        it("FAIL - value to low", async () => {
            const belowPremiumTicketPrice = ethers.utils.parseEther("0.01");

            await expect(
                myBaseERC721.connect(addr1).buyPremiumTicket({ value: belowPremiumTicketPrice })
            ).to.be.revertedWith(
                "Cant perform this action, amount send to buy premium ticket to low!"
            );

            expect(await myBaseERC721.addressToPremiumTicket(addr1.address)).to.be.equal(false);
        });
    });

    describe("TEST increaseAcumulativeValueOfTransactions()", async () => {
        it("PASS", async () => {
            const sellPrice = ethers.utils.parseEther("0.5");
            const tokenId = 0;

            await myBaseERC721.connect(addr1).payToMint(addr1.address, {
                value: mintValue,
            });
            await myBaseERC721.connect(addr1).startSale(tokenId, sellPrice);
            await myBaseERC721.connect(addr2).buyBasicTicket({ value: basicTicketPrice });

            const acumulativeValueOfTransactionsBefore = (
                await myBaseERC721.addressToBasicTicket(addr2.address)
            ).acumulativeValueOfTransactions;

            await myBaseERC721.connect(addr2).buyTokenOnSale(tokenId, {
                value: sellPrice,
            });
            expect(
                (await myBaseERC721.addressToBasicTicket(addr2.address))
                    .acumulativeValueOfTransactions
            ).to.be.equal(BigInt(acumulativeValueOfTransactionsBefore) + BigInt(sellPrice));
        });

        it("FAIL - lack of permission", async () => {
            await expect(
                myBaseERC721.connect(owner).increaseAcumulativeValueOfTransactions(addr2.address, 1)
            ).to.be.revertedWith(
                `VM Exception while processing transaction: reverted with reason string 'AccessControl: account ${String(
                    owner.address
                ).toLowerCase()} is missing role 0xb8f2027c75f0a7a9433db22e18b163cd7b918d8cafe4716a1cdb96e5866e3cd0'`
            );
        });
    });

    describe("TEST claimTokenFromAirdrop()", async () => {
        it("PASS", async () => {
            const addressesInAirdrop = [addr1.address, addr2.address, addrs[0].address];
            const merkleTree = new MerkleTree(addressesInAirdrop.concat(owner.address), keccak256, {
                hashLeaves: true,
                sortPairs: true,
            });
            const root = merkleTree.getHexRoot();

            await myBaseERC721.connect(owner).setMerkleRoot(root);

            const proof1 = merkleTree.getHexProof(keccak256(addr1.address));
            const proof2 = merkleTree.getHexProof(keccak256(addr2.address));
            const proof3 = merkleTree.getHexProof(keccak256(addrs[0].address));

            expect(await myBaseERC721.claimed(addr1.address)).to.eq(false);
            expect(await myBaseERC721.claimed(addr2.address)).to.eq(false);
            expect(await myBaseERC721.claimed(addrs[0].address)).to.eq(false);

            expect(await myBaseERC721.canClaim(addr1.address, proof1)).to.eq(true);
            expect(await myBaseERC721.canClaim(addr2.address, proof2)).to.eq(true);
            expect(await myBaseERC721.canClaim(addrs[0].address, proof3)).to.eq(true);

            const tokenCount = BigInt(await myBaseERC721.count());

            await myBaseERC721.connect(addr1).claimTokenFromAirdrop(proof1);
            await myBaseERC721.connect(addr2).claimTokenFromAirdrop(proof2);
            await myBaseERC721.connect(addrs[0]).claimTokenFromAirdrop(proof3);

            expect(await myBaseERC721.count()).to.be.equal(tokenCount + BigInt(3));
            expect(await myBaseERC721.ownerOf(0)).to.be.equal(addr1.address);
            expect(await myBaseERC721.ownerOf(1)).to.be.equal(addr2.address);
            expect(await myBaseERC721.ownerOf(2)).to.be.equal(addrs[0].address);

            expect(await myBaseERC721.claimed(addr1.address)).to.eq(true);
            expect(await myBaseERC721.claimed(addr2.address)).to.eq(true);
            expect(await myBaseERC721.claimed(addrs[0].address)).to.eq(true);

            expect(await myBaseERC721.canClaim(addr1.address, proof1)).to.eq(false);
            expect(await myBaseERC721.canClaim(addr2.address, proof2)).to.eq(false);
            expect(await myBaseERC721.canClaim(addrs[0].address, proof3)).to.eq(false);
        });

        it("FAIL - multiple claim by same address", async () => {
            const addressesInAirdrop = [addr1.address, addr2.address, addrs[0].address];
            const merkleTree = new MerkleTree(addressesInAirdrop.concat(owner.address), keccak256, {
                hashLeaves: true,
                sortPairs: true,
            });
            const root = merkleTree.getHexRoot();

            await myBaseERC721.connect(owner).setMerkleRoot(root);

            const proof = merkleTree.getHexProof(keccak256(addr1.address));

            await myBaseERC721.connect(addr1).claimTokenFromAirdrop(proof);
            const tokenCount = BigInt(await myBaseERC721.count());
            await expect(
                myBaseERC721.connect(addr1).claimTokenFromAirdrop(proof)
            ).to.be.revertedWith("MerkleAirdrop: Address is not a candidate for claim");
            expect(await myBaseERC721.count()).to.be.equal(tokenCount);
        });

        it("FAIL - claim witout entering airdrop", async () => {
            const addressesInAirdrop = [addr1.address, addr2.address, addrs[0].address];
            const merkleTree = new MerkleTree(addressesInAirdrop.concat(owner.address), keccak256, {
                hashLeaves: true,
                sortPairs: true,
            });
            const root = merkleTree.getHexRoot();

            await myBaseERC721.connect(owner).setMerkleRoot(root);

            const proof = merkleTree.getHexProof(keccak256(addrs[1].address));

            const tokenCount = BigInt(await myBaseERC721.count());
            await expect(
                myBaseERC721.connect(addrs[1]).claimTokenFromAirdrop(proof)
            ).to.be.revertedWith("MerkleAirdrop: Address is not a candidate for claim");
            expect(await myBaseERC721.count()).to.be.equal(tokenCount);
        });

        it("FAIL - merkleRoot not set", async () => {
            const addressesInAirdrop = [addr1.address, addr2.address, addrs[0].address];
            const merkleTree = new MerkleTree(addressesInAirdrop.concat(owner.address), keccak256, {
                hashLeaves: true,
                sortPairs: true,
            });
            const root = merkleTree.getHexRoot();

            const proof = merkleTree.getHexProof(keccak256(addr1.address));
            const tokenCount = BigInt(await myBaseERC721.count());

            await expect(
                myBaseERC721.connect(addrs[1]).claimTokenFromAirdrop(proof)
            ).to.be.revertedWith("MerkleAirdrop: Address is not a candidate for claim");
            expect(await myBaseERC721.count()).to.be.equal(tokenCount);
        });
    });
});
