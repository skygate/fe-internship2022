const { network, ethers } = require("hardhat");
// const { helperData } = require("helper-hardhat-config.js"); //This line is useful when we will be using different blockchains.
const { hashToken } = require("../test/utils");
const { MerkleTree } = require("merkletreejs");
const { keccak256 } = require("@ethersproject/keccak256");

async function main() {
    const DECIMALS = "18";
    const INITIAL_PRICE = "200000000000000000000";

    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);
    console.log("Account balance:", (await deployer.getBalance()).toString());

    const MyMockV3Aggregator = await ethers.getContractFactory("MyMockV3Aggregator");
    myMockV3Aggregator = await MyMockV3Aggregator.deploy(DECIMALS, INITIAL_PRICE);
    await myMockV3Aggregator.deployed();
    console.log("MyMockV3Aggregator address:", myMockV3Aggregator.address);

    const creatorArtist = "0xbcd4042de499d14e55001ccbb24a551f3b954096";
    let artistAddressPerTokenId = {};
    for (let i = 0; i < 10; i++) {
        artistAddressPerTokenId[i] = creatorArtist;
    }
    const artistMerkleTree = new MerkleTree(
        Object.entries(artistAddressPerTokenId).map((token) => hashToken(...token)),
        keccak256,
        { sortPairs: true }
    );

    const BaseERC721 = await ethers.getContractFactory("BaseERC721");
    const baseERC721 = await BaseERC721.deploy(
        "My base ERC721",
        "Base ERC721",
        myMockV3Aggregator.address,
        artistMerkleTree.getHexRoot()
    );
    console.log("BaseERC721 address:", baseERC721.address);

    const SalesContract = await ethers.getContractFactory("Sales");
    const salesContract = await BaseBidNFT.deploy(baseERC721.address);
    console.log("BaseBidNFT address:", salesContract.address);

    await baseERC721.setSalesContractAddress(salesContract.address);
    await mintNFT(baseERC721);
}

async function mintNFT(baseERC721Contract) {
    const [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    await baseERC721Contract.connect(owner).safeMint(addr1.address);
    await baseERC721Contract.connect(owner).safeMint(addr1.address);
    await baseERC721Contract.connect(owner).safeMint(addr2.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
