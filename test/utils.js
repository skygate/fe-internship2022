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

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = { getGasUsedForLastTx, sleep  };