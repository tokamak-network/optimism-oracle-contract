const { ethers } = require("hardhat");

// https://kovan-optimistic.etherscan.io/tx/1585591

describe("L1EIP155TxDecoder", function () {
  const encodedTx = "0xf8ab82678283e4e1c08401564162948ce8c13d816fe6daf12d6fd9e4952e1fc88850af80b844202ee0ed00000000000000000000000000000000000000000000000000000000000021bd000000000000000000000000000000000000000000000000000000008725c2fe38a06f50afd6ee443eb89092077abdbba326a3049de895b40afbb676f08bcaec1e35a0261c8ab2797f2fcb469d77243dbd3af3a3f3928a7c6021e85064e33ea79626f3"
  const chainId = "10"

  it("should decode encoded eip-155 transaction", async function () {
    const L1EIP155TxDecoder = await ethers.getContractFactory("L1EIP155TxDecoder");
    const l1EIP155TxDecoder = await L1EIP155TxDecoder.deploy();
    await l1EIP155TxDecoder.deployed();

    const decodedTx = await l1EIP155TxDecoder.decodeEIP155Tx(encodedTx, chainId);

    console.log(decodedTx);
  });

  it("should decode encoded eip-155 transaction data selector", async function () {
    const L1EIP155TxDecoder = await ethers.getContractFactory("L1EIP155TxDecoder");
    const l1EIP155TxDecoder = await L1EIP155TxDecoder.deploy();
    await l1EIP155TxDecoder.deployed();

    const decodedTxData = await l1EIP155TxDecoder.decodeEIP155TxData(encodedTx, chainId);

    console.log(decodedTxData);
  });

  it("should decode encoded eip-155 transaction data args", async function () {
    const L1EIP155TxDecoder = await ethers.getContractFactory("L1EIP155TxDecoder");
    const l1EIP155TxDecoder = await L1EIP155TxDecoder.deploy();
    await l1EIP155TxDecoder.deployed();

    const decodedTxArgs = await l1EIP155TxDecoder.decodeEIP155TxArgs(encodedTx, chainId);

    console.log(decodedTxArgs);
  });

  it("should decode encoded eip-155 transaction data args decoded", async function () {
    const L1EIP155TxDecoder = await ethers.getContractFactory("L1EIP155TxDecoder");
    const l1EIP155TxDecoder = await L1EIP155TxDecoder.deploy();
    await l1EIP155TxDecoder.deployed();

    const decodedTxArgsDecoded = await l1EIP155TxDecoder.decodeEIP155TxArgsDecoded(encodedTx, chainId);

    console.log(decodedTxArgsDecoded);
  });
});

