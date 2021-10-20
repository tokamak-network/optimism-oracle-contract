import * as dotenv from "dotenv";

import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-deploy";
import "hardhat-gas-reporter";
import "solidity-coverage";

import { HardhatUserConfig } from "hardhat/config";

import "./tasks/l1.task";
import "./tasks/l2.task";

dotenv.config();
const env = process.env;

const ALCHEMY_KEY = env.ALCHEMY_KEY;
const ETHERSCAN_API_KEY = env.ETHERSCAN_API_KEY;

const PRIVATE_KEY_DEPLOYER = env.PRIVATE_KEY_DEPLOYER;
const PRIVATE_KEY_USER = env.PRIVATE_KEY_USER;

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  solidity: "0.7.6",
  namedAccounts: {
    deployer: 0,
    user: 1,
  },
  networks: {
    hardhat: {
      forking: {
        url: `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_KEY}`,
        blockNumber: 13318263,
      },
    },
    kovan: {
      url: `https://eth-kovan.alchemyapi.io/v2/${ALCHEMY_KEY}`,
      accounts: [`0x${PRIVATE_KEY_DEPLOYER}`, `0x${PRIVATE_KEY_USER}`],
      deploy: ["deploy/l1"],
    },
    "kovan-optimistic": {
      url: "https://kovan.optimism.io",
      accounts: [`0x${PRIVATE_KEY_DEPLOYER}`, `0x${PRIVATE_KEY_USER}`],
      deploy: ["deploy/l2"],
      companionNetworks: {
        l1: "kovan",
      },
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
};

export default config;
