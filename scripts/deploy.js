const { network, ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  const [networkName] = ethers.networkName

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const BaseERC721 = await ethers.getContractFactory("BaseERC721");
  const baseERC721 = await BaseERC721.deploy("My base ERC721", "Base ERC721", network[networkName][priceFeedAddress]);

  console.log("BaseERC721 address:", baseERC721.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });