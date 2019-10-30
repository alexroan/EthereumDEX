pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";

contract Token {
    using SafeMath for uint256;

    //variables
    string public name = "Token Name";
    string public symbol = "TOK";
    uint256 public decimals = 18;
    uint256 public totalSupply;
    mapping(address => uint256) public balanceOf;

    //events
    event Transfer(address from, address to, uint256 value);

    constructor() public {
        totalSupply = 1000000 * (10 ** decimals);
        balanceOf[msg.sender] = totalSupply;
    }

    //functions
    function transfer(address _to, uint256 _value) public returns (bool success) {
        require(_to != address(0), "Cannot be null address.");
        require(balanceOf[msg.sender] >= _value, "Insufficient balance.");
        balanceOf[msg.sender] = balanceOf[msg.sender].sub(_value);
        balanceOf[_to] = balanceOf[_to].add(_value);
        emit Transfer(msg.sender, _to, _value);
        return true;
    }
}
