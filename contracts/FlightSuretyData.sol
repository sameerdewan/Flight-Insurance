// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.7.0;

import "../node_modules/@openzeppelin/contracts/math/SafeMath.sol";

contract FlightSuretyData {
    using SafeMath for uint256;

    // Global Variables
    address private owner;
    bool private operational;
    uint256 private numberOfAirlines;
    // CALLER => PERMISSION STATUS
    mapping(address => bool) private authorizedCallers;
    // AIRLINE ADDRESS => AIRLINE
    mapping(address => Airline) private airlinesByAddress;
    // AIRLINE NAME => AIRLINE
    mapping(string => Airline) private airlinesByName;
    // PASSENGER ADDRESS => AIRLINE NAME => FLIGHT NAME => INSURANCE POLICY
    mapping(address => mapping(string => mapping(string => Insurance))) policies;

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

    enum FlightStatus {
        UNKNOWN,
        ON_TIME,
        LATE_AIRLINE,
        LATE_WEATHER,
        LATE_TECHNICAL,
        LATE_OTHER
    }

    struct Flight {
        string _name;
        FlightStatus _status;
        address _airline;
        bool _exists;
    }

    struct Airline {
        string _name;
        address _address;
        AirlineStatus _status;
        uint8 _numberOfApprovals;
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
    event InsuranceSold(address passengerAddress, string airlineName, string flightName, uint insuredValue);
    event InsuranceChangeSent(address passengerAddress, uint change);

    // Modifiers
    modifier isOperational() {
        require(operational == true, "Error: Contract is not operational.");
        _;
    }

    modifier isOwner() {
        require(msg.sender == owner, "Error: Caller is not Contract Owner.");
        _;
    }

    modifier isAuthorized() {
        bool authorized = msg.sender == owner || authorizedCallers[msg.sender];
        require(authorized == true, "Error: Caller is not authorized.");
        _;
    }

    modifier lessThan5Airlines() {
        require(numberOfAirlines < 5, "Error: Cannot add airline without 4 votes. Initial 4 airlines created.");
        _;
    }

    modifier airlineDoesNotExist(address airlineAddress, string memory airlineName) {
        bool airlineAddressExists = airlinesByAddress[airlineAddress]._exists;
        require(airlineAddressExists == false, "Error: Airline with address already exists.");
        bool airlineNameExists = airlinesByName[airlineName]._exists;
        require(airlineNameExists == false, "Error: Airline with name already exists.");
        _;
    }

    modifier airlineExists(address airlineAddress, string memory airlineName) {
        bool airlineAddressExists = airlinesByAddress[airlineAddress]._exists;
        require(airlineAddressExists == true, "Error: Airline with address does not exist.");
        bool airlineNameExists = airlinesByName[airlineName]._exists;
        require(airlineNameExists == true, "Error: Airline with name does not exist.");
        _;
    }

    modifier airlineExistsName(string memory airlineName) {
        bool airlineNameExists = airlinesByName[airlineName]._exists;
        require(airlineNameExists == true, "Error: Airline with name does not exist.");
        _;
    }

    modifier airlineIsPetitioned(address airlineAddress, string memory airlineName) {
        bool isPetitioned = airlinesByAddress[airlineAddress]._status == AirlineStatus.APPLIED;
        require(isPetitioned == true, "Error: Airline is not applied.");
        _;
    }

    modifier airlineIsNotApproved(address airlineAddress, string memory airlineName) {
        bool isApproved1 = airlinesByAddress[airlineAddress]._status != AirlineStatus.APPLIED;
        bool isApproved2 = airlinesByName[airlineName]._status != AirlineStatus.APPLIED;
        bool isApproved = isApproved1 && isApproved2;
        require(isApproved == false, "Error: Airline already approved.");
        _;
    }

    modifier callerIsNotAirline(string memory airline) {
        address airlineAddress = airlinesByName[airline]._address;
        require(msg.sender != airlineAddress, "Error: Called from airline address");
        _;
    }

    modifier minimumFunding() {
        uint existingFunds = airlinesByAddress[msg.sender]._funds;
        if (existingFunds >= 10 ether) {
            _;
        }
        require(existingFunds + msg.value >= 10 ether, "Error: Insufficent funding.");
        _;
    }

    modifier flightExists(string memory flight, string memory airline) {
        bool exists = airlinesByName[airline]._flights[flight]._exists;
        require(exists == true, "Error: Flight does not exist.");
        _;
    }

    // Constructor
    constructor() public {
        owner = msg.sender;
    }

    // Contract Owner Functions
    function disableContract() public
        isOwner() {
            operational = false;
    }

    function enableContract() public
        isOwner() {
            operational = true;
    }

    // Airline Functions
    function applyAirline(address _address, string memory _name) public
        isOperational() airlineDoesNotExist(_address, _name) {
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

    function voteAirline(address _address, string memory _name) public
        isOperational() isAuthorized() airlineExists(_address, _name) airlineIsPetitioned(_address, _name)
        airlineIsNotApproved(_address, _name) {
            airlinesByAddress[_address]._numberOfApprovals = airlinesByAddress[_address]._numberOfApprovals + 1;
            airlinesByName[_name]._numberOfApprovals = airlinesByName[_name]._numberOfApprovals + 1;
            airlinesByAddress[_address]._approvingAirlines[msg.sender] = true;
            airlinesByName[_name]._approvingAirlines[msg.sender] = true;
            emit AirlineVotedFor(msg.sender, _address, _name);
            uint8 numberOfApprovals1 = airlinesByAddress[_address]._numberOfApprovals;
            uint8 numberOfApprovals2 = airlinesByName[_name]._numberOfApprovals;
            bool isApproved1 = numberOfApprovals1 > SafeMath.div(numberOfAirlines, 2);
            bool isApproved2 = numberOfApprovals2 > SafeMath.div(numberOfAirlines, 2);
            bool isApproved = isApproved1 && isApproved2;
            if (numberOfAirlines < 5 || isApproved) {
                airlinesByAddress[_address]._status = AirlineStatus.APPROVED;
                airlinesByName[_name]._status = AirlineStatus.APPROVED;
                numberOfAirlines = numberOfAirlines + 1;
                authorizedCallers[_address] = true;
                emit AirlineApproved(_address, _name);
            }
    }

    function fundAirline() public payable
        isOperational() isAuthorized() minimumFunding() {
            airlinesByAddress[msg.sender]._funds = SafeMath.add(airlinesByAddress[msg.sender]._funds, msg.value);
            string memory _name = airlinesByAddress[msg.sender]._name;
            airlinesByName[_name]._funds = SafeMath.add(airlinesByName[_name]._funds, msg.value);
            uint funds = airlinesByAddress[msg.sender]._funds;
            bool sufficientFunds = funds >= 10 ether;
            emit AirlineFunded(msg.sender, _name, msg.value, funds, sufficientFunds);
    }

    function addFlight(string memory _flight) public
        isOperational() isAuthorized() {
            airlinesByAddress[msg.sender]._flights[_flight] = Flight({
                _name: _flight,
                _status: FlightStatus.UNKNOWN,
                _airline: msg.sender,
                _exists: true
            });
    }

    // Passenger Functions
    function buyInsurance(string memory _airline, string memory _flight) public payable
        isOperational() callerIsNotAirline(_airline) airlineExistsName(_airline) flightExists(_flight, _airline) {
            bool airlineIsFunded = airlinesByName[_airline]._funds >= 10 ether;
            require(airlineIsFunded == true, "Error: Airline is not funded and cannot insure flight.");
            uint funds = msg.value;
            uint fundsToReturn = 0;
            if (funds > 1 ether) {
                fundsToReturn = msg.value - 1 ether;
                funds = 1 ether;
            }
            policies[msg.sender][_airline][_flight] = Insurance({
                _insured: true,
                _funds: funds,
                _paidOut: false
            });
            if (fundsToReturn > 0) {
                msg.sender.transfer(fundsToReturn);
                emit InsuranceChangeSent(msg.sender, fundsToReturn);
            }
            emit InsuranceSold(msg.sender, _airline, _flight, funds);
    }
}
