require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");
require('@openzeppelin/hardhat-upgrades');
require("axios");
require('recursive-fs');
let secret = require("./secret")

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

module.exports = {
  solidity: {
    compilers: [{ version: "0.6.6" },
    { version: "0.8.4" }]
  },
  networks: {
    ropsten: {
      url: `https://eth-ropsten.alchemyapi.io/v2/${secret.ALCHEMY_ROPSTEN_API_KEY}`,
      accounts: [secret.ROPSTEN_PRIVATE_KEY],
      chainID: 3,
    },
    rinkeby: {
      url: `https://eth-rinkeby.alchemyapi.io/v2/${secret.ALCHEMY_RINKEBY_API_KEY}`,
      accounts: [secret.RINKEBY_PRIVATE_KEY],
      chainID: 4,
    },
    mainnet: {
      url: `https://eth-mainnet.alchemyapi.io/v2/${secret.ALCHEMY_MAINNET_API_KEY}`,
      accounts: [secret.MAINNET_PRIVATE_KEY],
      chainID: 1,
    },
    polygon: {
      url: `https://polygon-mainnet.g.alchemy.com/v2/${secret.ALCHEMY_POLYGON_API_KEY}`,
      accounts: [secret.POLYGON_PRIVATE_KEY],
      chainID: 137,
    },
    mumbai: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/${secret.ALCHEMY_MUMBAI_API_KEY}`,
      accounts: [secret.MUMBAI_PRIVATE_KEY],
      chainID: 80001,
    },
    bscMainnet: {
      url: "https://bsc-dataseed.binance.org/",
      accounts: [secret.BSCMAINET_PRIVATE_KEY],
      chainId: 56,
    },
    bscTestnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545/",
      accounts: [secret.BSCTEST_PRIVATE_KEY],
      chainId: 97,
    }
  },
  etherscan: {
    apiKey: secret.ETHERSCAN_API_KEY
  },
  pinata: {
    pinataApiKey: secret.PINATA_API_KEY,
    pinataApiSecret: secret.PINATA_API_SECRET
  },
  paths: {
    artifacts: "./frontend/src/artifacts"
  }
};
