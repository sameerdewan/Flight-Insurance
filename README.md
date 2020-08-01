# Flight Surety dApp
This project is for the Udacity Blockchain Program, building an insurance dapp on the ethereum blockchain.

## Project Specifications
Truffle v5.1.26 (core: 5.1.26)

Solidity - ^0.6.0 (solc-js)

Node v10.16.3

Web3.js v1.2.1

Ganache CLI v6.9.1 (ganache-core: 2.10.2)

@openzeppelin/contracts - ^3.1.0

@truffle/hdwallet-provider - ^1.0.40-4
## How to Build the Project
> **_Note:_**  The commands <i>must</i> be run in order. Each step sequentially needs the previous to have run to completion.

In a dedicated terminal <code>(terminal 1)</code>, run the following:

    npm install

After the install is completed, run the following in the dedicated terminal <code>(terminal 1)</code>:

    npm run ganache

In another dedicated terminal <code>(terminal 2)</code>, run the following:

    npm run migrate-dev

Following the migration to truffle, run this command in the terminal <code>(terminal 2)</code>, run the next command:

    npm run server

In another dedicated terminal <code>(terminal 3)</code>, run the following:

    npm run dapp

In total, you will have <b>3</b> running open terminals. One will be dedicated to <b>ganache-cli</b>, the second to running the <b>server</b>, and the third for running the <b>client react app</b>.

## How to Run Smart Contract Tests
In a dedicated terminal <code>(terminal 1)</code>, run the following:

    npm run ganache

In another terminal <code>(terminal 2)</code>, run the following:

    npm run test

In total, you will have <b>2</b> running open terminals. One will be dedicated to <b>ganache-cli</b>, the second to running the <b>solidity tests</b>.

## Troubleshooting
If you are encountering trouble, check to make sure your build is removed, and the config files have been removed before re-trying the build steps. 

A helper script is available to you to accomplish this, by running the below in a terminal.

    npm run clean
