const truffleAssert = require('truffle-assertions');
const FlightSuretyData = artifacts.require("FlightSuretyData");
const FlightSuretyApp = artifacts.require("FlightSuretyApp");

describe('Oracle Tests', () => {
    const default_gas = 9500000;
    const default_fee = web3.utils.toWei("1");
    const default_initial_airline_name = "INITIAL_TEST_FLIGHT";
    const default_initial_flight = "FIRST_TEST_FLIGHT";

    let accounts;

    let owner;
    let dataContract;
    let appContract;

    let firstAirline;

    let passenger;

    contract('Oracle Tests', async (acc) => {
        accounts = acc;
        owner = accounts[0];
        firstAirline = accounts[0];
        passenger = accounts[1];
    });
    
    before(async () => {
        dataContract = await FlightSuretyData.new(initial_airline_name, { from: owner, value: default_minimum_funding, gas: default_gas });
        appContract = await FlightSuretyApp.new(dataContract.address, { from: owner, gas: default_gas });
        await dataContract.wireApp.sendTransaction(appContract.address, { from: owner });
    });

    
});