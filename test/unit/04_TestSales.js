const { expect } = require("chai");
const { ethers } = require("hardhat");
const { MerkleTree } = require("merkletreejs");
const { keccak256 } = require("@ethersproject/keccak256");

const {
    getGasUsedForLastTx,
    getTimeStampForLastTx,
    skiptTime,
    getEventLastTx,
    hashToken,
} = require("./../utils");

describe("Test Sales", async () => {
    const DECIMALS = "18";
    const INITIAL_PRICE = "200000000000000000000";
    const addrNull = "0x0000000000000000000000000000000000000000";
    const creatorArtist = "0xbcd4042de499d14e55001ccbb24a551f3b954096";
    const startingBid = 100;

    let myBaseERC721;
    let salesContract;
    let owner;
    let addr1;
    let addr2;
    let addr3;
    let addrs;

    let tokenId = 0;
    const bid1Amount = ethers.utils.parseEther("0.2");
    const bid1AmountWithFee = ethers.utils.parseEther("0.204");
    const bid2Amount = ethers.utils.parseEther("0.25");
    const bid2AmountWithFee = ethers.utils.parseEther("0.2550");

    const basicTicketPrice = ethers.utils.parseEther("0.1"); // value set in BaseERC721.js
    const premiumTicketPrice = ethers.utils.parseEther("1"); // basicTicketPrice * 10
    const mintValue = ethers.utils.parseEther("0.05"); // value set in BaseERC721.js

    let artistMerkleTree;
    let tokenZeroProof;

    beforeEach(async () => {
        const MyMockV3Aggregator = await ethers.getContractFactory("MyMockV3Aggregator");
        myMockV3Aggregator = await MyMockV3Aggregator.deploy(DECIMALS, INITIAL_PRICE);
        await myMockV3Aggregator.deployed();

        let artistAddressPerTokenId = {};
        for (let i = 0; i < 10; i++) {
            artistAddressPerTokenId[i] = creatorArtist;
        }
        artistMerkleTree = new MerkleTree(
            Object.entries(artistAddressPerTokenId).map((token) => hashToken(...token)),
            keccak256,
            { sortPairs: true }
        );
        tokenZeroProof = artistMerkleTree.getHexProof(hashToken(0, creatorArtist));

        const BaseERC721 = await ethers.getContractFactory("BaseERC721");
        myBaseERC721 = await BaseERC721.deploy(
            "My base ERC721",
            "Base ERC721",
            myMockV3Aggregator.address,
            artistMerkleTree.getHexRoot()
        );
        await myBaseERC721.deployed();

        const SalesContract = await ethers.getContractFactory("Sales");
        salesContract = await SalesContract.deploy(myBaseERC721.address);
        await salesContract.deployed();

        [owner, addr1, addr2, addr3, ...addrs] = await ethers.getSigners();

        await myBaseERC721.connect(owner).setSalesContractAddress(salesContract.address);
    });

    describe("TEST emit events", async () => {
        it("PASS - Start", async () => {
            await myBaseERC721.connect(owner).safeMint(owner.address);

            balance = await myBaseERC721.connect(owner).balanceOf(owner.address);
            expect(balance).to.equal(1);

            const timestampBefore = await getTimeStampForLastTx();
            const createAuctionTx = await salesContract
                .connect(owner)
                .createAuction(tokenId, startingBid);
            const eventCreateAuctionTx = await getEventLastTx(
                await createAuctionTx.wait(),
                "Start"
            );

            expect(eventCreateAuctionTx.owner).to.equal(owner.address);
            expect(eventCreateAuctionTx.auction[0]).to.equal(owner.address);
            expect(eventCreateAuctionTx.auction[1]).to.equal(addrNull);
            expect(eventCreateAuctionTx.auction[2]).to.equal(0);
            expect(eventCreateAuctionTx.auction[3]).to.equal(startingBid);
            expect(eventCreateAuctionTx.auction[4]).to.equal(timestampBefore + 6);
            expect(eventCreateAuctionTx.auction[5]).to.equal(0);
            expect(eventCreateAuctionTx.tokenId).to.equal(0);
        });

        it("PASS - Bid", async () => {
            await myBaseERC721.connect(owner).safeMint(owner.address);

            balance = await myBaseERC721.connect(owner).balanceOf(owner.address);
            expect(balance).to.equal(1);

            await salesContract.connect(owner).createAuction(tokenId, startingBid);
            const bidTx = await salesContract
                .connect(addr1)
                .bidAuction(tokenId, bid1Amount, creatorArtist, tokenZeroProof, {
                    value: bid1AmountWithFee,
                });
            await skiptTime(5);

            const eventBidTx = await getEventLastTx(await bidTx.wait(), "Bid");

            expect(eventBidTx.sender).to.equal(addr1.address);
            expect(eventBidTx.amount).to.equal(bid1Amount);
            expect(eventBidTx.tokenId).to.equal(0);
        });

        it("PASS - End", async () => {
            await myBaseERC721.connect(owner).safeMint(owner.address);

            balance = await myBaseERC721.connect(owner).balanceOf(owner.address);
            expect(balance).to.equal(1);

            await salesContract.connect(owner).createAuction(tokenId, startingBid);
            await salesContract
                .connect(addr1)
                .bidAuction(tokenId, bid1Amount, creatorArtist, tokenZeroProof, {
                    value: bid1AmountWithFee,
                });
            await skiptTime(5);

            const endTx = await salesContract.connect(owner).endAuction(tokenId);
            const eventEndTx = await getEventLastTx(await endTx.wait(), "End");

            expect(eventEndTx.winner).to.equal(addr1.address);
            expect(eventEndTx.amount).to.equal(bid1Amount);
            expect(eventEndTx.tokenId).to.equal(0);
        });

        it("PASS - Withdraw", async () => {
            await myBaseERC721.connect(owner).safeMint(owner.address);

            balance = await myBaseERC721.connect(owner).balanceOf(owner.address);
            expect(balance).to.equal(1);

            await salesContract.connect(owner).createAuction(tokenId, startingBid);
            await salesContract
                .connect(addr1)
                .bidAuction(tokenId, bid1Amount, creatorArtist, tokenZeroProof, {
                    value: bid1AmountWithFee,
                });

            await salesContract
                .connect(addr2)
                .bidAuction(tokenId, bid2Amount, creatorArtist, tokenZeroProof, {
                    value: bid2AmountWithFee,
                });

            await skiptTime(5);

            const withdrawTx = await salesContract.connect(addr1).withdraw(tokenId);
            const eventwithdrawTx = await getEventLastTx(await withdrawTx.wait(), "Withdraw");
            await salesContract.connect(owner).endAuction(tokenId);

            expect(eventwithdrawTx.bidder).to.equal(addr1.address);
            expect(eventwithdrawTx.amount).to.equal(bid1Amount);
            expect(eventwithdrawTx.tokenId).to.equal(0);
        });

        it("PASS - Cancel", async () => {
            await myBaseERC721.connect(owner).safeMint(owner.address);

            balance = await myBaseERC721.connect(owner).balanceOf(owner.address);
            expect(balance).to.equal(1);

            await salesContract.connect(owner).createAuction(tokenId, startingBid);
            await salesContract
                .connect(addr1)
                .bidAuction(tokenId, bid1Amount, creatorArtist, tokenZeroProof, {
                    value: bid1AmountWithFee,
                });

            await salesContract
                .connect(addr2)
                .bidAuction(tokenId, bid2Amount, creatorArtist, tokenZeroProof, {
                    value: bid2AmountWithFee,
                });

            const cancelTx = await salesContract.connect(owner).cancelAuction(tokenId);
            const eventCancelTx = await getEventLastTx(await cancelTx.wait(), "Cancel");

            expect(eventCancelTx.highestBidder).to.equal(addr2.address);
            expect(eventCancelTx.amount).to.equal(bid2Amount);
            expect(eventCancelTx.tokenId).to.equal(0);
        });
    });

    describe("TEST createAuction()", async () => {
        it("PASS", async () => {
            await myBaseERC721.connect(owner).safeMint(owner.address);

            balance = await myBaseERC721.connect(owner).balanceOf(owner.address);
            expect(balance).to.equal(1);

            await salesContract.connect(owner).createAuction(tokenId, startingBid);
            await salesContract
                .connect(addr1)
                .bidAuction(tokenId, bid1Amount, creatorArtist, tokenZeroProof, {
                    value: bid1AmountWithFee,
                });
            await skiptTime(6);

            await salesContract.connect(owner).endAuction(tokenId);
            await salesContract.connect(owner).withdraw(tokenId);
        });
    });

    describe("TEST bidAuction()", async () => {
        it("PASS", async () => {
            const startBalanceAddr1 = await addr1.getBalance();
            const startBalanceAddr2 = await addr2.getBalance();
            let agregateGasAddr1 = BigInt(0);
            let agregateGasAddr2 = BigInt(0);

            await myBaseERC721.connect(owner).safeMint(owner.address);

            balance = await myBaseERC721.connect(owner).balanceOf(owner.address);

            await salesContract.connect(owner).createAuction(tokenId, startingBid);

            await salesContract
                .connect(addr1)
                .bidAuction(tokenId, bid1Amount, creatorArtist, tokenZeroProof, {
                    value: bid1AmountWithFee,
                });
            agregateGasAddr1 = await getGasUsedForLastTx();

            expect((await salesContract.auctions(0))[1]).to.be.equal(addr1.address);
            expect((await salesContract.auctions(0))[2]).to.be.equal(BigInt(bid1Amount));
            expect(await addr1.getBalance()).to.be.equal(
                BigInt(startBalanceAddr1) - BigInt(agregateGasAddr1) - BigInt(bid1AmountWithFee)
            );

            await salesContract
                .connect(addr2)
                .bidAuction(tokenId, bid2Amount, creatorArtist, tokenZeroProof, {
                    value: bid2AmountWithFee,
                });
            agregateGasAddr2 = await getGasUsedForLastTx();

            expect((await salesContract.auctions(0))[1]).to.be.equal(addr2.address);
            expect((await salesContract.auctions(0))[2]).to.be.equal(BigInt(bid2Amount));
            expect(await addr2.getBalance()).to.be.equal(
                BigInt(startBalanceAddr2) - BigInt(agregateGasAddr2) - BigInt(bid2AmountWithFee)
            );
        });

        it("FAIL - before create auction", async () => {
            await myBaseERC721.connect(owner).safeMint(owner.address);

            balance = await myBaseERC721.connect(owner).balanceOf(owner.address);
            expect(balance).to.equal(1);

            await expect(
                salesContract
                    .connect(addr1)
                    .bidAuction(tokenId, bid1Amount, creatorArtist, tokenZeroProof, {
                        value: bid1AmountWithFee,
                    })
            ).to.be.revertedWith("The bidding period is over");

            await salesContract.connect(owner).createAuction(tokenId, startingBid);
        });

        it("FAIL - after endAuction", async () => {
            await myBaseERC721.connect(owner).safeMint(owner.address);

            balance = await myBaseERC721.connect(owner).balanceOf(owner.address);
            expect(balance).to.equal(1);

            await salesContract.connect(owner).createAuction(tokenId, startingBid);
            await skiptTime(5);

            await salesContract.connect(owner).endAuction(tokenId);
            await expect(
                salesContract
                    .connect(addr1)
                    .bidAuction(tokenId, bid1Amount, creatorArtist, tokenZeroProof, {
                        value: bid1AmountWithFee,
                    })
            ).to.be.revertedWith("The bidding period is over");
        });

        it("FAIL - after cancel", async () => {
            await myBaseERC721.connect(owner).safeMint(owner.address);

            balance = await myBaseERC721.connect(owner).balanceOf(owner.address);
            expect(balance).to.equal(1);

            await salesContract.connect(owner).createAuction(tokenId, startingBid);

            await salesContract.connect(owner).cancelAuction(tokenId);
            await expect(
                salesContract
                    .connect(addr1)
                    .bidAuction(tokenId, bid1Amount, creatorArtist, tokenZeroProof, {
                        value: bid1AmountWithFee,
                    })
            ).to.be.revertedWith("The bidding period is over");
        });

        it("FAIL - invalid creator address", async () => {
            const invalidProof = artistMerkleTree.getHexProof(hashToken(0, addr1.address));
            await myBaseERC721.connect(owner).safeMint(owner.address);

            balance = await myBaseERC721.connect(owner).balanceOf(owner.address);
            expect(balance).to.equal(1);

            await salesContract.connect(owner).createAuction(tokenId, startingBid);

            await expect(
                salesContract
                    .connect(addr1)
                    .bidAuction(tokenId, bid1Amount, creatorArtist, invalidProof, {
                        value: bid1AmountWithFee,
                    })
            ).to.be.revertedWith("Invalid artist address!");
        });

        it("FAIL - invalid tokenId in proof", async () => {
            const invalidProof = artistMerkleTree.getHexProof(hashToken(1, creatorArtist));
            await myBaseERC721.connect(owner).safeMint(owner.address);

            balance = await myBaseERC721.connect(owner).balanceOf(owner.address);
            expect(balance).to.equal(1);

            await salesContract.connect(owner).createAuction(tokenId, startingBid);

            await expect(
                salesContract
                    .connect(addr1)
                    .bidAuction(tokenId, bid1Amount, creatorArtist, invalidProof, {
                        value: bid1AmountWithFee,
                    })
            ).to.be.revertedWith("Invalid artist address!");
        });
    });

    describe("TEST endAuction()", async () => {
        it("PASS - revert tokens", async () => {
            const startBalanceOwner = await owner.getBalance();
            let agregateOwnerGas = BigInt(0);

            await myBaseERC721.connect(owner).safeMint(owner.address);
            agregateOwnerGas += await getGasUsedForLastTx();

            balance = await myBaseERC721.connect(owner).balanceOf(owner.address);
            expect(balance).to.equal(1);

            await salesContract.connect(owner).createAuction(tokenId, startingBid);
            agregateOwnerGas += await getGasUsedForLastTx();

            balance = await myBaseERC721.connect(owner).balanceOf(owner.address);
            expect(balance).to.equal(0);

            await skiptTime(5);

            await salesContract.connect(owner).endAuction(tokenId);
            agregateOwnerGas += await getGasUsedForLastTx();

            balance = await myBaseERC721.connect(owner).balanceOf(owner.address);
            expect(balance).to.equal(1);
            expect(await owner.getBalance()).to.equal(
                BigInt(startBalanceOwner) - BigInt(agregateOwnerGas)
            );
        });

        it("FAIL - before create auction", async () => {
            await myBaseERC721.connect(owner).safeMint(addr2.address);

            balance = await myBaseERC721.connect(addr2).balanceOf(addr2.address);
            expect(balance).to.equal(1);

            await skiptTime(5);

            await expect(salesContract.connect(addr2).endAuction(tokenId)).to.be.revertedWith(
                "You cannot end an auction that has not started"
            );

            await salesContract.connect(addr2).createAuction(tokenId, startingBid);
        });

        it("FAIL - before time's up", async () => {
            await myBaseERC721.connect(owner).safeMint(owner.address);

            balance = await myBaseERC721.connect(owner).balanceOf(owner.address);
            expect(balance).to.equal(1);

            await salesContract.connect(owner).createAuction(tokenId, startingBid);
            await salesContract
                .connect(addr1)
                .bidAuction(tokenId, bid1Amount, creatorArtist, tokenZeroProof, {
                    value: bid1AmountWithFee,
                });

            await expect(salesContract.connect(owner).endAuction(tokenId)).to.be.revertedWith(
                "The bidding period has not ended"
            );
        });

        it("FAIL - after endAuction auction", async () => {
            await myBaseERC721.connect(owner).safeMint(addr2.address);

            balance = await myBaseERC721.connect(addr2).balanceOf(addr2.address);
            expect(balance).to.equal(1);

            await salesContract.connect(addr2).createAuction(tokenId, startingBid);
            await salesContract
                .connect(addr1)
                .bidAuction(tokenId, bid1Amount, creatorArtist, tokenZeroProof, {
                    value: bid1AmountWithFee,
                });
            await skiptTime(5);

            await salesContract.connect(addr2).endAuction(tokenId);
            await expect(salesContract.connect(addr2).endAuction(tokenId)).to.be.revertedWith(
                "You cannot end an auction that has not started"
            );
        });
    });

    describe("Test cancelAuction()", async () => {
        it("PASS", async () => {
            const startBalanceOwner = await owner.getBalance();
            let agregateOwnerGas = BigInt(0);

            await myBaseERC721.connect(owner).safeMint(owner.address);
            agregateOwnerGas += await getGasUsedForLastTx();

            balance = await myBaseERC721.connect(owner).balanceOf(owner.address);
            expect(balance).to.equal(1);

            await salesContract.connect(owner).createAuction(tokenId, startingBid);
            agregateOwnerGas += await getGasUsedForLastTx();

            await salesContract.connect(owner).cancelAuction(tokenId);
            agregateOwnerGas += await getGasUsedForLastTx();

            expect(await owner.getBalance()).to.equal(
                BigInt(startBalanceOwner) - BigInt(agregateOwnerGas)
            );
        });

        it("FAIL - after time's up", async () => {
            await myBaseERC721.connect(owner).safeMint(owner.address);

            balance = await myBaseERC721.connect(owner).balanceOf(owner.address);
            expect(balance).to.equal(1);

            await salesContract.connect(owner).createAuction(tokenId, startingBid);
            await salesContract
                .connect(addr1)
                .bidAuction(tokenId, bid1Amount, creatorArtist, tokenZeroProof, {
                    value: bid1AmountWithFee,
                });

            await skiptTime(5);

            await expect(salesContract.connect(owner).cancelAuction(tokenId)).to.be.revertedWith(
                "The bidding period is over"
            );
        });
    });

    describe("TEST withdraw()", async () => {
        it("PASS -  after ended auction", async () => {
            const startBalanceAddr1 = await addr1.getBalance();
            const startBalanceAddr2 = await addr2.getBalance();
            const startBalanceAddr3 = await addr3.getBalance();
            const adminFee = BigInt(ethers.utils.parseEther("0.0045"));
            let agregateAddr1Gas = BigInt(0);
            let agregateAddr2Gas = BigInt(0);
            let agregateAddr3Gas = BigInt(0);

            await myBaseERC721.connect(owner).safeMint(addr1.address);

            await salesContract.connect(addr1).createAuction(tokenId, startingBid);
            agregateAddr1Gas += await getGasUsedForLastTx();

            await salesContract
                .connect(addr2)
                .bidAuction(tokenId, bid1Amount, creatorArtist, tokenZeroProof, {
                    value: bid1AmountWithFee,
                });
            agregateAddr2Gas += await getGasUsedForLastTx();

            await salesContract
                .connect(addr3)
                .bidAuction(tokenId, bid2Amount, creatorArtist, tokenZeroProof, {
                    value: bid2AmountWithFee,
                });
            agregateAddr3Gas += await getGasUsedForLastTx();

            await skiptTime(5);

            await salesContract.connect(addr1).endAuction(tokenId);
            agregateAddr1Gas += await getGasUsedForLastTx();

            expect(await addr2.getBalance()).to.equal(
                BigInt(startBalanceAddr2) - BigInt(agregateAddr2Gas) - BigInt(bid1AmountWithFee)
            );

            expect(await addr3.getBalance()).to.equal(
                BigInt(startBalanceAddr3) - BigInt(agregateAddr3Gas) - BigInt(bid2AmountWithFee)
            );

            expect(await addr1.getBalance()).to.equal(
                BigInt(startBalanceAddr1) - BigInt(agregateAddr1Gas) + BigInt(bid2Amount)
            );

            expect(await ethers.provider.getBalance(salesContract.address)).to.be.equal(
                BigInt(adminFee) + BigInt(bid1Amount)
            );

            expect(await salesContract.adminFeeToWithdraw()).to.be.equal(BigInt(adminFee));
        });

        it("PASS - after canceled auction", async () => {
            const startBalanceAddr2 = await addr2.getBalance();
            const startBalanceAddr3 = await addr3.getBalance();
            let agregateAddr2Gas = BigInt(0);
            let agregateAddr3Gas = BigInt(0);

            await myBaseERC721.connect(owner).safeMint(addr1.address);

            await salesContract.connect(addr1).createAuction(tokenId, startingBid);

            await salesContract
                .connect(addr2)
                .bidAuction(tokenId, bid1Amount, creatorArtist, tokenZeroProof, {
                    value: bid1AmountWithFee,
                });
            agregateAddr2Gas += await getGasUsedForLastTx();

            await salesContract
                .connect(addr3)
                .bidAuction(tokenId, bid2Amount, creatorArtist, tokenZeroProof, {
                    value: bid2AmountWithFee,
                });
            agregateAddr3Gas += await getGasUsedForLastTx();

            await salesContract.connect(addr1).cancelAuction(tokenId);

            await salesContract.connect(addr2).withdraw(tokenId);
            agregateAddr2Gas += await getGasUsedForLastTx();

            expect(await addr2.getBalance()).to.equal(
                BigInt(startBalanceAddr2) -
                    BigInt(agregateAddr2Gas) -
                    BigInt(bid1AmountWithFee) +
                    BigInt(bid1Amount)
            );

            await salesContract.connect(addr3).withdraw(tokenId);

            agregateAddr3Gas += await getGasUsedForLastTx();

            expect(await addr3.getBalance()).to.equal(
                BigInt(startBalanceAddr3) -
                    BigInt(agregateAddr3Gas) -
                    BigInt(bid2AmountWithFee) +
                    BigInt(bid2Amount)
            );
        });

        it("FAIL - before auction end", async () => {
            const startBalanceAddr1 = await addr1.getBalance();
            const startBalanceAddr2 = await addr2.getBalance();
            const startBalanceAddr3 = await addr3.getBalance();
            let agregateAddr1Gas = BigInt(0);
            let agregateAddr2Gas = BigInt(0);
            let agregateAddr3Gas = BigInt(0);

            await myBaseERC721.connect(owner).safeMint(addr1.address);

            await salesContract.connect(addr1).createAuction(tokenId, startingBid);
            agregateAddr1Gas += await getGasUsedForLastTx();

            await salesContract
                .connect(addr2)
                .bidAuction(tokenId, bid1Amount, creatorArtist, tokenZeroProof, {
                    value: bid1AmountWithFee,
                });
            agregateAddr2Gas += await getGasUsedForLastTx();

            await salesContract
                .connect(addr3)
                .bidAuction(tokenId, bid2Amount, creatorArtist, tokenZeroProof, {
                    value: bid2AmountWithFee,
                });
            agregateAddr3Gas += await getGasUsedForLastTx();

            await expect(salesContract.connect(addr2).withdraw(tokenId)).to.be.revertedWith(
                "The bidding period has not ended"
            );
            agregateAddr2Gas += await getGasUsedForLastTx();

            await expect(salesContract.connect(addr3).withdraw(tokenId)).to.be.revertedWith(
                "The bidding period has not ended"
            );
            agregateAddr3Gas += await getGasUsedForLastTx();

            expect(await addr1.getBalance()).to.equal(
                BigInt(startBalanceAddr1) - BigInt(agregateAddr1Gas)
            );

            expect(await addr2.getBalance()).to.equal(
                BigInt(startBalanceAddr2) - BigInt(agregateAddr2Gas) - BigInt(bid1AmountWithFee)
            );

            expect(await addr3.getBalance()).to.equal(
                BigInt(startBalanceAddr3) - BigInt(agregateAddr3Gas) - BigInt(bid2AmountWithFee)
            );
        });
    });

    describe("TEST withdrawAdminFee()", async () => {
        it("PASS", async () => {
            const startBalanceOwner = BigInt(await owner.getBalance());
            const tokenId = 0;
            const adminFee = BigInt(ethers.utils.parseEther("0.002"));

            await myBaseERC721
                .connect(addr1)
                .payToMint(addr1.address, { value: ethers.utils.parseEther("0.05") });

            await salesContract.connect(addr1).createAuction(tokenId, startingBid);

            await salesContract
                .connect(addr2)
                .bidAuction(tokenId, bid1Amount, creatorArtist, tokenZeroProof, {
                    value: bid1AmountWithFee,
                });

            await skiptTime(5);

            await salesContract.connect(addr1).endAuction(tokenId);

            await salesContract.connect(owner).withdrawAdminFee();
            const agregateOwnerGas = await getGasUsedForLastTx();

            expect(await owner.getBalance()).to.be.equal(
                startBalanceOwner + adminFee - BigInt(agregateOwnerGas)
            );
            expect(await salesContract.adminFeeToWithdraw()).to.be.equal(0);
        });

        it("FAIL - not onwer", async () => {
            const tokenId = 0;

            await myBaseERC721
                .connect(addr1)
                .payToMint(addr1.address, { value: ethers.utils.parseEther("0.05") });

            await salesContract.connect(addr1).createAuction(tokenId, startingBid);

            await salesContract
                .connect(addr2)
                .bidAuction(tokenId, bid1Amount, creatorArtist, tokenZeroProof, {
                    value: bid1AmountWithFee,
                });

            await skiptTime(5);

            await salesContract.connect(addr1).endAuction(tokenId);

            const ownerFee = await salesContract.adminFeeToWithdraw();

            await expect(salesContract.connect(addr1).withdrawAdminFee()).to.be.revertedWith(
                "Ownable: caller is not the owner"
            );

            expect(await salesContract.adminFeeToWithdraw()).to.be.equal(ownerFee);
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

            const putOnSaleTx = await salesContract.connect(addr1).startSale(tokenId, sellPrice);
            await putOnSaleTx.wait();

            expect((await salesContract.connect(addr1).tokenIdToSale(tokenId))[1]).to.equal(
                sellPrice
            );
            expect(await myBaseERC721.connect(addr1).ownerOf(tokenId)).to.equal(
                salesContract.address
            );
            expect((await salesContract.connect(addr1).tokenIdToSale(tokenId))[0]).to.equal(
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
                salesContract.connect(addr2).startSale(tokenId, sellPrice)
            ).to.be.revertedWith("Cant perform this action, you must be owner of this token!");

            expect((await salesContract.connect(addr1).tokenIdToSale(tokenId))[1]).to.equal(0);
            expect(await myBaseERC721.connect(addr1).ownerOf(tokenId)).to.equal(addr1.address);
            expect((await salesContract.connect(addr1).tokenIdToSale(tokenId))[0]).to.equal(
                addrNull
            );
        });

        it("FAIL - sale for 0 ETH", async () => {
            const tokenId = 0;
            const mintTx = await myBaseERC721.connect(addr1).payToMint(addr1.address, {
                value: mintValue,
            });
            await mintTx.wait();

            await expect(salesContract.connect(addr1).startSale(tokenId, 0)).to.be.revertedWith(
                "Can not sale for 0 ETH!"
            );

            expect((await salesContract.connect(addr1).tokenIdToSale(tokenId))[1]).to.equal(0);
            expect(await myBaseERC721.connect(addr1).ownerOf(tokenId)).to.equal(addr1.address);
            expect((await salesContract.connect(addr1).tokenIdToSale(tokenId))[0]).to.equal(
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

            const putOnSaleTx = await salesContract.connect(addr1).startSale(tokenId, sellPrice);
            await putOnSaleTx.wait();

            const cancelTheSaleTX = await salesContract.connect(addr1).cancelSale(tokenId);
            await cancelTheSaleTX.wait();

            expect(await myBaseERC721.connect(addr1).ownerOf(tokenId)).to.equal(addr1.address);
            expect((await salesContract.connect(addr1).tokenIdToSale(tokenId))[0]).to.equal(
                addrNull
            );
            expect((await salesContract.connect(addr1).tokenIdToSale(tokenId))[1]).to.equal(0);
        });

        it("FAIL - not onwer of token", async () => {
            const sellPrice = ethers.utils.parseEther("0.5");
            const tokenId = 0;
            const mintTx = await myBaseERC721.connect(addr1).payToMint(addr1.address, {
                value: mintValue,
            });
            await mintTx.wait();

            const putOnSaleTx = await salesContract.connect(addr1).startSale(tokenId, sellPrice);
            await putOnSaleTx.wait();

            await expect(salesContract.connect(addr2).cancelSale(tokenId)).to.be.revertedWith(
                "Cant perform this action, you must be owner of this token!"
            );

            expect((await salesContract.connect(addr1).tokenIdToSale(tokenId))[1]).to.equal(
                sellPrice
            );
            expect(await myBaseERC721.connect(addr1).ownerOf(tokenId)).to.equal(
                salesContract.address
            );
            expect((await salesContract.connect(addr1).tokenIdToSale(tokenId))[0]).to.equal(
                addr1.address
            );
        });

        it("FAIL - sale not started", async () => {
            const tokenId = 0;
            const mintTx = await myBaseERC721.connect(addr1).payToMint(addr1.address, {
                value: mintValue,
            });
            await mintTx.wait();

            await expect(salesContract.connect(addr1).cancelSale(tokenId)).to.be.revertedWith(
                "Cant perform this action, token is not on sale!"
            );

            expect((await salesContract.connect(addr1).tokenIdToSale(tokenId))[1]).to.equal(0);
            expect(await myBaseERC721.connect(addr1).ownerOf(tokenId)).to.equal(addr1.address);
            expect((await salesContract.connect(addr1).tokenIdToSale(tokenId))[0]).to.equal(
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

            const putOnSaleTx = await salesContract.connect(addr1).startSale(tokenId, sellPrice);
            await putOnSaleTx.wait();

            const addr1BalanceBefor = await addr1.getBalance();
            const addr2BalanceBefor = await addr2.getBalance();
            const contractBalanceBefor = await ethers.provider.getBalance(salesContract.address);
            const creatorArtistBalanceBefor = await ethers.provider.getBalance(creatorArtist);
            const adminFee = parseInt(
                await myBaseERC721.calculateAdminFee(addr2.address, sellPrice)
            );
            const royaltyFee = parseInt(await myBaseERC721.calculateRoyaltiesFee(sellPrice));

            await salesContract
                .connect(addr2)
                .buyTokenOnSale(tokenId, creatorArtist, tokenZeroProof, {
                    value: String(parseInt(sellPrice) + adminFee + royaltyFee),
                });

            const gasUsed = await getGasUsedForLastTx();

            expect(await myBaseERC721.connect(addr2).ownerOf(tokenId)).to.equal(addr2.address);
            expect((await salesContract.connect(addr2).tokenIdToSale(tokenId))[1]).to.equal(0);
            expect((await salesContract.connect(addr2).tokenIdToSale(tokenId))[0]).to.equal(
                addrNull
            );
            expect(await addr1.getBalance()).to.equal(
                BigInt(addr1BalanceBefor) + BigInt(sellPrice)
            );
            expect(await addr2.getBalance()).to.equal(
                BigInt(addr2BalanceBefor) -
                    BigInt(sellPrice) -
                    gasUsed -
                    BigInt(adminFee) -
                    BigInt(royaltyFee)
            );
            expect(await ethers.provider.getBalance(salesContract.address)).to.equal(
                BigInt(contractBalanceBefor) + BigInt(adminFee)
            );
            expect((await myBaseERC721.addressToBasicTicket(addr2.address))[0]).to.be.equal(0);
            expect(await ethers.provider.getBalance(creatorArtist)).to.be.equal(
                BigInt(creatorArtistBalanceBefor) + BigInt(royaltyFee)
            );
        });

        it("PASS - with basic ticket", async () => {
            const sellPrice = ethers.utils.parseEther("0.5");
            const tokenId = 0;
            const mintTx = await myBaseERC721.connect(addr1).payToMint(addr1.address, {
                value: mintValue,
            });
            await mintTx.wait();

            const putOnSaleTx = await salesContract.connect(addr1).startSale(tokenId, sellPrice);
            await putOnSaleTx.wait();

            const addr1BalanceBefor = await addr1.getBalance();
            const addr2BalanceBefor = await addr2.getBalance();
            const contractBalanceBefor = await ethers.provider.getBalance(myBaseERC721.address);
            const creatorArtistBalanceBefor = await ethers.provider.getBalance(creatorArtist);
            const royaltyFee = parseInt(await myBaseERC721.calculateRoyaltiesFee(sellPrice));

            await myBaseERC721.connect(addr2).buyBasicTicket({ value: basicTicketPrice });
            let gasUsed = await getGasUsedForLastTx();

            await salesContract
                .connect(addr2)
                .buyTokenOnSale(tokenId, creatorArtist, tokenZeroProof, {
                    value: String(parseInt(sellPrice) + royaltyFee),
                });
            gasUsed += await getGasUsedForLastTx();

            expect(await myBaseERC721.connect(addr2).ownerOf(tokenId)).to.equal(addr2.address);
            expect((await salesContract.connect(addr2).tokenIdToSale(tokenId))[1]).to.equal(0);
            expect((await salesContract.connect(addr2).tokenIdToSale(tokenId))[0]).to.equal(
                addrNull
            );
            expect(await addr1.getBalance()).to.equal(
                BigInt(addr1BalanceBefor) + BigInt(sellPrice)
            );
            expect(await addr2.getBalance()).to.equal(
                BigInt(addr2BalanceBefor) -
                    BigInt(sellPrice) -
                    gasUsed -
                    BigInt(basicTicketPrice) -
                    BigInt(royaltyFee)
            );
            expect(await ethers.provider.getBalance(myBaseERC721.address)).to.equal(
                BigInt(contractBalanceBefor) + BigInt(basicTicketPrice)
            );
            expect((await myBaseERC721.addressToBasicTicket(addr2.address))[0]).to.be.equal(
                sellPrice
            );
            expect(await ethers.provider.getBalance(creatorArtist)).to.be.equal(
                BigInt(creatorArtistBalanceBefor) + BigInt(royaltyFee)
            );
        });

        it("PASS - with premium ticket", async () => {
            const sellPrice = ethers.utils.parseEther("0.5");
            const tokenId = 0;
            const mintTx = await myBaseERC721.connect(addr1).payToMint(addr1.address, {
                value: mintValue,
            });
            await mintTx.wait();

            const putOnSaleTx = await salesContract.connect(addr1).startSale(tokenId, sellPrice);
            await putOnSaleTx.wait();

            const addr1BalanceBefor = await addr1.getBalance();
            const addr2BalanceBefor = await addr2.getBalance();
            const contractBalanceBefor = await ethers.provider.getBalance(myBaseERC721.address);
            const creatorArtistBalanceBefor = await ethers.provider.getBalance(creatorArtist);
            const royaltyFee = parseInt(await myBaseERC721.calculateRoyaltiesFee(sellPrice));

            await myBaseERC721.connect(addr2).buyPremiumTicket({ value: premiumTicketPrice });
            let gasUsed = await getGasUsedForLastTx();

            await salesContract
                .connect(addr2)
                .buyTokenOnSale(tokenId, creatorArtist, tokenZeroProof, {
                    value: String(parseInt(sellPrice) + royaltyFee),
                });
            gasUsed += await getGasUsedForLastTx();

            expect(await myBaseERC721.connect(addr2).ownerOf(tokenId)).to.equal(addr2.address);
            expect((await salesContract.connect(addr2).tokenIdToSale(tokenId))[1]).to.equal(0);
            expect((await salesContract.connect(addr2).tokenIdToSale(tokenId))[0]).to.equal(
                addrNull
            );
            expect(await addr1.getBalance()).to.equal(
                BigInt(addr1BalanceBefor) + BigInt(sellPrice)
            );
            expect(await addr2.getBalance()).to.equal(
                BigInt(addr2BalanceBefor) -
                    BigInt(sellPrice) -
                    gasUsed -
                    BigInt(premiumTicketPrice) -
                    BigInt(royaltyFee)
            );
            expect(await ethers.provider.getBalance(myBaseERC721.address)).to.equal(
                BigInt(contractBalanceBefor) + BigInt(premiumTicketPrice)
            );
            expect((await myBaseERC721.addressToBasicTicket(addr2.address))[0]).to.be.equal(0);
            expect(await ethers.provider.getBalance(creatorArtist)).to.be.equal(
                BigInt(creatorArtistBalanceBefor) + BigInt(royaltyFee)
            );
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
            const creatorArtistBalanceBefor = await ethers.provider.getBalance(creatorArtist);

            await expect(
                salesContract
                    .connect(addr2)
                    .buyTokenOnSale(tokenId, creatorArtist, tokenZeroProof, { value: sellPrice })
            ).to.be.revertedWith("Cant perform this action, token is not on sale!");

            const gasForRevertedTx = await getGasUsedForLastTx();

            expect(await myBaseERC721.connect(addr1).ownerOf(tokenId)).to.equal(addr1.address);
            expect(await addr1.getBalance()).to.equal(addr1BalanceBefor);
            expect(await addr2.getBalance()).to.equal(BigInt(addr2BalanceBefor) - gasForRevertedTx);
            expect(await ethers.provider.getBalance(creatorArtist)).to.equal(
                creatorArtistBalanceBefor
            );
        });

        it("FAIL - send eth to low", async () => {
            const sellPrice = ethers.utils.parseEther("0.5");
            const sendEthAmount = ethers.utils.parseEther("0.05");
            const tokenId = 0;
            const mintTx = await myBaseERC721.connect(addr1).payToMint(addr1.address, {
                value: sendEthAmount,
            });
            await mintTx.wait();

            const putOnSaleTx = await salesContract.connect(addr1).startSale(tokenId, sellPrice);
            await putOnSaleTx.wait();

            const addr1BalanceBefor = await addr1.getBalance();
            const addr2BalanceBefor = await addr2.getBalance();
            const creatorArtistBalanceBefor = await ethers.provider.getBalance(creatorArtist);

            await expect(
                salesContract.connect(addr2).buyTokenOnSale(tokenId, creatorArtist, tokenZeroProof, {
                    value: sendEthAmount,
                })
            ).to.be.revertedWith("Pleas provide minimum price of this specific token!");

            const gasForRevertedTx = await getGasUsedForLastTx();

            expect(
                (await salesContract.connect(salesContract.address).tokenIdToSale(tokenId))[1]
            ).to.equal(sellPrice);
            expect(
                (await salesContract.connect(salesContract.address).tokenIdToSale(tokenId))[0]
            ).to.equal(addr1.address);
            expect(await myBaseERC721.connect(salesContract.address).ownerOf(tokenId)).to.equal(
                salesContract.address
            );
            expect(await addr1.getBalance()).to.equal(addr1BalanceBefor);
            expect(await addr2.getBalance()).to.equal(BigInt(addr2BalanceBefor) - gasForRevertedTx);
            expect(await ethers.provider.getBalance(creatorArtist)).to.equal(
                creatorArtistBalanceBefor
            );
        });

        it("FAIL - send only price without transcation fee and active ticket", async () => {
            const sellPrice = ethers.utils.parseEther("0.5");
            const tokenId = 0;
            const mintTx = await myBaseERC721.connect(addr1).payToMint(addr1.address, {
                value: mintValue,
            });
            await mintTx.wait();

            const putOnSaleTx = await salesContract.connect(addr1).startSale(tokenId, sellPrice);
            await putOnSaleTx.wait();

            const addr1BalanceBefor = await addr1.getBalance();
            const addr2BalanceBefor = await addr2.getBalance();
            const creatorArtistBalanceBefor = await ethers.provider.getBalance(creatorArtist);

            await expect(
                salesContract
                    .connect(addr2)
                    .buyTokenOnSale(tokenId, creatorArtist, tokenZeroProof, { value: sellPrice })
            ).to.be.revertedWith("Pleas provide minimum price of this specific token!");

            const gasForRevertedTx = await getGasUsedForLastTx();

            expect(
                (await salesContract.connect(myBaseERC721.address).tokenIdToSale(tokenId))[1]
            ).to.equal(sellPrice);
            expect(
                (await salesContract.connect(myBaseERC721.address).tokenIdToSale(tokenId))[0]
            ).to.equal(addr1.address);
            expect(await myBaseERC721.connect(salesContract.address).ownerOf(tokenId)).to.equal(
                salesContract.address
            );
            expect(await addr1.getBalance()).to.equal(addr1BalanceBefor);
            expect(await addr2.getBalance()).to.equal(BigInt(addr2BalanceBefor) - gasForRevertedTx);
            expect(await ethers.provider.getBalance(creatorArtist)).to.equal(
                creatorArtistBalanceBefor
            );
        });

        it("FAIL - invalid creator address", async () => {
            const sellPrice = ethers.utils.parseEther("0.5");
            const tokenId = 0;
            const invalidProof = artistMerkleTree.getHexProof(hashToken(0, addr1.address));
            const mintTx = await myBaseERC721.connect(addr1).payToMint(addr1.address, {
                value: mintValue,
            });
            await mintTx.wait();

            const putOnSaleTx = await salesContract.connect(addr1).startSale(tokenId, sellPrice);
            await putOnSaleTx.wait();

            const addr1BalanceBefor = await addr1.getBalance();
            const addr2BalanceBefor = await addr2.getBalance();
            const contractBalanceBefor = await ethers.provider.getBalance(salesContract.address);
            const creatorArtistBalanceBefor = await ethers.provider.getBalance(creatorArtist);
            const adminFee = parseInt(
                await myBaseERC721.calculateAdminFee(addr2.address, sellPrice)
            );
            const royaltyFee = parseInt(await myBaseERC721.calculateRoyaltiesFee(sellPrice));

            await expect(
                salesContract.connect(addr2).buyTokenOnSale(tokenId, creatorArtist, invalidProof, {
                    value: String(parseInt(sellPrice) + adminFee + royaltyFee),
                })
            ).to.be.revertedWith("Invalid artist address!");

            const gasUsed = await getGasUsedForLastTx();

            expect(await addr1.getBalance()).to.equal(BigInt(addr1BalanceBefor));
            expect(await addr2.getBalance()).to.equal(BigInt(addr2BalanceBefor) - gasUsed);
            expect(await ethers.provider.getBalance(salesContract.address)).to.equal(
                BigInt(contractBalanceBefor)
            );
            expect(await ethers.provider.getBalance(creatorArtist)).to.be.equal(
                BigInt(creatorArtistBalanceBefor)
            );
        });

        it("FAIL - invalid tokenId in proof", async () => {
            const sellPrice = ethers.utils.parseEther("0.5");
            const tokenId = 0;
            const invalidProof = artistMerkleTree.getHexProof(hashToken(1, creatorArtist));
            const mintTx = await myBaseERC721.connect(addr1).payToMint(addr1.address, {
                value: mintValue,
            });
            await mintTx.wait();

            const putOnSaleTx = await salesContract.connect(addr1).startSale(tokenId, sellPrice);
            await putOnSaleTx.wait();

            const addr1BalanceBefor = await addr1.getBalance();
            const addr2BalanceBefor = await addr2.getBalance();
            const contractBalanceBefor = await ethers.provider.getBalance(salesContract.address);
            const creatorArtistBalanceBefor = await ethers.provider.getBalance(creatorArtist);
            const adminFee = parseInt(
                await myBaseERC721.calculateAdminFee(addr2.address, sellPrice)
            );
            const royaltyFee = parseInt(await myBaseERC721.calculateRoyaltiesFee(sellPrice));

            await expect(
                salesContract.connect(addr2).buyTokenOnSale(tokenId, creatorArtist, invalidProof, {
                    value: String(parseInt(sellPrice) + adminFee + royaltyFee),
                })
            ).to.be.revertedWith("Invalid artist address!");

            const gasUsed = await getGasUsedForLastTx();

            expect(await addr1.getBalance()).to.equal(BigInt(addr1BalanceBefor));
            expect(await addr2.getBalance()).to.equal(BigInt(addr2BalanceBefor) - gasUsed);
            expect(await ethers.provider.getBalance(salesContract.address)).to.equal(
                BigInt(contractBalanceBefor)
            );
            expect(await ethers.provider.getBalance(creatorArtist)).to.be.equal(
                BigInt(creatorArtistBalanceBefor)
            );
        });
    });

    describe("TEST - creatSwapOffer()", () => {
        it("PASS - 1 NFT for 1 NFT", async () => {
            await myBaseERC721.connect(owner).safeMint(addr1.address);
            await myBaseERC721.connect(owner).safeMint(addr1.address);

            await salesContract.connect(addr1).creatSwapOffer([0], [1], 2137);

            const swapStruct = await salesContract.tokenIdToSwapOffers(0);
            console.log(swapStruct);

            expect(swapStruct['offerMaker']).to.equal(addr1.address);
            console.log(1);
            expect(await salesContract.getOfferedTokensForSwap(0)).to.equal([BigInt(0)]);
            console.log(1);
            expect(await salesContract.getRequestedTokensForSwap(0)).to.equal([BigInt(1)]);
            console.log(1);
            expect(swapStruct['requestedEth']).to.equal(0);
        });
    });
});
