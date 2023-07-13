// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Oracle {
    address owner;

    uint public numberAsteroids;

    event __callbackNewData();

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, 'Only owner');
        _;
    }

    function update() public onlyOwner{
        emit __callbackNewData();
    }

    function setNumberAsteroids(uint _num) public onlyOwner{
         numberAsteroids = _num;
    }
}