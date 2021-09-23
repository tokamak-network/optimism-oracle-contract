pragma solidity >=0.7.6;
pragma abicoder v2;

import { Lib_EIP155Tx } from "./codec/Lib_EIP155Tx.sol";

contract L1EIP155TxDecoder {
    function decodeEIP155Tx (
        bytes memory encodedEIP155Tx,
        uint256 chainId
    )
        external
        view
        returns (
            Lib_EIP155Tx.EIP155Tx memory decodedEIP155Tx
        )
    {
        // Decode the tx with the correct chain ID.
        decodedEIP155Tx = Lib_EIP155Tx.decode(
            encodedEIP155Tx,
            chainId
        );
    }
}
