const { network, ethers } = require("hardhat");
// const { helperData } = require("helper-hardhat-config.js"); //This line is useful when we will be using different blockchains.

async function main() {
  const DECIMALS = '18'
  const INITIAL_PRICE = '200000000000000000000'

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  const MockV3Aggregator = await ethers.getContractFactory("MyMockV3Aggregator");
  mockV3Aggregator = await MockV3Aggregator.deploy(DECIMALS, INITIAL_PRICE);
  await mockV3Aggregator.deployed();
  console.log("MockV3Aggregator address:", mockV3Aggregator.address);


  const BaseERC721 = await ethers.getContractFactory("BaseERC721");
  const baseERC721 = await BaseERC721.deploy("My base ERC721", "Base ERC721", mockV3Aggregator.address);
  console.log("BaseERC721 address:", baseERC721.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });