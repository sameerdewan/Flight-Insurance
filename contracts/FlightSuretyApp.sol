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
    address flightSuretyContractAddress;

    // Modifiers
    modifier isOperational() {
        require(operational == true, "Error: Contract is not operational.");
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
    constructor(address _dataContractAddress) public {
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

    function fundAirline() public payable {

    }
}