import { task } from "hardhat/config";
import { TaskArguments, HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployment } from "hardhat-deploy/dist/types";

task("l1-contracts", "Prints layer 1 contract's address").setAction(
  async (taskArgs: TaskArguments, hre: HardhatRuntimeEnvironment, runSuper) => {
    const { deployments } = hre;

    const L1Auction: Deployment = await deployments.get("L1Auction");
    const L1ClaimableToken: Deployment = await deployments.get(
      "L1ClaimableToken"
    );
    const L1Oracle: Deployment = await deployments.get("L1Oracle");
    const L1Token: Deployment = await deployments.get("L1Token");

    console.log("L1Auction: %s", L1Auction.address);
    console.log("L1ClaimableToken: %s", L1ClaimableToken.address);
    console.log("L1Oracle: %s", L1Oracle.address);
    console.log("L1Token: %s", L1Token.address);
  }
);