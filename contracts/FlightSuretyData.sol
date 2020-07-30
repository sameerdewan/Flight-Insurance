// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.7.0;

import "../node_modules/@openzeppelin/contracts/math/SafeMath.sol";

contract FlightSuretyData {
    using SafeMath for uint256;

    // Global Variables
    address private owner;
    bool private operational;
    uint256 private numberOfAirlines;
    mapping(address => bool) private authorizedCallers;
    mapping(address => Airline) private airlinesByAddress;
    mapping(string => Airline) private airlinesByName;

    // Structs
    enum AirlineStatus {
        APPLIED,
        APPROVED,
        INSUFFICIENT_FUNDS,
        FUNDED
    }

    struct Passenger {
        bool _insured;
        bool _paidOut;
        bool _exists;
        uint256 _insuredAmount;
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
        mapping(address => Passenger) _passengers;
        bool _exists;
    }

    struct Airline {
        string _name;
        address _address;
        AirlineStatus _status;
        uint8 _numberOfApprovals;
        mapping(address => bool) _approvingAirlines;
        mapping(string => Flight) _flights;
        bool _exists;
    }

    // Events
    event AirlineApplied(address airlineAddress, string airlineName);
    event AirlineVotedFor(address voter, address airlineAddress, string airlineName);
    event AirlineApproved(address airlineAddress, string airlineName);

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
        airlineDoesNotExist(_address, _name) {
            Airline memory airline = Airline({
                _name: _name,
                _address: _address,
                _status: AirlineStatus.APPLIED,
                _numberOfApprovals: 0,
                _exists: true
            });
            airlinesByAddress[_address] = airline;
            airlinesByName[_name] = airline;
            emit AirlineApplied(_address, _name);
    }

    function voteAirline(address _address, string memory _name) public
        isAuthorized() airlineExists(_address, _name) airlineIsPetitioned(_address, _name) airlineIsNotApproved(_address, _name) {
            airlinesByAddress[_address]._numberOfApprovals = airlinesByAddress[_address]._numberOfApprovals + 1;
            airlinesByName[_name]._numberOfApprovals = airlinesByName[_name]._numberOfApprovals + 1;
            airlinesByAddress[_address]._approvingAirlines[msg.sender] = true;
            airlinesByName[_name]._approvingAirlines[msg.sender] = true;
            emit AirlineVotedFor(msg.sender, _address, _name);
            bool isApproved1 = airlinesByAddress[_address]._numberOfApprovals >= 4;
            bool isApproved2 = airlinesByName[_name]._numberOfApprovals >= 4;
            bool isApproved = isApproved1 && isApproved2;
            if (numberOfAirlines < 5 || isApproved) {
                airlinesByAddress[_address]._status = AirlineStatus.APPROVED;
                airlinesByName[_name]._status = AirlineStatus.APPROVED;
                numberOfAirlines = numberOfAirlines + 1;
                emit AirlineApproved(_address, _name);
            }
    }

}
