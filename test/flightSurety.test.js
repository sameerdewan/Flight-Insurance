const truffleAssert = require('truffle-assertions');
const FlightSuretyData = artifacts.require("FlightSuretyData");
const FlightSuretyApp = artifacts.require("FlightSuretyApp");

const default_gas = 9500000;
const initial_airline_name = "INITIAL_TEST_AIRLINE";
const default_minimum_funding = web3.utils.toWei("10");

const second_airline_name = "SECOND_TEST_AIRLINE";
const third_airline_name = "THIRD_TEST_AIRLINE";
const fourth_airline_name = "FOURTH_TEST_AIRLINE";
const fifth_airline_name = "FIFTH_TEST_AIRLINE";

const default_initial_flight = "FIRST_TEST_FLIGHT";

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
    const tx = await appContract.applyAirline.sendTransaction(second_airline_name, { from: secondAirline });
    const airlineStatus = `${await dataContract.getAirlineStatus.call(second_airline_name, { from: owner })}`;
    const error = "Error: Airline status is not: APPLIED";
    assert.equal(airlineStatus, AIRLINE_STATUS_ENUMS.APPLIED, error);
    const newTx = await truffleAssert.createTransactionResult(dataContract, tx.tx);
    truffleAssert.eventEmitted(newTx, 'AirlineApplied');
});

it('airline 1 should be able to vote for airline 2, immediately being approved', async () => {
    const tx = await appContract.voteAirline.sendTransaction(secondAirline, second_airline_name, { from: firstAirline });
    const numberOfApprovals = await dataContract.getAirlineApprovalCount.call(secondAirline, { from: owner });
    const error1 = "Error: Number of approvals should be 1";
    assert.equal(1, `${numberOfApprovals}`, error1);
    const airlineStatus = `${await dataContract.getAirlineStatus.call(second_airline_name, { from: owner })}`;
    const error2 = "Error: Airline status is not: APPROVED";
    assert.equal(airlineStatus, AIRLINE_STATUS_ENUMS.APPROVED, error2);
    const newTx = await truffleAssert.createTransactionResult(dataContract, tx.tx);
    truffleAssert.eventEmitted(newTx, 'AirlineVotedFor');
});

it('airline 3 should be able to apply', async () => {
    const tx = await appContract.applyAirline.sendTransaction(third_airline_name, { from: thirdAirline });
    const airlineStatus = `${await dataContract.getAirlineStatus.call(third_airline_name, { from: owner })}`;
    const error1 = "Error: Airline status is not: APPLIED";
    assert.equal(airlineStatus, AIRLINE_STATUS_ENUMS.APPLIED, error1);
    const newTx = await truffleAssert.createTransactionResult(dataContract, tx.tx);
    truffleAssert.eventEmitted(newTx, 'AirlineApplied');
});

it('airline 2 should be able to vote for airline 3, immediately being approved', async () => {
    const tx = await appContract.voteAirline.sendTransaction(thirdAirline, third_airline_name, { from: secondAirline });
    const numberOfApprovals = await dataContract.getAirlineApprovalCount.call(thirdAirline, { from: owner });
    const error1 = "Error: Number of approvals should be 1";
    assert.equal(1, `${numberOfApprovals}`, error1);
    const airlineStatus = `${await dataContract.getAirlineStatus.call(third_airline_name, { from: owner })}`;
    const error2 = "Error: Airline status is not: APPROVED";
    assert.equal(airlineStatus, AIRLINE_STATUS_ENUMS.APPROVED, error2);
    const newTx = await truffleAssert.createTransactionResult(dataContract, tx.tx);
    truffleAssert.eventEmitted(newTx, 'AirlineVotedFor');
});

it('airline 4 should be able to apply', async () => {
    const tx = await appContract.applyAirline.sendTransaction(fourth_airline_name, { from: fourthAirline });
    const airlineStatus = `${await dataContract.getAirlineStatus.call(fourth_airline_name, { from: owner })}`;
    const error = "Error: Airline status is not: APPLIED";
    assert.equal(airlineStatus, AIRLINE_STATUS_ENUMS.APPLIED, error);
    const newTx = await truffleAssert.createTransactionResult(dataContract, tx.tx);
    truffleAssert.eventEmitted(newTx, 'AirlineApplied');
});

it('airline 3 should be able to vote for airline 4, immediately being approved', async () => {
    const tx = await appContract.voteAirline.sendTransaction(fourthAirline, fourth_airline_name, { from: thirdAirline });
    const numberOfApprovals = await dataContract.getAirlineApprovalCount.call(fourthAirline, { from: owner });
    const error1 = "Error: Number of approvals should be 1";
    assert.equal(1, `${numberOfApprovals}`, error1);
    const airlineStatus = `${await dataContract.getAirlineStatus.call(fourth_airline_name, { from: owner })}`;
    const error2 = "Error: Airline status is not: APPROVED";
    assert.equal(airlineStatus, AIRLINE_STATUS_ENUMS.APPROVED, error2);
    const newTx = await truffleAssert.createTransactionResult(dataContract, tx.tx);
    truffleAssert.eventEmitted(newTx, 'AirlineVotedFor');
});

it('airline 5 should be able to apply', async () => {
    const tx = await appContract.applyAirline.sendTransaction(fifth_airline_name, { from: fifthAirline });
    const airlineStatus = `${await dataContract.getAirlineStatus.call(fifth_airline_name, { from: owner })}`;
    const error = "Error: Airline status is not: APPLIED";
    assert.equal(airlineStatus, AIRLINE_STATUS_ENUMS.APPLIED, error);
    const newTx = await truffleAssert.createTransactionResult(dataContract, tx.tx);
    truffleAssert.eventEmitted(newTx, 'AirlineApplied');
});

it('airline 4 should be able to vote for airline 5, requiring 4 votes to be approved', async () => {
    const tx1 = await appContract.voteAirline.sendTransaction(fifthAirline, fifth_airline_name, { from: fourthAirline });
    const newTx1 = await truffleAssert.createTransactionResult(dataContract, tx1.tx);
    truffleAssert.eventEmitted(newTx1, 'AirlineVotedFor');

    const numberOfApprovals = await dataContract.getAirlineApprovalCount.call(fifthAirline, { from: owner });
    const error1 = "Error: Number of approvals should be 1";
    assert.equal(1, `${numberOfApprovals}`, error1);

    const airlineStatus = `${await dataContract.getAirlineStatus.call(fifth_airline_name, { from: owner })}`;
    const error2 = "Error: Airline status is not: APPLIED";
    assert.equal(airlineStatus, AIRLINE_STATUS_ENUMS.APPLIED, error2);

    const tx2 = await appContract.voteAirline.sendTransaction(fifthAirline, fifth_airline_name, { from: firstAirline });
    const newTx2 = await truffleAssert.createTransactionResult(dataContract, tx2.tx);
    truffleAssert.eventEmitted(newTx2, 'AirlineVotedFor');

    const tx3 = await appContract.voteAirline.sendTransaction(fifthAirline, fifth_airline_name, { from: secondAirline });
    const newTx3 = await truffleAssert.createTransactionResult(dataContract, tx3.tx);
    truffleAssert.eventEmitted(newTx3, 'AirlineVotedFor');

    const tx4 = await appContract.voteAirline.sendTransaction(fifthAirline, fifth_airline_name, { from: thirdAirline });
    const newTx4 = await truffleAssert.createTransactionResult(dataContract, tx4.tx);
    truffleAssert.eventEmitted(newTx4, 'AirlineVotedFor');
    truffleAssert.eventEmitted(newTx4, 'AirlineApproved');

    const after3MoreVotesAirlineStatus = `${await dataContract.getAirlineStatus.call(fifth_airline_name, { from: owner })}`;
    const error3 = "Error: Airline status is not: APPROVED";
    assert.equal(after3MoreVotesAirlineStatus, AIRLINE_STATUS_ENUMS.APPROVED, error3);
});

it('airline 2 should be fundable and have appropriate funds post funding', async () => {
    const initialInsuredState = await dataContract.getInsuredStatus.call(second_airline_name, { from: owner });
    const initialInsuredState_BOOL = initialInsuredState.airlineIsFunded;
    const initialInsuredState_FUNDS = Number(`${initialInsuredState.funds}`);
    const expectedPreInsuredState = [false, 0];
    const returnedPreInsuredState = [initialInsuredState_BOOL, initialInsuredState_FUNDS];
    const error1 = "Error: Unexpected Preinsured State";
    assert.deepEqual(expectedPreInsuredState, returnedPreInsuredState, error1);
    await appContract.fundAirline.sendTransaction(secondAirline, { from: secondAirline, value: default_minimum_funding, gas: default_gas });
    const postInsuredState = await dataContract.getInsuredStatus.call(second_airline_name, { from: owner });
    const postInsuredState_BOOL = postInsuredState.airlineIsFunded;
    const postInsuredState_FUNDS = Number(`${postInsuredState.funds}`);
    const expectedPostInsuredState = [true, Number(default_minimum_funding)];
    const returnedPostInsuranceState = [postInsuredState_BOOL, postInsuredState_FUNDS];
    const error2 = "Error: Unexpected Postinsured State";
    assert.deepEqual(expectedPostInsuredState, returnedPostInsuranceState, error2);
});

it('airline 2 should be able to add a flight', async () => {
    const _timeOfFlight = new Date(2021, 00, 01, 10, 30, 00, 0) // January 1, 2021 10:30
    const _timeOfFlightInSeconds = _timeOfFlight.getTime() / 1000;
    await appContract.addFlight.sendTransaction(default_initial_flight, secondAirline, _timeOfFlightInSeconds, 
        { from: secondAirline, gas: default_gas }
    );
    const { name, airline, timeOfFlightInSeconds } = await dataContract.getFlight.call(second_airline_name, default_initial_flight, { from: owner });
    const expectedFlightState = [default_initial_flight, secondAirline, _timeOfFlightInSeconds];
    const actualFlightState = [name, airline, Number(`${timeOfFlightInSeconds}`)];
    const error1 = "Error: Unexpected Flight State";
    assert.deepEqual(expectedFlightState, actualFlightState, error1);
});

it('passenger should be able to buy insurance for airline 2 initial flight', async () => {
    const value = web3.utils.toWei("5");
    const maxValue = web3.utils.toWei("1");
    await appContract.buyInsurance.sendTransaction(second_airline_name, default_initial_flight, { from: passenger, value, gas: default_gas  });
    const { 
        insured, 
        paidOut, 
        funds 
    } = await dataContract.getInsuredPassenger.call(passenger, second_airline_name, default_initial_flight, { from: owner });
    const expectedPassengerInsuranceState = [true, false, Number(maxValue)];
    const actualPassengerInsuranceState = [insured, paidOut, Number(`${funds}`)];
    const error1 = "Error: Unexpected Passenger Insurance State";
    assert.deepEqual(expectedPassengerInsuranceState, actualPassengerInsuranceState, error1);
});

it('passenger should not be able to claim insurance if flight status not delayed on airline behalf', async () => {
    let caughtError = false;
    try {
        await appContract.claimInsurance.call(second_airline_name, default_initial_flight, { from: passenger });
    } catch (error) {
        caughtError = true;
    }
    const error3 = "Error: Claim went through, error was uncaught";
    assert.equal(caughtError, true, error3);
});