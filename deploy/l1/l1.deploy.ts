/* eslint-disable node/no-unpublished-import */
import { run } from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction, DeployResult } from "hardhat-deploy/dist/types";

/* eslint-disable camelcase */
const OVM_L1StandardBridge = "0x22F24361D548e5FaAfb36d1437839f080363982B";
const OVM_CanonicalTransactionChain =
  "0xe28c499EB8c36C0C18d1bdCdC47a51585698cb93";
const OVM_StateCommitmentChain = "0xa2487713665AC596b0b3E4881417f276834473d2";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy, execute } = deployments;
  const { deployer, user } = await getNamedAccounts();

  // deploy
  const L1Token: DeployResult = await deploy("L1Token", {
    from: deployer,
    args: ["L1 Tokamak Network Token", "L1TON"],
    log: true,
  });
  const L1ClaimableToken: DeployResult = await deploy("L1ClaimableToken", {
    from: deployer,
    args: ["L1 Claimable Token", "L1CTOKEN"],
    log: true,
  });
  const L1Oracle: DeployResult = await deploy("L1Oracle", {
    from: deployer,
    args: [
      OVM_CanonicalTransactionChain,
      OVM_StateCommitmentChain,
      L1ClaimableToken.address,
    ],
    log: true,
  });
  const L1Auction: DeployResult = await deploy("L1Auction", {
    from: deployer,
    args: [L1ClaimableToken.address, L1Oracle.address],
    log: true,
  });

  // execute
  await execute(
    "L1ClaimableToken",
    { from: deployer, log: true },
    "transferOwnership",
    L1Oracle.address
  );
  await execute(
    "L1Oracle",
    { from: deployer, log: true },
    "setApprovalForAll",
    L1Auction.address,
    true
  );

  // for development
  await execute(
    "L1Token",
    { from: deployer, log: true },
    "approve",
    OVM_L1StandardBridge,
    "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
  );
  await execute(
    "L1Token",
    { from: user, log: true },
    "approve",
    L1Auction.address,
    "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
  );

  // etherscan verify
  await run("verify:verify", {
    address: L1Token.address,
    constructorArguments: ["L1 Tokamak Network Token", "L1TON"],
  });
  await run("verify:verify", {
    address: L1ClaimableToken.address,
    constructorArguments: ["L1 Claimable Token", "L1CTOKEN"],
  });
  await run("verify:verify", {
    address: L1Oracle.address,
    constructorArguments: [
      OVM_CanonicalTransactionChain,
      OVM_StateCommitmentChain,
      L1ClaimableToken.address,
    ],
  });
  await run("verify:verify", {
    address: L1Auction.address,
    constructorArguments: [L1ClaimableToken.address, L1Oracle.address],
  });
};

export default func;
func.tags = ["l1"];
