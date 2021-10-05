// SPDX-License-Identifier: MIT

pragma solidity >0.5.0 <0.8.0;
pragma experimental ABIEncoderV2;

import { iOVM_L2ERC20Bridge } from "./optimism/iOVM/bridge/tokens/iOVM_L2ERC20Bridge.sol";
import { IL2StandardERC20 } from "./optimism/libraries/standards/IL2StandardERC20.sol";

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { SafeMath } from "@openzeppelin/contracts/math/SafeMath.sol";

contract L2BridgeWrapper {

    iOVM_L2ERC20Bridge public l2TokenBridge;

    address public l1Oracle;

    bool public initialized;

    function initialize (address _l2TokenBridge, address _l1Oracle) public {
        require(!initialized, "ALREADY_INITIALIZED");
        l2TokenBridge = iOVM_L2ERC20Bridge(_l2TokenBridge);
        l1Oracle = _l1Oracle;

        initialized = true;
    }

    function fastWithdraw(
        address _origin, // NOTE: after fraud proof window, we should transfer token to origin address.
        address _l1Token,
        address _l2Token,
        address _to,
        uint256 _amount,
        uint256 _fee,
        uint32 _l1Gas,
        bytes calldata _data
    )
        external
    {
        require(
            _origin == msg.sender,
            "INVALID_ORIGIN"
        );
        require(
            _to == l1Oracle,
            "INVALID_RECIPIENT" // NOTE: need to check in l1 oracle.
        );

        address l1Token = IL2StandardERC20(_l2Token).l1Token();
        require(
          l1Token == _l1Token,
          "INVALID_L1TOKEN"
        );

        // NOTE: _amount + _fee will burn on L2.
        uint256 amount = SafeMath.add(_amount, _fee);
        require(
            IERC20(_l2Token).transferFrom(msg.sender, address(this), amount),
            "TRANSFER_FAILURE"
        );

        l2TokenBridge.withdrawTo(
            _l2Token,
            _to,
            amount,
            _l1Gas,
            _data
        );
    }
}
