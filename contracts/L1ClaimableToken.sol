// SPDX-License-Identifier: MIT
// @unsupported: ovm

pragma solidity >=0.7.6;
pragma abicoder v2;

import { ERC721 } from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract L1ClaimableToken is ERC721 {

    event Minted(uint256 indexed tokenId, uint256 indexed l2TxIndex);

    struct TokenInfo {
        uint256 tokenId;
        uint256 transactionIndex;
        address origin;
        address l1Token;
        address l2Token;
        uint256 amount;
        uint256 fee;
        bool claimed;
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
        uint256 _tokenId,
        uint256 _transactionIndex,
        address _origin,
        address _l1Token,
        address _l2Token,
        uint256 _amount,
        uint256 _fee
    )
        external
    {
        require(msg.sender == owner, "NOT_OWNER");

        _mint(msg.sender, _tokenId);

        tokenInfos[_tokenId] = TokenInfo({
            tokenId: _tokenId,
            transactionIndex: _transactionIndex,
            origin: _origin,
            l1Token: _l1Token,
            l2Token: _l2Token,
            amount: _amount,
            fee: _fee,
            claimed: false
        });

        emit Minted(_tokenId, _transactionIndex);
    }

    function claim (uint256 tokenId) public {
        require(
            msg.sender == owner,
            "NO_OWNERSHIP"
        );
        TokenInfo storage tokenInfo = tokenInfos[tokenId];
        tokenInfo.claimed = true;
    }
}
