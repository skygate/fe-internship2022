const {
    expect
} = require("chai");
const {
    ethers
} = require("hardhat");

const {
    getGasUsedForLastTx,
    getTimeStampForLastTx,
    skiptTime,
    getEventLastTx
} = require("./../utils");

describe("Test base BaseBidNFT", function () {
    const DECIMALS = '18'
    const INITIAL_PRICE = '200000000000000000000'
    const addrNull = "0x0000000000000000000000000000000000000000";

    const metadataURI = "cid/test.png";
    const startingBid = 100;

    let myBaseERC721;
    let myBaseBidNFT;
    let owner;
    let addr1;
    let addr2;
    let addr3;
    let addrs;

    let tokenId = 0;

    beforeEach(async () => {
        const MyMockV3Aggregator = await ethers.getContractFactory("MyMockV3Aggregator");
        myMockV3Aggregator = await MyMockV3Aggregator.deploy(DECIMALS, INITIAL_PRICE, );
        await myMockV3Aggregator.deployed();

        const BaseERC721 = await ethers.getContractFactory("BaseERC721");
        myBaseERC721 = await BaseERC721.deploy("My base ERC721", "Base ERC721", myMockV3Aggregator.address);
        const myBaseERC721address = await myBaseERC721.deployed();

        const BaseBidNFT = await ethers.getContractFactory("BaseBidNFT");
        myBaseBidNFT = await BaseBidNFT.deploy(myBaseERC721address.address);
        await myBaseBidNFT.deployed();

        [owner, addr1, addr2, addr3, ...addrs] = await ethers.getSigners();
    });

    it("TEST emit start() - PASS", async () => {
        await myBaseERC721.connect(owner).safeMint(
            owner.address,
            metadataURI
        );

        balance = await myBaseERC721.connect(owner).balanceOf(owner.address);
        expect(balance).to.equal(1);

        const timestampBefore = await getTimeStampForLastTx();
        const createAuctionTx = await myBaseBidNFT.connect(owner).createAuction(tokenId, startingBid);
        const eventCreateAuctionTx = await getEventLastTx(await createAuctionTx.wait(), 'Start');

        expect(eventCreateAuctionTx.owner).to.equal(owner.address);
        expect(eventCreateAuctionTx.auction[0]).to.equal(owner.address);
        expect(eventCreateAuctionTx.auction[1]).to.equal(addrNull);
        expect(eventCreateAuctionTx.auction[2]).to.equal(0);
        expect(eventCreateAuctionTx.auction[3]).to.equal(startingBid);
        expect(eventCreateAuctionTx.auction[4]).to.equal(timestampBefore + 6);
        expect(eventCreateAuctionTx.auction[5]).to.equal(0);
        expect(eventCreateAuctionTx.tokenId).to.equal(0);
    });

    it("TEST emit bidAuction() - PASS", async () => {
        await myBaseERC721.connect(owner).safeMint(
            owner.address,
            metadataURI
        );

        balance = await myBaseERC721.connect(owner).balanceOf(owner.address);
        expect(balance).to.equal(1);

        await myBaseBidNFT.connect(owner).createAuction(tokenId, startingBid);
        const bidTx = await myBaseBidNFT.connect(addr1).bidAuction(tokenId, {
            value: ethers.utils.parseEther("0.2"),
        })
        await skiptTime(5);

        const eventBidTx = await getEventLastTx(await bidTx.wait(), 'Bid');

        expect(eventBidTx.sender).to.equal(addr1.address);
        expect(eventBidTx.amount).to.equal(ethers.utils.parseEther("0.2"));
        expect(eventBidTx.tokenId).to.equal(0);
    });

    it("TEST emit endAuction() - PASS", async () => {
        await myBaseERC721.connect(owner).safeMint(
            owner.address,
            metadataURI
        );

        balance = await myBaseERC721.connect(owner).balanceOf(owner.address);
        expect(balance).to.equal(1);

        await myBaseBidNFT.connect(owner).createAuction(tokenId, startingBid);
        await myBaseBidNFT.connect(addr1).bidAuction(tokenId, {
            value: ethers.utils.parseEther("0.2"),
        })
        await skiptTime(5);

        const endTx = await myBaseBidNFT.connect(owner).endAuction(tokenId);
        const eventEndTx = await getEventLastTx(await endTx.wait(), 'End');

        expect(eventEndTx.winner).to.equal(addr1.address);
        expect(eventEndTx.amount).to.equal(ethers.utils.parseEther("0.2"));
        expect(eventEndTx.tokenId).to.equal(0);
    });

    it("TEST emit Withdraw() - PASS", async () => {
        await myBaseERC721.connect(owner).safeMint(
            owner.address,
            metadataURI
        );

        balance = await myBaseERC721.connect(owner).balanceOf(owner.address);
        expect(balance).to.equal(1);

        await myBaseBidNFT.connect(owner).createAuction(tokenId, startingBid);
        await myBaseBidNFT.connect(addr1).bidAuction(tokenId, {
            value: ethers.utils.parseEther("0.2"),
        });

        await myBaseBidNFT.connect(addr2).bidAuction(tokenId, {
            value: ethers.utils.parseEther("0.25"),
        });

        await skiptTime(5);

        const withdrawTx = await myBaseBidNFT.connect(addr1).withdraw(tokenId);
        const eventwithdrawTx = await getEventLastTx(await withdrawTx.wait(), 'Withdraw');
        await myBaseBidNFT.connect(owner).endAuction(tokenId);
        
        expect(eventwithdrawTx.bidder).to.equal(addr1.address);
        expect(eventwithdrawTx.amount).to.equal(ethers.utils.parseEther("0.2"));
        expect(eventwithdrawTx.tokenId).to.equal(0);
    });

    it("TEST emit cancelAuction() - PASS", async () => {
        await myBaseERC721.connect(owner).safeMint(
            owner.address,
            metadataURI
        );

        balance = await myBaseERC721.connect(owner).balanceOf(owner.address);
        expect(balance).to.equal(1);

        await myBaseBidNFT.connect(owner).createAuction(tokenId, startingBid);
        await myBaseBidNFT.connect(addr1).bidAuction(tokenId, {
            value: ethers.utils.parseEther("0.2"),
        });

        await myBaseBidNFT.connect(addr2).bidAuction(tokenId, {
            value: ethers.utils.parseEther("0.25"),
        });

        const cancelTx = await myBaseBidNFT.connect(owner).cancelAuction(tokenId);
        const eventCancelTx = await getEventLastTx(await cancelTx.wait(), 'Cancel');
        
        expect(eventCancelTx.highestBidder).to.equal(addr2.address);
        expect(eventCancelTx.amount).to.equal(ethers.utils.parseEther("0.25"));
        expect(eventCancelTx.tokenId).to.equal(0);
    });

    it("TEST createAuction() - PASS", async () => {
        await myBaseERC721.connect(owner).safeMint(
            owner.address,
            metadataURI
        );

        balance = await myBaseERC721.connect(owner).balanceOf(owner.address);
        expect(balance).to.equal(1);

        await myBaseBidNFT.connect(owner).createAuction(tokenId, startingBid);
        await myBaseBidNFT.connect(addr1).bidAuction(tokenId, {
            value: ethers.utils.parseEther("0.2"),
        });
        await skiptTime(6);

        await myBaseBidNFT.connect(owner).endAuction(tokenId);
        await myBaseBidNFT.connect(owner).withdraw(tokenId);
    });

    it("TEST bidAuction() - PASS", async () => {
        const startBalanceOwner = await owner.getBalance();
        const startBalanceAddres1 = await addr1.getBalance();
        const startBalanceAddres2 = await addr2.getBalance();

        let agregateOwnerGas = BigInt(0);

        await myBaseERC721.connect(owner).safeMint(
            owner.address,
            metadataURI
        );

        balance = await myBaseERC721.connect(owner).balanceOf(owner.address);
        expect(balance).to.equal(1);
        agregateOwnerGas += await getGasUsedForLastTx();

        await myBaseBidNFT.connect(owner).createAuction(tokenId, startingBid);
        agregateOwnerGas += await getGasUsedForLastTx();

        await myBaseBidNFT.connect(addr1).bidAuction(tokenId, {
            value: ethers.utils.parseEther("0.2"),
        });
        const gasUsedAddres1 = await getGasUsedForLastTx();

        await myBaseBidNFT.connect(addr2).bidAuction(tokenId, {
            value: ethers.utils.parseEther("0.25"),
        });
        const gasUsedAddres2 = await getGasUsedForLastTx();

        await skiptTime(5);

        await myBaseBidNFT.connect(owner).endAuction(tokenId);
        agregateOwnerGas += await getGasUsedForLastTx();

        await myBaseBidNFT.connect(owner).withdraw(tokenId);
        agregateOwnerGas += await getGasUsedForLastTx();

        expect(await myBaseERC721.connect(owner).ownerOf(tokenId)).to.equal(addr2.address);
        expect(await owner.getBalance()).to.equal(BigInt(startBalanceOwner) + BigInt(ethers.utils.parseEther("0.25")) - BigInt(agregateOwnerGas));
        expect(await addr1.getBalance()).to.equal(BigInt(startBalanceAddres1) - BigInt(ethers.utils.parseEther("0.2")) - gasUsedAddres1);
        expect(await addr2.getBalance()).to.equal(BigInt(startBalanceAddres2) - BigInt(ethers.utils.parseEther("0.25")) - gasUsedAddres2);
    });

    it("TEST bidAuction() function before create auction - FAIL", async () => {
        await myBaseERC721.connect(owner).safeMint(
            owner.address,
            metadataURI
        );

        balance = await myBaseERC721.connect(owner).balanceOf(owner.address);
        expect(balance).to.equal(1);

        await expect(
            myBaseBidNFT.connect(addr1).bidAuction(tokenId, {
                value: ethers.utils.parseEther("0.2"),
            })
        ).to.be.revertedWith("The bidding period is over");

        await myBaseBidNFT.connect(owner).createAuction(tokenId, startingBid);
    });

    it("TEST bidAuction() function after endAuction - FAIL", async () => {
        await myBaseERC721.connect(owner).safeMint(
            owner.address,
            metadataURI
        );

        balance = await myBaseERC721.connect(owner).balanceOf(owner.address);
        expect(balance).to.equal(1);

        await myBaseBidNFT.connect(owner).createAuction(tokenId, startingBid);
        await skiptTime(5);

        await myBaseBidNFT.connect(owner).endAuction(tokenId);
        await expect(
            myBaseBidNFT.connect(addr1).bidAuction(tokenId, {
                value: ethers.utils.parseEther("0.2"),
            })
        ).to.be.revertedWith("The bidding period is over");
    });

    it("TEST bidAuction() function after cancel - FAIL", async () => {
        await myBaseERC721.connect(owner).safeMint(
            owner.address,
            metadataURI
        );

        balance = await myBaseERC721.connect(owner).balanceOf(owner.address);
        expect(balance).to.equal(1);

        await myBaseBidNFT.connect(owner).createAuction(tokenId, startingBid);

        await myBaseBidNFT.connect(owner).cancelAuction(tokenId);
        await expect(
            myBaseBidNFT.connect(addr1).bidAuction(tokenId, {
                value: ethers.utils.parseEther("0.2"),
            })
        ).to.be.revertedWith("The bidding period is over");
    });

    it("TEST endAuction() revert tokens - PASS", async () => {
        const startBalanceOwner = await owner.getBalance();
        let agregateOwnerGas = BigInt(0);

        await myBaseERC721.connect(owner).safeMint(
            owner.address,
            metadataURI
        );
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
        expect(await owner.getBalance()).to.equal(BigInt(startBalanceOwner) - BigInt(agregateOwnerGas));
    });

    it("TEST endAuction() function before create auction - FAIL", async () => {
        await myBaseERC721.connect(owner).safeMint(
            addr2.address,
            metadataURI
        );

        balance = await myBaseERC721.connect(addr2).balanceOf(addr2.address);
        expect(balance).to.equal(1);

        await skiptTime(5);

        await expect(
            myBaseBidNFT.connect(addr2).endAuction(tokenId)
        ).to.be.revertedWith("You cannot end an auction that has not started");

        await myBaseBidNFT.connect(addr2).createAuction(tokenId, startingBid);
    });

    it("TEST endAuction() Auction before time's up - FAIL", async () => {
        await myBaseERC721.connect(owner).safeMint(
            owner.address,
            metadataURI
        );

        balance = await myBaseERC721.connect(owner).balanceOf(owner.address);
        expect(balance).to.equal(1);

        await myBaseBidNFT.connect(owner).createAuction(tokenId, startingBid);
        await myBaseBidNFT.connect(addr1).bidAuction(tokenId, {
            value: ethers.utils.parseEther("0.2"),
        });

        await expect(
            myBaseBidNFT.connect(owner).endAuction(tokenId)
        ).to.be.revertedWith("The bidding period has not ended");
    });

    it("TEST endAuction function after endAuction auction - FAIL", async () => {
        await myBaseERC721.connect(owner).safeMint(
            addr2.address,
            metadataURI
        );

        balance = await myBaseERC721.connect(addr2).balanceOf(addr2.address);
        expect(balance).to.equal(1);

        await myBaseBidNFT.connect(addr2).createAuction(tokenId, startingBid);
        await myBaseBidNFT.connect(addr1).bidAuction(tokenId, {
            value: ethers.utils.parseEther("0.2"),
        });
        await skiptTime(5);

        await myBaseBidNFT.connect(addr2).endAuction(tokenId);
        await expect(
            myBaseBidNFT.connect(addr2).endAuction(tokenId)
        ).to.be.revertedWith("You cannot end an auction that has not started");
    });

    it("TEST cancel() - PASS", async () => {
        const startBalanceOwner = await owner.getBalance();
        let agregateOwnerGas = BigInt(0);

        await myBaseERC721.connect(owner).safeMint(
            owner.address,
            metadataURI
        );
        agregateOwnerGas += await getGasUsedForLastTx();

        balance = await myBaseERC721.connect(owner).balanceOf(owner.address);
        expect(balance).to.equal(1);

        await myBaseBidNFT.connect(owner).createAuction(tokenId, startingBid);
        agregateOwnerGas += await getGasUsedForLastTx();

        await myBaseBidNFT.connect(owner).cancelAuction(tokenId);
        agregateOwnerGas += await getGasUsedForLastTx();

        expect(await owner.getBalance()).to.equal(BigInt(startBalanceOwner) - BigInt(agregateOwnerGas));
    });

    it("TEST cancelAuction() Auction after time's up - FAIL", async () => {
        await myBaseERC721.connect(owner).safeMint(
            owner.address,
            metadataURI
        );

        balance = await myBaseERC721.connect(owner).balanceOf(owner.address);
        expect(balance).to.equal(1);

        await myBaseBidNFT.connect(owner).createAuction(tokenId, startingBid);
        await myBaseBidNFT.connect(addr1).bidAuction(tokenId, {
            value: ethers.utils.parseEther("0.2"),
        });

        await skiptTime(5);

        await expect(
            myBaseBidNFT.connect(owner).cancelAuction(tokenId)
        ).to.be.revertedWith("The bidding period is over");
    });

    it("TEST withdraw() after endAuction() - PASS", async () => {
        const startBalanceOwner = await addr1.getBalance();
        const startBalanceAddr3 = await addr3.getBalance();
        let agregateOwnerGas = BigInt(0);
        let agregateAddr3Gas = BigInt(0);

        await myBaseERC721.connect(owner).safeMint(
            addr1.address,
            metadataURI
        );

        balance = await myBaseERC721.connect(addr1).balanceOf(addr1.address);
        expect(balance).to.equal(1);

        await myBaseBidNFT.connect(addr1).createAuction(tokenId, startingBid);
        agregateOwnerGas += await getGasUsedForLastTx();

        await myBaseBidNFT.connect(addr3).bidAuction(tokenId, {
            value: ethers.utils.parseEther("0.2"),
        });
        agregateAddr3Gas += await getGasUsedForLastTx();

        await myBaseBidNFT.connect(addr2).bidAuction(tokenId, {
            value: ethers.utils.parseEther("0.25"),
        });

        await skiptTime(5);

        await myBaseBidNFT.connect(addr1).endAuction(tokenId);
        agregateOwnerGas += await getGasUsedForLastTx();

        
        expect(await addr3.getBalance()).to.equal(BigInt(startBalanceAddr3) - BigInt(agregateAddr3Gas) - BigInt(ethers.utils.parseEther("0.2")));
        
        const withdrawTx = await myBaseBidNFT.connect(addr3).withdraw(tokenId);
        await withdrawTx.wait();
        agregateAddr3Gas += await getGasUsedForLastTx();
        
        expect(await addr3.getBalance()).to.equal(BigInt(startBalanceAddr3) - BigInt(agregateAddr3Gas));
        expect(await addr1.getBalance()).to.equal(BigInt(startBalanceOwner) - BigInt(agregateOwnerGas) + BigInt(ethers.utils.parseEther("0.25")));
    });

    it("TEST withdraw() after cancelAuction() - PASS", async () => {
        const startBalanceAddr3 = await addr3.getBalance();
        let agregateAddr3Gas = BigInt(0);

        await myBaseERC721.connect(owner).safeMint(
            addr1.address,
            metadataURI
        );

        balance = await myBaseERC721.connect(addr1).balanceOf(addr1.address);
        expect(balance).to.equal(1);

        await myBaseBidNFT.connect(addr1).createAuction(tokenId, startingBid);
        await myBaseBidNFT.connect(addr3).bidAuction(tokenId, {
            value: ethers.utils.parseEther("0.2"),
        });
        agregateAddr3Gas += await getGasUsedForLastTx();

        await myBaseBidNFT.connect(addr2).bidAuction(tokenId, {
            value: ethers.utils.parseEther("0.25"),
        });
        await myBaseBidNFT.connect(addr1).cancelAuction(tokenId);

        expect(await addr3.getBalance()).to.equal(BigInt(startBalanceAddr3) - BigInt(agregateAddr3Gas) - BigInt(ethers.utils.parseEther("0.2")));
        
        const withdrawTx = await myBaseBidNFT.connect(addr3).withdraw(tokenId);
        await withdrawTx.wait();
        agregateAddr3Gas += await getGasUsedForLastTx();
        
        expect(await addr3.getBalance()).to.equal(BigInt(startBalanceAddr3) - BigInt(agregateAddr3Gas));
    });

    it("TEST withdraw() before endAuction - FAIL", async () => {
        const startBalanceOwner = await addr1.getBalance();
        const startBalanceAddr3 = await addr3.getBalance();
        let agregateOwnerGas = BigInt(0);
        let agregateAddr3Gas = BigInt(0);

        await myBaseERC721.connect(owner).safeMint(
            addr1.address,
            metadataURI
        );

        balance = await myBaseERC721.connect(addr1).balanceOf(addr1.address);
        expect(balance).to.equal(1);

        await myBaseBidNFT.connect(addr1).createAuction(tokenId, startingBid);
        agregateOwnerGas += await getGasUsedForLastTx();

        await myBaseBidNFT.connect(addr3).bidAuction(tokenId, {
            value: ethers.utils.parseEther("0.2"),
        });
        agregateAddr3Gas += await getGasUsedForLastTx();

        await myBaseBidNFT.connect(addr2).bidAuction(tokenId, {
            value: ethers.utils.parseEther("0.25"),
        });

        await expect(myBaseBidNFT.connect(addr3).withdraw(tokenId)).to.be.revertedWith('The bidding period has not ended');
        agregateAddr3Gas += await getGasUsedForLastTx();

        await skiptTime(5);

        await myBaseBidNFT.connect(addr1).endAuction(tokenId);
        agregateOwnerGas += await getGasUsedForLastTx();

        expect(await addr3.getBalance()).to.equal(BigInt(startBalanceAddr3) - BigInt(agregateAddr3Gas) - BigInt(ethers.utils.parseEther("0.2")));
        
        await myBaseBidNFT.connect(addr3).withdraw(tokenId);
        agregateAddr3Gas += await getGasUsedForLastTx();
        
        expect(await addr3.getBalance()).to.equal(BigInt(startBalanceAddr3) - BigInt(agregateAddr3Gas));
        expect(await addr1.getBalance()).to.equal(BigInt(startBalanceOwner) - BigInt(agregateOwnerGas) + BigInt(ethers.utils.parseEther("0.25")));
    });
});
