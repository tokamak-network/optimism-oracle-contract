// SPDX-License-Identifier: MIT
// @unsupported: ovm
pragma solidity >=0.7.6;
pragma abicoder v2;

/**
 * @title ERC721
 * @dev A super simple ERC721 implementation! Also *very* insecure. Do not use in prod.
 */
contract ERC721 {

    /**********
     * Events *
     **********/

    event Transfer(
        address indexed _from,
        address indexed _to,
        uint256 _tokenId
    );

    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );

    /*************
     * Variables *
     *************/

    string public name;

    mapping (uint256 => address) private _tokenOwner;
    mapping (uint256 => address) private _tokenApprovals;
    mapping (address => uint256) private _ownedTokensCount;

    /***************
     * Constructor *
     ***************/

    constructor(
        uint256 _initialId,
        string memory _name
    )
        public
    {
        name = _name;
    }

    /********************
     * Public Functions *
     ********************/

    function balanceOf(
        address _owner
    )
        external
        view
        returns (
            uint256
        )
    {
        return _ownedTokensCount[_owner];
    }

    function transfer(
        address _to,
        uint256 _tokenId
    )
        external
        returns (
            bool
        )
    {
        _transferFrom(msg.sender, _to, _tokenId);

        return true;
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 _tokenId
    )
        external
        returns (
            bool
        )
    {
        _transferFrom(_from, _to, _tokenId);

        return true;
    }

    function approve(address to, uint256 tokenId) public {
        address owner = ownerOf(tokenId);
        require(to != owner, "ERC721: approval to current owner");

        require(msg.sender == owner,
            "ERC721: approve caller is not owner nor approved for all"
        );

        _tokenApprovals[tokenId] = to;
        emit Approval(owner, to, tokenId);
    }

    function mint(address to, uint256 tokenId) external {
        _mint(to, tokenId);
    }

    function _mint(address to, uint256 tokenId) internal {
        require(to != address(0), "ERC721: mint to the zero address");
        require(!_exists(tokenId), "ERC721: token already minted");

        _tokenOwner[tokenId] = to;
        _ownedTokensCount[to] += 1;

        emit Transfer(address(0), to, tokenId);
    }

    function _burn(address owner, uint256 tokenId) internal {
        require(ownerOf(tokenId) == owner, "ERC721: burn of token that is not own");

        _clearApproval(tokenId);

        _ownedTokensCount[owner] -= 1;
        _tokenOwner[tokenId] = address(0);

        emit Transfer(owner, address(0), tokenId);
    }

    function _exists(uint256 tokenId) internal view returns (bool) {
        address owner = _tokenOwner[tokenId];
        return owner != address(0);
    }

    function ownerOf(uint256 tokenId) public view returns (address) {
        address owner = _tokenOwner[tokenId];
        require(owner != address(0), "ERC721: owner query for nonexistent token");

        return owner;
    }

    function _transferFrom(address from, address to, uint256 tokenId) internal {
        require(ownerOf(tokenId) == from, "ERC721: transfer of token that is not own");
        require(to != address(0), "ERC721: transfer to the zero address");

        _clearApproval(tokenId);

        _ownedTokensCount[from] -= 1;
        _ownedTokensCount[to] += 1;

        _tokenOwner[tokenId] = to;

        emit Transfer(from, to, tokenId);
    }

    function _clearApproval(uint256 tokenId) private {
        if (_tokenApprovals[tokenId] != address(0)) {
            _tokenApprovals[tokenId] = address(0);
        }
    }
}
