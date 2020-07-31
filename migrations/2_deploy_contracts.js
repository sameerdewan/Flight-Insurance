const Web3 = require('web3');
const FlightSuretyApp = artifacts.require("FlightSuretyApp");
const FlightSuretyData = artifacts.require("FlightSuretyData");
const fs = require('fs');

module.exports = function(deployer) {

    deployer.deploy(FlightSuretyData)
    .then(() => {
        return deployer.deploy(FlightSuretyApp, FlightSuretyData.address)
                .then(() => {
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
                    fs.writeFileSync(__dirname + '/deployments.json',JSON.stringify(config, null, '\t'), 'utf-8');
                    const web3 = new Web3(config.localhost.url);
                    const { abi, address } = config.localhost.FlightSuretyData;
                    const dataContractinstance = new web3.eth.Contract(abi, address);
                    const { address: appAddress } = config.localhost.FlightSuretyApp; 
                    dataContractinstance.methods.wireApp(appAddress).call()
                        .then(result => {
                            console.log({result});
                            console.log('<--WIRED APP-->');
                        }).catch(error => {
                            console.log({error});
                            console.log('!--FAILED TO WIRE APP--!');
                        });
                });
    });
}
