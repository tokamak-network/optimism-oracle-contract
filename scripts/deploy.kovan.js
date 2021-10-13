const { ethers } = require('hardhat');
const { JsonRpcProvider } = require('@ethersproject/providers');
require("dotenv").config()

const env = process.env
const INFURA_PROJECT_ID = env.INFURA_PROJECT_ID
const PRIVATE_KEY = env.PRIVATE_KEY

let L1Token = env.L1_TOKEN
let L1ClaimableToken = env.L1_CLAIMABLE_TOKEN
let L1Oracle = env.L1_ORACLE
let L1Auction = env.L1_AUCTION

async function deploy (deployer, contract, txOpts) {
  const deployedContract = await deployContract(deployer, await ethers.getContractFactory(contract), txOpts);
  console.log(`${contract}:`, deployedContract.address);

  return deployedContract;
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

async function main() {
  const provider = new JsonRpcProvider(`https://kovan.infura.io/v3/${INFURA_PROJECT_ID}`);
  const deployer = new ethers.Wallet(PRIVATE_KEY, provider);

  const CanonicalTransactionChain = '0xe28c499EB8c36C0C18d1bdCdC47a51585698cb93';

  L1Token ?
  console.log(`L1Token has already been deployed: ${L1Token}`) :
  L1Token = await deploy(deployer, 'L1Token', ['L1 Tokamak Network Token', 'L1TON'])

  L1ClaimableToken ?
  console.log(`L1ClaimableToken has already been deployed: ${L1ClaimableToken}`) :
  L1ClaimableToken = await deploy(deployer, 'L1ClaimableToken', ['L1 Claimable Token', 'L1CTOKEN'])

  L1Oracle ?
  console.log(`L1Oracle has already been deployed: ${L1Oracle}`) :
  L1Oracle = await deploy(deployer, 'L1Oracle', [CanonicalTransactionChain, !L1ClaimableToken.address ? L1ClaimableToken : L1ClaimableToken.address])

  L1Auction ?
  console.log(`L1Auction has already been deployed: ${L1Auction}`) :
  L1Auction = await deploy(deployer, 'L1Auction', [
    !L1ClaimableToken.address ? L1ClaimableToken : L1ClaimableToken.address,
    !L1Oracle.address ? L1Oracle : L1Oracle.address,
  ])
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
