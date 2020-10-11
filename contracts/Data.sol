// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.7.0;

import "../node_modules/@openzeppelin/contracts/math/SafeMath.sol";

contract Data {
    using SafeMath for uint256;

    address public OWNER_ADDRESS;

    address public DATA_ADDRESS;
    bool public DATA_OPERATIONAL = false;

    address public ORACLE_ADDRESS;
    bool public ORACLE_OPERATIONAL = false;

    address public APP_ADDRESS;
    bool public APP_OPERATIONAL = false;

    uint256 MINIMUM_AIRLINE_APPROVERS = 4;
    
    string private constant AIRLINE_APPLIED = "AIRLINE_APPLIED";
    string private constant AIRLINE_APPROVED = "AIRLINE_APPROVED";
    string private constant AIRLINE_INSUFFICIENT_FUNDS = "AIRLINE_INSUFFICIENT_FUNDS";
    string private constant AIRLINE_FUNDED = "AIRLINE_FUNDED";

    mapping(string => AIRLINE) private MAPPED_AIRLINES;
    string[] public AIRLINES;
    uint256 public TOTAL_AIRLINES = 0;

    struct AIRLINE {
        address ADDRESS;
        string STATUS;
        bool EXISTS;
        uint256 FUNDS;
        uint256 VOTES;
        mapping(address => bool) VOTERS;
    }

    string private constant FLIGHT_STATUS_CODE_UNKNOWN = "FLIGHT_STATUS_CODE_UNKNOWN";
    string private constant FLIGHT_STATUS_CODE_ON_TIME = "FLIGHT_STATUS_CODE_ON_TIME";
    string private constant FLIGHT_STATUS_CODE_LATE_AIRLINE = "FLIGHT_STATUS_CODE_LATE_AIRLINE";
    string private constant FLIGHT_STATUS_CODE_LATE_WEATHER = "FLIGHT_STATUS_CODE_LATE_WEATHER";
    string private constant FLIGHT_STATUS_CODE_LATE_TECHNICAL = "FLIGHT_STATUS_CODE_LATE_TECHNICAL";
    string private constant FLIGHT_STATUS_CODE_LATE_OTHER = "FLIGHT_STATUS_CODE_LATE_OTHER";

    mapping(bytes32 => FLIGHT) private MAPPED_FLIGHTS;
    string[2][] public FLIGHTS;
    uint256 public TOTAL_FLIGHTS = 0;

    struct FLIGHT {
        bool EXISTS;
        uint256 TIMESTAMP;
        string STATUS;
    }

    mapping(bytes32 => POLICY) private MAPPED_POLICIES;

    struct POLICY {
        bool ACTIVE;
        uint256 FUNDS;
        bool PAYOUT_AVAILABLE;
    }

    event ORACLE_CONTRACT_REGISTERED();
    event DATA_CONTRACT_OPERATIONAL();

    constructor() public {
        OWNER_ADDRESS = msg.sender;
        DATA_ADDRESS = address(this);
    }

    modifier isOwner() {
        require(msg.sender == OWNER_ADDRESS, 'Error: Only the OWNER can access this function.');
        _;
    }

    modifier isOperational() {
        require(DATA_OPERATIONAL == true, 'Error: The DATA CONTRACT is not operational.');
        _;
    }

    modifier isAppContract() {
        require(msg.sender == APP_ADDRESS, 'Error: Only the APP CONTRACT can access this function.');
        _;
    }

    modifier isOracleContract() {
        require(msg.sender == ORACLE_ADDRESS, 'Error: Only the ORACLE CONTRACT can access this function.');
        _;
    }

    function setDataOperational() external
        isOwner() {
            require(APP_OPERATIONAL == true, 'Error: APP CONTRACT is not registered.');
            require(ORACLE_OPERATIONAL == true, 'Error: ORACLE CONTRACT is not registered.');
            DATA_OPERATIONAL = true;
            emit DATA_CONTRACT_OPERATIONAL();
    }

    function registerAppContract(address appContractAddress) external {
        require(tx.origin == OWNER_ADDRESS, 'Error: tx.origin is not OWNER.');
        APP_ADDRESS = appContractAddress;
        APP_OPERATIONAL = true;
    }

    function registerOracleContract(address oracleContractAddress) external 
        isOwner() {
            ORACLE_ADDRESS = oracleContractAddress;
            ORACLE_OPERATIONAL = true;
            emit ORACLE_CONTRACT_REGISTERED();
    }

    function applyAirline(string memory airlineName, address airlineAddress) external 
        isAppContract() {
            AIRLINE memory airline = AIRLINE({
                ADDRESS: airlineAddress,
                STATUS: AIRLINE_APPLIED,
                EXISTS: true,
                FUNDS: 0,
                VOTES: 0
            });
            MAPPED_AIRLINES[airlineName] = airline;
            AIRLINES.push(airlineName);
            TOTAL_AIRLINES = SafeMath.add(TOTAL_AIRLINES, 1);
    }

    function getVoter(string memory airlineName, address voter) external view
        isAppContract() isOperational() returns(bool) {
            return MAPPED_AIRLINES[airlineName].VOTERS[voter];
    }

    function voteForAirline(string memory airlineName, address voter) external
        isAppContract() isOperational() returns(bool) {
            MAPPED_AIRLINES[airlineName].VOTERS[voter] = true;
            MAPPED_AIRLINES[airlineName].VOTES = SafeMath.add(MAPPED_AIRLINES[airlineName].VOTES, 1);
            bool approved = checkForApproval(airlineName);
            return approved;
    }

    function checkForApproval(string memory airlineName) internal returns(bool) {
        if (MAPPED_AIRLINES[airlineName].VOTES >= MINIMUM_AIRLINE_APPROVERS) {
            MAPPED_AIRLINES[airlineName].STATUS = AIRLINE_APPROVED;
            return true;
        }
        return false;
    }

    function fundAirline(string memory airlineName, uint256 fundingValue) external
        isAppContract() isOperational() {
            MAPPED_AIRLINES[airlineName].FUNDS = SafeMath.add(MAPPED_AIRLINES[airlineName].FUNDS, fundingValue);
    }

    function getAirline(string memory airlineName) external view returns(address airlineAddress, string memory airlineStatus, uint256 airlineFunds, bool airlineExists) {
        airlineAddress = MAPPED_AIRLINES[airlineName].ADDRESS;
        airlineStatus = MAPPED_AIRLINES[airlineName].STATUS;
        airlineFunds = MAPPED_AIRLINES[airlineName].FUNDS;
        airlineExists = MAPPED_AIRLINES[airlineName].EXISTS;
    }

    function addFlight(string memory airlineName, string memory flightName, uint256 flightTimestamp) external
        isAppContract() isOperational() {
             bytes32 flightKey = keccak256(abi.encodePacked(airlineName, flightName));
             FLIGHT memory flight = FLIGHT({
                 EXISTS: true,
                 TIMESTAMP: flightTimestamp,
                 STATUS: FLIGHT_STATUS_CODE_UNKNOWN
             });
             MAPPED_FLIGHTS[flightKey] = flight;
             FLIGHTS.push([airlineName, flightName]);
             TOTAL_FLIGHTS = SafeMath.add(TOTAL_FLIGHTS, 1);
    }

    function getFlight(string memory airlineName, string memory flightName) external view returns(bool flightExists, uint256 flightTimestamp, string memory flightStatus) {
        bytes32 flightKey = keccak256(abi.encodePacked(airlineName, flightName));
        flightExists = MAPPED_FLIGHTS[flightKey].EXISTS;
        flightTimestamp = MAPPED_FLIGHTS[flightKey].TIMESTAMP;
        flightStatus = MAPPED_FLIGHTS[flightKey].STATUS;
    }

    function getFlightAtIndex(uint256 flightIndex) external view returns(string memory airlineName, string memory flightName) {
        airlineName = FLIGHTS[0][flightIndex];
        flightName = FLIGHTS[1][flightIndex];
    }

    function updateFlight(string memory airlineName, string memory flightName, string memory flightStatus) external 
        isOracleContract() isOperational() {
            bytes32 flightKey = keccak256(abi.encodePacked(airlineName, flightName));
            MAPPED_FLIGHTS[flightKey].STATUS = flightStatus;
    }

    function buyInsurance(address passenger, uint256 insuranceFunds, string memory airlineName, string memory flightName) external payable 
        isAppContract() isOperational() {
            bytes32 policyKey = keccak256(abi.encodePacked(passenger, airlineName, flightName));
            POLICY memory policy = POLICY({
                ACTIVE: true,
                FUNDS: insuranceFunds,
                PAYOUT_AVAILABLE: false
            });
            MAPPED_POLICIES[policyKey] = policy;
    }

    function updatePolicy(address passenger, string memory airlineName, string memory flightName, bool policyActive, uint256 policyFunds, bool payoutAvailable) external
        isAppContract() isOperational() {
            bytes32 policyKey = keccak256(abi.encodePacked(passenger, airlineName, flightName));
            MAPPED_POLICIES[policyKey].ACTIVE = policyActive;
            MAPPED_POLICIES[policyKey].FUNDS = policyFunds;
            MAPPED_POLICIES[policyKey].PAYOUT_AVAILABLE = payoutAvailable;
    }

    function getPolicy(address passenger, string memory airlineName, string memory flightName) external view returns(bool policyActive, uint256 policyFunds, bool payoutAvailable) {
        bytes32 policyKey = keccak256(abi.encodePacked(passenger, airlineName, flightName));
        policyActive = MAPPED_POLICIES[policyKey].ACTIVE;
        policyFunds = MAPPED_POLICIES[policyKey].FUNDS;
        payoutAvailable = MAPPED_POLICIES[policyKey].PAYOUT_AVAILABLE;
    }
}
