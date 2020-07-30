// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.7.0;

import "../node_modules/@openzeppelin/contracts/math/SafeMath.sol";

contract FlightSuretyData {
    using SafeMath for uint256;

    // Global Variables
    address private owner;
    bool private operational;
    mapping(address => bool) private authorizedCallers;
    mapping(address => Airline) private airlines;

    // Structs
    enum AirlineStatus {
        APPLIED,
        APPROVED,
        INSUFFICIENT_FUNDS,
        FUNDED
    }

    struct AirlineApprovals {
        uint8 _numberOfApprovals;
        mapping(address => bool) _approvingAirlines;
    }

    struct Passenger {
        bool _insured;
        uint256 _insuredAmount;
        bool _paid;
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
    }

    struct Airline {
        string _name;
        address _address;
        AirlineStatus _status;
        AirlineApprovals _approvals;
        mapping(string => Flight) _flights;
    }

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
}