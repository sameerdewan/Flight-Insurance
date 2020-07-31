// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.7.0;

interface FlightSuretyDataInterface {
    // Contract Owner Functions
    function disableContract(address _address) external;
    function enableContract(address _address) external;

    // Utilities
    function getInsuredStatus(string memory _airline) external returns (bool airlineIsFunded);

    // Airline Functions
    function applyAirline(address _address, string memory _name) external;
    function voteAirline(address _address, address _voter, string memory _name) external;
    function fundAirline(address _funder, address _airline, uint _funds) external;
    function addFlight(string memory _flight, address _caller, address _airline) external;
    function getAirlineByName(string memory _airline) external view returns(address _address);

    // Passenger Functions
    function buyInsurance(address _passenger, string memory _airline, string memory _flight, uint _funds) external payable;
    function claimInsurance(address payable _passenger, string memory _airline, string memory _flight) external;

    // Oracle Functions
    function setFlightDelayed(string memory _airline, string memory _flight, uint8 _statusCode) external;
}
