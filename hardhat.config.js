require("@nomiclabs/hardhat-waffle")
require("@nomiclabs/hardhat-etherscan")
require("@eth-optimism/hardhat-ovm")
require("dotenv").config()

const env = process.env
const INFURA_PROJECT_ID = env.INFURA_PROJECT_ID
const ALCHEMY_KEY = env.ALCHEMY_KEY
const PRIVATE_KEY = env.PRIVATE_KEY
const ETHERSCAN_API_KEY = env.ETHERSCAN_API_KEY

module.exports = {
  solidity: '0.7.6',
  ovm: {
    solcVersion: '0.7.6',
  },
  networks: {
    "hardhat": {
      "forking": {
        // "url": `https://eth-kovan.alchemyapi.io/v2/${ALCHEMY_KEY}`,
        // "blockNumber": 27391022,
        "url": `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_KEY}`,
        "blockNumber": 13318263
      },
    },
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
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY
  }
};
