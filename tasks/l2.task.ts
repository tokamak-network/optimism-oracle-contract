import { task } from "hardhat/config";
import { TaskArguments, HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployment } from "hardhat-deploy/dist/types";
import { L2Token } from "../typechain/L2Token.d";

task("l2-contracts", "Prints layer 2 contract's address").setAction(
  async (taskArgs: TaskArguments, hre: HardhatRuntimeEnvironment, runSuper) => {
    const { deployments } = hre;

    const L2BridgeWrapper: Deployment = await deployments.get(
      "L2BridgeWrapper"
    );
    const L2Token: Deployment = await deployments.get("L2Token");

    console.log("L2BridgeWrapper: %s", L2BridgeWrapper.address);
    console.log("L2Token: %s", L2Token.address);
  }
);

task("tokens", "Prints L1 token's address").setAction(
  async (taskArgs: TaskArguments, hre: HardhatRuntimeEnvironment, runSuper) => {
    const { getNamedAccounts, ethers, deployments } = hre;
    const { deployer } = await getNamedAccounts();

    const deployment: Deployment = await deployments.get("L2Token");
    const contract = (await ethers.getContractAt(
      deployment.abi,
      deployment.address
    )) as L2Token;
    const l1Token = await contract.connect(deployer).l1Token();

    console.log("L1Token: %s", l1Token);
    console.log("L2Token: %s", contract.address);
  }
);