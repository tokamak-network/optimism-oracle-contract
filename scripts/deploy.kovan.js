const { ethers } = require('hardhat');
const { JsonRpcProvider } = require('@ethersproject/providers');
require("dotenv").config()

const env = process.env
const INFURA_PROJECT_ID = env.INFURA_PROJECT_ID
const PRIVATE_KEY = env.PRIVATE_KEY

async function deploy (deployer, contract, txOpts) {
  const deployedContract = await deployContract(deployer, await ethers.getContractFactory(contract), [txOpts]);
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

  const claimableToken = await deploy(deployer, 'ClaimableToken', ["Claimable Token", "CTK"]);

  const ctc = "0xe28c499EB8c36C0C18d1bdCdC47a51585698cb93"
  const oracle = await deploy(deployer, 'L1Oracle', [ctc, claimableToken.address]);

  await claimableToken.transferOwnership(oracle.address, { gasLimit: 600000 });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
