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
    await appContract.applyAirline.sendTransaction(second_airline_name, { from: secondAirline });
    const airlineStatus = `${await dataContract.getAirlineStatus.call(second_airline_name, { from: owner })}`;
    const error = "Error: Airline status is not: APPLIED";
    assert.equal(airlineStatus, AIRLINE_STATUS_ENUMS.APPLIED, error);
});

it('airline 1 should be able to vote for airline 2, immediately being approved', async () => {
    const second_airline_name = "SECOND_TEST_AIRLINE";
    await appContract.voteAirline.sendTransaction(secondAirline, second_airline_name, { from: firstAirline });
    const numberOfApprovals = await dataContract.getAirlineApprovalCount.call(secondAirline, { from: owner });
    const error1 = "Error: Number of approvals should be 1";
    assert.equal(1, `${numberOfApprovals}`, error1);
    const airlineStatus = `${await dataContract.getAirlineStatus.call(second_airline_name, { from: owner })}`;
    const error2 = "Error: Airline status is not: APPROVED";
    assert.equal(airlineStatus, AIRLINE_STATUS_ENUMS.APPROVED, error2);
});

it('airline 3 should be able to apply', async () => {
    const third_airline_name = "THIRD_TEST_AIRLINE";
    await appContract.applyAirline.sendTransaction(third_airline_name, { from: thirdAirline });
    const airlineStatus = `${await dataContract.getAirlineStatus.call(third_airline_name, { from: owner })}`;
    const error = "Error: Airline status is not: APPLIED";
    assert.equal(airlineStatus, AIRLINE_STATUS_ENUMS.APPLIED, error);
});

it('airline 2 should be able to vote for airline 3, immediately being approved', async () => {
    const third_airline_name = "THIRD_TEST_AIRLINE";
    await appContract.voteAirline.sendTransaction(thirdAirline, third_airline_name, { from: secondAirline });
    const numberOfApprovals = await dataContract.getAirlineApprovalCount.call(thirdAirline, { from: owner });
    const error1 = "Error: Number of approvals should be 1";
    assert.equal(1, `${numberOfApprovals}`, error1);
    const airlineStatus = `${await dataContract.getAirlineStatus.call(third_airline_name, { from: owner })}`;
    const error2 = "Error: Airline status is not: APPROVED";
    assert.equal(airlineStatus, AIRLINE_STATUS_ENUMS.APPROVED, error2);
});

it('airline 4 should be able to apply', async () => {
    const fourth_airline_name = "FOURTH_TEST_AIRLINE";
    await appContract.applyAirline.sendTransaction(fourth_airline_name, { from: fourthAirline });
    const airlineStatus = `${await dataContract.getAirlineStatus.call(fourth_airline_name, { from: owner })}`;
    const error = "Error: Airline status is not: APPLIED";
    assert.equal(airlineStatus, AIRLINE_STATUS_ENUMS.APPLIED, error);
});

it('airline 3 should be able to vote for airline 4, immediately being approved', async () => {
    const fourth_airline_name = "FOURTH_TEST_AIRLINE";
    await appContract.voteAirline.sendTransaction(fourthAirline, fourth_airline_name, { from: thirdAirline });
    const numberOfApprovals = await dataContract.getAirlineApprovalCount.call(fourthAirline, { from: owner });
    const error1 = "Error: Number of approvals should be 1";
    assert.equal(1, `${numberOfApprovals}`, error1);
    const airlineStatus = `${await dataContract.getAirlineStatus.call(fourth_airline_name, { from: owner })}`;
    const error2 = "Error: Airline status is not: APPROVED";
    assert.equal(airlineStatus, AIRLINE_STATUS_ENUMS.APPROVED, error2);
});

it('airline 5 should be able to apply', async () => {
    const fifth_airline_name = "FIFTH_TEST_AIRLINE";
    await appContract.applyAirline.sendTransaction(fifth_airline_name, { from: fifthAirline });
    const airlineStatus = `${await dataContract.getAirlineStatus.call(fifth_airline_name, { from: owner })}`;
    const error = "Error: Airline status is not: APPLIED";
    assert.equal(airlineStatus, AIRLINE_STATUS_ENUMS.APPLIED, error);
});

it('airline 4 should be able to vote for airline 5, requiring 4 votes to be approved', async () => {
    const fifth_airline_name = "FIFTH_TEST_AIRLINE";
    await appContract.voteAirline.sendTransaction(fifthAirline, fifth_airline_name, { from: fourthAirline });
    const numberOfApprovals = await dataContract.getAirlineApprovalCount.call(fifthAirline, { from: owner });
    const error1 = "Error: Number of approvals should be 1";
    assert.equal(1, `${numberOfApprovals}`, error1);
    const airlineStatus = `${await dataContract.getAirlineStatus.call(fifth_airline_name, { from: owner })}`;
    const error2 = "Error: Airline status is not: APPLIED";
    assert.equal(airlineStatus, AIRLINE_STATUS_ENUMS.APPLIED, error2);
    await appContract.voteAirline.sendTransaction(fifthAirline, fifth_airline_name, { from: firstAirline });
    await appContract.voteAirline.sendTransaction(fifthAirline, fifth_airline_name, { from: secondAirline });
    await appContract.voteAirline.sendTransaction(fifthAirline, fifth_airline_name, { from: thirdAirline });
    const after3MoreVotesAirlineStatus = `${await dataContract.getAirlineStatus.call(fifth_airline_name, { from: owner })}`;
    const error3 = "Error: Airline status is not: APPROVED";
    assert.equal(after3MoreVotesAirlineStatus, AIRLINE_STATUS_ENUMS.APPROVED, error3);
});