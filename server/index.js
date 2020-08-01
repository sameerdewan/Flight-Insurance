const express = require('express');
const Web3 = require('web3');
const app = express();

let oracle_history = [];

app.get('/api', (_, res) => {
    res.json({ oracle_history });
});

app.listen(5000, () => {
    console.log('Oracle Server App running on port 5000...');
});