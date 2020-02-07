pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";

contract SecondERC20 is ERC20, ERC20Detailed {
    constructor () public ERC20Detailed("SecondERC20", "2ND", 18) {
        _mint(msg.sender, 1000000 * (10 ** uint256(decimals())));
    }
}
