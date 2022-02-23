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

const skipt_time = async (seconds) => {
    await network.provider.send("evm_increaseTime", [seconds])
    await network.provider.send("evm_mine")
}

module.exports = { getGasUsedForLastTx, skipt_time  };