// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.7.0;

import "../node_modules/@openzeppelin/contracts/math/SafeMath.sol";
import "./FlightSuretyDataInterface.sol";

contract FlightSuretyApp {
    using SafeMath for uint256;

    // Global Variables
    address private owner;
    bool private operational = true;

    FlightSuretyDataInterface flightSuretyData;
    address payable flightSuretyContractAddress;

    // Events
    event ChangeSent(address passenger, uint change, string flight, string airline);

    // Modifiers
    modifier isOperational() {
        require(operational == true, "Error: Application Contract is not operational.");
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
    constructor(address payable _dataContractAddress) public {
        owner = msg.sender;
        flightSuretyContractAddress = _dataContractAddress;
        flightSuretyData = FlightSuretyDataInterface(flightSuretyContractAddress);
    }

    // Contract Owner Functions
    function disableContract() public {
        flightSuretyData.disableContract(msg.sender);
    }

    function enableContract() public {
        flightSuretyData.enableContract(msg.sender);
    }

    // Airline Functions
    function applyAirline(string memory _name) public {
        flightSuretyData.applyAirline(msg.sender, _name);
    }

    function voteAirline(address _address, string memory _name) public {
        flightSuretyData.voteAirline(_address, msg.sender, _name);
    }

    function fundAirline(address _address) public payable {
        flightSuretyData.fundAirline{value: msg.value}(msg.sender, _address);
    }

    function addFlight(string memory _flight, address _address, uint256 timeOfFlightInSeconds) public {
        flightSuretyData.addFlight(_flight, msg.sender, _address, timeOfFlightInSeconds);
    }

    // Passenger Functions
    function buyInsurance(string memory _airline, string memory _flight) public payable {
        bool airlineIsFunded = flightSuretyData.getInsuredStatus(_airline);
        require(airlineIsFunded == true, "Error: Airline does not meet funding requirements.");
        uint funds = msg.value;
        uint fundsToReturn = 0;
        if (funds > 1 ether) {
            fundsToReturn = msg.value - 1 ether;
            funds = 1 ether;
        }
        flightSuretyData.buyInsurance{value: funds}(msg.sender, _airline, _flight);
        if (fundsToReturn > 0 ether) {
            msg.sender.transfer(fundsToReturn);
            emit ChangeSent(msg.sender, fundsToReturn, _flight, _airline);
        }
    }

    function claimInsurance(string memory airline, string memory flight) public {
        flightSuretyData.claimInsurance(msg.sender, airline, flight);
    }

    // Oracle Variables
    uint256 public constant ORACLE_REGISTRATION_FEE = 1 ether;
    uint256 private constant MIN_RESPONSES = 3;
    uint8 private nonce = 0;
    mapping(address => Oracle) private oracles;
    mapping(bytes32 => ResponseInfo) private oracleResponses;

    // Oracle Structs
    struct ResponseInfo {
        address _requester;
        bool _isOpen;
        mapping(uint8 => address[]) responses;
    }

    struct Oracle {
        uint8[3] _indexes;
        bool _valid;
    }

    // Oracle Events
    event OracleRegistered(address oracleAddress);
    event OracleInformationRequested(address oracle);
    event OracleRequest(uint8 index, string airline, string flight, uint256 timestamp);
    event OracleResponse(string airline, string flight, uint256 timestamp, uint8 statusCode);
    event OracleSetFlightDelayed(address oracleAddress, string airline, string flight);

    // Oracle Modifiers
    modifier minimumRegistrationFee(uint fee) {
        require(fee >= ORACLE_REGISTRATION_FEE, "Error: Registration fee is required.");
        _;
    }

    modifier indexMustMatchOracleRequest(uint8 index) {
        bool indexMatchesOracleRequest = oracles[msg.sender]._indexes[0] == index || oracles[msg.sender]._indexes[1] == index || oracles[msg.sender]._indexes[2] == index;
        require(indexMatchesOracleRequest == true, "Error: Index does not match oracle request.");
        _;
    }

    modifier oracleMustBeRegistered(address oracle) {
        require(oracles[oracle]._valid == true, 'Error: Not a registered oracle.');
        _;
    }

    // Oracle Functions
    function registerOracle() external payable
        minimumRegistrationFee(msg.value) {
            uint8[3] memory indexes = generateIndexes(msg.sender);
            oracles[msg.sender] = Oracle({_valid: true, _indexes: indexes});
            emit OracleRegistered(msg.sender);
    }

    function getOracleIndexes() external oracleMustBeRegistered(msg.sender) returns(uint8[3] memory) {
        emit OracleInformationRequested(msg.sender);
        return oracles[msg.sender]._indexes;
    }

    function fetchFlightStatus(string memory airline, string memory flight) external {
        address _address = flightSuretyData.getAirlineByName(airline);
        uint256 timestamp = block.timestamp;
        uint8 index = getRandomIndex(_address);
        bytes32 flightKey = keccak256(abi.encodePacked(index, airline,  flight, timestamp));
        oracleResponses[flightKey] = ResponseInfo({
            _requester: msg.sender,
            _isOpen: true
        });
        emit OracleRequest(index, airline, flight, timestamp);
    }

    function submitOracleResponse(uint8 index, string memory airline, string memory flight, uint256 timestamp, uint8 statusCode) external
        indexMustMatchOracleRequest(index) {
            bytes32 responseKey = keccak256(abi.encodePacked(index, airline, flight, timestamp));
            require(oracleResponses[responseKey]._isOpen == true, "Error: Invalid Oracle");
            oracleResponses[responseKey].responses[statusCode].push(msg.sender);
            emit OracleResponse(airline, flight, timestamp, statusCode);
            if (oracleResponses[responseKey].responses[statusCode].length >= MIN_RESPONSES) {
                flightSuretyData.setFlightDelayed(airline, flight, statusCode);
                emit OracleSetFlightDelayed(msg.sender, airline, flight);
            }
    }

    // Oracle Utilities
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
        uint8 random = uint8(uint256(keccak256(abi.encodePacked(blockhash(block.number - nonce++), account))) % maxValue);

        if (nonce > 250) {
            nonce = 0;  // Can only fetch blockhashes for last 256 blocks so we adapt
        }

        return random;
    }
}