// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.7.0;

abstract contract FlightSuretyData {
    // Contract Owner Functions
    function disableContract() external virtual;
    function enableContract() external virtual;

    // Airline Functions
    function applyAirline(address _address, string memory _name) external virtual;
    function voteAirline(address _address, string memory _name) external virtual;
    function fundAirline() external virtual payable;
    function addFlight(string memory _flight) external virtual;

    // Passenger Functions
    function buyInsurance(string memory _airline, string memory _flight) external virtual payable;
}
