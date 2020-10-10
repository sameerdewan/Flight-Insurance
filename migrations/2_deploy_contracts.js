const App = artifacts.require("App");
const Data = artifacts.require("Data");
const Oracle = artifacts.require("Oracle");
const fs = require('fs');

module.exports = async function (deployer) {
    await deployer.deploy(App)
        .then(async app => {
            await deployer.deploy(Data)
                .then(data => {
                    await deployer.deploy(Oracle)
                        .then(oracle => {
                            let config = {
                                localhost: {
                                    url: 'http://localhost:8545',
                                    App: {
                                        address: app.address,
                                        abi: app.abi
                                    },
                                    Data: {
                                        address: data.address,
                                        abi: data.abi
                                    },
                                    Oracle: {
                                        address: oracle.address,
                                        abi: oracle.abi
                                    }
                                }
                            };
                            fs.writeFileSync('./client/src/deployments.json', JSON.stringify(config, null, '\t'), 'utf-8');
                            fs.writeFileSync('./server/deployments.json', JSON.stringify(config, null, '\t'), 'utf-8');
                        });
                });
        });
}