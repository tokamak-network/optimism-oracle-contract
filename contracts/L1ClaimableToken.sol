// SPDX-License-Identifier: MIT
// @unsupported: ovm

pragma solidity >=0.7.6;
pragma abicoder v2;

import { ERC721 } from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract L1ClaimableToken is ERC721 {

    struct TokenInfo {
        uint256 transactionIndex;
        address l1Token;
        address l2Token;
        uint256 amount;
        uint256 fee;
    }

    mapping(uint256 => TokenInfo) public tokenInfos;
    address public owner;

    constructor(string memory name, string memory symbol) ERC721(name, symbol) {
        owner = msg.sender;
    }

    function transferOwnership (address newOwner) public {
        require(msg.sender == owner, "NOT_OWNER");
        owner = newOwner;
    }

    function mint(
        uint256 tokenId,
        uint256 transactionIndex,
        address l1Token,
        address l2Token,
        uint256 amount,
        uint256 fee
    )
        external
    {
        require(msg.sender == owner, "NOT_OWNER");

        _mint(msg.sender, tokenId);

        TokenInfo storage tokenInfo = tokenInfos[tokenId];
        tokenInfo.transactionIndex = transactionIndex;
        tokenInfo.l1Token = l1Token;
        tokenInfo.l2Token = l2Token;
        tokenInfo.amount = amount;
        tokenInfo.fee = fee;
    }
}
