// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.7.0;

import "../node_modules/@openzeppelin/contracts/math/SafeMath.sol";
import "./Interfaces/DataInterface.sol";
import "./Interfaces/AppInterface.sol";

contract Oracle {
    using SafeMath for uint256;

    address public OWNER_ADDRESS;

    address public ORACLE_ADDRESS;
    bool public ORACLE_OPERATIONAL = false;

    DataInterface DATA;
    address public DATA_ADDRESS;
    bool public DATA_OPERATIONAL = false;

    AppInterface APP;
    address public APP_ADDRESS;
    bool public APP_OPERATIONAL = false;

    uint256 public MIN_RESPONSES = 3;
    uint8 private NONCE;
    mapping(address => ORACLE) private ORACLES;
    mapping(bytes32 => ORACLE_RESPONSE) private ORACLE_RESPONSES;

    struct ORACLE {
        uint8[3] INDEXES;
        bool VALID;
        string NAME;
    }

    struct RESPONDER {
        bool RESPONDED;
    }

    struct ORACLE_RESPONSE {
        address REQUEST_ORIGIN;
        bool OPEN;
        mapping(address => RESPONDER) RESPONDERS;
        mapping(string => address[]) RESPONSES;
    }

    constructor() public {
        OWNER_ADDRESS = msg.sender;
        ORACLE_ADDRESS = address(this);
    }

    modifier isOwner() {
        require(msg.sender == OWNER_ADDRESS, 'Error: Only the OWNER can access this function.');
        _;
    }

    modifier isAppContract() {
        require(msg.sender == APP_ADDRESS, 'Error: Only the APP CONTRACT can access this function.');
        _;
    }

    modifier isOperational() {
        require(ORACLE_OPERATIONAL == true, 'Error: ORACLE CONTRACT is not operational.');
        _;
    }

    function setOracleOperational() external 
        isOwner() {
            require(DATA_OPERATIONAL == true, 'Error: Error: DATA CONTRACT is not operational.');
            require(APP_OPERATIONAL == true, 'Error: Error: APP CONTRACT is not operational.');
            ORACLE_OPERATIONAL = true;
    }

    function registerAppContract(address appContractAddress) external 
        isOwner() {
            APP_ADDRESS = appContractAddress;
            APP = AppInterface(appContractAddress);
            APP_OPERATIONAL = true;
    }

    function registerDataContract(address dataContractAddress) external
        isOwner() {
            DATA_ADDRESS = dataContractAddress;
            DATA = DataInterface(dataContractAddress);
            DATA_OPERATIONAL = true;
    }

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
        uint8 random = uint8(uint256(keccak256(abi.encodePacked(blockhash(block.number - NONCE++), account))) % maxValue);

        if (NONCE > 250) {
            NONCE = 0;  // Can only fetch blockhashes for last 256 blocks so we adapt
        }

        return random;
    }

    function registerOracle(address oracleAddress, string memory oracleName) external
        isAppContract() isOperational() {
            uint8[3] memory indexes = generateIndexes(oracleAddress);
            ORACLES[oracleAddress] = ORACLE({
                INDEXES: indexes,
                VALID: true,
                NAME: oracleName
            });
    }

    function fireOracleFlightStatusRequest(string memory airlineName, string memory flightName) external
        isOperational() returns(uint8 oracleIndex, uint256 oracleTimestamp) {
            (address airlineAddress, , ,) = DATA.getAirline(airlineName);
            oracleTimestamp = block.timestamp;
            oracleIndex = getRandomIndex(airlineAddress);
            bytes32 oracleKey = keccak256(abi.encodePacked(oracleIndex, oracleTimestamp, airlineName, flightName));
            ORACLE_RESPONSE memory oracleResponse = ORACLE_RESPONSE({
                REQUEST_ORIGIN: msg.sender,
                OPEN: true
            });
            ORACLE_RESPONSES[oracleKey] = oracleResponse;
    }

    function submitOracleResponse(uint8 oracleIndex, uint256 oracleTimestamp, string memory airlineName, string memory flightName, string memory flightStatus) external
        isOperational() {
            bool indexMatchesRequest = ORACLES[msg.sender].INDEXES[0] == oracleIndex || ORACLES[msg.sender].INDEXES[1] == oracleIndex || ORACLES[msg.sender].INDEXES[2] == oracleIndex;
            require(indexMatchesRequest == true, 'Error: Invalid Oracle response.');
            bytes32 oracleKey = keccak256(abi.encodePacked(oracleIndex, oracleTimestamp, airlineName, flightName));
            require(ORACLE_RESPONSES[oracleKey].OPEN == true, 'Error: Oracle Request not open.');
            require(ORACLE_RESPONSES[oracleKey].RESPONDERS[msg.sender].RESPONDED == false, 'Error: Oracle already responded.');
            ORACLE_RESPONSES[oracleKey].RESPONSES[flightStatus].push(msg.sender);
            ORACLE_RESPONSES[oracleKey].RESPONDERS[msg.sender] = RESPONDER({ RESPONDED: true });
            string memory oracleName = ORACLES[msg.sender].NAME;
            APP.fireOracleResponded(oracleIndex, oracleName, airlineName, flightName, flightStatus);
            if (ORACLE_RESPONSES[oracleKey].RESPONSES[flightStatus].length >= MIN_RESPONSES) {
                DATA.updateFlight(airlineName, flightName, flightStatus);
                APP.fireFlightUpdate(airlineName, flightName, flightStatus);
            }
    }
}
