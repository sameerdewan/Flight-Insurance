// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.7.0;

interface AppInterface {
    function fireOracleResponded(uint8 oracleIndex, string memory oracleName, string memory airlineName, string memory flightName, string memory flightStatus) external;
    function fireFlightUpdate(string memory airlineName, string memory flightName, string memory flightStatus) external;
}
