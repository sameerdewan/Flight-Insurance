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
}