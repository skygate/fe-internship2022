const { ethers } = require("hardhat");

const getGasUsedForLastTx = async () => {
    const lastBlock = await ethers.provider.send("eth_getBlockByNumber", ["latest", false]);

    const txHashAfter = await ethers.provider.send("eth_getTransactionByHash", [
        lastBlock.transactions[0],
    ]);
    return BigInt(parseInt(lastBlock.gasUsed) * parseInt(txHashAfter.gasPrice));
};

const getTimeStampForLastTx = async () => {
    const blockNumBefore = await ethers.provider.getBlockNumber();
    const blockBefore = await ethers.provider.getBlock(blockNumBefore);
    return blockBefore.timestamp;
};

const skiptTime = async (seconds) => {
    network.provider.send("evm_increaseTime", [seconds]);
    network.provider.send("evm_mine");
};

const getEventLastTx = async (receipt, eventName) => {
    const event = receipt.events.find((event) => event.event === eventName);
    return event.args;
};

const calculatePercentageInWei = async (amount, percentageInWei) => {
    const percentage100 = 100000;
    return BigInt((amount * percentageInWei) / percentage100);
};
module.exports = {
    getGasUsedForLastTx,
    getTimeStampForLastTx,
    skiptTime,
    getEventLastTx,
    calculatePercentageInWei,
};
