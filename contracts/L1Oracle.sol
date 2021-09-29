pragma solidity >=0.7.6;
pragma abicoder v2;

import { Lib_OVMCodec } from "./libraries/codec/Lib_OVMCodec.sol";
import { Lib_EIP155Tx } from "./libraries/codec/Lib_EIP155Tx.sol";
import { Lib_BytesUtils } from "./libraries/utils/Lib_BytesUtils.sol";
import { iOVM_CanonicalTransactionChain } from "./iOVM/chain/iOVM_CanonicalTransactionChain.sol";
import { ClaimableToken } from "./ClaimableToken.sol";

import { SafeMath } from "@openzeppelin/contracts/math/SafeMath.sol";

contract L1Oracle {
    using SafeMath for uint;

    iOVM_CanonicalTransactionChain public ctc;
    ClaimableToken public claimableToken;
    
    uint256 public tokenId;
    bytes internal testSelector = "0x202ee0ed"; // submit(uint256,int256)

    constructor (address _ctc, address _cToken) public {
        ctc = iOVM_CanonicalTransactionChain(_ctc);
        claimableToken = ClaimableToken(_cToken);
    }

    function processFastWithdrawal (
        uint256 l2TxIndex,
        uint256 chainId,
        Lib_OVMCodec.Transaction memory _transaction,
        Lib_OVMCodec.TransactionChainElement memory _txChainElement,
        Lib_OVMCodec.ChainBatchHeader memory _batchHeader,
        Lib_OVMCodec.ChainInclusionProof memory _inclusionProof
    ) external returns (bool) {
        uint256 prevTotalElements = _batchHeader.prevTotalElements;
        uint256 index = _inclusionProof.index;

        require(
            l2TxIndex == prevTotalElements.add(index),
            "INVALID_INDEX"
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
        //     keccak256(testSelector) == keccak256(selector), "INVALID_SELECTOR"
        // );
        bytes memory args = Lib_BytesUtils.slice(data, 4);

        // submit(round uint256,submission int256)
        (uint256 amount, uint256 fee) = abi.decode(
            args,
            (uint256,uint256)
        );

        claimableToken.mint(
            tokenId,
            prevTotalElements.add(index), // CompilerError: Stack too deep, try removing local variables.
            amount,
            fee
        );

        tokenId++;

        return true;
    }

    function testTransaction(
        Lib_OVMCodec.Transaction memory _transaction
    )
        public
        view
        returns (bool)
    {
        return _transaction.timestamp > 0;
    }

    function testTransactionChainElement(
        Lib_OVMCodec.TransactionChainElement memory _txChainElement
    )
        public
        view
        returns (bool)
    {
        return _txChainElement.queueIndex > 0;
    }

    function testChainBatchHeader(
        Lib_OVMCodec.ChainBatchHeader memory _batchHeader
    )
        public
        view
        returns (bool)
    {
        return _batchHeader.batchIndex > 0;
    }

    function testChainInclusionProof(
        Lib_OVMCodec.ChainInclusionProof memory _inclusionProof
    )
        public
        view
        returns (bool)
    {
        return _inclusionProof.index > 0;
    }

    function verifyTransactionInclusion(
        Lib_OVMCodec.Transaction memory _transaction,
        Lib_OVMCodec.TransactionChainElement memory _txChainElement,
        Lib_OVMCodec.ChainBatchHeader memory _batchHeader,
        Lib_OVMCodec.ChainInclusionProof memory _inclusionProof
    )
        public
        view
        returns (bool)
    {
        return ctc.verifyTransaction(
            _transaction,
            _txChainElement,
            _batchHeader,
            _inclusionProof
        );
    }

    function verifyTransactionIndex(
        uint256 index,
        Lib_OVMCodec.ChainBatchHeader calldata _batchHeader,
        Lib_OVMCodec.ChainInclusionProof calldata _inclusionProof
    )
        public
        view
        returns (bool)
    {
        uint256 prevTotalElements = _batchHeader.prevTotalElements;
        uint256 proofIndex = _inclusionProof.index;

        return (index == prevTotalElements.add(proofIndex));
    }

    // function verifyTransactionData(
    //     Lib_OVMCodec.Transaction calldata _transaction
    // )
    //     public
    //     view
    //     returns (bool)
    // {
    //     // TODO: use calldata slicing
    // }
    
    // TODO: prev state, next state -> inclusion proof
    // function challenge (
    //     bytes32 _preStateRoot,
    //     bytes32 _stateRoot,
    //     Lib_OVMCodec.ChainBatchHeader memory _preStateRootBatchHeader,
    //     Lib_OVMCodec.ChainInclusionProof memory _preStateRootProof,
    //     Lib_OVMCodec.ChainBatchHeader memory _stateRootBatchHeader,
    //     Lib_OVMCodec.ChainInclusionProof memory _stateRootProof
    // )
    //     public
    //     view
    //     returns (bool)
    // {
    //     fToken.index

    //     uint256 prevTotalElements1 = _preStateRootBatchHeader.prevTotalElements;
    //     uint256 prevIndex1 = _preStateRootProof.index;
    //     require(
    //         index == prevTotalElements1.add(prevIndex1),
    //         ""
    //     );

    //     uint256 prevTotalElements2 = _stateRootBatchHeader.prevTotalElements;
    //     uint256 prevIndex2 = _stateRootProof.index;
    //     require(
    //         index.add(1) == prevTotalElements2.add(prevIndex2),
    //         ""
    //     );
    // }

}