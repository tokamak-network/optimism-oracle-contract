// SPDX-License-Identifier: MIT

pragma solidity >=0.7.6;
pragma abicoder v2;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// mock class using ERC20
contract L1Token is ERC20 {
    constructor(
        string memory name,
        string memory symbol
    ) payable ERC20(name, symbol) {
        _mint(msg.sender, 100 ether);
    }

    function mint(address account, uint256 amount) public {
        _mint(account, amount);
    }

    function burn(address account, uint256 amount) public {
        _burn(account, amount);
    }

    function transferInternal(
        address from,
        address to,
        uint256 value
    ) public {
        _transfer(from, to, value);
    }

    function approveInternal(
        address owner,
        address spender,
        uint256 value
    ) public {
        _approve(owner, spender, value);
    }
}
