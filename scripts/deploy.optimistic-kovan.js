const { artifacts, ethers } = require('hardhat');
const { JsonRpcProvider } = require('@ethersproject/providers');
const { join } = require('path');
const { readFileSync } = require('fs');
require("dotenv").config()

const env = process.env
const PRIVATE_KEY = env.PRIVATE_KEY

let L2Token = env.L2_TOKEN
let L2BridgeWrapper = env.L2_BRIDGE_WRAPPER

async function deploy (deployer, contract, txOpts) {
  const deployedContract = await deployContract(deployer, await getL2ContractFactory(contract), txOpts);
  console.log(`${contract}:`, deployedContract.address);

  return deployedContract;
}

async function getL2ContractFactory (contract) {
  const l1ArtifactPaths = await artifacts.getArtifactPaths();
  const desiredArtifacts = l1ArtifactPaths.filter((a) => a.endsWith(`/${contract}.json`));
  if (desiredArtifacts.length !== 1) {
    console.error('Couldn\'t find desired artifact or found too many');
  }

  const l1ArtifactPath = desiredArtifacts[0];
  const artifactRootPath = join(__dirname, '../artifacts');
  const artifactOvmRootPath = join(__dirname, '../artifacts-ovm');
  const l2ArtifactPath = l1ArtifactPath.replace(artifactRootPath, artifactOvmRootPath);

  const artifact = JSON.parse(readFileSync(l2ArtifactPath, 'utf-8'));

  return new ethers.ContractFactory(artifact.abi, artifact.bytecode);
}

async function deployContract(
  signer,
  artifact,
  args,
) {
  const contractFactory = new ethers.ContractFactory(artifact.interface, artifact.bytecode, signer);
  const contract = await contractFactory.deploy(...args);

  await contract.deployed();

  return contract;
}

const l2TxOpts = {
  gasLimit: 500010,
}

async function main() {
  const provider = new JsonRpcProvider('https://kovan.optimism.io');
  const deployer = new ethers.Wallet(PRIVATE_KEY, provider);

  const L2Bridge = '0x4200000000000000000000000000000000000010'
  const L1Oracle = '0x0Cc14671122b22cAD4a02762a39FBe471F4CB81A'

  L2Token ?
  console.log(`L2Token has already been deployed: ${L2Token}`) :
  await deploy(deployer, 'L2Token', [
    '0x4200000000000000000000000000000000000010',
    '0x2f0E2eE646434EadfB655DB026e56E7a71B89B99',
    'L2 Tokamak Network Token',
    'L2TON',
  ]);

  L2BridgeWrapper ?
  console.log(`L2BridgeWrapper has already been deployed: ${L2BridgeWrapper}`) :
  L2BridgeWrapper = await deploy(deployer, 'L2BridgeWrapper', []);

  await L2BridgeWrapper.initialize(L2Bridge, L1Oracle, l2TxOpts);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
