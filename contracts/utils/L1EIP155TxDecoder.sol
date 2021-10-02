// pragma solidity >=0.7.6;
// pragma abicoder v2;

// import { Lib_EIP155Tx } from "./optimism/libraries/codec/Lib_EIP155Tx.sol";
// import { Lib_BytesUtils } from "./optimism/libraries/utils/Lib_BytesUtils.sol";

// contract L1EIP155TxDecoder {
//     function decodeEIP155Tx (
//         bytes memory encodedEIP155Tx,
//         uint256 chainId
//     )
//         external
//         view
//         returns (
//             Lib_EIP155Tx.EIP155Tx memory decodedEIP155Tx
//         )
//     {
//         // Decode the tx with the correct chain ID.
//         decodedEIP155Tx = Lib_EIP155Tx.decode(
//             encodedEIP155Tx,
//             chainId
//         );
//     }

//     function decodeEIP155TxData (
//         bytes memory encodedEIP155Tx,
//         uint256 chainId
//     )
//         external
//         view
//         returns (
//             bytes memory
//         )
//     {
//         // Decode the tx with the correct chain ID.
//         Lib_EIP155Tx.EIP155Tx memory decodedEIP155Tx = Lib_EIP155Tx.decode(
//             encodedEIP155Tx,
//             chainId
//         );

//         bytes memory data = decodedEIP155Tx.data;
//         bytes memory selector = Lib_BytesUtils.slice(data, 0, 4);

//         return selector;
//     }

//     function decodeEIP155TxArgs (
//         bytes memory encodedEIP155Tx,
//         uint256 chainId
//     )
//         external
//         view
//         returns (
//             bytes memory
//         )
//     {
//         // Decode the tx with the correct chain ID.
//         Lib_EIP155Tx.EIP155Tx memory decodedEIP155Tx = Lib_EIP155Tx.decode(
//             encodedEIP155Tx,
//             chainId
//         );

//         bytes memory data = decodedEIP155Tx.data;
//         bytes memory selector = Lib_BytesUtils.slice(data, 0, 4);
//         bytes memory params = Lib_BytesUtils.slice(data, 4);

//         return params;
//     }

//     function decodeEIP155TxArgsDecoded (
//         bytes memory encodedEIP155Tx,
//         uint256 chainId
//     )
//         external
//         view
//         returns (
//             uint256, int256
//         )
//     {
//         // Decode the tx with the correct chain ID.
//         Lib_EIP155Tx.EIP155Tx memory decodedEIP155Tx = Lib_EIP155Tx.decode(
//             encodedEIP155Tx,
//             chainId
//         );

//         bytes memory data = decodedEIP155Tx.data;
//         bytes memory selector = Lib_BytesUtils.slice(data, 0, 4);
//         bytes memory args = Lib_BytesUtils.slice(data, 4);

//         return abi.decode(
//             args,
//             (uint256,int256)
//         );
//     }
// }
