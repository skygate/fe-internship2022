const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Test base ExchangeBalanceAccountant", function () {

    let mockWETH9;
    let exchangeBalanceAccountant;
    let addr1;
    let addr2;
    let addrs;

    beforeEach(async () => {
        const MockWETH9 = await ethers.getContractFactory("MockWETH9");
        mockWETH9 = await MockWETH9.deploy();
        await mockWETH9.deployed();

        const ExchangeBalanceAccountant = await ethers.getContractFactory("ExchangeBalanceAccountant");
        exchangeBalanceAccountant = await ExchangeBalanceAccountant.deploy(mockWETH9.address);
        await exchangeBalanceAccountant.deployed();

        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    });


    it('TEST mintETH() - PASS', async () => {
        const weiValue = ethers.utils.parseEther('1');
        mint_Tx = await exchangeBalanceAccountant.connect(addr1).mintETH(addr1.address, { value: weiValue });
        await mint_Tx.wait();
        // console.log(await exchangeBalanceAccountant.getETHBalance(addr1.address))
        expect(await exchangeBalanceAccountant.getETHBalance(addr1.address)).equals(weiValue);
        expect(await exchangeBalanceAccountant.getWETHBalance(addr1.address)).equals(0);
        expect(await exchangeBalanceAccountant.totalSupply()).equals(weiValue);
    });

    //0,0,0 == 1,1,1
    it('TEST Same mintWETH() - PASS', async () => {
        const weiValue = ethers.utils.parseEther('1');
        convertETHToWETH_Tx = await mockWETH9.connect(addr1).deposit({ value: weiValue });
        approve_Tx = await mockWETH9.connect(addr1).approve(exchangeBalanceAccountant.address, weiValue);
        mint_Tx = await exchangeBalanceAccountant.connect(addr1).mintWETH(addr1.address, weiValue);
        await mint_Tx.wait();
        // console.log(await exchangeBalanceAccountant.getETHBalance(addr1.address))
        expect(await exchangeBalanceAccountant.getETHBalance(addr1.address)).equals(0);
        expect(await exchangeBalanceAccountant.getWETHBalance(addr1.address)).equals(weiValue);
        expect(await exchangeBalanceAccountant.totalSupply()).equals(weiValue);
    });

    //0,0,1
    it('TEST 2/7 mintWETH() - FAIL', async () => {
        const properValue = ethers.utils.parseEther('2');
        const lessThanProperValue = ethers.utils.parseEther('1');
        convertETHToWETH_Tx = await mockWETH9.connect(addr1).deposit({ value: lessThanProperValue });
        approve_Tx = await mockWETH9.connect(addr1).approve(exchangeBalanceAccountant.address, lessThanProperValue);
        await expect(
            exchangeBalanceAccountant.connect(addr1).mintWETH(addr1.address, properValue)
        ).to.be.reverted
    });

    //0,1,0
    it('TEST 3/7 mintWETH() - PASS', async () => {
        const properValue = ethers.utils.parseEther('2');
        const lessThanProperValue = ethers.utils.parseEther('1');
        convertETHToWETH_Tx = await mockWETH9.connect(addr1).deposit({ value: lessThanProperValue });
        approve_Tx = await mockWETH9.connect(addr1).approve(exchangeBalanceAccountant.address, properValue);
        mint_Tx = await exchangeBalanceAccountant.connect(addr1).mintWETH(addr1.address, lessThanProperValue);
        expect(await exchangeBalanceAccountant.getETHBalance(addr1.address)).equals(0);
        expect(await exchangeBalanceAccountant.getWETHBalance(addr1.address)).equals(lessThanProperValue);
        expect(await exchangeBalanceAccountant.totalSupply()).equals(lessThanProperValue);
    });

    //0,1,1
    it('TEST 4/7 mintWETH() - FAIL', async () => {
        const properValue = ethers.utils.parseEther('2');
        const lessThanProperValue = ethers.utils.parseEther('1');
        convertETHToWETH_Tx = await mockWETH9.connect(addr1).deposit({ value: lessThanProperValue });
        approve_Tx = await mockWETH9.connect(addr1).approve(exchangeBalanceAccountant.address, properValue);
        await expect(
            exchangeBalanceAccountant.connect(addr1).mintWETH(addr1.address, properValue)
        ).to.be.reverted
    });

    //1,0,0
    it('TEST 5/7 mintWETH() - FAIL', async () => {
        const properValue = ethers.utils.parseEther('2');
        const lessThanProperValue = ethers.utils.parseEther('1');
        convertETHToWETH_Tx = await mockWETH9.connect(addr1).deposit({ value: properValue });
        approve_Tx = await mockWETH9.connect(addr1).approve(exchangeBalanceAccountant.address, lessThanProperValue);
        mint_Tx = await exchangeBalanceAccountant.connect(addr1).mintWETH(addr1.address, lessThanProperValue);
        expect(await exchangeBalanceAccountant.getETHBalance(addr1.address)).equals(0);
        expect(await exchangeBalanceAccountant.getWETHBalance(addr1.address)).equals(lessThanProperValue);
        expect(await exchangeBalanceAccountant.totalSupply()).equals(lessThanProperValue);
    });

    //1,0,1
    it('TEST 6/7 mintWETH() - FAIL', async () => {
        const properValue = ethers.utils.parseEther('2');
        const lessThanProperValue = ethers.utils.parseEther('1');
        convertETHToWETH_Tx = await mockWETH9.connect(addr1).deposit({ value: properValue });
        approve_Tx = await mockWETH9.connect(addr1).approve(exchangeBalanceAccountant.address, lessThanProperValue);
        await expect(
            exchangeBalanceAccountant.connect(addr1).mintWETH(addr1.address, properValue)
        ).to.be.reverted
    });

    //1,1,0
    it('TEST 7/7 mintWETH() - PASS', async () => {
        const properValue = ethers.utils.parseEther('2');
        const lessThanProperValue = ethers.utils.parseEther('1');
        convertETHToWETH_Tx = await mockWETH9.connect(addr1).deposit({ value: properValue });
        approve_Tx = await mockWETH9.connect(addr1).approve(exchangeBalanceAccountant.address, properValue);
        mint_Tx = await exchangeBalanceAccountant.connect(addr1).mintWETH(addr1.address, lessThanProperValue);
        expect(await exchangeBalanceAccountant.getETHBalance(addr1.address)).equals(0);
        expect(await exchangeBalanceAccountant.getWETHBalance(addr1.address)).equals(lessThanProperValue);
        expect(await exchangeBalanceAccountant.totalSupply()).equals(lessThanProperValue);
    });

    // <
    it('TEST 1/3 burnETH() - PASS', async () => {
        const properValue = ethers.utils.parseEther('2');
        mintETH_Tx = await exchangeBalanceAccountant.connect(addr1).mintETH(addr1.address, { value: properValue });
        expect(await exchangeBalanceAccountant.getETHBalance(addr1.address)).equals(properValue);
        expect(await exchangeBalanceAccountant.getWETHBalance(addr1.address)).equals(0);
        expect(await exchangeBalanceAccountant.totalSupply()).equals(properValue);

        const lessThanProperValue = ethers.utils.parseEther('1');
        burnETH_Tx = await exchangeBalanceAccountant.connect(addr1).burnETH(addr1.address, lessThanProperValue)
        expect(await exchangeBalanceAccountant.getETHBalance(addr1.address)).equals(lessThanProperValue);
        expect(await exchangeBalanceAccountant.getWETHBalance(addr1.address)).equals(0);
        expect(await exchangeBalanceAccountant.totalSupply()).equals(lessThanProperValue);
    });

    // =
    it('TEST 2/3 burnETH() - PASS', async () => {
        const weiValue = ethers.utils.parseEther('2');
        mintETH_Tx = await exchangeBalanceAccountant.connect(addr1).mintETH(addr1.address, { value: weiValue });
        expect(await exchangeBalanceAccountant.getETHBalance(addr1.address)).equals(weiValue);
        expect(await exchangeBalanceAccountant.getWETHBalance(addr1.address)).equals(0);
        expect(await exchangeBalanceAccountant.totalSupply()).equals(weiValue);

        burnETH_Tx = await exchangeBalanceAccountant.connect(addr1).burnETH(addr1.address, weiValue)
        expect(await exchangeBalanceAccountant.getETHBalance(addr1.address)).equals(0);
        expect(await exchangeBalanceAccountant.getWETHBalance(addr1.address)).equals(0);
        expect(await exchangeBalanceAccountant.totalSupply()).equals(0);
    });

    // >
    it('TEST 3/3 burnETH() - FAIL', async () => {
        const weiValue = ethers.utils.parseEther('1');
        mintETH_Tx = await exchangeBalanceAccountant.connect(addr1).mintETH(addr1.address, { value: weiValue });
        expect(await exchangeBalanceAccountant.getETHBalance(addr1.address)).equals(weiValue);
        expect(await exchangeBalanceAccountant.getWETHBalance(addr1.address)).equals(0);
        expect(await exchangeBalanceAccountant.totalSupply()).equals(weiValue);

        await expect(
            exchangeBalanceAccountant.connect(addr1).burnETH(addr1.address, ethers.utils.parseEther('2'))
        ).to.be.revertedWith("This account has too low ethereum balance on exchange to perform 'burn' opreation.");
    });

    // <
    it('TEST 1/3 burnWETH() - PASS', async () => {
        const properValue = ethers.utils.parseEther('2');
        const lessThanProperValue = ethers.utils.parseEther('1');
        convertETHToWETH_Tx = await mockWETH9.connect(addr1).deposit({ value: properValue });
        approve_Tx = await mockWETH9.connect(addr1).approve(exchangeBalanceAccountant.address, properValue);
        mint_Tx = await exchangeBalanceAccountant.connect(addr1).mintWETH(addr1.address, properValue);
        await mint_Tx.wait();
        expect(await exchangeBalanceAccountant.getETHBalance(addr1.address)).equals(0);
        expect(await exchangeBalanceAccountant.getWETHBalance(addr1.address)).equals(properValue);
        expect(await exchangeBalanceAccountant.totalSupply()).equals(properValue);

        burnETH_Tx = await exchangeBalanceAccountant.connect(addr1).burnWETH(addr1.address, lessThanProperValue)
        expect(await exchangeBalanceAccountant.getETHBalance(addr1.address)).equals(0);
        expect(await exchangeBalanceAccountant.getWETHBalance(addr1.address)).equals(lessThanProperValue);
        expect(await exchangeBalanceAccountant.totalSupply()).equals(lessThanProperValue);
    });

    // =
    it('TEST 2/3 burnWETH() - PASS', async () => {
        const properValue = ethers.utils.parseEther('2');
        const lessThanProperValue = ethers.utils.parseEther('1');
        convertETHToWETH_Tx = await mockWETH9.connect(addr1).deposit({ value: properValue });
        approve_Tx = await mockWETH9.connect(addr1).approve(exchangeBalanceAccountant.address, properValue);
        mint_Tx = await exchangeBalanceAccountant.connect(addr1).mintWETH(addr1.address, properValue);
        await mint_Tx.wait();
        expect(await exchangeBalanceAccountant.getETHBalance(addr1.address)).equals(0);
        expect(await exchangeBalanceAccountant.getWETHBalance(addr1.address)).equals(properValue);
        expect(await exchangeBalanceAccountant.totalSupply()).equals(properValue);

        burnETH_Tx = await exchangeBalanceAccountant.connect(addr1).burnWETH(addr1.address, lessThanProperValue)
        expect(await exchangeBalanceAccountant.getETHBalance(addr1.address)).equals(0);
        expect(await exchangeBalanceAccountant.getWETHBalance(addr1.address)).equals(lessThanProperValue);
        expect(await exchangeBalanceAccountant.totalSupply()).equals(lessThanProperValue);
    });

    // >
    it('TEST 3/3 burnWETH() - FAIL', async () => {
        const properValue = ethers.utils.parseEther('2');
        const lessThanProperValue = ethers.utils.parseEther('1');
        convertETHToWETH_Tx = await mockWETH9.connect(addr1).deposit({ value: lessThanProperValue });
        approve_Tx = await mockWETH9.connect(addr1).approve(exchangeBalanceAccountant.address, lessThanProperValue);
        mint_Tx = await exchangeBalanceAccountant.connect(addr1).mintWETH(addr1.address, lessThanProperValue);
        await mint_Tx.wait();
        expect(await exchangeBalanceAccountant.getETHBalance(addr1.address)).equals(0);
        expect(await exchangeBalanceAccountant.getWETHBalance(addr1.address)).equals(lessThanProperValue);
        expect(await exchangeBalanceAccountant.totalSupply()).equals(lessThanProperValue);

        await expect(
            exchangeBalanceAccountant.connect(addr1).burnWETH(addr1.address, properValue)
        ).to.be.revertedWith("This account has too low wrappend etherum balance on exchange to perform 'burn' opreation.");
    });

    //0,0
    it('TEST 1/4 transfer() [ETH] - PASS', async () => {
        const weiValue = ethers.utils.parseEther('2');
        const halfOfWeiValue = ethers.utils.parseEther('1');
        mint_Tx = await exchangeBalanceAccountant.connect(addr1).mintETH(addr1.address, { value: weiValue });
        await mint_Tx.wait();
        expect(await exchangeBalanceAccountant.getETHBalance(addr1.address)).equals(weiValue);
        expect(await exchangeBalanceAccountant.getWETHBalance(addr1.address)).equals(0);
        expect(await exchangeBalanceAccountant.totalSupply()).equals(weiValue);

        transfer_Tx = await exchangeBalanceAccountant.connect(addr1).innerTransfer(addr2.address, halfOfWeiValue, false);

        expect(await exchangeBalanceAccountant.getETHBalance(addr1.address)).equals(halfOfWeiValue);
        expect(await exchangeBalanceAccountant.getETHBalance(addr2.address)).equals(halfOfWeiValue);

        expect(await exchangeBalanceAccountant.getWETHBalance(addr1.address)).equals(0);
        expect(await exchangeBalanceAccountant.getWETHBalance(addr2.address)).equals(0);
        expect(await exchangeBalanceAccountant.totalSupply()).equals(weiValue);
    });

    //0,1
    it('TEST 2/4 transfer() [ETH] - FAIL', async () => {
        const weiValue = ethers.utils.parseEther('2');
        const halfOfWeiValue = ethers.utils.parseEther('1');
        mint_Tx = await exchangeBalanceAccountant.connect(addr1).mintETH(addr1.address, { value: halfOfWeiValue });
        await mint_Tx.wait();
        expect(await exchangeBalanceAccountant.getETHBalance(addr1.address)).equals(halfOfWeiValue);
        expect(await exchangeBalanceAccountant.getWETHBalance(addr1.address)).equals(0);
        expect(await exchangeBalanceAccountant.totalSupply()).equals(halfOfWeiValue);

        await expect(
            exchangeBalanceAccountant.connect(addr2).innerTransfer(addr1.address, weiValue, false)
        ).to.be.revertedWith(
            "This account has too low ethereum balance on exchange to perform 'innerTransfer' opreation."
        );
    });

    //1,0
    it('TEST 3/4 transfer() [WETH] - PASS', async () => {
        const weiValue = ethers.utils.parseEther('2');
        const halfOfWeiValue = ethers.utils.parseEther('1');
        convertETHToWETH_Tx = await mockWETH9.connect(addr1).deposit({ value: weiValue });
        approve_Tx = await mockWETH9.connect(addr1).approve(exchangeBalanceAccountant.address, weiValue);
        mint_Tx = await exchangeBalanceAccountant.connect(addr1).mintWETH(addr1.address, weiValue);
        await mint_Tx.wait();
        expect(await exchangeBalanceAccountant.getETHBalance(addr1.address)).equals(0);
        expect(await exchangeBalanceAccountant.getWETHBalance(addr1.address)).equals(weiValue);
        expect(await exchangeBalanceAccountant.totalSupply()).equals(weiValue);

        transfer_Tx = await exchangeBalanceAccountant.connect(addr1).innerTransfer(addr2.address, halfOfWeiValue, true);

        expect(await exchangeBalanceAccountant.getETHBalance(addr1.address)).equals(0);
        expect(await exchangeBalanceAccountant.getETHBalance(addr2.address)).equals(0);

        expect(await exchangeBalanceAccountant.getWETHBalance(addr1.address)).equals(halfOfWeiValue);
        expect(await exchangeBalanceAccountant.getWETHBalance(addr2.address)).equals(halfOfWeiValue);
        expect(await exchangeBalanceAccountant.totalSupply()).equals(weiValue);
    });

    //1,1
    it('TEST 4/4 transfer() [WETH] - FAIL', async () => {
        const weiValue = ethers.utils.parseEther('2');
        const halfOfWeiValue = ethers.utils.parseEther('1');
        convertETHToWETH_Tx = await mockWETH9.connect(addr1).deposit({ value: halfOfWeiValue });
        approve_Tx = await mockWETH9.connect(addr1).approve(exchangeBalanceAccountant.address, halfOfWeiValue);
        mint_Tx = await exchangeBalanceAccountant.connect(addr1).mintWETH(addr1.address, halfOfWeiValue);
        await mint_Tx.wait();
        expect(await exchangeBalanceAccountant.getETHBalance(addr1.address)).equals(0);
        expect(await exchangeBalanceAccountant.getWETHBalance(addr1.address)).equals(halfOfWeiValue);
        expect(await exchangeBalanceAccountant.totalSupply()).equals(halfOfWeiValue);

        await expect(
            exchangeBalanceAccountant.connect(addr1).innerTransfer(addr2.address, weiValue, true)
        ).to.be.revertedWith("This account has too low wrapped ethereum balance on exchange to perform 'innerTransfer' opreation.");
    });

});
