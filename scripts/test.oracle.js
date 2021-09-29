const { ethers } = require('hardhat');
const { JsonRpcProvider } = require('@ethersproject/providers');
require("dotenv").config()

const env = process.env
const INFURA_PROJECT_ID = env.INFURA_PROJECT_ID
const PRIVATE_KEY = env.PRIVATE_KEY

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

async function getContractAt (address, name, signerOrProvider) {
  const artifact = await ethers.getContractFactory(name);
  return new ethers.Contract(address, artifact.interface, signerOrProvider);
}

async function main() {
  const provider = new JsonRpcProvider(`https://kovan.infura.io/v3/${INFURA_PROJECT_ID}`);
  const signer = new ethers.Wallet(PRIVATE_KEY, provider);

  const claimableTokenAddr = '0x51E8E9Fb1E1CE0be35D249B3E7Ea7281B70e4a0F'
  const claimableToken = await getContractAt(claimableTokenAddr, 'ClaimableToken', signer)

  const oracleAddr = '0x7B8b71D3C6C01e0cE894a61B63FAEd15f56f593d'
  const oracle = await getContractAt(oracleAddr, 'L1Oracle', signer)

  const tokenInfo = await claimableToken.tokenInfos(0)
  console.log(tokenInfo.transactionIndex.toNumber())

  // const transactionProof = {"transaction":{"blockNumber":27391604,"timestamp":1632876392,"gasLimit":11000000,"entrypoint":"0x4200000000000000000000000000000000000005","l1TxOrigin":"0x0000000000000000000000000000000000000000","l1QueueOrigin":0,"data":"0xf8ac83034f0183e4e1c083772c02941a260e95c93ffaaa010f13bb443ee34536c5695e80b844202ee0ed00000000000000000000000000000000000000000000000000000000000043a1000000000000000000000000000000000000000000000000000003c4bbd87b0081ada0c5f4309aaef87ca2ddf77a5e2c6db6ceef72d0dbee102c3173cf0eea974c8144a06c1c78cb9c0d6e66bbe0863282816e37bc5687f3737422a145344d12100e6d37"},"transactionChainElement":{"isSequenced":true,"queueIndex":0,"timestamp":1632876392,"blockNumber":27391604,"txData":"0xf8ac83034f0183e4e1c083772c02941a260e95c93ffaaa010f13bb443ee34536c5695e80b844202ee0ed00000000000000000000000000000000000000000000000000000000000043a1000000000000000000000000000000000000000000000000000003c4bbd87b0081ada0c5f4309aaef87ca2ddf77a5e2c6db6ceef72d0dbee102c3173cf0eea974c8144a06c1c78cb9c0d6e66bbe0863282816e37bc5687f3737422a145344d12100e6d37"},"transactionBatchHeader":{"batchIndex":101663,"batchRoot":"0x11788216e83726caf12787001d07a9c2591d4f86ace3c6246829163d5589a8f3","batchSize":5,"prevTotalElements":1619548,"extraData":"0x"},"transactionProof":{"index":0,"siblings":["0x4c64386a9e77a2dd8b5184bec4c29f2038c72638d4f0075b8bf71a977f6766fb","0x2a0b683cb2c936f5af5653accc0610c6a4cb83f3bab57d017bd724cb49f3c071","0x2bf8def6bf9b54ca2968d1b91ff4cbd582536aa6f32e7b4c6bb22cdc2cb58e4c"]}}

  // const l2TxIndex = 1619548
  // const chainId = 69 // optimistic-kovan
  // const tx = await oracle.processFastWithdrawal(
  //   l2TxIndex,
  //   chainId,
  //   transactionProof.transaction,
  //   transactionProof.transactionChainElement,
  //   transactionProof.transactionBatchHeader,
  //   transactionProof.transactionProof,
  //   { 
  //     gasLimit: 605886
  //   }
  // )
  // const receipt = await tx.wait()
  // console.log(receipt);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
