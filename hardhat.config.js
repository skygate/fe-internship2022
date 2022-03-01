require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");
require('@openzeppelin/hardhat-upgrades');
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
      url: secret.ALCHEMY_ROPSTEN_API_KEY,
      accounts: [secret.ROPSTEN_PRIVATE_KEY]
    },
    rinkeby: {
      url: secret.ALCHEMY_RINKEBY_API_KEY,
      accounts: [secret.RINKEBY_PRIVATE_KEY],
    }
  },
  etherscan: {
    apiKey: secret.ETHERSCAN_API_KEY
  },
  paths: {
    artifacts: "./frontend/src/artifacts"
  }
};
