const { ethers } = require("hardhat");

const l2TxIndex = 1619548
const transactionProof = {"transaction":{"blockNumber":27391604,"timestamp":1632876392,"gasLimit":11000000,"entrypoint":"0x4200000000000000000000000000000000000005","l1TxOrigin":"0x0000000000000000000000000000000000000000","l1QueueOrigin":0,"data":"0xf8ac83034f0183e4e1c083772c02941a260e95c93ffaaa010f13bb443ee34536c5695e80b844202ee0ed00000000000000000000000000000000000000000000000000000000000043a1000000000000000000000000000000000000000000000000000003c4bbd87b0081ada0c5f4309aaef87ca2ddf77a5e2c6db6ceef72d0dbee102c3173cf0eea974c8144a06c1c78cb9c0d6e66bbe0863282816e37bc5687f3737422a145344d12100e6d37"},"transactionChainElement":{"isSequenced":true,"queueIndex":0,"timestamp":1632876392,"blockNumber":27391604,"txData":"0xf8ac83034f0183e4e1c083772c02941a260e95c93ffaaa010f13bb443ee34536c5695e80b844202ee0ed00000000000000000000000000000000000000000000000000000000000043a1000000000000000000000000000000000000000000000000000003c4bbd87b0081ada0c5f4309aaef87ca2ddf77a5e2c6db6ceef72d0dbee102c3173cf0eea974c8144a06c1c78cb9c0d6e66bbe0863282816e37bc5687f3737422a145344d12100e6d37"},"transactionBatchHeader":{"batchIndex":101663,"batchRoot":"0x11788216e83726caf12787001d07a9c2591d4f86ace3c6246829163d5589a8f3","batchSize":5,"prevTotalElements":1619548,"extraData":"0x"},"transactionProof":{"index":0,"siblings":["0x4c64386a9e77a2dd8b5184bec4c29f2038c72638d4f0075b8bf71a977f6766fb","0x2a0b683cb2c936f5af5653accc0610c6a4cb83f3bab57d017bd724cb49f3c071","0x2bf8def6bf9b54ca2968d1b91ff4cbd582536aa6f32e7b4c6bb22cdc2cb58e4c"]}}
const chainId = 69 // optimistic-kovan

// https://github.com/ethereum-optimism/optimism/tree/develop/packages/contracts/deployments#kovan
// https://kovan-optimistic.etherscan.io/txs?batch=101660
// https://kovan-optimistic.etherscan.io/tx/1619528
describe("L1Oracle", function () {
  let ctc;
  let signer;
  
  let claimableToken;
  let oracle;

  before(async () => {
    signer = await ethers.getSigner()

    const CTC = await ethers.getContractFactory("OVM_CanonicalTransactionChain")
    ctc = new ethers.Contract("0xe28c499EB8c36C0C18d1bdCdC47a51585698cb93", CTC.interface, signer)

    const ClaimableToken = await ethers.getContractFactory("ClaimableToken");
    claimableToken = await ClaimableToken.deploy("Claimable Token", "CLT");
    await claimableToken.deployed();

    const Oracle = await ethers.getContractFactory("L1Oracle");
    oracle = await Oracle.deploy(ctc.address, claimableToken.address);
    await oracle.deployed();

    await claimableToken.transferOwnership(oracle.address);
  })

  it("should mint claimable token", async function () {
    const fw = await ctc.verifyTransaction(
      transactionProof.transaction,
      transactionProof.transactionChainElement,
      transactionProof.transactionBatchHeader,
      transactionProof.transactionProof,
    )

    // const fw = await oracle.processFastWithdrawal(
    //   l2TxIndex,
    //   chainId,
    //   transactionProof.transaction,
    //   transactionProof.transactionChainElement,
    //   transactionProof.transactionBatchHeader,
    //   transactionProof.transactionProof,
    // )

    console.log(fw);
  });
});
