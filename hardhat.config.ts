import * as dotenv from "dotenv";

import { HardhatUserConfig, task } from "hardhat/config";

import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@eth-optimism/hardhat-ovm";
import "@typechain/hardhat";
import "hardhat-deploy";
import "hardhat-gas-reporter";
import "solidity-coverage";

dotenv.config();
const env = process.env;

const INFURA_PROJECT_ID = env.INFURA_PROJECT_ID;
const ALCHEMY_KEY = env.ALCHEMY_KEY;
const ETHERSCAN_API_KEY = env.ETHERSCAN_API_KEY;

const PRIVATE_KEY_DEPLOYER = env.PRIVATE_KEY_DEPLOYER;
const PRIVATE_KEY_USER = env.PRIVATE_KEY_USER;

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  solidity: "0.7.6",
  ovm: {
    solcVersion: "0.7.6",
  },
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
      url: `https://kovan.infura.io/v3/${INFURA_PROJECT_ID}`,
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
      ovm: true,
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
};

export default config;
