require("@nomiclabs/hardhat-waffle")
require("@eth-optimism/hardhat-ovm")
require("dotenv").config()

const env = process.env
const INFURA_PROJECT_ID = env.INFURA_PROJECT_ID
const PRIVATE_KEY = env.PRIVATE_KEY

module.exports = {
  solidity: '0.7.6',
  ovm: {
    solcVersion: '0.7.6+commit.3b061308',
  },
  networks: {
    "mainnet": {
      url: `https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`,
      accounts: [`0x${PRIVATE_KEY}`],
    },
    "kovan": {
      url: `https://kovan.infura.io/v3/${INFURA_PROJECT_ID}`,
      accounts: [`0x${PRIVATE_KEY}`],
    },
    "optimistic-mainnet": {
      url: "https://mainnet.optimism.io",
      accounts: [`0x${PRIVATE_KEY}`],
      ovm: true,
    },
    "optimistic-kovan": {
      url: "https://kovan.optimism.io",
      accounts: [`0x${PRIVATE_KEY}`],
      ovm: true,
    },
  }
};
