const { ethers, upgrades } = require("hardhat");

async function main() {
    const BaseERC721Upgradeable = await ethers.getContractFactory("BaseERC721Upgradeable");
    const baseERC721Upgradeable = await upgrades.deployProxy(
        BaseERC721Upgradeable,
        ["My base ERC721Upgradeable", "Base ERC721Upgradeable"],
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
