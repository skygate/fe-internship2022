const { expect } = require("chai");
const { ethers } = require("hardhat");

const {
    skiptTime,
} = require("./../utils");

describe("Test MyDAO", async () => {

    let addr1;
    let addr2;
    let addrs;

    const PENDING = 2;
    const REJECTED =1;
    const ACCEPTED = 0;


    beforeEach(async () => {
        const MockWETH9 = await ethers.getContractFactory("WETH9");
        mockWETH9 = await MockWETH9.deploy();
        await mockWETH9.deployed();

        const MyDAO = await ethers.getContractFactory("MyDAO");
        myDAO = await MyDAO.deploy(mockWETH9.address);
        await myDAO.deployed();

        [owner, addr1, addr2, addr3, ...addrs] = await ethers.getSigners();
    });
    
    //2,2,2==1,1,1
    describe("TEST deposit()", async () => {
        it('PASS', async () => {
            const weiValue = ethers.utils.parseEther('1');
            convertETHToWETH_Tx = await mockWETH9.connect(addr1).deposit({ value: weiValue });
            approve_Tx = await mockWETH9.connect(addr1).approve(myDAO.address, weiValue);
            mintVotes_Tx = await myDAO.connect(addr1).deposit(weiValue);
            await mintVotes_Tx.wait();
            expect(await myDAO.shares(addr1.address)).equals(weiValue);
            expect(await myDAO.totalShares()).equals(weiValue);
        });

    //1,2,1
        it('PASS - Deposit: 1, Approve: 2, Mint: 1', async () => {
            const properValue = ethers.utils.parseEther('2');
            const lessThanProperValue = ethers.utils.parseEther('1');
            convertETHToWETH_Tx = await mockWETH9.connect(addr1).deposit({ value: lessThanProperValue });
            approve_Tx = await mockWETH9.connect(addr1).approve(myDAO.address, properValue);
            mintVotes_Tx = await myDAO.connect(addr1).deposit(lessThanProperValue);
            await mintVotes_Tx.wait();
            expect(await myDAO.shares(addr1.address)).equals(lessThanProperValue);
            expect(await myDAO.totalShares()).equals(lessThanProperValue);
        });

    //2,1,1

        it('PASS - Deposit: 2, Approve: 1, Mint: 1', async () => {
            const properValue = ethers.utils.parseEther('2');
            const lessThanProperValue = ethers.utils.parseEther('1');
            convertETHToWETH_Tx = await mockWETH9.connect(addr1).deposit({ value: properValue });
            approve_Tx = await mockWETH9.connect(addr1).approve(myDAO.address, lessThanProperValue);
            mintVotes_Tx = await myDAO.connect(addr1).deposit(lessThanProperValue);
            await mintVotes_Tx.wait();
            expect(await myDAO.shares(addr1.address)).equals(lessThanProperValue);
            expect(await myDAO.totalShares()).equals(lessThanProperValue);
        });
    

        //1,1,2

        it('FAIL - Deposit: 1, Approve: 1, Mint: 2', async () => {
            const properValue = ethers.utils.parseEther('2');
            const lessThanProperValue = ethers.utils.parseEther('1');
            convertETHToWETH_Tx = await mockWETH9.connect(addr1).deposit({ value: lessThanProperValue });
            approve_Tx = await mockWETH9.connect(addr1).approve(myDAO.address, lessThanProperValue);
            await expect(
                myDAO.connect(addr1).deposit(addr1.address, properValue)
            ).to.be.reverted
        });

        //1,2,2

        it('FAIL - Deposit: 1, Approve: 2, Mint: 2', async () => {
            const properValue = ethers.utils.parseEther('2');
            const lessThanProperValue = ethers.utils.parseEther('1');
            convertETHToWETH_Tx = await mockWETH9.connect(addr1).deposit({ value: lessThanProperValue });
            approve_Tx = await mockWETH9.connect(addr1).approve(myDAO.address, properValue);
            await expect(
                myDAO.connect(addr1).deposit(addr1.address, properValue)
            ).to.be.reverted
        });

        //2,1,2

        it('FAIL - Deposit: 2, Approve: 1, Mint: 2', async () => {
            const properValue = ethers.utils.parseEther('2');
            const lessThanProperValue = ethers.utils.parseEther('1');
            convertETHToWETH_Tx = await mockWETH9.connect(addr1).deposit({ value: properValue });
            approve_Tx = await mockWETH9.connect(addr1).approve(myDAO.address, lessThanProperValue);
            await expect(
                myDAO.connect(addr1).deposit(addr1.address, properValue)
            ).to.be.reverted
        });

        //2,2,1

        it('FAIL - Deposit: 2, Approve: 2, Mint: 1', async () => {
            const properValue = ethers.utils.parseEther('2');
            const lessThanProperValue = ethers.utils.parseEther('1');
            convertETHToWETH_Tx = await mockWETH9.connect(addr1).deposit({ value: properValue });
            approve_Tx = await mockWETH9.connect(addr1).approve(myDAO.address, properValue);
            mintVotes_Tx = await myDAO.connect(addr1).deposit(lessThanProperValue);
            await mintVotes_Tx.wait();
            expect(await myDAO.shares(addr1.address)).equals(lessThanProperValue);
            expect(await myDAO.totalShares()).equals(lessThanProperValue);
        });
    });

    describe("TEST withdraw()", async () => {
        // <
        it('PASS - burn < deposit', async () => {
            const properValue = ethers.utils.parseEther('2');
            const lessThanProperValue = ethers.utils.parseEther('1');
            convertETHToWETH_Tx = await mockWETH9.connect(addr1).deposit({ value: properValue });
            approve_Tx = await mockWETH9.connect(addr1).approve(myDAO.address, properValue);
            mintVotes_Tx = await myDAO.connect(addr1).deposit(properValue);
            await mintVotes_Tx.wait();
            expect(await myDAO.shares(addr1.address)).equals(properValue);
            expect(await myDAO.totalShares()).equals(properValue);
            burnETH_Tx = await myDAO.connect(addr1).withdraw(lessThanProperValue)
            expect(await myDAO.shares(addr1.address)).equals(lessThanProperValue);
            expect(await myDAO.totalShares()).equals(lessThanProperValue);
        });

        // =
        it('PASS - burn = deposit', async () => {
            const properValue = ethers.utils.parseEther('2');
            const lessThanProperValue = ethers.utils.parseEther('1');
            convertETHToWETH_Tx = await mockWETH9.connect(addr1).deposit({ value: properValue });
            approve_Tx = await mockWETH9.connect(addr1).approve(myDAO.address, properValue);
            mintVotes_Tx = await myDAO.connect(addr1).deposit(properValue);
            await mintVotes_Tx.wait();
            expect(await myDAO.shares(addr1.address)).equals(properValue);
            expect(await myDAO.totalShares()).equals(properValue);
            burnETH_Tx = await myDAO.connect(addr1).withdraw(lessThanProperValue)
            expect(await myDAO.shares(addr1.address)).equals(lessThanProperValue);
            expect(await myDAO.totalShares()).equals(lessThanProperValue);
        });

        // >
        it('FAIL - burn > deposit', async () => {
            const properValue = ethers.utils.parseEther('2');
            const lessThanProperValue = ethers.utils.parseEther('1');
            convertETHToWETH_Tx = await mockWETH9.connect(addr1).deposit({ value: lessThanProperValue });
            approve_Tx = await mockWETH9.connect(addr1).approve(myDAO.address, lessThanProperValue);
            mintVotes_Tx = await myDAO.connect(addr1).deposit(lessThanProperValue);
            await mintVotes_Tx.wait();
            expect(await myDAO.shares(addr1.address)).equals(lessThanProperValue);
            expect(await myDAO.totalShares()).equals(lessThanProperValue);
            
            await expect(
                myDAO.connect(addr1).withdraw(properValue)
            ).to.be.revertedWith('Not enough shares');
        });
    });

    describe("TEST createProposal()", async () => {
        it('PASS - shares > proposal_min_share', async () => {
            const weiValue = ethers.utils.parseEther('1');
            const proposal = "proposal1";
            convertETHToWETH_Tx = await mockWETH9.connect(addr1).deposit({ value: weiValue });
            approve_Tx = await mockWETH9.connect(addr1).approve(myDAO.address, weiValue);
            mintVotes_Tx = await myDAO.connect(addr1).deposit(weiValue);
            await mintVotes_Tx.wait();
            createProposal_Tx = await myDAO.connect(addr1).createProposal(proposal);
            await createProposal_Tx.wait();
            proposal0 = await myDAO.proposals(0);
            expect(proposal0["id"]).equals(0);
            expect(proposal0["author"]).equals(addr1.address);
            expect(proposal0["name"]).equals(proposal);
            expect(proposal0["votesForYes"]).equals(0);
            expect(proposal0["votesForNo"]).equals(0);
            expect(proposal0["status"]).equals(PENDING);
            
        });

        it('FAIL - shares < proposal_min_share', async () => {
            const weiValue = ethers.utils.parseEther('.001');
            const proposal = "proposal1";
            convertETHToWETH_Tx = await mockWETH9.connect(addr1).deposit({ value: weiValue });
            approve_Tx = await mockWETH9.connect(addr1).approve(myDAO.address, weiValue);
            mintVotes_Tx = await myDAO.connect(addr1).deposit(weiValue);
            await mintVotes_Tx.wait();
            await expect(
                myDAO.connect(addr1).createProposal(proposal)
            ).to.be.revertedWith(
                'Not enough shares to create a proposal'
            );
            
        });
    });

    describe("TEST Vote()", async () => {
        it('PASS - first time within voting period, voteYes', async () => {
            const weiValue = ethers.utils.parseEther('1');
            const proposal = "proposal1";
            convertETHToWETH_Tx = await mockWETH9.connect(addr1).deposit({ value: weiValue });
            approve_Tx = await mockWETH9.connect(addr1).approve(myDAO.address, weiValue);
            mintVotes_Tx = await myDAO.connect(addr1).deposit(weiValue);
            shares_Tx = await myDAO.connect(addr1).shares(addr1.address);
            await mintVotes_Tx.wait();
            createProposal_Tx = await myDAO.connect(addr1).createProposal(proposal);
            await createProposal_Tx.wait();
            createVote_Tx = await myDAO.connect(addr1).vote(0,0);
            await createVote_Tx.wait();
            checkForVotes_Tx = await myDAO.connect(addr1).votes(addr1.address, 0);
            proposal0 = await myDAO.proposals(0);
            expect(proposal0["votesForYes"]).equals(weiValue);
            expect(proposal0["votesForNo"]).equals(0);
        });
        
        it('PASS - first time, within voting period, voteNo', async () => {
            const weiValue = ethers.utils.parseEther('1');
            const proposal = "proposal1";
            convertETHToWETH_Tx = await mockWETH9.connect(addr1).deposit({ value: weiValue });
            approve_Tx = await mockWETH9.connect(addr1).approve(myDAO.address, weiValue);
            mintVotes_Tx = await myDAO.connect(addr1).deposit(weiValue);
            await mintVotes_Tx.wait();
            createProposal_Tx = await myDAO.connect(addr1).createProposal(proposal);
            await createProposal_Tx.wait();
            proposal0 = await myDAO.proposals(0);createVote_Tx = await myDAO.connect(addr1).vote(proposal0["id"], 1);
            await createVote_Tx.wait();
            proposal0 = await myDAO.proposals(0);
            expect(proposal0["votesForYes"]).equals(0);
            expect(proposal0["votesForNo"]).equals(weiValue);
        });

        it('Fail - Already Voted, within voting period, voteNo', async () => {
            const weiValue = ethers.utils.parseEther('1');
            const proposal = "proposal1";
            convertETHToWETH_Tx = await mockWETH9.connect(addr1).deposit({ value: weiValue });
            approve_Tx = await mockWETH9.connect(addr1).approve(myDAO.address, weiValue);
            mintVotes_Tx = await myDAO.connect(addr1).deposit(weiValue);
            await mintVotes_Tx.wait();
            createProposal_Tx = await myDAO.connect(addr1).createProposal(proposal);
            await createProposal_Tx.wait();
            proposal0 = await myDAO.proposals(0);
            createVote_Tx = await myDAO.connect(addr1).vote(proposal0["id"], 1);
            await createVote_Tx.wait();
            await expect(
                myDAO.connect(addr1).vote(proposal0["id"], 1)
            ).to.be.revertedWith(
                'already voted'
            );
            
            
        });

        it('Fail - voting period is over, voteNo', async () => {
            const weiValue = ethers.utils.parseEther('1');
            const proposal = "proposal1";
            convertETHToWETH_Tx = await mockWETH9.connect(addr1).deposit({ value: weiValue });
            approve_Tx = await mockWETH9.connect(addr1).approve(myDAO.address, weiValue);
            mintVotes_Tx = await myDAO.connect(addr1).deposit(weiValue);
            await mintVotes_Tx.wait();
            createProposal_Tx = await myDAO.connect(addr1).createProposal(proposal);
            await createProposal_Tx.wait();
            proposal0 = await myDAO.proposals(0);
            await skiptTime(50);
            await expect(
                myDAO.connect(addr1).vote(proposal0["id"], 1)
            ).to.be.revertedWith(
                'Voting period is over'
            );
            
            
        });


        
        it('PASS - proposal status accepted, voteYes', async () => {
            const weiValue = ethers.utils.parseEther('1');
            const weiValue2 = ethers.utils.parseEther('2');
            const proposal = "proposal1";
            convertETHToWETH_Tx = await mockWETH9.connect(addr1).deposit({ value: weiValue });
            approve_Tx = await mockWETH9.connect(addr1).approve(myDAO.address, weiValue);
            mintVotes_Tx = await myDAO.connect(addr1).deposit(weiValue);
            await mintVotes_Tx.wait();
            createProposal_Tx = await myDAO.connect(addr1).createProposal(proposal);
            await createProposal_Tx.wait();
            convertETHToWETH_Tx = await mockWETH9.connect(addr2).deposit({ value: weiValue });
            approve_Tx = await mockWETH9.connect(addr2).approve(myDAO.address, weiValue);
            mintVotes_Tx = await myDAO.connect(addr2).deposit(weiValue);
            await mintVotes_Tx.wait();
            createVote_Tx1 = await myDAO.connect(addr1).vote(0, 0);
            createVote_Tx2 = await myDAO.connect(addr2).vote(0, 0);
            await createVote_Tx1.wait();
            await createVote_Tx2.wait();
            await skiptTime(50);
            proposal0 = await myDAO.proposals(0);
            expect(proposal0["votesForYes"]).equals(weiValue2);
            expect(proposal0["votesForNo"]).equals(0);
            expect(proposal0["status"]).equals(ACCEPTED);  
        });
        
        it('PASS - proposal status rejected, voteNo', async () => {
            const weiValue = ethers.utils.parseEther('1');
            const weiValue2 = ethers.utils.parseEther('2');
            const proposal = "proposal1";
            convertETHToWETH_Tx = await mockWETH9.connect(addr1).deposit({ value: weiValue });
            approve_Tx = await mockWETH9.connect(addr1).approve(myDAO.address, weiValue);
            mintVotes_Tx = await myDAO.connect(addr1).deposit(weiValue);
            await mintVotes_Tx.wait();
            createProposal_Tx = await myDAO.connect(addr1).createProposal(proposal);
            await createProposal_Tx.wait();
            convertETHToWETH_Tx = await mockWETH9.connect(addr2).deposit({ value: weiValue });
            approve_Tx = await mockWETH9.connect(addr2).approve(myDAO.address, weiValue);
            mintVotes_Tx = await myDAO.connect(addr2).deposit(weiValue);
            await mintVotes_Tx.wait();
            createVote_Tx1 = await myDAO.connect(addr1).vote(0, 1);
            createVote_Tx2 = await myDAO.connect(addr2).vote(0, 1);
            await createVote_Tx1.wait();
            await createVote_Tx2.wait();
            await skiptTime(50);
            proposal0 = await myDAO.proposals(0);
            expect(proposal0["votesForYes"]).equals(0);
            expect(proposal0["votesForNo"]).equals(weiValue2);
            expect(proposal0["status"]).equals(REJECTED);  
        }); 
    });    
});