// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "hardhat/console.sol";

contract Token {
    string public name = "RossCoin";
    string public symbol = "Ross";
    string public standard = "RossCoin v1.0";
    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    constructor ()  {
        totalSupply           = 1000000 * 1000000000000000000;
        balanceOf[msg.sender] = totalSupply;
    }

    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );


    function transfer(address _to, uint256 _value)
             public returns (bool success)
    {
        console.log("msg.sender : ", msg.sender);
        console.log("to.address : ", _to);
        console.log("msg._value : ", _value);

        address tokenOwner = msg.sender;
        require(balanceOf[ tokenOwner ] >= _value,  "Sender balance is not sufficient");
        require(balanceOf[_to] + _value >= balanceOf[_to], "Transfer would cause overflow");

        balanceOf[tokenOwner] -= _value;
        balanceOf[_to] += _value;
        emit Transfer(tokenOwner, _to, _value);
        return true;
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) public returns (bool success) {
        address tokenOwner = _from;
        address middleOwner = msg.sender;
        require(balanceOf[tokenOwner] >= _value, "Owner's balance is not sufficient");
        require(allowance[tokenOwner][middleOwner] >= _value, "Sender allowance is not sufficient");
        balanceOf[tokenOwner] -= _value;
        allowance[tokenOwner][middleOwner] -= _value;
        balanceOf[_to] += _value;
        emit Transfer(_from, _to, _value);
        return true;

    }

    function approve(address _spender, uint256 _value)
        public
        returns (bool success)
    {
        address tokenOwner = msg.sender;
        address middleOwner = _spender;
        allowance[tokenOwner][middleOwner] = _value;
        emit Approval(tokenOwner, middleOwner, _value);
        return true;
    }
}
