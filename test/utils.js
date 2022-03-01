const { ethers } = require('hardhat')
 
const getGasUsedForLastTx = async () => {
    const lastBlock = await ethers.provider.send(
        "eth_getBlockByNumber",
        ["latest", false]
    );

    const txHashAfter = await ethers.provider.send(
        "eth_getTransactionByHash",
        [lastBlock.transactions[0]]
    );
    return BigInt(parseInt(lastBlock.gasUsed) * parseInt(txHashAfter.gasPrice));
}

const calculatePercentageInWei = async (amount, percentageInWei) => {
    const percentage100 = 100000;
    return BigInt(amount * percentageInWei / percentage100);
}

module.exports = { getGasUsedForLastTx, calculatePercentageInWei };