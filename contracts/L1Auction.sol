// SPDX-License-Identifier: MIT
// @unsupported: ovm

pragma solidity >=0.7.6;
pragma abicoder v2;

import { L1ClaimableToken } from "./L1ClaimableToken.sol";

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract L1Auction {
    L1ClaimableToken public claimableToken;
    address public l1Oracle;

    constructor (address _claimableToken, address _l1Oracle) {
        claimableToken = L1ClaimableToken(_claimableToken);
        l1Oracle = _l1Oracle;
    }

    function buy (uint256 tokenId) external {
        address tokenOwner = claimableToken.ownerOf(tokenId);
        require(
            tokenOwner == l1Oracle,
            "INVALID_OWNER"
        );

        (uint256 transactionIndex, address l1Token, address l2Token, uint256 amount, uint256 fee)
            = claimableToken.tokenInfos(tokenId);

        require(
            IERC20(l1Token).transferFrom(msg.sender, l1Oracle, amount),
            "TRANSFER_FAILURE"
        );

        claimableToken.safeTransferFrom(l1Oracle, msg.sender, tokenId);
    } 
}