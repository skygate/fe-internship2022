const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Test ExchangeBalanceAccountant", async () => {

    let addr1;
    let addr2;
    let addrs;

    beforeEach(async () => {
        const MockWETH9 = await ethers.getContractFactory("WETH9");
        mockWETH9 = await MockWETH9.deploy();
        await mockWETH9.deployed();

        const ExchangeBalanceAccountant = await ethers.getContractFactory("ExchangeBalanceAccountant");
        exchangeBalanceAccountant = await ExchangeBalanceAccountant.deploy(mockWETH9.address);
        await exchangeBalanceAccountant.deployed();

        [owner, addr1, addr2, addr3, ...addrs] = await ethers.getSigners();
    });

    describe("TEST depositETH()", async () => {
        it('PASS', async () => {
            const weiValue = ethers.utils.parseEther('1');
            mint_Tx = await exchangeBalanceAccountant.connect(addr1).depositETH(addr1.address, { value: weiValue });
            await mint_Tx.wait();
            expect(await exchangeBalanceAccountant.eTHBalances(addr1.address)).equals(weiValue);
            expect(await exchangeBalanceAccountant.wETHBalances(addr1.address)).equals(0);
            expect(await exchangeBalanceAccountant.totalSupply()).equals(weiValue);
        });
    });

    describe("TEST depositWETH()", async () => {
        it('PASS - Same values', async () => {
            const weiValue = ethers.utils.parseEther('1');
            convertETHToWETH_Tx = await mockWETH9.connect(addr1).deposit({ value: weiValue });
            approve_Tx = await mockWETH9.connect(addr1).approve(exchangeBalanceAccountant.address, weiValue);
            mint_Tx = await exchangeBalanceAccountant.connect(addr1).depositWETH(addr1.address, weiValue);
            await mint_Tx.wait();
            expect(await exchangeBalanceAccountant.eTHBalances(addr1.address)).equals(0);
            expect(await exchangeBalanceAccountant.wETHBalances(addr1.address)).equals(weiValue);
            expect(await exchangeBalanceAccountant.totalSupply()).equals(weiValue);
        });

        //0,1,0 - Yes - it's weird but you can approve more money to somebody than you own. This is exacly how WETH9 works. 
        it('PASS - Deposit: 1, Approve: 2, Mint: 1', async () => {
            const properValue = ethers.utils.parseEther('2');
            const lessThanProperValue = ethers.utils.parseEther('1');
            convertETHToWETH_Tx = await mockWETH9.connect(addr1).deposit({ value: lessThanProperValue });
            approve_Tx = await mockWETH9.connect(addr1).approve(exchangeBalanceAccountant.address, properValue);
            mint_Tx = await exchangeBalanceAccountant.connect(addr1).depositWETH(addr1.address, lessThanProperValue);
            expect(await exchangeBalanceAccountant.eTHBalances(addr1.address)).equals(0);
            expect(await exchangeBalanceAccountant.wETHBalances(addr1.address)).equals(lessThanProperValue);
            expect(await exchangeBalanceAccountant.totalSupply()).equals(lessThanProperValue);
        });

        //1,0,0
        it('PASS - Deposit: 2, Approve: 1, Mint: 1', async () => {
            const properValue = ethers.utils.parseEther('2');
            const lessThanProperValue = ethers.utils.parseEther('1');
            convertETHToWETH_Tx = await mockWETH9.connect(addr1).deposit({ value: properValue });
            approve_Tx = await mockWETH9.connect(addr1).approve(exchangeBalanceAccountant.address, lessThanProperValue);
            mint_Tx = await exchangeBalanceAccountant.connect(addr1).depositWETH(addr1.address, lessThanProperValue);
            expect(await exchangeBalanceAccountant.eTHBalances(addr1.address)).equals(0);
            expect(await exchangeBalanceAccountant.wETHBalances(addr1.address)).equals(lessThanProperValue);
            expect(await exchangeBalanceAccountant.totalSupply()).equals(lessThanProperValue);
        });

        //0,0,1
        it('FAIL - Deposit: 1, Approve: 1, Mint: 2', async () => {
            const properValue = ethers.utils.parseEther('2');
            const lessThanProperValue = ethers.utils.parseEther('1');
            convertETHToWETH_Tx = await mockWETH9.connect(addr1).deposit({ value: lessThanProperValue });
            approve_Tx = await mockWETH9.connect(addr1).approve(exchangeBalanceAccountant.address, lessThanProperValue);
            await expect(
                exchangeBalanceAccountant.connect(addr1).depositWETH(addr1.address, properValue)
            ).to.be.reverted
        });

        //0,1,1
        it('FAIL - Deposit: 1, Approve: 2, Mint: 2', async () => {
            const properValue = ethers.utils.parseEther('2');
            const lessThanProperValue = ethers.utils.parseEther('1');
            convertETHToWETH_Tx = await mockWETH9.connect(addr1).deposit({ value: lessThanProperValue });
            approve_Tx = await mockWETH9.connect(addr1).approve(exchangeBalanceAccountant.address, properValue);
            await expect(
                exchangeBalanceAccountant.connect(addr1).depositWETH(addr1.address, properValue)
            ).to.be.reverted
        });

        //1,0,1
        it('FAIL - Deposit: 2, Approve: 1, Mint: 2', async () => {
            const properValue = ethers.utils.parseEther('2');
            const lessThanProperValue = ethers.utils.parseEther('1');
            convertETHToWETH_Tx = await mockWETH9.connect(addr1).deposit({ value: properValue });
            approve_Tx = await mockWETH9.connect(addr1).approve(exchangeBalanceAccountant.address, lessThanProperValue);
            await expect(
                exchangeBalanceAccountant.connect(addr1).depositWETH(addr1.address, properValue)
            ).to.be.reverted
        });

        //1,1,0
        it('FAIL - Deposit: 2, Approve: 2, Mint: 1', async () => {
            const properValue = ethers.utils.parseEther('2');
            const lessThanProperValue = ethers.utils.parseEther('1');
            convertETHToWETH_Tx = await mockWETH9.connect(addr1).deposit({ value: properValue });
            approve_Tx = await mockWETH9.connect(addr1).approve(exchangeBalanceAccountant.address, properValue);
            mint_Tx = await exchangeBalanceAccountant.connect(addr1).depositWETH(addr1.address, lessThanProperValue);
            expect(await exchangeBalanceAccountant.eTHBalances(addr1.address)).equals(0);
            expect(await exchangeBalanceAccountant.wETHBalances(addr1.address)).equals(lessThanProperValue);
            expect(await exchangeBalanceAccountant.totalSupply()).equals(lessThanProperValue);
        });
    });

    describe("TEST withdrawETH()", async () => {
        // <
        it('PASS - burn < deposit', async () => {
            const properValue = ethers.utils.parseEther('2');
            mintETH_Tx = await exchangeBalanceAccountant.connect(addr1).depositETH(addr1.address, { value: properValue });
            expect(await exchangeBalanceAccountant.eTHBalances(addr1.address)).equals(properValue);
            expect(await exchangeBalanceAccountant.wETHBalances(addr1.address)).equals(0);
            expect(await exchangeBalanceAccountant.totalSupply()).equals(properValue);

            const lessThanProperValue = ethers.utils.parseEther('1');
            burnETH_Tx = await exchangeBalanceAccountant.connect(addr1).withdrawETH(lessThanProperValue)
            expect(await exchangeBalanceAccountant.eTHBalances(addr1.address)).equals(lessThanProperValue);
            expect(await exchangeBalanceAccountant.wETHBalances(addr1.address)).equals(0);
            expect(await exchangeBalanceAccountant.totalSupply()).equals(lessThanProperValue);
        });

        // =
        it('PASS - burn = deposit', async () => {
            const weiValue = ethers.utils.parseEther('2');
            mintETH_Tx = await exchangeBalanceAccountant.connect(addr1).depositETH(addr1.address, { value: weiValue });
            expect(await exchangeBalanceAccountant.eTHBalances(addr1.address)).equals(weiValue);
            expect(await exchangeBalanceAccountant.wETHBalances(addr1.address)).equals(0);
            expect(await exchangeBalanceAccountant.totalSupply()).equals(weiValue);

            burnETH_Tx = await exchangeBalanceAccountant.connect(addr1).withdrawETH(weiValue)
            expect(await exchangeBalanceAccountant.eTHBalances(addr1.address)).equals(0);
            expect(await exchangeBalanceAccountant.wETHBalances(addr1.address)).equals(0);
            expect(await exchangeBalanceAccountant.totalSupply()).equals(0);
        });

        // >
        it('FAIL - burn > deposit', async () => {
            const weiValue = ethers.utils.parseEther('1');
            mintETH_Tx = await exchangeBalanceAccountant.connect(addr1).depositETH(addr1.address, { value: weiValue });
            expect(await exchangeBalanceAccountant.eTHBalances(addr1.address)).equals(weiValue);
            expect(await exchangeBalanceAccountant.wETHBalances(addr1.address)).equals(0);
            expect(await exchangeBalanceAccountant.totalSupply()).equals(weiValue);

            await expect(
                exchangeBalanceAccountant.connect(addr1).withdrawETH(ethers.utils.parseEther('2'))
            ).to.be.revertedWith("This account has too low ethereum balance on exchange to perform 'burn' opreation.");
        });
    });

    describe("TEST withdrawWETH()", async () => {
        // <
        it('PASS - burn < deposit', async () => {
            const properValue = ethers.utils.parseEther('2');
            const lessThanProperValue = ethers.utils.parseEther('1');
            convertETHToWETH_Tx = await mockWETH9.connect(addr1).deposit({ value: properValue });
            approve_Tx = await mockWETH9.connect(addr1).approve(exchangeBalanceAccountant.address, properValue);
            mint_Tx = await exchangeBalanceAccountant.connect(addr1).depositWETH(addr1.address, properValue);
            await mint_Tx.wait();
            expect(await exchangeBalanceAccountant.eTHBalances(addr1.address)).equals(0);
            expect(await exchangeBalanceAccountant.wETHBalances(addr1.address)).equals(properValue);
            expect(await exchangeBalanceAccountant.totalSupply()).equals(properValue);

            burnETH_Tx = await exchangeBalanceAccountant.connect(addr1).withdrawWETH(lessThanProperValue)
            expect(await exchangeBalanceAccountant.eTHBalances(addr1.address)).equals(0);
            expect(await exchangeBalanceAccountant.wETHBalances(addr1.address)).equals(lessThanProperValue);
            expect(await exchangeBalanceAccountant.totalSupply()).equals(lessThanProperValue);
        });

        // =
        it('PASS - burn = deposit', async () => {
            const properValue = ethers.utils.parseEther('2');
            const lessThanProperValue = ethers.utils.parseEther('1');
            convertETHToWETH_Tx = await mockWETH9.connect(addr1).deposit({ value: properValue });
            approve_Tx = await mockWETH9.connect(addr1).approve(exchangeBalanceAccountant.address, properValue);
            mint_Tx = await exchangeBalanceAccountant.connect(addr1).depositWETH(addr1.address, properValue);
            await mint_Tx.wait();
            expect(await exchangeBalanceAccountant.eTHBalances(addr1.address)).equals(0);
            expect(await exchangeBalanceAccountant.wETHBalances(addr1.address)).equals(properValue);
            expect(await exchangeBalanceAccountant.totalSupply()).equals(properValue);

            burnETH_Tx = await exchangeBalanceAccountant.connect(addr1).withdrawWETH(lessThanProperValue)
            expect(await exchangeBalanceAccountant.eTHBalances(addr1.address)).equals(0);
            expect(await exchangeBalanceAccountant.wETHBalances(addr1.address)).equals(lessThanProperValue);
            expect(await exchangeBalanceAccountant.totalSupply()).equals(lessThanProperValue);
        });

        // >
        it('FAIL - burn > deposit', async () => {
            const properValue = ethers.utils.parseEther('2');
            const lessThanProperValue = ethers.utils.parseEther('1');
            convertETHToWETH_Tx = await mockWETH9.connect(addr1).deposit({ value: lessThanProperValue });
            approve_Tx = await mockWETH9.connect(addr1).approve(exchangeBalanceAccountant.address, lessThanProperValue);
            mint_Tx = await exchangeBalanceAccountant.connect(addr1).depositWETH(addr1.address, lessThanProperValue);
            await mint_Tx.wait();
            expect(await exchangeBalanceAccountant.eTHBalances(addr1.address)).equals(0);
            expect(await exchangeBalanceAccountant.wETHBalances(addr1.address)).equals(lessThanProperValue);
            expect(await exchangeBalanceAccountant.totalSupply()).equals(lessThanProperValue);

            await expect(
                exchangeBalanceAccountant.connect(addr1).withdrawWETH(properValue)
            ).to.be.revertedWith("This account has too low wrappend etherum balance on exchange to perform 'burn' opreation.");
        });
    });

    describe("TEST innerTransfer()", async () => {
        //0,0
        it('PASS - mint > transfer, ETH', async () => {
            const weiValue = ethers.utils.parseEther('2');
            const halfOfWeiValue = ethers.utils.parseEther('1');
            mint_Tx = await exchangeBalanceAccountant.connect(addr1).depositETH(addr1.address, { value: weiValue });
            await mint_Tx.wait();
            expect(await exchangeBalanceAccountant.eTHBalances(addr1.address)).equals(weiValue);
            expect(await exchangeBalanceAccountant.wETHBalances(addr1.address)).equals(0);
            expect(await exchangeBalanceAccountant.totalSupply()).equals(weiValue);

            transfer_Tx = await exchangeBalanceAccountant.connect(addr1).innerTransfer(addr2.address, halfOfWeiValue, false);

            expect(await exchangeBalanceAccountant.eTHBalances(addr1.address)).equals(halfOfWeiValue);
            expect(await exchangeBalanceAccountant.eTHBalances(addr2.address)).equals(halfOfWeiValue);

            expect(await exchangeBalanceAccountant.wETHBalances(addr1.address)).equals(0);
            expect(await exchangeBalanceAccountant.wETHBalances(addr2.address)).equals(0);
            expect(await exchangeBalanceAccountant.totalSupply()).equals(weiValue);
        });

        //1,0
        it('PASS - mint > transfer, WETH', async () => {
            const weiValue = ethers.utils.parseEther('2');
            const halfOfWeiValue = ethers.utils.parseEther('1');
            convertETHToWETH_Tx = await mockWETH9.connect(addr1).deposit({ value: weiValue });
            approve_Tx = await mockWETH9.connect(addr1).approve(exchangeBalanceAccountant.address, weiValue);
            mint_Tx = await exchangeBalanceAccountant.connect(addr1).depositWETH(addr1.address, weiValue);
            await mint_Tx.wait();
            expect(await exchangeBalanceAccountant.eTHBalances(addr1.address)).equals(0);
            expect(await exchangeBalanceAccountant.wETHBalances(addr1.address)).equals(weiValue);
            expect(await exchangeBalanceAccountant.totalSupply()).equals(weiValue);

            transfer_Tx = await exchangeBalanceAccountant.connect(addr1).innerTransfer(addr2.address, halfOfWeiValue, true);

            expect(await exchangeBalanceAccountant.eTHBalances(addr1.address)).equals(0);
            expect(await exchangeBalanceAccountant.eTHBalances(addr2.address)).equals(0);

            expect(await exchangeBalanceAccountant.wETHBalances(addr1.address)).equals(halfOfWeiValue);
            expect(await exchangeBalanceAccountant.wETHBalances(addr2.address)).equals(halfOfWeiValue);
            expect(await exchangeBalanceAccountant.totalSupply()).equals(weiValue);
        });

        //0,1
        it('FAIL - mint < transfer, ETH', async () => {
            const weiValue = ethers.utils.parseEther('2');
            const halfOfWeiValue = ethers.utils.parseEther('1');
            mint_Tx = await exchangeBalanceAccountant.connect(addr1).depositETH(addr1.address, { value: halfOfWeiValue });
            await mint_Tx.wait();
            expect(await exchangeBalanceAccountant.eTHBalances(addr1.address)).equals(halfOfWeiValue);
            expect(await exchangeBalanceAccountant.wETHBalances(addr1.address)).equals(0);
            expect(await exchangeBalanceAccountant.totalSupply()).equals(halfOfWeiValue);

            await expect(
                exchangeBalanceAccountant.connect(addr2).innerTransfer(addr1.address, weiValue, false)
            ).to.be.revertedWith(
                "This account has too low ethereum balance on exchange to perform 'innerTransfer' opreation."
            );
        });

        //1,1
        it('FAIL - mint < transfer, WETH', async () => {
            const weiValue = ethers.utils.parseEther('2');
            const halfOfWeiValue = ethers.utils.parseEther('1');
            convertETHToWETH_Tx = await mockWETH9.connect(addr1).deposit({ value: halfOfWeiValue });
            approve_Tx = await mockWETH9.connect(addr1).approve(exchangeBalanceAccountant.address, halfOfWeiValue);
            mint_Tx = await exchangeBalanceAccountant.connect(addr1).depositWETH(addr1.address, halfOfWeiValue);
            await mint_Tx.wait();
            expect(await exchangeBalanceAccountant.eTHBalances(addr1.address)).equals(0);
            expect(await exchangeBalanceAccountant.wETHBalances(addr1.address)).equals(halfOfWeiValue);
            expect(await exchangeBalanceAccountant.totalSupply()).equals(halfOfWeiValue);

            await expect(
                exchangeBalanceAccountant.connect(addr1).innerTransfer(addr2.address, weiValue, true)
            ).to.be.revertedWith("This account has too low wrapped ethereum balance on exchange to perform 'innerTransfer' opreation.");
        });
    });
});
