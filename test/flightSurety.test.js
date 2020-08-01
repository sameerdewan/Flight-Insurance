const FlightSuretyData = artifacts.require("FlightSuretyData");
const FlightSuretyApp = artifacts.require("FlightSuretyApp");

const default_gas = 9500000;
const initial_airline_name = "INITIAL_TEST_AIRLINE";
const default_minimum_funding = web3.utils.toWei("10");

let accounts;

let owner;
let dataContract;
let appContract;

let firstAirline;
let secondAirline;
let thirdAirline;
let fourthAirline;
let fifthAirline;

let passenger;

const AIRLINE_STATUS_ENUMS = {
    APPLIED: 0,
    APPROVED: 1,
    INSUFFICIENT_FUNDS: 2,
    FUNDED: 3
};

contract('Flight Surety Tests', async (acc) => {
    accounts = acc;

    owner = accounts[0];

    firstAirline = accounts[0];
    secondAirline = accounts[1];
    thirdAirline = accounts[2];
    fourthAirline = accounts[3];
    fifthAirline = accounts[4];

    passenger = accounts[5];
});

before(async () => {
    dataContract = await FlightSuretyData.new(initial_airline_name, { from: owner, value: default_minimum_funding, gas: default_gas });
    appContract = await FlightSuretyApp.new(dataContract.address, { from: owner, gas: default_gas });
    await dataContract.wireApp.sendTransaction(appContract.address, { from: owner });
});

it('initial airline should have a balance of 10 ETH on deployment', async () => {
   const { funds } = await dataContract.getInsuredStatus.call(initial_airline_name, { from: owner });
   const error = "Error: Initial airline does not have a balance of 10 ETH";
   assert.equal(web3.utils.fromWei(funds), web3.utils.fromWei(default_minimum_funding), error);
});

it('airline 2 should be able to apply', async () => {
    const second_airline_name = "SECOND_TEST_AIRLINE";
    await appContract.applyAirline.call(second_airline_name, { from: secondAirline });
    const airlineStatus = `${await dataContract.getAirlineStatus.call(second_airline_name, { from: owner })}`;
    const error = "Error: Airline status is not: APPLIED";
    assert.equal(airlineStatus, AIRLINE_STATUS_ENUMS.APPLIED, error);
});

it('airline 1 should be able to vote for airline 2, immediately being approved', async () => {
    const second_airline_name = "SECOND_TEST_AIRLINE";
    await appContract.voteAirline.sendTransaction(secondAirline, second_airline_name, { from: firstAirline });
    const numberOfApprovals = await dataContract.getAirlineApprovalCount.call(secondAirline, { from: owner });
    const error = "Error: Number of approvals should be 1";
    assert.equal(1, `${numberOfApprovals}`, error);
});