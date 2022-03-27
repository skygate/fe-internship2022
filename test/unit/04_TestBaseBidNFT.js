const { expect } = require("chai");
const { ethers } = require("hardhat");

const {
    getGasUsedForLastTx,
    getTimeStampForLastTx,
    skiptTime,
    getEventLastTx,
} = require("./../utils");

describe("Test BaseBidNFT", async () => {
    const DECIMALS = "18";
    const INITIAL_PRICE = "200000000000000000000";
    const addrNull = "0x0000000000000000000000000000000000000000";
    const startingBid = 100;

    let myBaseERC721;
    let myBaseBidNFT;
    let owner;
    let addr1;
    let addr2;
    let addr3;
    let addrs;

    let tokenId = 0;
    const bid1Amount = ethers.utils.parseEther("0.2");
    const bid1AmountWithFee = ethers.utils.parseEther("0.202");
    const bid2Amount = ethers.utils.parseEther("0.25");
    const bid2AmountWithFee = ethers.utils.parseEther("0.2525");

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

        const BaseBidNFT = await ethers.getContractFactory("BaseBidNFT");
        myBaseBidNFT = await BaseBidNFT.deploy(myBaseERC721.address);
        await myBaseBidNFT.deployed();
    
        [owner, addr1, addr2, addr3, ...addrs] = await ethers.getSigners();

        await myBaseERC721.connect(owner).setBaseBidNFTAddress(myBaseBidNFT.address);
    });

    describe("TEST emit events", async () => {
        it("PASS - Start", async () => {
            await myBaseERC721.connect(owner).safeMint(owner.address);

            balance = await myBaseERC721.connect(owner).balanceOf(owner.address);
            expect(balance).to.equal(1);

            const timestampBefore = await getTimeStampForLastTx();
            const createAuctionTx = await myBaseBidNFT
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

            await myBaseBidNFT.connect(owner).createAuction(tokenId, startingBid);
            const bidTx = await myBaseBidNFT.connect(addr1).bidAuction(tokenId, bid1Amount, {
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

            await myBaseBidNFT.connect(owner).createAuction(tokenId, startingBid);
            await myBaseBidNFT.connect(addr1).bidAuction(tokenId, bid1Amount, {
                value: bid1AmountWithFee,
            });
            await skiptTime(5);

            const endTx = await myBaseBidNFT.connect(owner).endAuction(tokenId);
            const eventEndTx = await getEventLastTx(await endTx.wait(), "End");

            expect(eventEndTx.winner).to.equal(addr1.address);
            expect(eventEndTx.amount).to.equal(bid1Amount);
            expect(eventEndTx.tokenId).to.equal(0);
        });

        it("PASS - Withdraw", async () => {
            await myBaseERC721.connect(owner).safeMint(owner.address);

            balance = await myBaseERC721.connect(owner).balanceOf(owner.address);
            expect(balance).to.equal(1);

            await myBaseBidNFT.connect(owner).createAuction(tokenId, startingBid);
            await myBaseBidNFT.connect(addr1).bidAuction(tokenId, bid1Amount, {
                value: bid1AmountWithFee,
            });

            await myBaseBidNFT.connect(addr2).bidAuction(tokenId, bid2Amount, {
                value: bid2AmountWithFee,
            });

            await skiptTime(5);

            const withdrawTx = await myBaseBidNFT.connect(addr1).withdraw(tokenId);
            const eventwithdrawTx = await getEventLastTx(await withdrawTx.wait(), "Withdraw");
            await myBaseBidNFT.connect(owner).endAuction(tokenId);

            expect(eventwithdrawTx.bidder).to.equal(addr1.address);
            expect(eventwithdrawTx.amount).to.equal(bid1Amount);
            expect(eventwithdrawTx.tokenId).to.equal(0);
        });

        it("PASS - Cancel", async () => {
            await myBaseERC721.connect(owner).safeMint(owner.address);

            balance = await myBaseERC721.connect(owner).balanceOf(owner.address);
            expect(balance).to.equal(1);

            await myBaseBidNFT.connect(owner).createAuction(tokenId, startingBid);
            await myBaseBidNFT.connect(addr1).bidAuction(tokenId, bid1Amount, {
                value: bid1AmountWithFee,
            });

            await myBaseBidNFT.connect(addr2).bidAuction(tokenId, bid2Amount, {
                value: bid2AmountWithFee,
            });

            const cancelTx = await myBaseBidNFT.connect(owner).cancelAuction(tokenId);
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

            await myBaseBidNFT.connect(owner).createAuction(tokenId, startingBid);
            await myBaseBidNFT.connect(addr1).bidAuction(tokenId, bid1Amount, {
                value: bid1AmountWithFee,
            });
            await skiptTime(6);

            await myBaseBidNFT.connect(owner).endAuction(tokenId);
            await myBaseBidNFT.connect(owner).withdraw(tokenId);
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

            await myBaseBidNFT.connect(owner).createAuction(tokenId, startingBid);

            await myBaseBidNFT.connect(addr1).bidAuction(tokenId, bid1Amount, {
                value: bid1AmountWithFee,
            });
            agregateGasAddr1 = await getGasUsedForLastTx();

            expect((await myBaseBidNFT.auctions(0))[1]).to.be.equal(addr1.address);
            expect((await myBaseBidNFT.auctions(0))[2]).to.be.equal(BigInt(bid1Amount));
            expect(await addr1.getBalance()).to.be.equal(
                BigInt(startBalanceAddr1) - BigInt(agregateGasAddr1) - BigInt(bid1AmountWithFee)
            );

            await myBaseBidNFT.connect(addr2).bidAuction(tokenId, bid2Amount, {
                value: bid2AmountWithFee,
            });
            agregateGasAddr2 = await getGasUsedForLastTx();

            expect((await myBaseBidNFT.auctions(0))[1]).to.be.equal(addr2.address);
            expect((await myBaseBidNFT.auctions(0))[2]).to.be.equal(BigInt(bid2Amount));
            expect(await addr2.getBalance()).to.be.equal(
                BigInt(startBalanceAddr2) - BigInt(agregateGasAddr2) - BigInt(bid2AmountWithFee)
            );
        });

        it("FAIL - before create auction", async () => {
            await myBaseERC721.connect(owner).safeMint(owner.address);

            balance = await myBaseERC721.connect(owner).balanceOf(owner.address);
            expect(balance).to.equal(1);

            await expect(
                myBaseBidNFT.connect(addr1).bidAuction(tokenId, bid1Amount, {
                    value: bid1AmountWithFee,
                })
            ).to.be.revertedWith("The bidding period is over");

            await myBaseBidNFT.connect(owner).createAuction(tokenId, startingBid);
        });

        it("FAIL - after endAuction", async () => {
            await myBaseERC721.connect(owner).safeMint(owner.address);

            balance = await myBaseERC721.connect(owner).balanceOf(owner.address);
            expect(balance).to.equal(1);

            await myBaseBidNFT.connect(owner).createAuction(tokenId, startingBid);
            await skiptTime(5);

            await myBaseBidNFT.connect(owner).endAuction(tokenId);
            await expect(
                myBaseBidNFT.connect(addr1).bidAuction(tokenId, bid1Amount, {
                    value: bid1AmountWithFee,
                })
            ).to.be.revertedWith("The bidding period is over");
        });

        it("FAIL - after cancel", async () => {
            await myBaseERC721.connect(owner).safeMint(owner.address);

            balance = await myBaseERC721.connect(owner).balanceOf(owner.address);
            expect(balance).to.equal(1);

            await myBaseBidNFT.connect(owner).createAuction(tokenId, startingBid);

            await myBaseBidNFT.connect(owner).cancelAuction(tokenId);
            await expect(
                myBaseBidNFT.connect(addr1).bidAuction(tokenId, bid1Amount, {
                    value: bid1AmountWithFee,
                })
            ).to.be.revertedWith("The bidding period is over");
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

            await myBaseBidNFT.connect(owner).createAuction(tokenId, startingBid);
            agregateOwnerGas += await getGasUsedForLastTx();

            balance = await myBaseERC721.connect(owner).balanceOf(owner.address);
            expect(balance).to.equal(0);

            await skiptTime(5);

            await myBaseBidNFT.connect(owner).endAuction(tokenId);
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

            await expect(myBaseBidNFT.connect(addr2).endAuction(tokenId)).to.be.revertedWith(
                "You cannot end an auction that has not started"
            );

            await myBaseBidNFT.connect(addr2).createAuction(tokenId, startingBid);
        });

        it("FAIL - before time's up", async () => {
            await myBaseERC721.connect(owner).safeMint(owner.address);

            balance = await myBaseERC721.connect(owner).balanceOf(owner.address);
            expect(balance).to.equal(1);

            await myBaseBidNFT.connect(owner).createAuction(tokenId, startingBid);
            await myBaseBidNFT.connect(addr1).bidAuction(tokenId, bid1Amount, {
                value: bid1AmountWithFee,
            });

            await expect(myBaseBidNFT.connect(owner).endAuction(tokenId)).to.be.revertedWith(
                "The bidding period has not ended"
            );
        });

        it("FAIL - after endAuction auction", async () => {
            await myBaseERC721.connect(owner).safeMint(addr2.address);

            balance = await myBaseERC721.connect(addr2).balanceOf(addr2.address);
            expect(balance).to.equal(1);

            await myBaseBidNFT.connect(addr2).createAuction(tokenId, startingBid);
            await myBaseBidNFT.connect(addr1).bidAuction(tokenId, bid1Amount, {
                value: bid1AmountWithFee,
            });
            await skiptTime(5);

            await myBaseBidNFT.connect(addr2).endAuction(tokenId);
            await expect(myBaseBidNFT.connect(addr2).endAuction(tokenId)).to.be.revertedWith(
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

            await myBaseBidNFT.connect(owner).createAuction(tokenId, startingBid);
            agregateOwnerGas += await getGasUsedForLastTx();

            await myBaseBidNFT.connect(owner).cancelAuction(tokenId);
            agregateOwnerGas += await getGasUsedForLastTx();

            expect(await owner.getBalance()).to.equal(
                BigInt(startBalanceOwner) - BigInt(agregateOwnerGas)
            );
        });

        it("FAIL - after time's up", async () => {
            await myBaseERC721.connect(owner).safeMint(owner.address);

            balance = await myBaseERC721.connect(owner).balanceOf(owner.address);
            expect(balance).to.equal(1);

            await myBaseBidNFT.connect(owner).createAuction(tokenId, startingBid);
            await myBaseBidNFT.connect(addr1).bidAuction(tokenId, bid1Amount, {
                value: bid1AmountWithFee,
            });

            await skiptTime(5);

            await expect(myBaseBidNFT.connect(owner).cancelAuction(tokenId)).to.be.revertedWith(
                "The bidding period is over"
            );
        });
    });

    describe("TEST withdraw()", async () => {
        it("PASS -  after ended auction", async () => {
            const startBalanceAddr1 = await addr1.getBalance();
            const startBalanceAddr2 = await addr2.getBalance();
            const startBalanceAddr3 = await addr3.getBalance();
            let agregateAddr1Gas = BigInt(0);
            let agregateAddr2Gas = BigInt(0);
            let agregateAddr3Gas = BigInt(0);

            await myBaseERC721.connect(owner).safeMint(addr1.address);

            await myBaseBidNFT.connect(addr1).createAuction(tokenId, startingBid);
            agregateAddr1Gas += await getGasUsedForLastTx();

            await myBaseBidNFT.connect(addr2).bidAuction(tokenId, bid1Amount, {
                value: bid1AmountWithFee,
            });
            agregateAddr2Gas += await getGasUsedForLastTx();

            await myBaseBidNFT.connect(addr3).bidAuction(tokenId, bid2Amount, {
                value: bid2AmountWithFee,
            });
            agregateAddr3Gas += await getGasUsedForLastTx();

            await skiptTime(5);

            await myBaseBidNFT.connect(addr1).endAuction(tokenId);
            agregateAddr1Gas += await getGasUsedForLastTx();
            const feeForContractOwner =
                BigInt(bid2AmountWithFee) -
                BigInt(bid2Amount) +
                BigInt(bid1AmountWithFee) -
                BigInt(bid1Amount);

            expect(await addr2.getBalance()).to.equal(
                BigInt(startBalanceAddr2) - BigInt(agregateAddr2Gas) - BigInt(bid1AmountWithFee)
            );

            expect(await addr3.getBalance()).to.equal(
                BigInt(startBalanceAddr3) - BigInt(agregateAddr3Gas) - BigInt(bid2AmountWithFee)
            );

            expect(await addr1.getBalance()).to.equal(
                BigInt(startBalanceAddr1) - BigInt(agregateAddr1Gas) + BigInt(bid2Amount)
            );

            expect(await ethers.provider.getBalance(myBaseBidNFT.address)).to.be.equal(
                BigInt(feeForContractOwner) + BigInt(bid1Amount)
            );

            expect(await myBaseBidNFT.ownerFeeToWithdraw()).to.be.equal(
                BigInt(feeForContractOwner)
            );
        });

        it("PASS - after canceled auction", async () => {
            const startBalanceAddr2 = await addr2.getBalance();
            const startBalanceAddr3 = await addr3.getBalance();
            let agregateAddr2Gas = BigInt(0);
            let agregateAddr3Gas = BigInt(0);

            await myBaseERC721.connect(owner).safeMint(addr1.address);

            await myBaseBidNFT.connect(addr1).createAuction(tokenId, startingBid);

            await myBaseBidNFT.connect(addr2).bidAuction(tokenId, bid1Amount, {
                value: bid1AmountWithFee,
            });
            agregateAddr2Gas += await getGasUsedForLastTx();

            await myBaseBidNFT.connect(addr3).bidAuction(tokenId, bid2Amount, {
                value: bid2AmountWithFee,
            });
            agregateAddr3Gas += await getGasUsedForLastTx();

            await myBaseBidNFT.connect(addr1).cancelAuction(tokenId);

            await myBaseBidNFT.connect(addr2).withdraw(tokenId);
            agregateAddr2Gas += await getGasUsedForLastTx();

            expect(await addr2.getBalance()).to.equal(
                BigInt(startBalanceAddr2) -
                    BigInt(agregateAddr2Gas) -
                    BigInt(bid1AmountWithFee) +
                    BigInt(bid1Amount)
            );

            await myBaseBidNFT.connect(addr3).withdraw(tokenId);

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

            await myBaseBidNFT.connect(addr1).createAuction(tokenId, startingBid);
            agregateAddr1Gas += await getGasUsedForLastTx();

            await myBaseBidNFT.connect(addr2).bidAuction(tokenId, bid1Amount, {
                value: bid1AmountWithFee,
            });
            agregateAddr2Gas += await getGasUsedForLastTx();

            await myBaseBidNFT.connect(addr3).bidAuction(tokenId, bid2Amount, {
                value: bid2AmountWithFee,
            });
            agregateAddr3Gas += await getGasUsedForLastTx();

            await expect(myBaseBidNFT.connect(addr2).withdraw(tokenId)).to.be.revertedWith(
                "The bidding period has not ended"
            );
            agregateAddr2Gas += await getGasUsedForLastTx();

            await expect(myBaseBidNFT.connect(addr3).withdraw(tokenId)).to.be.revertedWith(
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

    describe("TEST withdrawOwnerFee()", async () => {
        it("PASS", async () => {
            const startBalanceOwner = BigInt(await owner.getBalance());
            const tokenId = 0;

            await myBaseERC721
                .connect(addr1)
                .payToMint(addr1.address, { value: ethers.utils.parseEther("0.05") });

            await myBaseBidNFT.connect(addr1).createAuction(tokenId, startingBid);

            await myBaseBidNFT.connect(addr2).bidAuction(tokenId, bid1Amount, {
                value: bid1AmountWithFee,
            });

            await skiptTime(5);

            await myBaseBidNFT.connect(addr1).endAuction(tokenId);

            await myBaseBidNFT.connect(owner).withdrawOwnerFee();
            const agregateOwnerGas = await getGasUsedForLastTx();

            const ownerFee = BigInt(parseInt(bid1AmountWithFee) - parseInt(bid1Amount));

            expect(await owner.getBalance()).to.be.equal(
                startBalanceOwner + ownerFee - BigInt(agregateOwnerGas)
            );
            expect(await myBaseBidNFT.ownerFeeToWithdraw()).to.be.equal(0);
        });

        it("FAIL - not onwer", async () => {
            const tokenId = 0;

            await myBaseERC721
                .connect(addr1)
                .payToMint(addr1.address, { value: ethers.utils.parseEther("0.05") });

            await myBaseBidNFT.connect(addr1).createAuction(tokenId, startingBid);

            await myBaseBidNFT.connect(addr2).bidAuction(tokenId, bid1Amount, {
                value: bid1AmountWithFee,
            });

            await skiptTime(5);

            await myBaseBidNFT.connect(addr1).endAuction(tokenId);

            const ownerFee = await myBaseBidNFT.ownerFeeToWithdraw();

            await expect(myBaseBidNFT.connect(addr1).withdrawOwnerFee()).to.be.revertedWith(
                "Ownable: caller is not the owner"
            );

            expect(await myBaseBidNFT.ownerFeeToWithdraw()).to.be.equal(ownerFee);
        });
    });
});
