const express = require('express');
const Web3 = require('web3');
const { forEach } = require('lodash');
const url = require('./deployments.json').localhost.url;
const App  = require('./deployments.json').localhost.App;
const Oracle  = require('./deployments.json').localhost.Oracle;
const refinedURL = url.replace('http', 'ws');

const app = express();

const oracleHistory = [];
const oracles = [];
const MINIMUM_ORACLES = 21;
const GAS = 4712388;
const FEE = 100000000000000000;

function getStatus() {
    const STATUS_CODE_ON_TIME = "STATUS_CODE_ON_TIME";
    const STATUS_CODE_LATE_AIRLINE = "STATUS_CODE_LATE_AIRLINE";
    const STATUS_CODE_LATE_WEATHER = "STATUS_CODE_LATE_WEATHER";
    const STATUS_CODE_LATE_TECHNICAL = "STATUS_CODE_LATE_TECHNICAL";
    const STATUS_CODE_LATE_OTHER = "STATUS_CODE_LATE_OTHER";

    const statuses = [STATUS_CODE_UNKNOWN, STATUS_CODE_ON_TIME, STATUS_CODE_LATE_AIRLINE, STATUS_CODE_LATE_WEATHER, STATUS_CODE_LATE_TECHNICAL, STATUS_CODE_LATE_OTHER];
    return statuses[Math.floor(Math.random() * statuses.length)];
}

function getTime() {
    const unformattedTime = new Date();
    return unformattedTime.toLocaleString();
}

function pushEvent(event) {
    console.log(event, '\n');
    const time = getTime();
    const addedEvent = { time, event };
    oracleHistory.push(addedEvent);
}

function addOracle(oracle) {
    oracles.push(oracle);
}

const web3 = new Web3(refinedURL);
web3.setProvider(new Web3.providers.WebsocketProvider(refinedURL));
const appContract = new web3.eth.Contract(App.abi, App.address);
const oracleContract = new web3.eth.Contract(Oracle.abi, Oracle.address);

async function registerOracles(accounts) {
    pushEvent('STARTING TO REGISTER ORACLES...');
    for (let index = 10; index < accounts.length; index++) {
        const oracle = accounts[index];
        pushEvent(`ATTEMPTING TO REGISTER ORACLE: ${oracle}`);
        try {
            await appContract.methods.registerOracle(`Oracle ${index}`).send({ from: oracle, value: FEE, gas: GAS });
            addOracle(oracle);
            pushEvent(`ADDED ORACLE: ${oracle}`);
        } catch (error) {
            pushEvent(`FAILED TO ADD ORACLE ${error}`);
        }
    }
}

async function respondToOracleRequest(oracleIndex, oracleTimestamp, airlineName, flightName) {
    pushEvent(`REQUEST RECEIVED: ${oracleIndex}, ${oracleTimestamp}, ${airlineName}, ${flightName}`);
    if (!oracles.length) {
        pushEvent('REQUEST DENIED NOT ENOUGH ORACLES');
    }

    forEach(oracles, async oracle => {
        try {
            const flightStatus = getStatus();
            await oracleContract.methods.submitOracleResponse(oracleIndex, oracleTimestamp, airlineName, flightName, flightStatus).send({ from: oracle, gas: GAS });
            pushEvent(`ORACLE ${oracle} RESPONSE: ${oracleIndex}, ${oracleTimestamp}, ${airlineName}, ${flightName}, ${flightStatus}`);
        } catch (error) {
            pushEvent(`ORACLE ${oracle} ERROR: ${error}`);
        }
    });
}

async function startOracles() {
    const accounts = await web3.eth.getAccounts();
    if (accounts.length < MINIMUM_ORACLES) {
        return pushEvent(`ERROR: NOT ENOUGH ACCOUNTS TO START SERVER FOR ORACLES`);
    }
    await registerOracles(accounts);

    oracleContract.events.ORACLE_REQUEST()
        .on('data', event => {
            const { oracleIndex, oracleTimestamp, airlineName, flightName } = event.returnValues;
            respondToOracleRequest(oracleIndex, oracleTimestamp, airlineName, flightName);
        })
        .on('error', error => console.log('reached err'));
}

app.get('/logs', (_, res) => {
    res.json({ oracleHistory });
});

app.get('/oracles', (_, res) => {
    res.json({ oracles });
});

app.set('json spaces', 2)

app.listen(5000, async () => {
    console.log('Oracle Server App running on port 5000...');
    console.log('GET /logs for server log history');
    console.log('GET /oracles for registered oracles');
    console.log('-----------------------------------------');
    console.log('v               LOGS                    v');
    console.log('-----------------------------------------');
    await startOracles();
});