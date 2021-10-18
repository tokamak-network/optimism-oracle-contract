/* eslint-disable node/no-unpublished-import */
import { run } from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction, DeployResult } from "hardhat-deploy/dist/types";

/* eslint-disable camelcase */
const OVM_L2StandardBridge = "0x4200000000000000000000000000000000000010";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy, execute } = deployments;
  const { deployer, user } = await getNamedAccounts();

  // l1
  const L1Token = await hre.companionNetworks.l1.deployments.get("L1Token");
  const L1Oracle = await hre.companionNetworks.l1.deployments.get("L1Oracle");

  // deploy
  const L2Token: DeployResult = await deploy("L2Token", {
    from: user,
    args: [
      L1Token.address,
      OVM_L2StandardBridge,
      "L2 Tokamak Network Token",
      "L2TON",
    ],
    log: true,
  });
  const L2BridgeWrapper: DeployResult = await deploy("L2BridgeWrapper", {
    from: user,
    args: [],
    log: true,
  });

  // execute
  await execute(
    "L2BridgeWrapper",
    { from: user, log: true },
    "initialize",
    OVM_L2StandardBridge,
    L1Oracle.address
  );

  // for development
  await execute(
    "L2Token",
    { from: deployer, log: true },
    "approve",
    L2BridgeWrapper.address,
    "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
  );
  await execute(
    "L2Token",
    { from: user, log: true },
    "approve",
    L2BridgeWrapper.address,
    "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
  );

  // etherscan verify
  await run("verify:verify", {
    address: L2Token.address,
    constructorArguments: [
      L1Token.address,
      OVM_L2StandardBridge,
      "L2 Tokamak Network Token",
      "L2TON",
    ],
  });
  await run("verify:verify", {
    address: L2BridgeWrapper.address,
    constructorArguments: [],
  });
};

export default func;
func.tags = ["l2"];
func.dependencies = ["l1"];
