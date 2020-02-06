pragma solidity ^0.5.0;

import "./MyERC20.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";

contract Exchange {

    using SafeMath for uint256;

    //vars
    address constant ETHER = address(0);
    address payable public feeAccount;
    uint256 public feePercent;
    mapping(address => mapping(address => uint256)) public tokens;
    mapping(uint256 => _Order) public orders;
    mapping(uint256 => bool) public orderCancelled;
    mapping(uint256 => bool) public orderFilled;
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
    event Order(uint256 _id, address _user, address _tokenGet, uint256 _amountGet,
        address _tokenGive, uint256 _amountGive, uint256 _timestamp);
    event Cancel(uint256 _id, address _user, address _tokenGet, uint256 _amountGet, address _tokenGive, uint256 _amountGive,
        uint256 _timestamp);
    event Trade(uint256 _id, address _user, address _tokenGet, uint256 _amountGet, address _tokenGive, uint256 _amountGive,
        address _userFill, uint256 _timestamp);


    //constructor
    constructor (address payable _feeAccount, uint256 _feePercent) public {
        feeAccount = _feeAccount;
        feePercent = _feePercent;
    }

    function fillOrder(uint256 _id) public {
        //require order is valid, not filled or cancelled already
        require(_id > 0 && _id <= orderCount, "Invalid order id");
        require(!orderCancelled[_id], "Order cancelled before fill");
        require(!orderFilled[_id], "Order filled already");
        //fetch order
        _Order storage _order = orders[_id];
        //do trade
        _trade(_order.id, _order.user, _order.tokenGet, _order.amountGet, _order.tokenGive, _order.amountGive);
        //mark order as filled
        orderFilled[_id] = true;
    }

    function _trade(uint256 _id, address _user, address _tokenGet, uint256 _amountGet, address _tokenGive, uint256 _amountGive) internal {
        //charge fees - taken from filler of order (msg.sender)
        uint256 _feeAmount = _amountGet.mul(feePercent).div(100);
        //DO TRADE
        //msg.sender is the person filling order, _user the person who made the order
        //move order fillers tokens to order maker, whilst subtracting fees from filler
        tokens[_tokenGet][msg.sender] = tokens[_tokenGet][msg.sender].sub(_amountGet.add(_feeAmount));
        tokens[_tokenGet][_user] = tokens[_tokenGet][_user].add(_amountGet);
        //take fees to fee account
        tokens[_tokenGet][feeAccount] = tokens[_tokenGet][feeAccount].add(_feeAmount);
        //move order makers tokens to order filler
        tokens[_tokenGive][_user] = tokens[_tokenGive][_user].sub(_amountGive);
        tokens[_tokenGive][msg.sender] = tokens[_tokenGive][msg.sender].add(_amountGive);
        //emit event
        emit Trade(_id, _user, _tokenGet, _amountGet, _tokenGive, _amountGive, msg.sender, now);
    }

    //make order
    function makeOrder(address _tokenGet, uint256 _amountGet, address _tokenGive, uint256 _amountGive) public {
        //increment ordercount
        orderCount = orderCount.add(1);
        //add order to orders mapping by creating new struct
        orders[orderCount] = _Order(orderCount, msg.sender, _tokenGet, _amountGet, _tokenGive, _amountGive, now);
        //emit event
        emit Order(orderCount, msg.sender, _tokenGet, _amountGet, _tokenGive, _amountGive, now);
    }

    //cancel order
    function cancelOrder(uint256 _id) public returns (bool){
        //retrieve order
        _Order storage _order = orders[_id];
        //require user is owner of order
        require(address(_order.user) == msg.sender, "Must be order user to cancel");
        //require valid order id
        require(_id == _order.id, "Not valid order id");
        //add to cancelled orders mapping
        orderCancelled[_id] = true;
        //emit event
        emit Cancel(_id, _order.user, _order.tokenGet, _order.amountGet, _order.tokenGive, _order.amountGive, now);
        //return true for cancelled order
        return orderCancelled[_id];
    }

    //deposit erc20 tokens
    function depositToken(address _tokenAddress, uint256 _amount) public {
        //don't allow ether deposits
        require(_tokenAddress != ETHER, "Can't send ether to this function");
        //require this so we only continue if transfer occurs
        require(MyERC20(_tokenAddress).transferFrom(msg.sender, address(this), _amount), "Could not transfer");
        //add to balance
        tokens[_tokenAddress][msg.sender] = tokens[_tokenAddress][msg.sender].add(_amount);
        //emit event
        emit Deposit(_tokenAddress, msg.sender, _amount, tokens[_tokenAddress][msg.sender]);
    }

    //withdraw erc20 tokens
    function withdrawToken(address _tokenAddress, uint256 _amount) public {
        //dont allow ether
        require(_tokenAddress != ETHER, "Token address not valid");
        //require balance to be greater than amount
        require(tokens[_tokenAddress][msg.sender] >= _amount, "Not enough tokens");
        //subtract tokens
        tokens[_tokenAddress][msg.sender] = tokens[_tokenAddress][msg.sender].sub(_amount);
        //send tokens and require the transfer goes through
        require(MyERC20(_tokenAddress).transfer(msg.sender, _amount), "Could not transfer");
        //emit event
        emit Withdraw(_tokenAddress, msg.sender, _amount, tokens[_tokenAddress][msg.sender]);
    }

    //deposit ether
    function depositEther() public payable {
        //use tokens mapping to store ether
        tokens[ETHER][msg.sender] = tokens[ETHER][msg.sender].add(msg.value);
        //emit event
        emit Deposit(ETHER, msg.sender, msg.value, tokens[ETHER][msg.sender]);
    }

    //withdraw ether
    function withdrawEther(uint256 _amount) public {
        //require balance to be greater than amount
        require(tokens[ETHER][msg.sender] >= _amount, "Not enough ether");
        //subtract ether
        tokens[ETHER][msg.sender] = tokens[ETHER][msg.sender].sub(_amount);
        //send ether
        msg.sender.transfer(_amount);
        //emit event
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