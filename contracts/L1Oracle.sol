// SPDX-License-Identifier: MIT
// @unsupported: ovm

pragma solidity >=0.7.6;
pragma abicoder v2;

import { Lib_OVMCodec } from "./optimism/libraries/codec/Lib_OVMCodec.sol";
import { Lib_EIP155Tx } from "./optimism/libraries/codec/Lib_EIP155Tx.sol";
import { Lib_BytesUtils } from "./optimism/libraries/utils/Lib_BytesUtils.sol";
import { iOVM_CanonicalTransactionChain } from "./optimism/iOVM/chain/iOVM_CanonicalTransactionChain.sol";
import { L1ClaimableToken } from "./L1ClaimableToken.sol";

import { SafeMath } from "@openzeppelin/contracts/math/SafeMath.sol";

contract L1Oracle {
    using SafeMath for uint;

    iOVM_CanonicalTransactionChain public ctc;
    L1ClaimableToken public claimableToken;

    uint256 public tokenId;
    bytes internal FASTWITHDRAW_SELECTOR = "0x7090fd90"; // fastWithdraw(address,address,address,address,uint256,uint256,uint32,bytes)

    mapping(uint256 => bool) public minted; // l2Txindex => minted

    constructor (address _ctc, address _cToken) public {
        ctc = iOVM_CanonicalTransactionChain(_ctc);
        claimableToken = L1ClaimableToken(_cToken);
    }

    function processFastWithdrawal (
        uint256 l2TxIndex,
        uint256 chainId,
        Lib_OVMCodec.Transaction memory _transaction,
        Lib_OVMCodec.TransactionChainElement memory _txChainElement,
        Lib_OVMCodec.ChainBatchHeader memory _batchHeader,
        Lib_OVMCodec.ChainInclusionProof memory _inclusionProof
    )
        external
    {
        uint256 prevTotalElements = _batchHeader.prevTotalElements; // 100
        uint256 index = _inclusionProof.index; // 10

        uint256 txIndex = prevTotalElements.add(index); // CompilerError: Stack too deep, try removing local variables.
        require(
            l2TxIndex == txIndex,
            "INVALID_INDEX"
        );
        require(
            !minted[txIndex],
            "ALREADY_MINTED"
        );

        require(
            ctc.verifyTransaction(
                _transaction,
                _txChainElement,
                _batchHeader,
                _inclusionProof
            ),
            "INVALID_PROOF"
        );

        bytes memory encodedTx = _transaction.data;
        Lib_EIP155Tx.EIP155Tx memory decodedTx = Lib_EIP155Tx.decode(
            encodedTx,
            chainId
        );

        bytes memory data = decodedTx.data;
        bytes memory selector = Lib_BytesUtils.slice(data, 0, 4);
        // require(
        //     keccak256(FASTWITHDRAW_SELECTOR) == keccak256(selector),
        //     "INVALID_SELECTOR"
        // );

        bytes memory args = Lib_BytesUtils.slice(data, 4);
        (address _l1Token, address _l2Token, uint256 _amount, uint256 _fee) = getTokenInfo(args);

        claimableToken.mint(
            tokenId,
            txIndex,
            _l1Token,
            _l2Token,
            _amount,
            _fee
        );
        minted[txIndex] = true;

        tokenId++;
    }

    function setApprovalForAll (address operator, bool approved) public {
        claimableToken.setApprovalForAll(operator, approved);
    }

    // CompilerError: Stack too deep, try removing local variables.
    function getTokenInfo(bytes memory args) internal returns (address, address, uint256, uint256) {
        (
          address _origin,
          address _l1Token,
          address _l2Token,
          address _to,
          uint256 _amount,
          uint256 _fee,
          uint32 _l1Gas,
          bytes memory _data
        ) = abi.decode(
            args,
            (address, address, address, address, uint256, uint256, uint32, bytes)
        );

        return (_l1Token, _l2Token, _amount, _fee);
    }
}