const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Test base ERC721", function () {
	const metadataURI = "cid/test.png";
	const addrNull = "0x0000000000000000000000000000000000000000";

	let myBaseERC721;
	let owner;
	let addr1;
	let addr2;
	let addrs;

	beforeEach(async () => {
		const BaseERC721 = await ethers.getContractFactory("BaseERC721");
		myBaseERC721 = await BaseERC721.deploy("My base ERC721", "Base ERC721");
		await myBaseERC721.deployed();

		[owner, addr1, addr2, ...addrs] = await ethers.getSigners();
	});

	it("TEST payToMint() - PASS", async () => {
		let balance = await myBaseERC721.connect(addr1).balanceOf(addr1.address);
		expect(balance).to.equal(0);

		const newlyMintedToken = await myBaseERC721.connect(addr1).payToMint(
			addr1.address,
			metadataURI,
			{
				value: ethers.utils.parseEther("0.05"),
			}
		);
		await newlyMintedToken.wait();

		balance = await myBaseERC721.connect(addr1).balanceOf(addr1.address);
		expect(balance).to.equal(1);

		const nft_owner = await myBaseERC721.connect(addr1).ownerOf(0);
		expect(nft_owner).to.equal(addr1.address);

		const currentCounter = await myBaseERC721.connect(addr1).count();
		expect(currentCounter).to.equal(1);
	});

	it("TEST safeMint() for owner - PASS", async () => {
		let balance = await myBaseERC721.connect(owner).balanceOf(owner.address);
		expect(balance).to.equal(0);

		const newlyMintedToken = await myBaseERC721.connect(owner).safeMint(
			owner.address,
			metadataURI
		);
		await newlyMintedToken.wait();

		balance = await myBaseERC721.connect(owner).balanceOf(owner.address);
		expect(balance).to.equal(1);

		const nft_owner = await myBaseERC721.connect(owner).ownerOf(0);
		expect(nft_owner).to.equal(owner.address);

		const currentCounter = await myBaseERC721.connect(owner).count();
		expect(currentCounter).to.equal(1);
	});

	it("TEST safeMint() for not owner - FAIL", async () => {
		let balance = await myBaseERC721.connect(addr2).balanceOf(addr2.address);
		expect(balance).to.equal(0);

		await expect(
			myBaseERC721.connect(addr2).safeMint(addr2.address, metadataURI)
		).to.be.revertedWith("Ownable: caller is not the owner");

		balance = await myBaseERC721.connect(addr2).balanceOf(addr2.address);
		expect(balance).to.equal(0);

		const currentCounter = await myBaseERC721.connect(addr2).count();
		expect(currentCounter).to.equal(0);
	});

	it("TEST startSale() - PASS", async () => {
		const sellPrice = ethers.utils.parseEther("0.5");
		const tokenId = 0;
		const mintTx = await myBaseERC721.connect(addr1).payToMint(
			addr1.address,
			metadataURI,
			{
				value: ethers.utils.parseEther("0.05"),
			}
		);
		await mintTx.wait();

		const putOnSaleTx = await myBaseERC721.connect(addr1).startSale(
			tokenId,
			sellPrice
		);
		await putOnSaleTx.wait();

		expect(await myBaseERC721.connect(addr1).tokenIdToPriceOnSale(tokenId)).to.equal(sellPrice);
		expect(await myBaseERC721.connect(addr1).ownerOf(tokenId)).to.equal(myBaseERC721.address);
		expect(await myBaseERC721.connect(addr1).tokenIdToOwnerAddressOnSale(tokenId)).to.equal(addr1.address);
	});

	it("TEST startSale() not onwer of token - FAIL", async () => {
		const sellPrice = ethers.utils.parseEther("0.5");
		const tokenId = 0;
		const mintTx = await myBaseERC721.connect(addr1).payToMint(
			addr1.address,
			metadataURI,
			{
				value: ethers.utils.parseEther("0.05"),
			}
		);
		await mintTx.wait();

		await expect(
			myBaseERC721.connect(addr2).startSale(tokenId, sellPrice)
		).to.be.revertedWith("To put token on sale you must be owner!");

		expect(await myBaseERC721.connect(addr1).tokenIdToPriceOnSale(tokenId)).to.equal(0);
		expect(await myBaseERC721.connect(addr1).ownerOf(tokenId)).to.equal(addr1.address);
		expect(await myBaseERC721.connect(addr1).tokenIdToOwnerAddressOnSale(tokenId)).to.equal(addrNull);
	});

	it("TEST startSale() for 0 ETH - FAIL", async () => {
		const tokenId = 0;
		const mintTx = await myBaseERC721.connect(addr1).payToMint(
			addr1.address,
			metadataURI,
			{
				value: ethers.utils.parseEther("0.05"),
			}
		);
		await mintTx.wait();

		await expect(
			myBaseERC721.connect(addr1).startSale(tokenId, 0)
		).to.be.revertedWith("Can not sale for 0 ETH!");

		expect(await myBaseERC721.connect(addr1).tokenIdToPriceOnSale(tokenId)).to.equal(0);
		expect(await myBaseERC721.connect(addr1).ownerOf(tokenId)).to.equal(addr1.address);
		expect(await myBaseERC721.connect(addr1).tokenIdToOwnerAddressOnSale(tokenId)).to.equal(addrNull);
	});
});
