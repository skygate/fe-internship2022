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

// https://github.com/BlockTheChainz/airdrop-merkle/blob/main/index.html
const hexStringToUint8Array = (hexString) => {
    if (hexString.length % 2 !== 0) {
        throw "Invalid hexString";
    } /*from  w w w.  j  av a 2s  . c  o  m*/
    var arrayBuffer = new Uint8Array(hexString.length / 2);

    for (var i = 0; i < hexString.length; i += 2) {
        var byteValue = parseInt(hexString.substr(i, 2), 16);
        if (isNaN(byteValue)) {
            throw "Invalid hexString";
        }
        arrayBuffer[i / 2] = byteValue;
    }
    return arrayBuffer;
};

const hashToken = (tokenId, account) => {
    const leaf = ethers.utils
        .solidityKeccak256(["uint256", "address"], [tokenId, account])
        .slice(2);
    // console.log(hexStringToUint8Array(leaf));
    return hexStringToUint8Array(leaf);
};
module.exports = {
    getGasUsedForLastTx,
    getTimeStampForLastTx,
    skiptTime,
    getEventLastTx,
    calculatePercentageInWei,
    hashToken,
};
