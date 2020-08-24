const express = require('express');
const Web3 = require('web3');
const app = express();
const url = 'http://localhost:8545';
const FlightSuretyApp  = require('../build/contracts/FlightSuretyApp.json');
const { address } = require('./deployments.json').localhost;
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
const FLIGHT = {
    "STATUS_CODE_UNKNOWN": 0,
    "STATUS_CODE_ON_TIME": 10,
    "STATUS_CODE_LATE_AIRLINE": 20,
    "STATUS_CODE_LATE_WEATHER": 30,
    "STATUS_CODE_LATE_TECHNICAL": 40,
    "STATUS_CODE_LATE_OTHER": 50
};

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
const flightSuretyApp = new web3.eth.Contract(FlightSuretyApp.abi, FlightSuretyApp.address);

async function registerOracles(accounts) {
    const event = 'STARTING TO REGISTER ORACLES';
    pushEvent(event);
    for (let i = 0; i < accounts.length; i++) {
        const account = accounts[i];
        const event = `ATTEMPTING TO REGISTER ORACLE: ${account}`;
        pushEvent(event);
        const payload = {
            from: account,
            value: '1000000000000000000',
            gas: GAS
        };
        console.log(flightSuretyApp)
        // try {
        //     await flightSurityApp.methods.registerOracle.send(payload);
        //     oracles = [...oracles, account];
        //     const event = `SUCCESS: Registered oracle: ${account}.`
        //     pushEvent(event);
        // } catch (error) {
        //     const event = `ERROR - FAILED TO REGISTER ORACLE: ${account}: ${error}`;
        //     pushEvent(event);
        // }
    }
}

async function start() {
    const accounts = await web3.eth.getAccounts();
    await registerOracles(accounts);
}

start();

/* SERVER APP */
app.get('/logs', (_, res) => {
    res.json({ oracle_history });
});

app.get('/oracles', (_, res) => {
    res.json({ oracles });
});

app.listen(5000, () => {
    console.log('Oracle Server App running on port 5000...');
    console.log('GET /api for Oracle Log History');
    console.log('-----------------------------------------');
    console.log('v               LOGS                    v');
    console.log('-----------------------------------------');
});