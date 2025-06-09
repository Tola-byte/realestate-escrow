// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

 import "hardhat/console.sol";

contract RealEstateEscrow {
    uint public goalAmount;
    uint public deadline;
    address public developer;

    mapping(address => uint) public contributions;

    constructor(uint _goalAmount, uint _durationInDays){
        goalAmount = _goalAmount;
        deadline   = block.timestamp + (_durationInDays * 1 days);
        developer  = msg.sender;
    }

    function invest() external payable {
        require(block.timestamp < deadline, "Deadline Passed");
        require(msg.value > 0, "No ETH sent");
        contributions[msg.sender] += msg.value;
    } 

    function releaseToDeveloper() external {
        require(block.timestamp >= deadline, "Too early to release");
        require(address(this).balance >= goalAmount, "Goal not met");
        payable(developer).transfer(address(this).balance);
    }

      function refund() external {
        require(block.timestamp >= deadline, "Deadline not passed yet");
        require(address(this).balance < goalAmount, "Goal was met");

        uint contributed = contributions[msg.sender];
        require(contributed > 0, "No contributions to refund");
        contributions[msg.sender] = 0;
        payable(msg.sender).transfer(contributed);
    }
}
