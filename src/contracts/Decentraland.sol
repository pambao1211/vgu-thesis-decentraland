// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Decentraland{
    //Store land
    struct Land{
        uint256 id;
        address owner;
        address publishAdmin;
        string description;
        string landCoordinatorHash;
    }

    string public name = "Decentraland";
    address public owner;
    uint256 public landCount = 0;
    mapping(uint256 => Land) public lands;

    constructor(){
        owner = msg.sender;
    }

    function publishLand(
        address _landOwner,
        string calldata _description,
        string calldata _landCoordinatorHash
    ) public{
        require(bytes(_landCoordinatorHash).length > 0);
        require(bytes(_description).length > 0);
        require(msg.sender != address(0));
        landCount++;
        lands[landCount] = Land(
            landCount,
            _landOwner,
            msg.sender,
            _description,
            _landCoordinatorHash
        );
    }
}