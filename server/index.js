const express = require('express');
const Web3 = require('web3');
const BigNumber = require('bignumber.js');
const { forEach, isNil } = require('lodash');
const app = express();
const url = require('./deployments.json').localhost.url;
const App  = require('./deployments.json').localhost.App;
const Oracle  = require('./deployments.json').localhost.Oracle;
const refinedURL = url.replace('http', 'ws');

const oracleHistory = [];
const oracles = [];
const MINIMUM_ORACLES = 21;
const GAS = 4712388;
const FEE = 100000000000000000;

function getStatus() {
    const STATUS_CODE_UNKNOWN = "STATUS_CODE_UNKNOWN";
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
        pushEvent('NO PASSING ORACLES FOUND');
        return;
    }
    pushEvent(`PASSING ORACLES: ${passingOracles.join('::')}`);

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
        .on('data', event => console.log('reached'))
        .on('error', error => console.log('reached err'));
}

function startServer() {
}

(async () => {
    await startOracles();
    startServer();
})();

// /* WEB3 APP */
// const provider = new Web3.providers.WebsocketProvider(refinedURL);
// const web3 = new Web3(provider);
// const contractOwner = web3.eth.accounts[0];
// web3.eth.defaultAccount = contractOwner;
// const appContract = new web3.eth.Contract(App.abi, App.address);
// const oracleContract = new web3.eth.Contract(Oracle.abi, Oracle.address);

// async function registerOracles(accounts) {
//     const event = 'STARTING TO REGISTER ORACLES \n';
//     pushEvent(event);
//     for (let i = 0; i < accounts.length; i++) {
//         const account = accounts[i];
//         const event = `ATTEMPTING TO REGISTER ORACLE: ${account} \n`;
//         pushEvent(event);
//         const payload = {
//             from: account,
//             value: '1000000000000000000',
//             gas: GAS
//         };
//         try {
//             await appContract.methods.registerOracle(`Oracle ${i}`).send(payload);
//             oracles = [...oracles, account];
//             const event = `SUCCESS: Registered oracle: ${account} -- Oracle ${i}. \n`
//             pushEvent(event);
//         } catch (error) {
//             const event = `ERROR - FAILED TO REGISTER ORACLE: ${account} -- Oracle ${i}: ${error} \n`;
//             pushEvent(event);
//         }
//     }
// }

// async function respondToFetchFlightStatusRequest(index, airline, flight, timestamp ) {
//     const event = `Oracle Request Recieved: index:${index}, airline:${airline}, flight:${flight}, timestamp:${timestamp}`;
//     pushEvent(event);
//     if (oracles.length < 1) {
//         const event2 = 'Oracle Request Denied: Not enough oracles.';
//         pushEvent(event2);
//         return;
//     }

//     const passingOracles = [];

//     forEach(oracles, oracle => {
//         const index1Check = BigNumber(oracle.indexes[0]).isEqualTo(index);
//         const index2Check = BigNumber(oracle.indexes[1]).isEqualTo(index);
//         const index3Check = BigNumber(oracle.indexes[2]).isEqualTo(index);
//         const isPassing = index1Check || index2Check || index3Check;
//         if (isPassing) {
//             passingOracles.push(oracle);
//         }
//     });

//     if (passingOracles.length === 0) {
//         const event3 = 'No passing oracles found';
//         pushEvent(event3);
//         return;
//     }

//     const event4 = `Found passing oracles: ${passingOracles}`;
//     pushEvent(event4);

//     forEach(oracles, async oracle => {
//         try {
//             await oracleContract.methods.submitOracleResponse(index, timestamp, airline, flight, oracle.statusCode).send({ from: oracle.address, gas: GAS });
//         } catch (error) {
//             const event5 = `Error Caught: ${error}`;
//             pushEvent(event5);
//         }
//         const event6 = `Oracle response successfully submited: address:${address}::statusCode:${oracle.statusCode}`;
//         pushEvent(event6);
//     });
// }

// async function start() {
//     const accounts = await web3.eth.getAccounts();
//     if (accounts.length < MINIMUM_ORACLES) {
//         throw new Error(`Insufficient amount of oracle accounts - needed ${MINIMUM_ORACLES}`);
//     }
//     await registerOracles(accounts);

//     flightSuretyApp.events.OracleRequest({fromBlock: 0}, (error, event) => {
//         if (error) {
//             return console.log(error);
//         }
//         if (!event.returnValues) {
//             return console.error("No returnValues");
//         }

//         respondToFetchFlightStatus(
//             event.returnValues.index,
//             event.returnValues.airline,
//             event.returnValues.flight,
//             event.returnValues.timestamp
//         )
//     });

//     flightSuretyApp.events.OracleRequest({fromBlock: 0}, (err, event) => {
//         if (!isNil(err)) {
//             const event1 = `Error caught in Oracle Request event: ${err}`;
//             pushEvent(event1);
//             return;
//         }
//         if (isNil(event.returnValues)) {
//             const event2 = 'Error: No return values found for Oracle Request.';
//             pushEvent(event2);
//             return;
//         }

//         const { index, airline, flight, timestamp } = event.returnValues;

//         respondToFetchFlightStatusRequest(index, airline, flight, timestamp);
//     });

// }

// /* SERVER APP */
// app.get('/logs', (_, res) => {
//     res.json({ oracle_history });
// });

// app.get('/oracles', (_, res) => {
//     res.json({ oracles });
// });

// app.listen(5000, () => {
//     start();
//     console.log('Oracle Server App running on port 5000...');
//     console.log('GET /logs for server log history');
//     console.log('GET /oracles for registered oracles');
//     console.log('-----------------------------------------');
//     console.log('v               LOGS                    v');
//     console.log('-----------------------------------------');
// });