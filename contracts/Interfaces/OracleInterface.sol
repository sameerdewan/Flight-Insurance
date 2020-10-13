// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.7.0;

interface OracleInterface {
    function registerAppContract(address appAddress) external;
    function registerOracle(address oracleAddress, string memory oracleName) external;
    function fireOracleFlightStatusRequest(string memory airlineName, string memory flightName) external;
}
