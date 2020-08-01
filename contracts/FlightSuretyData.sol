// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.7.0;

import "../node_modules/@openzeppelin/contracts/math/SafeMath.sol";

contract FlightSuretyData {
    using SafeMath for uint256;

    // Global Variables
    address private owner;
    address private app;
    bool private operational = true;
    uint256 private numberOfAirlines;
    // CALLER => PERMISSION STATUS
    mapping(address => bool) private authorizedCallers;
    // AIRLINE ADDRESS => AIRLINE
    mapping(address => Airline) private airlinesByAddress;
    // AIRLINE NAME => AIRLINE
    mapping(string => Airline) private airlinesByName;
    // PASSENGER ADDRESS => AIRLINE NAME => FLIGHT NAME => INSURANCE POLICY
    mapping(address => mapping(string => mapping(string => Insurance))) policies;

    // Flight Status Codes
    uint8 private constant STATUS_CODE_UNKNOWN = 0;
    uint8 private constant STATUS_CODE_ON_TIME = 10;
    uint8 private constant STATUS_CODE_LATE_AIRLINE = 20;
    uint8 private constant STATUS_CODE_LATE_WEATHER = 30;
    uint8 private constant STATUS_CODE_LATE_TECHNICAL = 40;
    uint8 private constant STATUS_CODE_LATE_OTHER = 50;

    // Structs
    enum AirlineStatus {
        APPLIED,
        APPROVED,
        INSUFFICIENT_FUNDS,
        FUNDED
    }

    struct Insurance {
        bool _insured;
        bool _paidOut;
        uint _funds;
    }

    struct Flight {
        string _name;
        uint8 _status;
        address _airline;
        bool _exists;
        uint256 _timeOfFlightInSeconds;
    }

    struct Airline {
        string _name;
        address _address;
        AirlineStatus _status;
        uint _numberOfApprovals;
        uint _funds;
        // APPROVING AIRLINE => VOTE
        mapping(address => bool) _approvingAirlines;
        // FLIGHT NAME => FLIGHT
        mapping(string => Flight) _flights;
        bool _exists;
    }

    // Events
    event AirlineApplied(address airlineAddress, string airlineName);
    event AirlineVotedFor(address voter, address airlineAddress, string airlineName);
    event AirlineApproved(address airlineAddress, string airlineName);
    event AirlineFunded(address airlineAddress, string airlineName, uint valueSent, uint totalFunds, bool sufficientFunding);
    event AirlineInsufficientFunds(address airlineAddress, string airlineName, uint totalFunds);
    event FlightAdded(string airlineName, string flightName);
    event InsuranceSold(address passengerAddress, string airlineName, string flightName, uint insuredValue);
    event InsuranceChangeSent(address passengerAddress, uint change);
    event FlightDelayed(string airlineName, string flightName, uint8 statusCode);
    event InsuranceClaimed(string airlineName, string flightName, address passenger, uint funds);

    // Modifiers
    modifier isOperational() {
        require(operational == true, "Error: Data Contract is not operational.");
        _;
    }

    modifier isOwner(address _address) {
        require(_address == owner, "Error: Caller is not Contract Owner.");
        _;
    }

    modifier isCalledFromApp() {
        require(msg.sender == app, "Error: Not called from approved Application Contract");
        _;
    }

    modifier isAuthorized(address _address) {
        bool authorized = msg.sender == owner || authorizedCallers[_address];
        require(authorized == true, "Error: Caller is not authorized.");
        _;
    }

    modifier lessThan5Airlines() {
        require(numberOfAirlines < 5, "Error: Cannot add airline without 4 votes. Initial 4 airlines created.");
        _;
    }

    modifier airlineDidNotVote(address airline, address voter) {
        require(airlinesByAddress[airline]._approvingAirlines[voter] == false, "Error: Already voted.");
        _;
    }

    modifier airlineDoesNotExist(address airlineAddress, string memory airlineName) {
        bool airlineAddressExists = airlinesByAddress[airlineAddress]._exists;
        require(airlineAddressExists == false, "Error: Airline with address already exists.");
        bool airlineNameExists = airlinesByName[airlineName]._exists;
        require(airlineNameExists == false, "Error: Airline with name already exists.");
        _;
    }

    modifier airlineExistsName(string memory airlineName) {
        bool airlineNameExists = airlinesByName[airlineName]._exists;
        require(airlineNameExists == true, "Error: Airline with name does not exist.");
        _;
    }

    modifier airlineIsNotApproved(address airlineAddress, string memory airlineName) {
        bool isApproved1 = airlinesByAddress[airlineAddress]._status != AirlineStatus.APPLIED;
        bool isApproved2 = airlinesByName[airlineName]._status != AirlineStatus.APPLIED;
        bool isApproved = isApproved1 && isApproved2;
        require(isApproved == false, "Error: Airline already approved.");
        _;
    }

    modifier callerAndAirlineEqual(address caller, address airline) {
        require(caller == airline, "Error: Caller is not the airline.");
        _;
    }

    modifier minimumFunding(address airline, uint funds) {
        uint existingFunds = airlinesByAddress[airline]._funds;
        if (existingFunds >= 10 ether) {
            _;
        }
        require(existingFunds + funds >= 10 ether, "Error: Insufficent funding.");
        _;
    }

    modifier flightExists(string memory flight, string memory airline) {
        bool exists = airlinesByName[airline]._flights[flight]._exists;
        require(exists == true, "Error: Flight does not exist.");
        _;
    }

    modifier flightHasNotLeft(string memory flight, string memory airline) {
        uint256 timeOfFlightInSeconds = airlinesByName[airline]._flights[flight]._timeOfFlightInSeconds;
        require(block.timestamp < timeOfFlightInSeconds, "Error: Flight has already left.");
        _;
    }

    modifier isInsured(address passenger, string memory airline, string memory flight) {
        bool insured = policies[passenger][airline][flight]._insured;
        require(insured == true, "Error: Insurance Policy does not exist.");
        _;
    }

    // Constructor
    constructor(string memory initialAirline) public payable {
        owner = msg.sender;
        Airline memory airline = Airline({
            _name: initialAirline,
            _address: msg.sender,
            _status: AirlineStatus.FUNDED,
            _numberOfApprovals: 0,
            _funds: msg.value,
            _exists: true
        });
        airlinesByName[initialAirline] = airline;
        airlinesByAddress[msg.sender] = airline;
        numberOfAirlines = numberOfAirlines + 1;
        authorizedCallers[msg.sender] = true;
        emit AirlineApproved(msg.sender, initialAirline);
    }

    // Utilities
    function getInsuredStatus(string memory _airline) external isAuthorized(msg.sender) returns (bool airlineIsFunded, uint funds) {
        airlineIsFunded = airlinesByName[_airline]._funds >= 10 ether;
        funds = airlinesByName[_airline]._funds;
        if (airlineIsFunded == false) {
            airlinesByName[_airline]._status = AirlineStatus.INSUFFICIENT_FUNDS;
            address _address = airlinesByName[_airline]._address;
            airlinesByAddress[_address]._status = AirlineStatus.INSUFFICIENT_FUNDS;
            emit AirlineInsufficientFunds(_address, _airline, funds);
        }
    }

    function getAirlineStatus(string memory _airline) external view isAuthorized(msg.sender) returns (AirlineStatus status) {
        status = airlinesByName[_airline]._status;
    }

    function getAirlineApprovalCount(address _address) external view isAuthorized(msg.sender) returns (uint numApprovals) {
        numApprovals = airlinesByAddress[_address]._numberOfApprovals;
    }

    // Contract Owner Functions
    function disableContract(address _address) public
        isOwner(_address) {
            operational = false;
    }

    function enableContract(address _address) public
        isOwner(_address) {
            operational = true;
    }

    function wireApp(address _app) external
        isOwner(msg.sender) {
            app = _app;
            authorizedCallers[_app] = true;
    }

    function unwireApp(address _app) external
        isOwner(msg.sender) {
            authorizedCallers[_app] = false;
    }

    // Airline Functions
    function applyAirline(address _address, string memory _name) public
        isOperational() isCalledFromApp() airlineDoesNotExist(_address, _name) {
            Airline memory airline = Airline({
                _name: _name,
                _address: _address,
                _status: AirlineStatus.APPLIED,
                _numberOfApprovals: 0,
                _funds: 0 ether,
                _exists: true
            });
            airlinesByAddress[_address] = airline;
            airlinesByName[_name] = airline;
            emit AirlineApplied(_address, _name);
    }

    function voteAirline(address _address, address _voter, string memory _name) public
        isOperational() isCalledFromApp() isAuthorized(_voter) airlineExistsName(_name) airlineDidNotVote(_address, _voter) {
            uint numberOfApprovals1 = airlinesByAddress[_address]._numberOfApprovals;
            uint numberOfApprovals2 = airlinesByName[_name]._numberOfApprovals;
            airlinesByAddress[_address]._numberOfApprovals = SafeMath.add(numberOfApprovals1, 1);
            airlinesByName[_name]._numberOfApprovals = SafeMath.add(numberOfApprovals2, 1);
            airlinesByAddress[_address]._approvingAirlines[_voter] = true;
            airlinesByName[_name]._approvingAirlines[_voter] = true;
            emit AirlineVotedFor(_voter, _address, _name);
            numberOfApprovals1 = airlinesByAddress[_address]._numberOfApprovals;
            numberOfApprovals2 = airlinesByName[_name]._numberOfApprovals;
            bool isApproved = numberOfApprovals1 > SafeMath.div(numberOfAirlines, 2) && numberOfApprovals2 > SafeMath.div(numberOfAirlines, 2);
            evaluateAirlineStatus(isApproved, _address, _name);
    }

    function evaluateAirlineStatus(bool isApproved, address _address, string memory _name) internal
        isOperational() isAuthorized(msg.sender) {
            if (numberOfAirlines < 5 || isApproved) {
                airlinesByAddress[_address]._status = AirlineStatus.APPROVED;
                airlinesByName[_name]._status = AirlineStatus.APPROVED;
                numberOfAirlines = numberOfAirlines + 1;
                authorizedCallers[_address] = true;
                emit AirlineApproved(_address, _name);
            }
    }

    function fundAirline(address _funder, address _airline, uint _funds) public
        isOperational() isCalledFromApp() isAuthorized(_funder) callerAndAirlineEqual(_funder, _airline) minimumFunding(_airline, _funds) {
            airlinesByAddress[_airline]._funds = SafeMath.add(airlinesByAddress[_airline]._funds, _funds);
            string memory _name = airlinesByAddress[_airline]._name;
            airlinesByName[_name]._funds = SafeMath.add(airlinesByName[_name]._funds, _funds);
            uint fundedAmount = airlinesByAddress[msg.sender]._funds;
            bool sufficientFunds = fundedAmount >= 10 ether;
            emit AirlineFunded(msg.sender, _name, _funds, fundedAmount, sufficientFunds);
    }

    function addFlight(string memory _flight, address _caller, address _airline, uint256 _timeOfFlightInSeconds) public
        isOperational() isCalledFromApp() isAuthorized(_caller) callerAndAirlineEqual(_caller, _airline) {
            Flight memory flight = Flight({
                _name: _flight,
                _status: STATUS_CODE_UNKNOWN,
                _airline: _airline,
                _exists: true,
                _timeOfFlightInSeconds: _timeOfFlightInSeconds
            });
            airlinesByAddress[_airline]._flights[_flight] = flight;
            string memory _name = airlinesByAddress[_airline]._name;
            airlinesByName[_name]._flights[_flight] = flight;
            emit FlightAdded(_name, _flight);
    }

    function getAirlineByName(string memory _airline) public view
        isOperational() isCalledFromApp() airlineExistsName(_airline) returns(address _address) {
            _address = airlinesByName[_airline]._address;
    }

    // // Passenger Functions
    function buyInsurance(address _passenger, string memory _airline, string memory _flight, uint _funds) public
        isOperational() isCalledFromApp() airlineExistsName(_airline) flightExists(_flight, _airline) flightHasNotLeft(_flight, _airline) {
        policies[_passenger][_airline][_flight] = Insurance({
            _insured: true,
            _funds: _funds,
            _paidOut: false
        });
        airlinesByName[_airline]._funds = SafeMath.add(airlinesByName[_airline]._funds, _funds);
        address _address = airlinesByName[_airline]._address;
        airlinesByAddress[_address]._funds = SafeMath.add(airlinesByAddress[_address]._funds, _funds);
        emit InsuranceSold(_passenger, _airline, _flight, _funds);
    }

    function claimInsurance(address payable _passenger, string memory _airline, string memory _flight) public
        isOperational() isCalledFromApp() isInsured(_passenger, _airline, _flight) {
            uint statusCode = airlinesByName[_airline]._flights[_flight]._status;
            require(statusCode == STATUS_CODE_LATE_AIRLINE, "Error: Claim invalid - Airline (flight) was not late.");
            policies[_passenger][_airline][_flight]._paidOut = true;
            uint payoutBy = SafeMath.div(3, 2);
            uint funds = SafeMath.mul(policies[_passenger][_airline][_flight]._funds, payoutBy);
            _passenger.transfer(funds);
            emit InsuranceClaimed(_airline, _flight, _passenger, funds);
    }

    // Oracle Functions
    function setFlightDelayed(string memory _airline, string memory _flight, uint8 _statusCode) external
       isOperational() isCalledFromApp() airlineExistsName(_airline) flightExists(_flight, _airline) {
           address _address = airlinesByName[_airline]._address;
           airlinesByName[_airline]._flights[_flight]._status = _statusCode;
           airlinesByAddress[_address]._flights[_flight]._status = _statusCode;
           emit FlightDelayed(_airline, _flight, _statusCode);
    }
}
