// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Strings.sol";

contract Decentraland{
    enum Gender{MALE, FEMALE}

    //Store land
    struct Land{
        uint256 id;
        uint256 parcelNumber;
        string landCode;
        address owner;
        string description;
        string landCoordinatorHash;
        address publishAdmin;
        uint256 publishDate;
    }

    struct Citizen{
        uint256 id;
        uint256 idNumber;
        string fullName;
        uint256 dob;
        address publishAdmin;
        uint256 publishDate;
    }

    struct LandOwnershipTransaction{
        uint256 ownerId;
        uint256 ownerIdNumber;
        string ownerFullname;
        address publishAdmin;
        uint256 transferDate;
    }

    event LandPublished(
        uint256 id,
        uint256 parcelNumber,
        string landCode,
        address owner,
        string description,
        string landCoordinatorHash,
        address publishAdmin,
        uint256 publishDate
    );

    event CitizenPublished(
        uint256 id,
        uint256 idNumber,
        string fullName,
        uint256 dob,
        address publishAdmin,
        uint256 publishDate
    );

    string public constant name = "Decentraland";
    string public constant townshipCode = "ASD";
    address public owner;
    uint256 public parcelNumberSeed = 5000;
    uint256 public landCount = 0;
    uint256 public citizenCount = 0;
    mapping(uint256 => Land) public lands;
    mapping(uint256 => Citizen) public citizens;
    mapping(uint256 => LandOwnershipTransaction[]) public landToTransaction;
    mapping(uint256 => Land[]) public ownerToLands;

    constructor(){
        owner = msg.sender;
    }

    function publishLand(
        address _landOwner,
        string calldata _description,
        string calldata _landCoordinatorHash
    ) external{
        require(bytes(_landCoordinatorHash).length > 0);
        require(bytes(_description).length > 0);
        require(msg.sender != address(0));
        landCount++;
        uint256 parcelNumber = parcelNumberSeed + landCount;
        string memory landCode = string(abi.encodePacked(townshipCode, Strings.toString(parcelNumber)));
        uint256 publishDate = block.timestamp;

        lands[landCount] = Land(
            landCount,
            parcelNumber,
            landCode,
            _landOwner,
            _description,
            _landCoordinatorHash,
            msg.sender,
            publishDate
        );

        emit LandPublished(
            landCount,
            parcelNumber,
            landCode,
            _landOwner,
            _description,
            _landCoordinatorHash,
            msg.sender,
            publishDate
        );
    }

    function publishCitizen (
        uint256 _idNumber, string calldata _fullName, uint256 _dob
    ) external{
        require(_idNumber > 2);
        require(bytes(_fullName).length > 0);
        require(_dob > 0);
        citizenCount++;
        citizens[citizenCount] = Citizen(
            citizenCount,
            _idNumber,
            _fullName,
            _dob,
            msg.sender,
            block.timestamp
        );

        emit CitizenPublished(
            citizenCount,
            _idNumber,
            _fullName,
            _dob,
            msg.sender,
            block.timestamp
        );
    }

    function transferLand(uint256 _landId, uint256 _citizenId) external{
        Land storage land = lands[_landId];
        Citizen storage citizen = citizens[_citizenId];
        LandOwnershipTransaction memory transaction = LandOwnershipTransaction(citizen.id, citizen.idNumber, citizen.fullName, msg.sender, block.timestamp);
        landToTransaction[_landId].push(transaction);
        ownerToLands[_citizenId].push(land);
    }

    function getLandTransaction(uint256 _landId) external view returns(LandOwnershipTransaction[] memory){
        return landToTransaction[_landId];
    }
}