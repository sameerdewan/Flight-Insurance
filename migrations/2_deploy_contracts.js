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
                });
    });
}
