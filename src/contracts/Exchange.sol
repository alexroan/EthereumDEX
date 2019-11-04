pragma solidity ^0.5.0;

import "./Token.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";

contract Exchange {

    using SafeMath for uint256;

    // Fill Order
    // Charge fees

    //vars
    address constant ETHER = address(0);
    address payable public feeAccount;
    uint256 public feePercent;
    mapping(address => mapping(address => uint256)) public tokens;
    mapping(uint256 => _Order) public orders;
    mapping(uint256 => bool) public orderCancelled;
    uint256 public orderCount;

    //structs
    struct _Order {
        uint256 id;
        address user;
        address tokenGet;
        uint256 amountGet;
        address tokenGive;
        uint256 amountGive;
        uint256 timestamp;
    }

    //events
    event Deposit(address _token, address _user, uint256 _amount, uint256 _balance);
    event Withdraw(address _token, address _user, uint256 _amount, uint256 _balance);
    event Order(uint256 _id, address _user, address _tokenGet, uint256 _amountGet, address _tokenGive, uint256 _amountGive, uint256 _timestamp);
    event Cancel(uint256 _id, address _user, address _tokenGet, uint256 _amountGet, address _tokenGive, uint256 _amountGive,
        uint256 _timestamp);


    //constructor
    constructor (address payable _feeAccount, uint256 _feePercent) public {
        feeAccount = _feeAccount;
        feePercent = _feePercent;
    }

    //make order
    function makeOrder(address _tokenGet, uint256 _amountGet, address _tokenGive, uint256 _amountGive) public {
        orderCount = orderCount.add(1);
        orders[orderCount] = _Order(orderCount, msg.sender, _tokenGet, _amountGet, _tokenGive, _amountGive, now);
        emit Order(orderCount, msg.sender, _tokenGet, _amountGet, _tokenGive, _amountGive, now);
    }

    //cancel order
    function cancelOrder(uint256 _id) public returns (bool){
        _Order storage _order = orders[_id];
        require(address(_order.user) == msg.sender, "Must be order user to cancel");
        require(_id == _order.id, "Not valid order id");
        orderCancelled[_id] = true;
        emit Cancel(_id, _order.user, _order.tokenGet, _order.amountGet, _order.tokenGive, _order.amountGive, _order.timestamp);
        return orderCancelled[_id];
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

    //withdraw erc20 tokens
    function withdrawToken(address _tokenAddress, uint256 _amount) public {
        require(_tokenAddress != ETHER, "Token address not valid");
        require(tokens[_tokenAddress][msg.sender] >= _amount, "Not enough tokens");
        tokens[_tokenAddress][msg.sender] = tokens[_tokenAddress][msg.sender].sub(_amount);
        require(Token(_tokenAddress).transfer(msg.sender, _amount), "Could not transfer");
        emit Withdraw(_tokenAddress, msg.sender, _amount, tokens[_tokenAddress][msg.sender]);
    }

    //deposit ether
    function depositEther() public payable {
        //use tokens mapping to store ether
        tokens[ETHER][msg.sender] = tokens[ETHER][msg.sender].add(msg.value);
        emit Deposit(ETHER, msg.sender, msg.value, tokens[ETHER][msg.sender]);
    }

    //withdraw ether
    function withdrawEther(uint256 _amount) public {
        require(tokens[ETHER][msg.sender] >= _amount, "Not enough ether");
        tokens[ETHER][msg.sender] = tokens[ETHER][msg.sender].sub(_amount);
        msg.sender.transfer(_amount);
        emit Withdraw(ETHER, msg.sender, _amount, tokens[ETHER][msg.sender]);
    }

    //balance of user
    function balanceOf(address _tokenAddress, address _user) public view returns (uint256){
        return tokens[_tokenAddress][_user];
    }

    //fallback
    function() external {
        revert("Cannot send ether directly to exchange");
    }

}