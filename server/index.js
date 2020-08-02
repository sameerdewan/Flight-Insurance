const express = require('express');
const Web3 = require('web3');
const app = express();
const { FlightSuretyApp, FlightSuretyData, url } = require('./deployments.json').localhost;
const refinedURL = url.replace('http', 'ws');

const oracle_history = [];
const oracles = {};

/* WEB3 APP */


/* SERVER APP */
app.get('/api', (_, res) => {
    res.json({ oracle_history });
});

app.listen(5000, () => {
    console.log('Oracle Server App running on port 5000...');
});