const { network, ethers } = require("hardhat");
const { helperData } = require("helper-hardhat-config.js")

async function main() {
  const [deployer] = await ethers.getSigners();
  const [networkName] = ethers.networkName

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());


  const MockV3Aggregator = await ethers.getContractFactory("MockV3Aggregator");
  mockV3Aggregator = await MockV3Aggregator.deploy(DECIMALS, INITIAL_PRICE,);
  await mockV3Aggregator.deployed();

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