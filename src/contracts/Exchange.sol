pragma solidity ^0.5.0;

import "./Token.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";

contract Exchange {

    using SafeMath for uint256;

    // Withdraw Eth
    // Withdraw Tokens
    // Check Balance
    // Make Order
    // Fill Order
    // Cancel Order

    //vars
    address constant ETHER = address(0);
    address payable public feeAccount;
    uint256 public feePercent;
    mapping(address => mapping(address => uint256)) public tokens;

    //events
    event Deposit(address _token, address _user, uint256 _amount, uint256 _balance);

    //constructor
    constructor (address payable _feeAccount, uint256 _feePercent) public {
        feeAccount = _feeAccount;
        feePercent = _feePercent;
    }

    //deposit erc20 tokens
    function depositToken(address _tokenAddress, uint256 _amount) public {
        //don't allow ether deposits
        //require this so we only continue if transfer occurs
        require(_tokenAddress != ETHER, "Can't send ether to this function");
        require(Token(_tokenAddress).transferFrom(msg.sender, address(this), _amount), "Could not transfer");
        tokens[_tokenAddress][msg.sender] = tokens[_tokenAddress][msg.sender].add(_amount);
        emit Deposit(_tokenAddress, msg.sender, _amount, tokens[_tokenAddress][msg.sender]);
    }

    //deposit ether
    function depositEther() public payable {
        //use tokens mapping to store ether
        tokens[ETHER][msg.sender] = tokens[ETHER][msg.sender].add(msg.value);
        emit Deposit(ETHER, msg.sender, msg.value, tokens[ETHER][msg.sender]);
    }

    //fallback
    function() external {
        revert("Cannot send ether directly to exchange");
    }

}