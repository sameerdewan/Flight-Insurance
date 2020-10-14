// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.7.0;

interface DataInterface {
    function registerAppContract(address appAddress) external;
    function applyAirline(string memory airlineName, address airlineAddress) external;
    function getVoter(string memory airlineName, address votingAirline) external view returns(bool);
    function voteForAirline(string memory airlineName, address votingAirline) external;
    function checkForApproval(string memory airlineName) external returns(bool);
    function fundAirline(string memory airlineName, uint256 fundingValue) external payable;
    function addFlight(string memory airlineName, string memory flightName, uint256 flightTimestamp) external;
    function getAirline(string memory airlineName) external returns(address airlineAddress, string memory airlineStatus, uint256 airlineFunds, bool airlineExists);
    function getFlight(string memory airlineName, string memory flightName) external returns(bool flightExists, uint256 flightTimestamp, string memory flightStatus, uint256 airlineFunds);
    function buyInsurance(address passenger, uint256 insuranceFunds, string memory airlineName, string memory flightName) external;
    function getPolicy(address passenger, string memory airlineName, string memory flightName) external returns(bool policyActive, uint256 policyFunds, bool payoutAvailable);
    function updatePolicy(address passenger, string memory airlineName, string memory flightName, bool policyActive, uint256 policyFunds, bool payoutAvailable) external;
    function updateFlight(string memory airlineName, string memory flightName, string memory flightStatus) external;
}
