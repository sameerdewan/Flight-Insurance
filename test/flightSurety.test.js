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
    let airline_applied_event_emitted = false;
    await dataContract.AirlineApplied(() => airline_applied_event_emitted = true);
    await appContract.applyAirline.sendTransaction(second_airline_name, { from: secondAirline });
    const airlineStatus = `${await dataContract.getAirlineStatus.call(second_airline_name, { from: owner })}`;
    const error = "Error: Airline status is not: APPLIED";
    assert.equal(airlineStatus, AIRLINE_STATUS_ENUMS.APPLIED, error);
    const error2 = "Error: Applied Event not Emitted";
    assert.equal(airline_applied_event_emitted, true, error2);
});

it('airline 1 should be able to vote for airline 2, immediately being approved', async () => {
    let airline_voted_for_event_emitted = false;
    let airline_approved_event_emitted = false;
    await dataContract.AirlineVotedFor(() => airline_voted_for_event_emitted = true);
    await dataContract.AirlineApproved(() => airline_approved_event_emitted = true);
    await appContract.voteAirline.sendTransaction(secondAirline, second_airline_name, { from: firstAirline });
    const numberOfApprovals = await dataContract.getAirlineApprovalCount.call(secondAirline, { from: owner });
    const error1 = "Error: Number of approvals should be 1";
    assert.equal(1, `${numberOfApprovals}`, error1);
    const airlineStatus = `${await dataContract.getAirlineStatus.call(second_airline_name, { from: owner })}`;
    const error2 = "Error: Airline status is not: APPROVED";
    assert.equal(airlineStatus, AIRLINE_STATUS_ENUMS.APPROVED, error2);
    const error3 = "Error: Voted For Event not Emitted";
    assert.equal(airline_voted_for_event_emitted, true, error3);
    const error4 = "Error: Approved Event not Emitted";
    assert.equal(airline_approved_event_emitted, true, error4);
});

it('airline 3 should be able to apply', async () => {
    let airline_applied_event_emitted = false;
    await dataContract.AirlineApplied(() => airline_applied_event_emitted = true);
    await appContract.applyAirline.sendTransaction(third_airline_name, { from: thirdAirline });
    const airlineStatus = `${await dataContract.getAirlineStatus.call(third_airline_name, { from: owner })}`;
    const error1 = "Error: Airline status is not: APPLIED";
    assert.equal(airlineStatus, AIRLINE_STATUS_ENUMS.APPLIED, error1);
    const error2 = "Error: Applied Event not Emitted";
    assert.equal(airline_applied_event_emitted, true, error2);
});

it('airline 2 should be able to vote for airline 3, immediately being approved', async () => {
    let airline_voted_for_event_emitted = false;
    let airline_approved_event_emitted = false;
    await dataContract.AirlineVotedFor(() => airline_voted_for_event_emitted = true);
    await dataContract.AirlineApproved(() => airline_approved_event_emitted = true);
    await appContract.voteAirline.sendTransaction(thirdAirline, third_airline_name, { from: secondAirline });
    const numberOfApprovals = await dataContract.getAirlineApprovalCount.call(thirdAirline, { from: owner });
    const error1 = "Error: Number of approvals should be 1";
    assert.equal(1, `${numberOfApprovals}`, error1);
    const airlineStatus = `${await dataContract.getAirlineStatus.call(third_airline_name, { from: owner })}`;
    const error2 = "Error: Airline status is not: APPROVED";
    assert.equal(airlineStatus, AIRLINE_STATUS_ENUMS.APPROVED, error2);
    const error3 = "Error: Voted For Event not Emitted";
    assert.equal(airline_voted_for_event_emitted, true, error3);
    const error4 = "Error: Approved Event not Emitted";
    assert.equal(airline_approved_event_emitted, true, error4);
});

it('airline 4 should be able to apply', async () => {
    let airline_applied_event_emitted = false;
    await dataContract.AirlineApplied(() => airline_applied_event_emitted = true);
    await appContract.applyAirline.sendTransaction(fourth_airline_name, { from: fourthAirline });
    const airlineStatus = `${await dataContract.getAirlineStatus.call(fourth_airline_name, { from: owner })}`;
    const error = "Error: Airline status is not: APPLIED";
    assert.equal(airlineStatus, AIRLINE_STATUS_ENUMS.APPLIED, error);
    const error2 = "Error: Applied Event not Emitted";
    assert.equal(airline_applied_event_emitted, true, error2);
});

it('airline 3 should be able to vote for airline 4, immediately being approved', async () => {
    let airline_voted_for_event_emitted = false;
    let airline_approved_event_emitted = false;
    await dataContract.AirlineVotedFor(() => airline_voted_for_event_emitted = true);
    await dataContract.AirlineApproved(() => airline_approved_event_emitted = true);
    await appContract.voteAirline.sendTransaction(fourthAirline, fourth_airline_name, { from: thirdAirline });
    const numberOfApprovals = await dataContract.getAirlineApprovalCount.call(fourthAirline, { from: owner });
    const error1 = "Error: Number of approvals should be 1";
    assert.equal(1, `${numberOfApprovals}`, error1);
    const airlineStatus = `${await dataContract.getAirlineStatus.call(fourth_airline_name, { from: owner })}`;
    const error2 = "Error: Airline status is not: APPROVED";
    assert.equal(airlineStatus, AIRLINE_STATUS_ENUMS.APPROVED, error2);
    const error3 = "Error: Voted For Event not Emitted";
    assert.equal(airline_voted_for_event_emitted, true, error3);
    const error4 = "Error: Approved Event not Emitted";
    assert.equal(airline_approved_event_emitted, true, error4);
});

it('airline 5 should be able to apply', async () => {
    let airline_applied_event_emitted = false;
    await dataContract.AirlineApplied(() => airline_applied_event_emitted = true);
    await appContract.applyAirline.sendTransaction(fifth_airline_name, { from: fifthAirline });
    const airlineStatus = `${await dataContract.getAirlineStatus.call(fifth_airline_name, { from: owner })}`;
    const error = "Error: Airline status is not: APPLIED";
    assert.equal(airlineStatus, AIRLINE_STATUS_ENUMS.APPLIED, error);
    const error2 = "Error: Applied Event not Emitted";
    assert.equal(airline_applied_event_emitted, true, error2);
});

it('airline 4 should be able to vote for airline 5, requiring 4 votes to be approved', async () => {
    let airline_voted_for_event_emitted = 0;
    let airline_approved_event_emitted = false;
    await dataContract.AirlineVotedFor(() => airline_voted_for_event_emitted += 1);
    await dataContract.AirlineApproved(() => airline_approved_event_emitted = true);
    await appContract.voteAirline.sendTransaction(fifthAirline, fifth_airline_name, { from: fourthAirline });
    const numberOfApprovals = await dataContract.getAirlineApprovalCount.call(fifthAirline, { from: owner });
    const error1 = "Error: Number of approvals should be 1";
    assert.equal(1, `${numberOfApprovals}`, error1);
    const airlineStatus = `${await dataContract.getAirlineStatus.call(fifth_airline_name, { from: owner })}`;
    const error2 = "Error: Airline status is not: APPLIED";
    assert.equal(airlineStatus, AIRLINE_STATUS_ENUMS.APPLIED, error2);
    await appContract.voteAirline.sendTransaction(fifthAirline, fifth_airline_name, { from: firstAirline });
    await dataContract.AirlineVotedFor(() => airline_voted_for_event_emitted += 1);
    await appContract.voteAirline.sendTransaction(fifthAirline, fifth_airline_name, { from: secondAirline });
    await dataContract.AirlineVotedFor(() => airline_voted_for_event_emitted += 1);
    await appContract.voteAirline.sendTransaction(fifthAirline, fifth_airline_name, { from: thirdAirline });
    await dataContract.AirlineVotedFor(() => airline_voted_for_event_emitted += 1);
    const after3MoreVotesAirlineStatus = `${await dataContract.getAirlineStatus.call(fifth_airline_name, { from: owner })}`;
    const error3 = "Error: Airline status is not: APPROVED";
    assert.equal(after3MoreVotesAirlineStatus, AIRLINE_STATUS_ENUMS.APPROVED, error3);
    const error4 = "Error: Approved Event not Emitted";
    assert.equal(airline_approved_event_emitted, true, error4);
    const error5 = "Error: Voted For Event not called 4 times";
    assert.equal(airline_voted_for_event_emitted, 4, error5);
});

it('airline 2 should be fundable and have appropriate funds post funding', async () => {
    let airiline_funded_event_emitted = false;
    await dataContract.AirlineFunded(() => airiline_funded_event_emitted  = true);
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
    const error3 = "Error: Airline Funded Event not Emitted";
    assert.equal(airiline_funded_event_emitted, true, error3);
});

it('airline 2 should be able to add a flight', async () => {
    let airline_flight_added_event_emitted = false;
    const _timeOfFlight = new Date(2021, 00, 01, 10, 30, 00, 0) // January 1, 2021 10:30
    const _timeOfFlightInSeconds = _timeOfFlight.getTime() / 1000;
    await dataContract.FlightAdded(() => airline_flight_added_event_emitted = true);
    await appContract.addFlight.sendTransaction(default_initial_flight, secondAirline, _timeOfFlightInSeconds, 
        { from: secondAirline, gas: default_gas }
    );
    const { name, airline, timeOfFlightInSeconds } = await dataContract.getFlight.call(second_airline_name, default_initial_flight, { from: owner });
    const expectedFlightState = [default_initial_flight, secondAirline, _timeOfFlightInSeconds];
    const actualFlightState = [name, airline, Number(`${timeOfFlightInSeconds}`)];
    const error1 = "Error: Unexpected Flight State";
    assert.deepEqual(expectedFlightState, actualFlightState, error1);
    const error2 = "Error: Flight Added Event not Emitted";
    assert.equal(airline_flight_added_event_emitted, true, error2);
});

it('passenger should be able to buy insurance for airline 2 initial flight', async () => {
    let insurance_sold_event_emitted = false;
    const value = web3.utils.toWei("5");
    const maxValue = web3.utils.toWei("1");
    await dataContract.InsuranceSold(() => insurance_sold_event_emitted = true);
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
    const error2 = "Error: Insurance Sold Event not Emitted";
    assert.equal(insurance_sold_event_emitted, true, error2);
});

it('passenger should not be able to claim insurance if flight status not delayed on airline behalf', async () => {
    let insurance_invalid_claim_event_emitted = false;
    let caughtError = false;
    await dataContract.InvalidClaim(() => insurance_invalid_claim_event_emitted = true);
    try {
        await appContract.claimInsurance.call(second_airline_name, default_initial_flight, { from: passenger });
    } catch (error) {
        caughtError = true;
    }
    const error1 = "Error: Invalid Claim Event was not Emitted";
    assert.equal(insurance_invalid_claim_event_emitted, true, error1);
    const error2 = "Error: Claim went through, error was uncaught";
    assert.equal(caughtError, true, error2);
});