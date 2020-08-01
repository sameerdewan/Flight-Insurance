const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const FlightSuretyApp = artifacts.require("FlightSuretyApp");
const FlightSuretyData = artifacts.require("FlightSuretyData");
const fs = require('fs');
const { mnemonic, infuraKey, initialAirline } = require('../constants');

module.exports = function(deployer) {

    deployer.deploy(FlightSuretyData, initialAirline)
    .then(() => {
        return deployer.deploy(FlightSuretyApp, FlightSuretyData.address)
                .then(async () => {
                    let config = {
                        localhost: {
                            url: 'http://localhost:8545',
                            FlightSuretyData: {
                                address: FlightSuretyData.address,
                                abi: FlightSuretyData.abi
                            },
                            FlightSuretyApp: {
                                address: FlightSuretyApp.address,
                                abi: FlightSuretyData.abi
                            }
                        }
                    };
                    await new Promise(resolve => resolve(fs.writeFileSync('../deployments.json',JSON.stringify(config, null, '\t'), 'utf-8')));
                    const provider = new HDWalletProvider(mnemonic, infuraKey);
                    const web3 = new Web3(provider);
                    const { abi, address } = config.localhost.FlightSuretyData;
                    const dataContractinstance = new web3.eth.Contract(abi, address);
                    const { address: appAddress } = config.localhost.FlightSuretyApp; 
                    dataContractinstance.methods.wireApp(appAddress).call()
                        .then(async () => {
                            console.log('<--WIRED APP-->');
                        }).catch(error => {
                            console.log({error});
                            console.log('!--FAILED TO WIRE APP--!');
                        });
                });
    });
}
