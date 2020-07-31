// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.7.0;

import "../node_modules/@openzeppelin/contracts/math/SafeMath.sol";
import "./FlightSuretyDataInterface.sol";

contract FlightSuretyApp {
    using SafeMath for uint256;

    // Global Variables
    address private owner;
    bool private operational = true;

    FlightSuretyData flightSuretyData;
    address payable flightSuretyContractAddress;

    // Modifiers
    modifier isOperational() {
        require(operational == true, "Error: Application Contract is not operational.");
        _;
    }

    modifier isOwner() {
        require(msg.sender == owner, "Error: Caller is not Contract Owner");
        _;
    }

    // Utility
    function getContractOperationalStatus() public view returns(bool) {
        return operational;
    }

    // Constructor
    constructor(address payable _dataContractAddress) public {
        owner = msg.sender;
        flightSuretyContractAddress = _dataContractAddress;
        flightSuretyData = FlightSuretyData(flightSuretyContractAddress);
    }

    // Contract Owner Functions
    function disableContract() public {
        flightSuretyData.disableContract(msg.sender);
    }

    function enableContract() public {
        flightSuretyData.enableContract(msg.sender);
    }

    // Airline Functions
    function applyAirline(string memory _name) public {
        flightSuretyData.applyAirline(msg.sender, _name);
    }

    function voteAirline(address _address, string memory _name) public {
        flightSuretyData.voteAirline(_address, msg.sender, _name);
    }

    function fundAirline(address _address) public payable {
        flightSuretyContractAddress.transfer(msg.value);
        flightSuretyData.fundAirline(msg.sender, _address, msg.value);
    }

    function addFlight(string memory _flight, address _address) public {
        flightSuretyData.addFlight(_flight, msg.sender, _address);
    }

    // Passenger Functions
    function buyInsurance(string memory _airline, string memory _flight) public payable {
        bool airlineIsFunded = flightSuretyData.getInsuredStatus(_airline);
        require(airlineIsFunded == true, "Error: Airline does not meet funding requirements.");
        uint funds = msg.value;
        uint fundsToReturn = 0;
        if (funds > 1 ether) {
            fundsToReturn = msg.value - 1 ether;
            funds = 1 ether;
        }
        flightSuretyContractAddress.transfer(funds);
        flightSuretyData.buyInsurance(msg.sender, _airline, _flight, funds);
        if (fundsToReturn > 0 ether) {
            msg.sender.transfer(fundsToReturn);
        }
    }

    function claimInsurance() public payable {

    }

    // Oracle Management
    uint256 public constant ORACLE_REGISTRATION_FEE = 1 ether;
    uint8 private nonce = 0;

    modifier minimumRegistrationFee(uint fee) {
        require(fee >= ORACLE_REGISTRATION_FEE, "Error: Registration fee is required.");
        _;
    }

    function registerOracle() external payable
        minimumRegistrationFee(msg.value) {

    }

    // Oracle Utilities
    function generateIndexes(address account) internal returns(uint8[3] memory indexes) {
        indexes[0] = getRandomIndex(account);

        indexes[1] = indexes[0];
        while(indexes[1] == indexes[0]) {
            indexes[1] = getRandomIndex(account);
        }

        indexes[2] = indexes[1];
        while((indexes[2] == indexes[0]) || (indexes[2] == indexes[1])) {
            indexes[2] = getRandomIndex(account);
        }

        return indexes;
    }

    function getRandomIndex(address account) internal returns (uint8) {
        uint8 maxValue = 10;
        uint8 random = uint8(uint256(keccak256(abi.encodePacked(blockhash(block.number - nonce++), account))) % maxValue);

        if (nonce > 250) {
            nonce = 0;  // Can only fetch blockhashes for last 256 blocks so we adapt
        }

        return random;
    }
}