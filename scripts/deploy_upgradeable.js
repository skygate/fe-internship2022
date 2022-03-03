const { ethers, upgrades } = require("hardhat");

async function main() {
    const DECIMALS = "18";
    const INITIAL_PRICE = "200000000000000000000";

    const MyMockV3Aggregator = await ethers.getContractFactory("MyMockV3Aggregator");
    myMockV3Aggregator = await MyMockV3Aggregator.deploy(DECIMALS, INITIAL_PRICE);
    await myMockV3Aggregator.deployed();
    console.log(`MyMockV3Aggregator deployed at: ${myMockV3Aggregator.address}`);

    const BaseERC721Upgradeable = await ethers.getContractFactory("BaseERC721Upgradeable");
    const baseERC721Upgradeable = await upgrades.deployProxy(
        BaseERC721Upgradeable,
        ["My base ERC721Upgradeable", "Base ERC721Upgradeable", myMockV3Aggregator.address],
        { kind: "uups" }
    );
    console.log(`BaseERC721Upgradeable deployed at: ${baseERC721Upgradeable.address}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
