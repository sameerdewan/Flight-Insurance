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
> **_Note:_**  The commands <i>must</i> be run in order. Each step sequentially needs the previous to have run to completion. I have also created a video guide walkthrough that goes through the build steps and testing steps that helps you navigate this in an intuitve way.

### Steps (Video)(Advised/Preferred)
[1. Setting up the Project](https://www.youtube.com/watch?v=Ei4pDGOKuUg)
[2. Starting the dApp](https://www.youtube.com/watch?v=qArOa3MNDko)
[3. Airline Administration](https://www.youtube.com/watch?v=sQF9RQkqmfA)
[4. Airline Funding and Flight Creation](https://www.youtube.com/watch?v=dYen0hV3V8g)
[5. Running our Oracles](https://www.youtube.com/watch?v=ed67CiWAS3g)
[6. Getting an Insurance Payout](https://www.youtube.com/watch?v=0p-yBrRm7Y8)

### Steps (Text)

In a dedicated terminal <code>(terminal 1)</code>, run the following:

    npm install 
    npm run dapp

After the install is completed, run the following in the dedicated terminal <code>(terminal 1)</code>:

    npm run ganache

In another dedicated terminal <code>(terminal 2)</code>, run the following:

    npm run migrate-dev

Following the migration to ganache and setting wiring the contract from the ui, run this command in the terminal <code>(terminal 2)</code>, run the next command:

    npm run server

## Troubleshooting
If you are encountering trouble, check to make sure your build is removed, and the config files have been removed before re-trying the build steps. 

A helper script is available to you to accomplish this, by running the below in a terminal.

    npm run clean
