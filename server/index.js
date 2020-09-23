const express = require('express');
const Web3 = require('web3');
const BigNumber = require('bignumber.js');
const { forEach } = require('lodash');
const app = express();
const url = 'http://localhost:8545';
const FlightSuretyApp  = require('../build/contracts/FlightSuretyApp.json');
const { address } = require('./deployments.json').localhost.FlightSuretyApp;
const refinedURL = url.replace('http', 'ws');

/* GLOBAL VARS */
let oracle_history = [];
let oracles = [];
const MINIMUM_ORACLES = 21;
const GAS = 9500000;

/* UTILITIES */
function getTime() {
    const unformattedTime = new Date();
    return unformattedTime.toLocaleString();
}

function pushEvent(event) {
    console.log(event);
    const time = getTime();
    const addedEvent = { time, event };
    oracle_history = [...oracle_history, addedEvent];
}

/* FLIGHT STATUS CODES */
const STATUSES = [
    "STATUS_CODE_UNKNOWN", 
    "STATUS_CODE_ON_TIME", 
    "STATUS_CODE_LATE_AIRLINE",
    "STATUS_CODE_LATE_WEATHER",
    "STATUS_CODE_LATE_TECHNICAL",
    "STATUS_CODE_LATE_OTHER"
];
const CODES = [0, 10, 20, 30, 40, 50];

async function retrieveFlightStatus() {
    const event = 'RETRIEVING FLIGHT STATUS';
    pushEvent(event);
    const statusCode = Math.floor(Math.random() * 6) * 10;
    const statusLabel = STATUSES[CODES.indexOf(statusCode)];
    return { statusCode, statusLabel };
}

/* WEB3 APP */
const provider = new Web3.providers.WebsocketProvider(refinedURL);
const web3 = new Web3(provider);
const contractOwner = web3.eth.accounts[0];
web3.eth.defaultAccount = contractOwner;
const flightSuretyApp = new web3.eth.Contract(FlightSuretyApp.abi, address);

async function registerOracles(accounts) {
    const event = 'STARTING TO REGISTER ORACLES \n';
    pushEvent(event);
    for (let i = 0; i < accounts.length; i++) {
        const account = accounts[i];
        const event = `ATTEMPTING TO REGISTER ORACLE: ${account} \n`;
        pushEvent(event);
        const payload = {
            from: account,
            value: '1000000000000000000',
            gas: GAS
        };
        try {
            await flightSuretyApp.methods.registerOracle().send(payload);
            oracles = [...oracles, account];
            const event = `SUCCESS: Registered oracle: ${account}. \n`
            pushEvent(event);
        } catch (error) {
            const event = `ERROR - FAILED TO REGISTER ORACLE: ${account}: ${error} \n`;
            pushEvent(event);
        }
    }
}

async function respondToFetchFlightStatusRequest(index, airline, flight, timestamp ) {
    const event = `Oracle Request Recieved: index:${index}, airline:${airline}, flight:${flight}, timestamp:${timestamp}`;
    pushEvent(event);
    if (oracles.length < 1) {
        const event2 = 'Oracle Request Denied: Not enough oracles.';
        pushEvent(event2);
        return;
    }

    const passingOracles = [];

    forEach(oracles, oracle => {
        const index1Check = BigNumber(oracle.indexes[0]).isEqualTo(index);
        const index2Check = BigNumber(oracle.indexes[1]).isEqualTo(index);
        const index3Check = BigNumber(oracle.indexes[2]).isEqualTo(index);
        const isPassing = index1Check || index2Check || index3Check;
        if (isPassing) {
            passingOracles.push(oracle);
        }
    });

    if (passingOracles.length === 0) {
        const event3 = 'No passing oracles found';
        pushEvent(event3);
        return;
    }

    const event4 = `Found passing oracles: ${passingOracles}`;
    pushEvent(event4);

    forEach(oracles, async oracle => {
        try {
            await flightSuretyApp.methods.submitOracleResponse(index, airline, flight, timestamp, oracle.statusCode).send({ from: oracle.address, gas: GAS });
        } catch (error) {
            const event5 = `Error Caught: ${error}`;
            pushEvent(event5);
        }
        const event6 = `Oracle response successfully submited: address:${address}::statusCode:${oracle.statusCode}`;
        pushEvent(event6);
    });
}

async function start() {
    const accounts = await web3.eth.getAccounts();
    if (accounts.length < MINIMUM_ORACLES) {
        throw new Error(`Insufficient amount of oracle accounts - needed ${MINIMUM_ORACLES}`);
    }
    await registerOracles(accounts);
}

/* SERVER APP */
app.get('/logs', (_, res) => {
    res.json({ oracle_history });
});

app.get('/oracles', (_, res) => {
    res.json({ oracles });
});

app.listen(5000, () => {
    start();
    console.log('Oracle Server App running on port 5000...');
    console.log('GET /logs for server log history');
    console.log('GET /oracles for registered oracles');
    console.log('-----------------------------------------');
    console.log('v               LOGS                    v');
    console.log('-----------------------------------------');
});