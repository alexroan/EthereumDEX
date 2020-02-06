pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";

contract Pairs {

    address[] public addresses;
    uint public size;

    event NewAddress(address indexed tokenAddress, string symbol, address user);

    function add(address _tokenAddress) public {
        require(ERC20Detailed(_tokenAddress).totalSupply() > 0, "Could not get total supply");
        string memory symbol = ERC20Detailed(_tokenAddress).symbol();
        addresses.push(_tokenAddress);
        size = size + 1;
        emit NewAddress(_tokenAddress, symbol, msg.sender);
    }
}