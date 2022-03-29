// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Strings.sol";

contract Decentraland{  
    enum Gender{MALE, FEMALE}

    struct Land{
        uint256 id;
        uint256 parcelNumber;
        string landCode;
        string description;
        string landCoordinatorHash;
        bool isOccupied;
        address publishAdmin;
        uint256 publishDate;
    }

    struct Citizen{
        uint256 id;
        uint256 idNumber;
        string fullName;
        Gender gender;
        uint256 dob;
        address publishAdmin;
        uint256 publishDate;
    }

    struct Admin{
        uint256 id;
        string title;
        string adminCode;
        address adminAddr;
        address publishAdmin;
        uint256 publishDate;
    }

    struct landTransferedTrx{
        uint256 id;
        uint256 ownerId;
        uint256 ownerIdNumber;
        string ownerFullname;
        uint256 landId;
        string landCode;
        address admin;
        uint256 transferDate;
    }

    event LandPublished(
        uint256 id,
        uint256 parcelNumber,
        string landCode,
        string description,
        string landCoordinatorHash,
        bool isOccupied,
        address publishAdmin,
        uint256 publishDate
    );

    event CitizenPublished(
        uint256 id,
        uint256 idNumber,
        string fullName,
        Gender gender,
        uint256 dob,
        address publishAdmin,
        uint256 publishDate
    );

    event AdminPublished(
        uint256 id,
        string title,
        string admincode,
        address newAdmin,
        address publishAdmin,
        uint256 publishDate
    );

    event LandTransfer(
        uint256 id,
        uint256 landId,
        uint256 ownerId,
        address adminAddr,
        uint256 trxTime
    );

    string public constant NAME = "Decentraland";
    address public owner;
    string private constant TOWNSHIP_CODE = "ASD";
    string private constant ADMIN_CODE = "ADMIN";
    uint256 private constant PARCEL_NUMBER_SEED = 5000;
    uint256 private constant ADMIN_NUMBER_SEED = 3000;
    uint256 private landCount = 0;
    uint256 private citizenCount = 0;
    uint256 private adminCount = 0;
    uint256 private transactionCount = 0;
    mapping(uint256 => Land) private lands;
    mapping(uint256 => Citizen) private citizens;
    mapping(uint256 => Admin) private admins;

    mapping(uint256 => uint256) private idNumbersToCitizenId;
    mapping(address => uint256) private addressToAdminId;
    mapping(uint256 => landTransferedTrx) private landTransferedTrxs;
    mapping(uint256 => uint256[]) private landIdToTrxIds;
    mapping(uint256 => uint256[]) private citizenIdToOwnedLandTrxIds;

    modifier onlyOwner(address _sender){
        require(owner == _sender, "Sender must be the contract creator");
        _;
    }

    modifier onlyAdmin(address _sender){
        Admin memory admin = getAdminByAddress(_sender);
        require(admin.id != 0, "Only admin account is authorized");
        _;
    }

    modifier validLandId(uint256 _landId){
        require(_landId > 0 && _landId <= landCount, "Invalid land id");
        _;
    }

    modifier validCitizenId(uint256 _citizenId){
        require(_citizenId > 0 && _citizenId <= citizenCount, "Invalid citizen id");
        _;
    }

    modifier validAdminId(uint256 _adminId){
        require(_adminId > 0 && _adminId <= adminCount, "Invalid admin id");
        _;
    }

    modifier validCitizenIdNumber(uint256 _citizenIdNumber){
        bool is10Digit = bytes(Strings.toString(_citizenIdNumber)).length == 10;
        require(is10Digit, "Citizen id number must contain 10 digit");
        _;
    }

    constructor(){
        owner = msg.sender;
        publishAdmin("Contract owner", msg.sender);
    }

    function getLandCount() external view onlyAdmin(msg.sender) returns(uint256){
        return landCount;
    }

    function getLand(uint256 _id) external view onlyAdmin(msg.sender) returns(Land memory){
        return lands[_id];
    }

    function getCitizenCount() external view onlyAdmin(msg.sender) returns(uint256){
        return citizenCount;
    }

    function getCitizen(uint256 _id) external view onlyAdmin(msg.sender) validCitizenId(_id) returns(Citizen memory){
        return citizens[_id];
    }

    function getCitizenByIdNumber(uint256 _idNumber) external view onlyAdmin(msg.sender) validCitizenIdNumber(_idNumber) returns(Citizen memory){
        return citizens[idNumbersToCitizenId[_idNumber]];
    }

    function getAdminCount() external view onlyOwner(msg.sender) returns(uint256){
        return adminCount;
    }

    function getAdmin(uint256 _id) external view onlyOwner(msg.sender) returns(Admin memory){
        return admins[_id];
    }

    function getAdminByAddress(address _address) public view returns(Admin memory){
        return admins[addressToAdminId[_address]];
    }

    function isCitizenLandOwner(uint256 _landId, uint256 _citizenId) view private returns(bool){
        uint256 landTrxsLength = landIdToTrxIds[_landId].length;
        uint256[] memory landTrxIds = landIdToTrxIds[_landId];
        landTransferedTrx memory lastLandTrx = landTransferedTrxs[landTrxIds[landTrxsLength - 1]];
        return lastLandTrx.ownerId == _citizenId;
    }

    function checkIsContractOwner(address _sender) external view returns(bool){
        return owner == _sender;
    }

    function isNewAdminAddressValid(address _newAdmin) private view returns(bool){
        if(_newAdmin == address(0)){
            return false;
        }
        if(_newAdmin != address(_newAdmin)){
            return false;
        }
        bool isNewAdminUnique = addressToAdminId[_newAdmin] == 0;
        if(!isNewAdminUnique){
            return false;
        }
        return true;

    }

    function revokeCurrentOwner(uint256 _landId) private{
        uint256 landTrxsLength = landIdToTrxIds[_landId].length;
        uint256 trxOwnerId = landIdToTrxIds[_landId][landTrxsLength - 1];
        uint256 currentOwnerId = landTransferedTrxs[trxOwnerId].ownerId;

        uint256[] storage ownerTrxIds = citizenIdToOwnedLandTrxIds[currentOwnerId];
        bool isAfterIndex = false;
        for(uint256 i = 0; i < ownerTrxIds.length - 1; i++){
            uint256 currentLandId = landTransferedTrxs[ownerTrxIds[i]].landId;
            if(currentLandId == _landId){
                isAfterIndex = true;
            }
            if(isAfterIndex){
                ownerTrxIds[i] = ownerTrxIds[i + 1];
            }
        }
        ownerTrxIds.pop();
    }

    function getLandTrxs(uint256 _landId) external view onlyAdmin(msg.sender) validLandId(_landId) returns(landTransferedTrx[] memory) {
        uint256[] memory trxIds = landIdToTrxIds[_landId];
        uint256 arrLength = trxIds.length;
        landTransferedTrx[] memory result = new landTransferedTrx[](arrLength);
        for(uint256 i = 0; i < arrLength; i++){
            result[i] = landTransferedTrxs[trxIds[i]];
        }
        return result;
    }

    function getCitizenOwnedTrxs(uint256 _citizenId) external view onlyAdmin(msg.sender) validCitizenId(_citizenId) returns(landTransferedTrx[] memory){
        uint256[] memory trxIds = citizenIdToOwnedLandTrxIds[_citizenId];
        uint256 arrLength = trxIds.length;
        landTransferedTrx[] memory result = new landTransferedTrx[](arrLength);
        for(uint256 i = 0; i < arrLength; i++){
            result[i] = landTransferedTrxs[trxIds[i]];
        }
        return result;
    }

    function publishLand(
        string calldata _description,
        string calldata _landCoordinatorHash
    ) external onlyAdmin(msg.sender){
        require(bytes(_landCoordinatorHash).length > 0, "Land hash specification is required");
        require(bytes(_description).length > 0, "Description is required");
        require(msg.sender != address(0), "Invalid address");

        landCount++;
        uint256 parcelNumber = PARCEL_NUMBER_SEED + landCount;
        string memory landCode = string(abi.encodePacked(TOWNSHIP_CODE, Strings.toString(parcelNumber)));
        uint256 publishDate = block.timestamp;

        lands[landCount] = Land(
            landCount,
            parcelNumber,
            landCode,
            _description,
            _landCoordinatorHash,
            false,
            msg.sender,
            publishDate
        );
        emit LandPublished(
            landCount,
            parcelNumber,
            landCode,
            _description,
            _landCoordinatorHash,
            false,
            msg.sender,
            publishDate
        );
    }

    function publishCitizen (
        uint256 _idNumber, string calldata _fullName, Gender _gender, uint256 _dob
    ) external onlyAdmin(msg.sender) validCitizenIdNumber(_idNumber){
        bool isIdNumberUnique = idNumbersToCitizenId[_idNumber] == 0;
        require(isIdNumberUnique, "Citizen id number already exist");
        require(bytes(_fullName).length > 0, "Full name is required");
        require(_dob < block.timestamp, "Invalid dob");
        citizenCount++;
        uint256 publishDate = block.timestamp;
        citizens[citizenCount] = Citizen(
            citizenCount,
            _idNumber,
            _fullName,
            _gender,
            _dob,
            msg.sender,
            publishDate
        );
        idNumbersToCitizenId[_idNumber] = citizenCount;

        emit CitizenPublished(
            citizenCount,
            _idNumber,
            _fullName,
            _gender,
            _dob,
            msg.sender,
            publishDate
        );
    }

    function transferLand(uint256 _landId, uint256 _citizenIdNumber) external onlyAdmin(msg.sender) validLandId(_landId) validCitizenIdNumber(_citizenIdNumber){
        uint256 citizenId = idNumbersToCitizenId[_citizenIdNumber];
        require(citizenId != 0, "Citizen id does not exist");
        uint256 landTrxsLength = landIdToTrxIds[_landId].length;
        if(landTrxsLength > 0){
            if(isCitizenLandOwner(_landId, citizenId)){
                revert("Citizen is the current land's owner");
            }
            revokeCurrentOwner(_landId);
        }
        transactionCount++;
        Land storage land = lands[_landId];
        land.isOccupied = true;
        Citizen storage citizen = citizens[citizenId]; 
        landTransferedTrxs[transactionCount] = landTransferedTrx(
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
        citizenIdToOwnedLandTrxIds[citizenId].push(transactionCount);
        emit LandTransfer(transactionCount, _landId, citizenId, msg.sender, block.timestamp);
    }

    function publishAdmin(string memory _title, address _newAdmin) public onlyOwner(msg.sender){
        require(bytes(_title).length > 0, "Title must not be empty");
        require(isNewAdminAddressValid(_newAdmin), "Admin address not valid or aldready exist");
        adminCount++;
        uint256 adminNumber = ADMIN_NUMBER_SEED + adminCount;
        string memory adminCode = string(abi.encodePacked(ADMIN_CODE, Strings.toString(adminNumber)));
        uint256 publishDate = block.timestamp;
        admins[adminCount] = Admin(adminCount, _title, adminCode, _newAdmin, msg.sender, publishDate); 
        addressToAdminId[_newAdmin] = adminCount;

        emit AdminPublished(adminCount, _title, adminCode, _newAdmin, msg.sender, publishDate);
    }

}