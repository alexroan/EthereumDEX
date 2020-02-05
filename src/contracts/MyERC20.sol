pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";

contract MyERC20 is ERC20, ERC20Detailed {
    constructor () public ERC20Detailed("MyERC20", "MERC", 18) {
        _mint(msg.sender, 10000 * (10 ** uint256(decimals())));
    }
}
