const express = require('express');
const Web3 = require('web3');
const app = express();
const { FlightSuretyApp, url } = require('./deployments.json').localhost;
const refinedURL = url.replace('http', 'ws');

/* GLOBAL VARS */
const oracle_history = [];
const oracles = [];
const MINIMUM_ORACLES = 21;
const GAS = 9500000;

/* FLIGHT STATUS CODES */
const FLIGHT = {
    "STATUS_CODE_UNKNOWN": 0,
    "STATUS_CODE_ON_TIME": 10,
    "STATUS_CODE_LATE_AIRLINE": 20,
    "STATUS_CODE_LATE_WEATHER": 30,
    "STATUS_CODE_LATE_TECHNICAL": 40,
    "STATUS_CODE_LATE_OTHER": 50
};

/* WEB3 APP */
const provider = new Web3.providers.WebsocketProvider(refinedURL);
const web3 = new Web3(provider);
const contractOwner = web3.eth.accounts[0];
web3.eth.defaultAccount = contractOwner;
const flightSurityApp = new web3.eth.Contract(FlightSuretyApp.abi, FlightSuretyApp.address);

/* SERVER APP */
app.get('/api', (_, res) => {
    res.json({ oracle_history });
});

app.listen(5000, () => {
    console.log('Oracle Server App running on port 5000...');
    console.log('GET /api for Oracle Log History');
    console.log('-----------------------------------------');
    console.log('v               LOGS                    v');
    console.log('-----------------------------------------');
});