// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.7.0;

import "../node_modules/@openzeppelin/contracts/math/SafeMath.sol";
import "./FlightSuretyDataInterface.sol";

contract FlightSuretyApp {
    using SafeMath for uint256;

    // Global Variables
    address private owner;
    bool private operational = true;

    FlightSuretyData dataContract;
    address dataContractAddress;

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
        dataContractAddress = _dataContractAddress;
        dataContract = FlightSuretyData(dataContractAddress);
    }
}