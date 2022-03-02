const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Test BaseERC721Upgradeable", async () => {
    const metadataURI = "cid/test.png";

    const DECIMALS = "18";
    const INITIAL_PRICE = "200000000000000000000";

    let baseERC721Upgradeable;
    let owner;
    let addr1;
    let addr2;
    let addrs;

    beforeEach(async () => {
        const MyMockV3Aggregator = await ethers.getContractFactory(
            "MyMockV3Aggregator"
        );
        myMockV3Aggregator = await MyMockV3Aggregator.deploy(
            DECIMALS,
            INITIAL_PRICE
        );
        await myMockV3Aggregator.deployed();

        const BaseERC721Upgradeable = await ethers.getContractFactory(
            "BaseERC721Upgradeable"
        );
        baseERC721Upgradeable = await upgrades.deployProxy(
            BaseERC721Upgradeable,
            [
                "My base ERC721Upgradeable",
                "Base ERC721Upgradeable",
                myMockV3Aggregator.address,
            ],
            { kind: "uups" }
        );
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    });

    it("PASS - upgrade proxy", async () => {
        const sendEthAmount = ethers.utils.parseEther("0.05");
        const tokenId = 0;
        const mintTx = await baseERC721Upgradeable
            .connect(addr1)
            .payToMint(addr1.address, metadataURI, { value: sendEthAmount });
        await mintTx.wait();

        await expect(
            baseERC721Upgradeable.connect(addr2).burn(tokenId)
        ).to.be.revertedWith(
            "Cant perform this action, you must be owner of this token!"
        );

        const BaseERC721UpgradeableV2 = await ethers.getContractFactory(
            "BaseERC721UpgradeableV2"
        );
        const baseERC721UpgradeableV2 = await upgrades.upgradeProxy(
            baseERC721Upgradeable,
            BaseERC721UpgradeableV2
        );

        await expect(
            baseERC721Upgradeable.connect(addr2).burn(tokenId)
        ).to.be.revertedWith(
            "BaseERC721 Error: Can't perform this action, you must be owner of this token!"
        );

        await expect(
            baseERC721Upgradeable.connect(addr1).startSale(tokenId, 0)
        ).to.be.revertedWith("Can not sale for 0 ETH!");
    });
});
