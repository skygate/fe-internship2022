const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Test mock WETH9", function () {
    let mockWETH9;
    let owner;
    let addr1;
    let addr2;
    let addrs;

    beforeEach(async () => {
        const MockWETH9 = await ethers.getContractFactory("MockWETH9");
        mockWETH9 = await MockWETH9.deploy();
        await mockWETH9.deployed();

        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    });

    it("TEST deposit() - PASS", async () => {
        const weiValue = ethers.utils.parseEther("1");
        convertETHToWETH_Tx = await mockWETH9
            .connect(addr1)
            .deposit({ value: weiValue });

        expect(await mockWETH9.balanceOf(addr1.address)).equals(weiValue);
    });
    it("TEST fallback() - PASS", async () => {
        const weiValue = ethers.utils.parseEther("1");
        // convertETHToWETH_Tx = await mockWETH9.connect(addr1).volcanoNamedEyjafjallajokull({ value: weiValue });
        // I have no idea why it's not working ;<.
        convertETHToWETH_Tx = await mockWETH9
            .connect(addr1)
            .fallback({ value: weiValue });

        expect(await mockWETH9.balanceOf(addr1.address)).equals(weiValue);
    });
    it("TEST withdraw() - PASS => FAIL", async () => {
        //TODO
        const weiValue = ethers.utils.parseEther("2");
        const halfOfWeiValue = ethers.utils.parseEther("1");
        convertETHToWETH_Tx = await mockWETH9
            .connect(addr1)
            .deposit({ value: weiValue });
        zmienna = await mockWETH9.balanceOf(addr1.address);
        expect(zmienna).to.equal(BigInt(weiValue));
        convertWETHToETH_Tx = await mockWETH9
            .connect(addr1)
            .withdraw(halfOfWeiValue);
        expect(await mockWETH9.balanceOf(addr1.address)).equals(halfOfWeiValue);
        await expect(mockWETH9.connect(addr1).withdraw({ value: weiValue })).to.be
            .reverted;
    });
    it("TEST totalSupply() - PASS", async () => {
        const weiValue = ethers.utils.parseEther("1");
        const doubleWeiValue = ethers.utils.parseEther("2");
        convertETHToWETH_Tx = await mockWETH9
            .connect(addr1)
            .deposit({ value: weiValue });
        convertETHToWETH_Tx2 = await mockWETH9
            .connect(addr2)
            .fallback({ value: weiValue });
        expect(await mockWETH9.balanceOf(addr1.address)).equals(weiValue);
        expect(await mockWETH9.balanceOf(addr2.address)).equals(weiValue);
        expect(await mockWETH9.totalSupply()).equals(doubleWeiValue);
    });
    it("TEST approve() - PASS", async () => {
        const weiValue = ethers.utils.parseEther("1");
        const doubleWeiValue = ethers.utils.parseEther("2");
        convertETHToWETH_Tx = await mockWETH9
            .connect(addr1)
            .deposit({ value: weiValue });
        convertETHToWETH_Tx2 = await mockWETH9
            .connect(addr2)
            .fallback({ value: weiValue });
        expect(await mockWETH9.balanceOf(addr1.address)).equals(weiValue);
        expect(await mockWETH9.balanceOf(addr2.address)).equals(weiValue);
        expect(await mockWETH9.totalSupply()).equals(doubleWeiValue);
        approve_Tx = await mockWETH9
            .connect(addr1)
            .approve(addr2.address, weiValue);
        expect(await mockWETH9.allowance(addr1.address, addr2.address)).equals(
            weiValue
        );
    });
    it("TEST transfer() - PASS", async () => {
        const weiValue = ethers.utils.parseEther("1");
        convertETHToWETH_Tx = await mockWETH9
            .connect(addr1)
            .deposit({ value: weiValue });
        convertETHToWETH_Tx2 = await mockWETH9
            .connect(addr1)
            .transfer(addr2.address, weiValue);
        expect(await mockWETH9.balanceOf(addr1.address)).equals(0);
        expect(await mockWETH9.balanceOf(addr2.address)).equals(weiValue);
        expect(await mockWETH9.totalSupply()).equals(weiValue);
    });
    it("TEST transferFrom() - PASS", async () => {
        const weiValue = ethers.utils.parseEther("1");
        const doubleWeiValue = ethers.utils.parseEther("2");
        convertETHToWETH_Tx = await mockWETH9
            .connect(addr1)
            .deposit({ value: weiValue });
        convertETHToWETH_Tx2 = await mockWETH9
            .connect(addr2)
            .fallback({ value: weiValue });
        expect(await mockWETH9.balanceOf(addr1.address)).equals(weiValue);
        expect(await mockWETH9.balanceOf(addr2.address)).equals(weiValue);
        expect(await mockWETH9.totalSupply()).equals(doubleWeiValue);
        approve_Tx = await mockWETH9
            .connect(addr1)
            .approve(addr2.address, weiValue);
        expect(await mockWETH9.allowance(addr1.address, addr2.address)).equals(
            weiValue
        );

        transferFrom_Tx = await mockWETH9
            .connect(addr2)
            .transferFrom(addr1.address, addr2.address, weiValue);
        expect(await mockWETH9.balanceOf(addr1.address)).equals(0);
        expect(await mockWETH9.balanceOf(addr2.address)).equals(doubleWeiValue);
        expect(await mockWETH9.totalSupply()).equals(doubleWeiValue);
    });
});
