// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.7.0;

import "../node_modules/@openzeppelin/contracts/math/SafeMath.sol";
import "./Interfaces/DataInterface.sol";
import "./Interfaces/OracleInterface.sol";

contract App {
    using SafeMath for uint256;
    
    address public OWNER_ADDRESS;

    address public APP_ADDRESS;
    bool public APP_OPERATIONAL = false;
    uint256 public APP_FUNDS = 0;

    DataInterface DATA;
    address public DATA_ADDRESS;
    bool public DATA_OPERATIONAL = false;

    OracleInterface ORACLE;
    address public ORACLE_ADDRESS;
    bool public ORACLE_OPERATIONAL = false;

    uint256 public MINIMUM_PARTNER_FEE = 10000000000000000000; // 10 ETH

    event AIRLINE_APPLIED(address airlinelineAddress, string indexed airlineName);
    event AIRLINE_VOTED_FOR(string indexed airlineName, address voter);
    event AIRLINE_APPROVED(string indexed airlineName, address airlineAddress);
    event AIRLINE_FUNDED(address fundingAddress, string indexed airlineName);
    event FLIGHT_ADDED(address airlineAddress, string indexed airlineName, string indexed flightName, uint256 indexed timestamp);
    event INSURANCE_BOUGHT(address indexed passenger, uint256 insuranceFunds, string indexed airlineName, string indexed flightName);
    event INSURANCE_CLAIMED(address passenger, uint256 claimedValue, string airlineName, string flightName);
    event POLICY_UPDATED(address passenger, string airlineName, string flightName, bool policyActive, uint256 policyFunds, bool payoutAvailable);
    event ORACLE_RESPONDED(uint8 oracleIndex, string oracleName, string indexed airlineName, string indexed flightName, string flightStatus);
    event FLIGHT_UPDATED(string indexed airlineName, string indexed flightName, string flightStatus);

    event APP_IS_OPERATIONAL();
    event DATA_CONTRACT_REGISTERED();
    event ORACLE_CONTRACT_REGISTERED();

    constructor() public {
        OWNER_ADDRESS = msg.sender;
        APP_ADDRESS = address(this);
    }

    modifier isOwner() {
        require(msg.sender == OWNER_ADDRESS, 'Error: Only the OWNER can access this function.');
        _;
    }

    modifier isOracleContract() {
        require(msg.sender == ORACLE_ADDRESS, 'Error: Only the ORACLE CONTRACT can access this function.');
        _;
    }

    modifier isOperational() {
        require(APP_OPERATIONAL == true, 'Error: The APP CONTRACT is not operational.');
        _;
    }

    modifier isValidVoter(string memory airlineName, string memory voterAirlineName) {
        if (msg.sender == OWNER_ADDRESS) {
            _;
        } else {
            (address voterAirlineAddress, string memory voterAirlineStatus, ,) = DATA.getAirline(voterAirlineName);
            require(voterAirlineAddress == msg.sender, 'Error: Invalid request.');
            require(keccak256(abi.encodePacked(voterAirlineStatus)) == keccak256(abi.encodePacked('AIRLINE_APPROVED')), 'Error: You are not an approved airline.');
            bool hasVoted = DATA.getVoter(airlineName, msg.sender);
            require(hasVoted == false, 'Error: You have already voted for this airline.');
            _;
        }
    }

    function setAppOperational() external
        isOwner() {
            require(DATA_OPERATIONAL == true, 'Error: DATA CONTRACT is not registered.');
            require(ORACLE_OPERATIONAL == true, 'Error: ORACLE CONTRACT is not registered.');
            APP_OPERATIONAL = true;
            emit APP_IS_OPERATIONAL();
    }

    function registerDataContract(address dataContractAddress) external 
        isOwner() {
            DATA_ADDRESS = dataContractAddress;
            DATA = DataInterface(dataContractAddress);
            DATA.registerAppContract(APP_ADDRESS);
            DATA_OPERATIONAL = true;
            emit DATA_CONTRACT_REGISTERED();
    }

    function registerOracleContract(address oracleContractAddress) external 
        isOwner() {
            ORACLE_ADDRESS = oracleContractAddress;
            ORACLE = OracleInterface(oracleContractAddress);
            ORACLE.registerAppContract(APP_ADDRESS);
            ORACLE_OPERATIONAL = true;
            emit ORACLE_CONTRACT_REGISTERED();
    }

    function applyAirline(string memory airlineName) external 
        isOperational() {
            DATA.applyAirline(airlineName, msg.sender);
            emit AIRLINE_APPLIED(msg.sender, airlineName);
    }

    function voteForAirline(string memory airlineName, string memory voterAirlineName) external 
        isOperational() isValidVoter(airlineName, voterAirlineName) {
            DATA.voteForAirline(airlineName, msg.sender);
            emit AIRLINE_VOTED_FOR(airlineName, msg.sender);
            bool approved = DATA.checkForApproval(airlineName);
            if (approved == true) {
                (address airlineAddress, , ,) = DATA.getAirline(airlineName);
                emit AIRLINE_APPROVED(airlineName, airlineAddress);
            }
    }

    function fundAirline(string memory airlineName) external payable 
        isOperational() {
            require(msg.value > MINIMUM_PARTNER_FEE, 'Error: MINIMUM_AIRLINE_REGISTRATION_FEE');
            DATA.fundAirline(airlineName, msg.value);
            APP_FUNDS = SafeMath.add(APP_FUNDS, msg.value);
            emit AIRLINE_FUNDED(msg.sender, airlineName);
    }

    function addFlight(string memory flightName, uint256 flightTimestamp, string memory airlineName) external 
        isOperational() {
            (address airlineAddress, string memory airlineStatus, ,) = DATA.getAirline(airlineName);
            require(airlineAddress == msg.sender, 'Error: Invalid request.');
            require(keccak256(abi.encodePacked(airlineStatus)) == keccak256(abi.encodePacked('AIRLINE_FUNDED')), 'Error: Airline is not funded.');
            DATA.addFlight(airlineName, flightName, flightTimestamp);
            emit FLIGHT_ADDED(msg.sender, airlineName, flightName, flightTimestamp); 
    }

    function buyInsurance(string memory airlineName, string memory flightName) external payable 
        isOperational() {
            (, string memory airlineStatus, uint256 funds,) = DATA.getAirline(airlineName);
            require(keccak256(abi.encodePacked(airlineStatus)) == keccak256(abi.encodePacked('AIRLINE_FUNDED')), 'Error: Airline is not funded.');
            require(funds > MINIMUM_PARTNER_FEE, 'Error: MINIMUM_AIRLINE_REGISTRATION_FEE');
            (bool flightExists, uint256 flightTimestamp, ,) = DATA.getFlight(airlineName, flightName);
            require(flightExists == true, 'Error: Flight does not exist.');
            require(block.timestamp < flightTimestamp, 'Error: Flight has already left.');
            APP_FUNDS = SafeMath.add(APP_FUNDS, msg.value);
            DATA.buyInsurance(msg.sender, msg.value, airlineName, flightName);
            emit INSURANCE_BOUGHT(msg.sender, msg.value, airlineName, flightName);
    }

    function checkFlightStatus(string memory airlineName, string memory flightName) external
        isOperational() {
            (bool flightExists, uint256 flightTimestamp , string memory flightStatus,) = DATA.getFlight(airlineName, flightName);
            require(flightExists == true, 'Error: Flight does not exist.');
            bytes32 flightStatusHash = keccak256(abi.encodePacked(flightStatus));
            bytes32 unknownStatusHash = keccak256(abi.encodePacked('FLIGHT_STATUS_CODE_UNKNOWN'));
            require(flightStatusHash == unknownStatusHash, 'Error: Flight status is already available.');
            require(flightTimestamp < block.timestamp, 'Error: Flight has not left yet.');
            ORACLE.fireOracleFlightStatusRequest(airlineName, flightName);
    }

    function fireOracleResponded(uint8 oracleIndex, string memory oracleName, string memory airlineName, string memory flightName, string memory flightStatus) external 
        isOperational() isOracleContract() {
            emit ORACLE_RESPONDED(oracleIndex, oracleName, airlineName, flightName, flightStatus);
    }
    
    function fireFlightUpdate(string memory airlineName, string memory flightName, string memory flightStatus) external 
        isOperational() isOracleContract() {
            emit FLIGHT_UPDATED(airlineName, flightName, flightStatus);
    }

    function checkPolicy(string memory airlineName, string memory flightName) external
        isOperational() {
            bool payoutAvailable = false;
            (bool policyActive, uint256 policyFunds,) = DATA.getPolicy(msg.sender, airlineName, flightName);
            require(policyActive == true, 'Error: Policy not active.');
            require(policyFunds > 0, 'Error: No funds available to withdraw for policy.'); 
            (, , string memory flightStatus,) = DATA.getFlight(airlineName, flightName);
            bytes32 flightStatusHash = keccak256(abi.encodePacked(flightStatus));
            bytes32 airlineAtFaultStatusHash = keccak256(abi.encodePacked('STATUS_CODE_LATE_AIRLINE'));
            if (flightStatusHash == airlineAtFaultStatusHash) {
                payoutAvailable = true;
                DATA.updatePolicy(msg.sender, airlineName, flightName, policyActive, policyFunds, true);
                emit POLICY_UPDATED(msg.sender, airlineName, flightName, policyActive, policyFunds, true);
            }
    }

    function claimInsurance(string memory airlineName, string memory flightName) external
        isOperational() {
            (bool policyActive, uint256 policyFunds, bool payoutAvailable) = DATA.getPolicy(msg.sender, airlineName, flightName); 
            require(policyActive == true, 'Error: Policy not active.');
            require(payoutAvailable == true, 'Error: No payout available.');
            require(policyFunds > 0, 'Error: No funds available to withdraw for policy.');
            uint256 insurancePayout = SafeMath.mul(policyFunds, 2);
            require(APP_FUNDS >= insurancePayout, 'Error: Not enough funds to fill claim.');
            DATA.updatePolicy(msg.sender, airlineName, flightName, false, 0, false);
            emit POLICY_UPDATED(msg.sender, airlineName, flightName, false, 0, false);
            APP_FUNDS = SafeMath.sub(APP_FUNDS, insurancePayout);
            msg.sender.transfer(insurancePayout);
            emit INSURANCE_CLAIMED(msg.sender, insurancePayout, airlineName, flightName);
    }

    function registerOracle(string memory oracleName) external payable 
        isOperational() {
            require(msg.value >= MINIMUM_PARTNER_FEE, 'Error: Oracle registration fee not high enough.');
            ORACLE.registerOracle(msg.sender, oracleName);
            APP_FUNDS = SafeMath.add(APP_FUNDS, msg.value);
    }
}
