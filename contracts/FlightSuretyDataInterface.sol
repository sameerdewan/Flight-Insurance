// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.7.0;

abstract contract FlightSuretyData {
    // Contract Owner Functions
    function disableContract(address _address) external virtual;
    function enableContract(address _address) external virtual;

    // Utilities
    function getInsuredStatus(string memory _airline) external virtual returns (bool airlineIsFunded);

    // Airline Functions
    function applyAirline(address _address, string memory _name) external virtual;
    function voteAirline(address _address, address _voter, string memory _name) external virtual;
    function fundAirline(address _funder, address _airline, uint _funds) external virtual;
    function addFlight(string memory _flight, address _caller, address _airline) external virtual;

    // Passenger Functions
    function buyInsurance(address _passenger, string memory _airline, string memory _flight, uint _funds) external virtual payable;
}
