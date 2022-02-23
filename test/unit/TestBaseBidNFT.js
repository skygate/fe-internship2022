const {
    expect
} = require("chai");
const {
    ethers
} = require("hardhat");

const { getGasUsedForLastTx, skipt_time } = require("./../utils");

describe("Test base BaseBidNFT", function () {
    const addrNull = "0x0000000000000000000000000000000000000000";

    const DECIMALS = '18'
    const INITIAL_PRICE = '200000000000000000000'

    const metadataURI = "cid/test.png";

    let myBaseERC721;
    let myBaseBidNFT;
    let owner;
    let addr1;
    let addr2;
    let addrs;

    let tokenId = 0;

    beforeEach(async () => {
        const MyMockV3Aggregator = await ethers.getContractFactory("MyMockV3Aggregator");
        myMockV3Aggregator = await MyMockV3Aggregator.deploy(DECIMALS, INITIAL_PRICE,);
        await myMockV3Aggregator.deployed();

        const BaseERC721 = await ethers.getContractFactory("BaseERC721");
        myBaseERC721 = await BaseERC721.deploy("My base ERC721", "Base ERC721", myMockV3Aggregator.address);
        const myBaseERC721address = await myBaseERC721.deployed();

        const BaseBidNFT = await ethers.getContractFactory("BaseBidNFT");
        myBaseBidNFT = await BaseBidNFT.deploy(myBaseERC721address.address);
        await myBaseBidNFT.deployed();

        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    });

    it("TEST createAuction() - PASS", async () => {
        await myBaseERC721.connect(owner).safeMint(
            owner.address,
            metadataURI
        );

        balance = await myBaseERC721.connect(owner).balanceOf(owner.address);
        expect(balance).to.equal(1);

        await myBaseBidNFT.connect(owner).createAuction(tokenId, 100);
        await myBaseBidNFT.connect(addr1).bid(tokenId, {
            value: ethers.utils.parseEther("0.2"),
        });
        await skipt_time(6);

        await myBaseBidNFT.connect(owner).end(tokenId);
        await myBaseBidNFT.connect(owner).withdraw(tokenId);
    });

    it("TEST bid() - PASS", async () => {
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

        await myBaseBidNFT.connect(owner).createAuction(tokenId, 100);
        agregateOwnerGas += await getGasUsedForLastTx();
        
        await myBaseBidNFT.connect(addr1).bid(tokenId, {
            value: ethers.utils.parseEther("0.2"),
        });
        const gasUsedAddres1 = await getGasUsedForLastTx();

        await myBaseBidNFT.connect(addr2).bid(tokenId, {
            value: ethers.utils.parseEther("0.25"),
        });
        const gasUsedAddres2 = await getGasUsedForLastTx();

        await skipt_time(6);

        await myBaseBidNFT.connect(owner).end(tokenId);
        agregateOwnerGas += await getGasUsedForLastTx();
        
        await myBaseBidNFT.connect(owner).withdraw(tokenId);
        agregateOwnerGas += await getGasUsedForLastTx();

        expect(await myBaseERC721.connect(owner).ownerOf(tokenId)).to.equal(addr2.address);
		expect(await owner.getBalance()).to.equal(BigInt(startBalanceOwner) + BigInt(ethers.utils.parseEther("0.25")) - BigInt(agregateOwnerGas));
		expect(await addr1.getBalance()).to.equal(BigInt(startBalanceAddres1) - BigInt(ethers.utils.parseEther("0.2")) - gasUsedAddres1);
		expect(await addr2.getBalance()).to.equal(BigInt(startBalanceAddres2) - BigInt(ethers.utils.parseEther("0.25")) - gasUsedAddres2);
    });

    it("TEST bid() function before create auction - FAIL", async () => {
        await myBaseERC721.connect(owner).safeMint(
            owner.address,
            metadataURI
        );

        balance = await myBaseERC721.connect(owner).balanceOf(owner.address);
        expect(balance).to.equal(1);

        await expect(
            myBaseBidNFT.connect(addr1).bid(tokenId, {
                value: ethers.utils.parseEther("0.2"),
            })
        ).to.be.revertedWith("The bidding period is over");

        await myBaseBidNFT.connect(owner).createAuction(tokenId, 100);
    });

    it("TEST end() revert tokens - PASS", async () => {
        const startBalanceOwner = await owner.getBalance();
        let agregateOwnerGas = BigInt(0);

        await myBaseERC721.connect(owner).safeMint(
            owner.address,
            metadataURI
        );
        agregateOwnerGas += await getGasUsedForLastTx();

        balance = await myBaseERC721.connect(owner).balanceOf(owner.address);
        expect(balance).to.equal(1);

        await myBaseBidNFT.connect(owner).createAuction(tokenId, 100);
        agregateOwnerGas += await getGasUsedForLastTx();

        await skipt_time(6);

        await myBaseBidNFT.connect(owner).end(tokenId);
        agregateOwnerGas += await getGasUsedForLastTx();

        expect(await owner.getBalance()).to.equal(BigInt(startBalanceOwner) - BigInt(agregateOwnerGas));
    });

    it("TEST end() function before create auction - FAIL", async () => {
        await myBaseERC721.connect(owner).safeMint(
            owner.address,
            metadataURI
        );

        balance = await myBaseERC721.connect(owner).balanceOf(owner.address);
        expect(balance).to.equal(1);

        await skipt_time(6);

        await expect(
            myBaseBidNFT.connect(owner).end(tokenId)
        ).to.be.revertedWith("You don't have permission to manage this token!");

        await myBaseBidNFT.connect(owner).createAuction(tokenId, 100);
    });

    it("TEST end() Auction before end - FAIL", async () => {
        await myBaseERC721.connect(owner).safeMint(
            owner.address,
            metadataURI
        );

        balance = await myBaseERC721.connect(owner).balanceOf(owner.address);
        expect(balance).to.equal(1);

        await myBaseBidNFT.connect(owner).createAuction(tokenId, 100);
        await myBaseBidNFT.connect(addr1).bid(tokenId, {
            value: ethers.utils.parseEther("0.2"),
        });

        await expect(
            myBaseBidNFT.connect(owner).end(tokenId)
        ).to.be.revertedWith("The bidding period has not ended");
    });



});