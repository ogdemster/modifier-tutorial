//SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract ModifierTutorial {
    using SafeMath for uint256;
    address public owner;
    string public name;

    bool private _locked;

    event NameChanged(string newName);
    mapping (address => uint256) public balances;
    mapping (address => bool) public isAdmin;

    constructor() {
        owner = msg.sender;
        isAdmin[msg.sender] = true;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function.");
        _;
    }

    modifier onlyAdmin() {
        require(isAdmin[msg.sender], "Only admin can call this function.");
        _;
    }

    function changeName(string memory _name) public onlyAdmin {
        name = _name;
        emit NameChanged(_name);
    }

    function addAdmin(address _admin) public onlyOwner {
        isAdmin[_admin] = true;
    }

    function removeAdmin(address _admin) public onlyOwner {
        isAdmin[_admin] = false;
    }


    function changeOwner(address _owner) public onlyOwner {
        owner = _owner;
    }

    function getName() public view returns (string memory) {
        return name;
    }

    function getOwner() public view returns (address) {
        return owner;
    }

    function getSender() public view returns (address) {
        return msg.sender;
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function getUserBalance() public view returns (uint256) {
        return balances[msg.sender];
    }   

    function deposit() public payable {
        require(msg.value > 0, "Deposit amount must be greater than zero");
        balances[msg.sender] = balances[msg.sender].add(msg.value);
    }

    // function withdraw(uint256 _amount) public {
    //     uint256 etherAmount = _amount.mul(1 ether);
    //     require(_amount > 0, "Invalid amount");
    //     require(balances[msg.sender] >= etherAmount, "Not enough funds");
    //     balances[msg.sender] = balances[msg.sender].sub(etherAmount);
    //     payable(msg.sender).transfer(etherAmount);
    // }
    
    modifier noReentrancy() {
        require(!_locked, "Reentrant call");
        _locked = true;
        _;
        _locked = false;
    }   

    function withdraw(uint256 _amount) public noReentrancy {
        uint256 etherAmount = _amount.mul(1 ether);
        require(_amount > 0, "Invalid amount");
        require(balances[msg.sender] >= etherAmount, "Not enough funds");
        balances[msg.sender] = balances[msg.sender].sub(etherAmount);
        payable(msg.sender).transfer(etherAmount);
    }

    
}
