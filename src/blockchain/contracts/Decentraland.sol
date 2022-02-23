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

    struct OwnershipTransaction{
        uint256 id;
        uint256 ownerId;
        uint256 ownerIdNumber;
        string ownerFullname;
        uint256 landId;
        string landCode;
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
    uint256 public transactionCount = 0;
    mapping(uint256 => Land) public lands;
    mapping(uint256 => Citizen) public citizens;
    mapping(uint256 => OwnershipTransaction) public transactions;
    mapping(uint256 => uint256[]) public landIdToTrxIds;
    mapping(uint256 => uint256[]) public citizenIdToOwnedTrxIds;

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

    function isCurrentCitizenLandOwner(uint256 _landId, uint256 _citizenId) view private returns(bool){
        uint256 landTrxsLength = landIdToTrxIds[_landId].length;
        uint256[] memory landTrxIds = landIdToTrxIds[_landId];
        OwnershipTransaction memory lastLandTrx = transactions[landTrxIds[landTrxsLength - 1]];
        return lastLandTrx.ownerId == _citizenId;
    }

    function revokeCurrentLandOwner(uint256 _landId) private{
        uint256 landTrxsLength = landIdToTrxIds[_landId].length;
        uint256 trxOwnerId = landIdToTrxIds[_landId][landTrxsLength - 1];
        uint256 currentOwnerId = transactions[trxOwnerId].ownerId;

        uint256[] storage ownerTrxIds = citizenIdToOwnedTrxIds[currentOwnerId];
        bool isAfterIndex = false;
        for(uint256 i = 0; i < ownerTrxIds.length - 1; i++){
            uint256 currentLandId = transactions[ownerTrxIds[i]].landId;
            if(currentLandId == _landId){
                isAfterIndex = true;
            }
            if(isAfterIndex){
                ownerTrxIds[i] = ownerTrxIds[i + 1];
            }

        }
        ownerTrxIds.pop();
    }

    function transferLand(uint256 _landId, uint256 _citizenId) external{

        uint256 landTrxsLength = landIdToTrxIds[_landId].length;
        if(landTrxsLength > 0){
            if(isCurrentCitizenLandOwner(_landId, _citizenId)){
                revert("Citizen is the current land's owner");
            }
            revokeCurrentLandOwner(_landId);
        }

        transactionCount++;
        Land storage land = lands[_landId];
        Citizen storage citizen = citizens[_citizenId]; 
        transactions[transactionCount] = OwnershipTransaction(
            transactionCount,
            citizen.id,
            citizen.idNumber,
            citizen.fullName,
            land.id,
            land.landCode,
            msg.sender,
            block.timestamp
        );
        
        



        landIdToTrxIds[_landId].push(transactionCount);
        citizenIdToOwnedTrxIds[_citizenId].push(transactionCount);
    }

    function getLandTransactions(uint256 _landId) external view returns(OwnershipTransaction[] memory){
        uint256[] memory trxIds = landIdToTrxIds[_landId];
        uint256 arrLength = trxIds.length;
        OwnershipTransaction[] memory result = new OwnershipTransaction[](arrLength);
        for(uint256 i = 0; i < arrLength; i++){
            result[i] = transactions[trxIds[i]];
        }
        return result;
    }

    function getCitizenTransactions(uint256 _citizenId) external view returns(OwnershipTransaction[] memory){
        uint256[] memory trxIds = citizenIdToOwnedTrxIds[_citizenId];
        uint256 arrLength = trxIds.length;
        OwnershipTransaction[] memory result = new OwnershipTransaction[](arrLength);
        for(uint256 i = 0; i < arrLength; i++){
            result[i] = transactions[trxIds[i]];
        }
        return result;
    }

}