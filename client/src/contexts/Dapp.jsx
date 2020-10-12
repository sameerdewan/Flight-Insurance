import React, { createContext, useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import Web3Context from './Web3';

const DappContext = createContext();

export default DappContext;

export function DappProvider({ children }) {
    const [isOperational, setOperationalStatus] = useState(false);
    const [airlines, setAirlines] = useState([]);
    const [MINIMUM_PARTNER_FEE, setPartnerFee] = useState(undefined);

    const [wiredDataToApp, setWiredDataToApp] = useState({ status: false, loading: false });
    const [wiredOracleToApp, setWiredOracleToApp] = useState({ status: false, loading: false });
    const [appIsOperational, setAppIsOperational] = useState({ status: false, loading: false });

    const [wiredAppToData, setWiredAppToData] = useState({ status: false, loading: false });
    const [wiredOracleToData, setWiredOracleToData] = useState({ status: false, loading: false });
    const [dataIsOperational, setDataIsOperational] = useState({ status: false, loading: false });

    const [wiredAppToOracle, setWiredAppToOracle] = useState({ status: false, loading: false });
    const [wiredDataToOracle, setWiredDataToOracle] = useState({ status: false, loading: false });
    const [oracleIsOperational, setOracleIsOperational] = useState({ status: false, loading: false });

    const [airlineApplyIsLoading, setAirlineApplyIsLoading] = useState(false);
    const [airlineVoteIsLoading, setAirlineVoteIsLoading] = useState(false);
    const [airlineFundIsLoading, setAirlineFundIsLoading] = useState(false);
    const [airlineAddFlightIsLoading, setAirlineAddFlightIsLoading] = useState(false); 

    const { 
        web3Enabled, 
        appContract, 
        // appContractAddress, 
        dataContract, 
        dataContractAddress, 
        oracleContract,
        oracleContractAddress,
        account, 
        web3 
    } = useContext(Web3Context);

    useEffect(() => {
        const allOperationalStatuses = [
            wiredDataToApp.status,
            wiredOracleToApp.status,
            appIsOperational.status,
            wiredAppToData.status,
            wiredOracleToData.status, 
            dataIsOperational.status, 
            wiredAppToOracle.status,
            wiredDataToOracle.status, 
            oracleIsOperational.status
        ];
        const overallOperationalStatus = !allOperationalStatuses.includes(false);
        setOperationalStatus(overallOperationalStatus);
        if (overallOperationalStatus === true) {
            setTimeout(() => {
                toast.dark('🎉 Block Airline Insurance is Operational');
            }, 1000);
        }
    }, [
        wiredDataToApp,
        wiredOracleToApp,
        appIsOperational,
        wiredAppToData,
        wiredOracleToData, 
        dataIsOperational, 
        wiredAppToOracle,
        wiredDataToOracle, 
        oracleIsOperational
    ]);

    useEffect(() => {
        (async () => {
            if (!web3 || !web3Enabled || !appContract || !dataContract || !oracleContract) {
                return;
            }
            const local_wiredDataToApp = await appContract.methods.DATA_OPERATIONAL().call();
            const local_wiredOracleToApp = await appContract.methods.ORACLE_OPERATIONAL().call();
            const local_appIsOperational = await appContract.methods.APP_OPERATIONAL().call();

            setWiredDataToApp({ status: local_wiredDataToApp, loading: false });
            setWiredOracleToApp({ status: local_wiredOracleToApp, loading: false });
            setAppIsOperational({ status: local_appIsOperational, loading: false });

            const local_wiredAppToData = await dataContract.methods.APP_OPERATIONAL().call();
            const local_wiredOracleToData = await dataContract.methods.ORACLE_OPERATIONAL().call();
            const local_dataIsOperational = await dataContract.methods.DATA_OPERATIONAL().call();

            setWiredAppToData({ status: local_wiredAppToData, loading: false });
            setWiredOracleToData({ status: local_wiredOracleToData, loading: false });
            setDataIsOperational({ status: local_dataIsOperational, loading: false });

            const local_wiredAppToOracle = await oracleContract.methods.APP_OPERATIONAL().call();
            const local_wiredDataToOracle = await oracleContract.methods.DATA_OPERATIONAL().call();
            const local_oracleIsOperational = await oracleContract.methods.ORACLE_OPERATIONAL().call();

            setWiredAppToOracle({ status: local_wiredAppToOracle, loading: false });
            setWiredDataToOracle({ status: local_wiredDataToOracle, loading: false });
            setOracleIsOperational({ status: local_oracleIsOperational, loading: false });

            const allOperationalStatuses = [
                local_wiredDataToApp,
                local_wiredOracleToApp,
                local_appIsOperational,
                local_wiredAppToData,
                local_wiredOracleToData,
                local_dataIsOperational,
                local_wiredAppToOracle,
                local_wiredDataToOracle,
                local_oracleIsOperational
            ];

            const overallOperationalStatus = !allOperationalStatuses.includes(false);
            setOperationalStatus(overallOperationalStatus);

            const partnerFee = await appContract.methods.MINIMUM_PARTNER_FEE().call();
            setPartnerFee(partnerFee);
        })();
    }, [web3,
        web3Enabled, 
        appContract, 
        dataContract, 
        oracleContract]
    );

    useEffect(() => {
        (async () => {
            if (!web3 || !web3Enabled || !appContract || !dataContract || !oracleContract) {
                return;
            }
            const amountOfAirlines = Number(await dataContract.methods.TOTAL_AIRLINES().call());
            const airlinesNames = [];
            for (let airlineIndex = 0; airlineIndex < amountOfAirlines; airlineIndex++) {
                const airlineName = await dataContract.methods.AIRLINES(airlineIndex).call();
                airlinesNames.push(airlineName);
            }
            const _airlines = [];
            for (let airlineIndex = 0; airlineIndex < airlinesNames.length; airlineIndex++) {
                const airlineName = airlinesNames[airlineIndex];
                const response = await dataContract.methods.MAPPED_AIRLINES(airlineName).call();
                const airline = {
                    name: airlineName,
                    address: response.ADDRESS,
                    funds: response.FUNDS,
                    status: response.STATUS
                };
                _airlines.push(airline);
            }
            setAirlines(_airlines);

            // const amountOfFlights = Number(await dataContract.methods.TOTAL_FLIGHTS().call());
            // const flights = [];
            // for (let flightIndex = 0; flightIndex < amountOfFlights.length + 1; flightIndex++) {
            //     const flight = await dataContract.methods.getFlightAtIndex(flightIndex).call();
            //     flights.push(flight);
            // }
            // setFlights(flights);
        })();
    }, [web3,
        web3Enabled, 
        appContract, 
        dataContract, 
        oracleContract]
    );

    const DEFAULT_GAS_SETTINGS = { gas: 4712388, gasPrice: 100000000000 };
    const DEFAULT_PAYLOAD = { from: account, ...DEFAULT_GAS_SETTINGS };

    const airlineMethods = {
        applyAirline(airlineName) {
            if (!airlineName || airlineName.trim() === "") {
                return;
            }
            setAirlineApplyIsLoading(true);
            const AIRLINE_APPLIED = appContract.events.AIRLINE_APPLIED({ topics: [, web3.utils.sha3(airlineName)] });
            AIRLINE_APPLIED
                .on('data', () => {
                    setTimeout(() => {
                        toast.success(`✅ Airline: ${airlineName} successfully applied`);
                        setAirlineApplyIsLoading(false);
                    }, 2000);
                })
                .on('error', () => {
                    setTimeout(() => {
                        toast.error(`❌ Failed to apply airline: ${airlineName}`);
                        setAirlineApplyIsLoading(false);
                    }, 1000);
                });
            appContract.methods.applyAirline(airlineName).send(DEFAULT_PAYLOAD)
                .on('error', () => {
                    setTimeout(() => {
                        toast.error(`❌ Failed to apply airline: ${airlineName}`);
                        setAirlineApplyIsLoading(false);
                    }, 1000);
                });
        },
        voteAirline(airlineName) {
            if (!airlineName || airlineName.trim() === "") {
                return;
            }
            const voterName = airlines.filter(a => a.address === account)[0] || account;
            setAirlineVoteIsLoading(true);
            const AIRLINE_VOTED_FOR = appContract.events.AIRLINE_VOTED_FOR({ topics: [web3.utils.sha3(airlineName)] });
            AIRLINE_VOTED_FOR
                .on('data', () => {
                    setTimeout(() => {
                        toast.success(`Airline: ${airlineName} voted for by ${voterName}`);
                        setAirlineVoteIsLoading(false);
                    }, 2000);
                })
                .on('error', () => {
                    setTimeout(() => {
                        toast.error(`Voter: ${voterName} failed to vote for ${airlineName}`);
                        setAirlineVoteIsLoading(false);
                    }, 1000);
                });
            const AIRLINE_APPROVED = appContract.events.AIRLINE_APPROVED({ topics: [, web3.utils.sha3(airlineName)] });
            AIRLINE_APPROVED
                .on('data', () => {
                    setTimeout(() => {
                        toast.dark(`Airline ${airlineName} was approved`);
                        setAirlineVoteIsLoading(false);
                    }, 2000);
                })
                .on('error', () => {
                   setTimeout(() => {
                    toast.error(`Something went wrong setting airline ${airlineName} to approved`);
                    setAirlineVoteIsLoading(false);
                   }, 1000);
                });
            appContract.methods.voteForAirline(airlineName, voterName).send(DEFAULT_PAYLOAD)
                .on('error', () => {
                    setTimeout(() => {
                        toast.error(`Voter: ${voterName} failed to vote for ${airlineName}`);
                        setAirlineVoteIsLoading(false);
                    }, 1000);
                });
        },
        fundAirline(airlineName, funds) {
            if (!airlineName || airlineName.trim() === "") {
                return;
            }
            if (!funds || funds < MINIMUM_PARTNER_FEE) {
                return;
            }
            setAirlineFundIsLoading(true);
        },
        addFlight() {}
    };

    const operationalMethods = {
        wireDataToApp() {
            setWiredDataToApp({status: false, loading: true});
            const DATA_CONTRACT_REGISTERED = appContract.events.DATA_CONTRACT_REGISTERED();
            DATA_CONTRACT_REGISTERED
                .on('data', () => {
                    setTimeout(() => {
                        toast.success('✅ Data Contract wired to App Contract');
                        setWiredDataToApp({loading: false, status: true});
                    }, 2000);
                })
                .on('error', () => {
                    setTimeout(() => {
                        toast.error('❌ Failed to wire Data Contract to App Contract');
                        setWiredDataToApp({loading: false, status: false});
                    }, 1000);
                });
            appContract.methods.registerDataContract(dataContractAddress).send(DEFAULT_PAYLOAD)
                .on('error', () => {
                    setTimeout(() => {
                        toast.error('❌ Failed to wire Data Contract to App Contract');
                        setWiredDataToApp({loading: false, status: false});
                    }, 1000);
                });
        },
        wireOracleToApp() {
            setWiredOracleToApp({ status: false, loading: true });
            const ORACLE_CONTRACT_REGISTERED = appContract.events.ORACLE_CONTRACT_REGISTERED();
            ORACLE_CONTRACT_REGISTERED
                .on('data', () => {
                    setTimeout(() => {
                        toast.success('✅ Oracle Contract wired to App Contract');
                        setWiredOracleToApp({ loading: false, status: true });
                    }, 2000);
                })
                .on('error', () => {
                    setTimeout(() => {
                        toast.error('❌ Failed to wire Oracle Contract to App Contract');
                        setWiredOracleToApp({ loading: false, status: false });
                    }, 1000);
                });
            appContract.methods.registerOracleContract(oracleContractAddress).send(DEFAULT_PAYLOAD)
                .on('error', () => {
                    setTimeout(() => {
                        toast.error('❌ Failed to wire Oracle Contract to App Contract');
                        setWiredOracleToApp({ loading: false, status: false });
                    }, 1000);
                });
        },
        setAppOperational() {
            setAppIsOperational({ status: false, loading: true });
            const APP_IS_OPERATIONAL = appContract.events.APP_IS_OPERATIONAL();
            APP_IS_OPERATIONAL
                .on('data', () => {
                    setTimeout(() => {
                        toast.success('✅ App Contract set to Operational');
                        setAppIsOperational({ status: true, loading: false });
                    }, 2000);
                })
                .on('error', () => {
                    setTimeout(() => {
                        toast.error('❌ Failed to set App Contract to Operational');
                        setAppIsOperational({ status: false, loading: false });
                    }, 1000);
                });
            appContract.methods.setAppOperational().send(DEFAULT_PAYLOAD)
                .on('error', () => {
                    setTimeout(() => {
                        toast.error('❌ Failed to set App Contract to Operational');
                        setAppIsOperational({ status: false, loading: false });
                    }, 1000);
                });
        },
        async wireAppToData() {
            setWiredAppToData({ status: false, loading: true });
            const isWired = await dataContract.methods.APP_OPERATIONAL().call();
            if (isWired === true) {
                setTimeout(() => {
                    toast.success('✅ App Contract wired to Data Contract');
                    setWiredAppToData({ status: true, loading: false });
                }, 2000);
            } else {
                setTimeout(() => {
                    toast.error('Failed to wire App Contract to Data Contract');
                    setWiredAppToData({ status: false, loading: false });
                }, 1000);
            }
        },
        async wireOracleToData() {
            setWiredOracleToData({ status: false, loading: true });
            const ORACLE_CONTRACT_REGISTERED = dataContract.events.ORACLE_CONTRACT_REGISTERED();
            ORACLE_CONTRACT_REGISTERED
                .on('data', () => {
                    setTimeout(() => {
                        toast.success('✅ Oracle Contract wired to Data Contract');
                        setWiredOracleToData({ status: true, loading: false });
                    }, 2000);
                })
                .on('error', () => {
                    setTimeout(() => {
                        toast.error('❌ Failed to wire Oracle Contract to Data Contract');
                        setWiredOracleToData({ loading: false, status: false });
                    }, 1000);
                });
            dataContract.methods.registerOracleContract(oracleContractAddress).send(DEFAULT_PAYLOAD)
                .on('error', () => {
                    setTimeout(() => {
                        toast.error('❌ Failed to wire Oracle Contract to Data Contract');
                        setWiredOracleToData({ loading: false, status: false });
                    }, 1000);
                });
        },
        setDataOperational() {
            setDataIsOperational({ status: false, loading: true });
            const DATA_CONTRACT_OPERATIONAL = dataContract.events.DATA_CONTRACT_OPERATIONAL();
            DATA_CONTRACT_OPERATIONAL
                .on('data', () => {
                    setTimeout(() => {
                        toast.success('✅ Data Contract set to Operational');
                        setDataIsOperational({ status: true, loading: false });
                    }, 2000);
                })
                .on('error', () => {
                    setTimeout(() => {
                        toast.error('❌ Failed to set Data Contract to Operational');
                        setDataIsOperational({ loading: false, status: false });
                    }, 1000);
                });
            dataContract.methods.setDataOperational().send(DEFAULT_PAYLOAD)
                .on('error', () => {
                    setTimeout(() => {
                        toast.error('❌ Failed to set Data Contract to Operational');
                        setDataIsOperational({ loading: false, status: false });
                    }, 1000);
                });
        },
        async wireAppToOracle() {
            setWiredAppToOracle({ status: false, loading: true });
            const isWired = await oracleContract.methods.APP_OPERATIONAL().call();
            if (isWired === true) {
                setTimeout(() => {
                    toast.success('✅ App Contract wired to Oracle Contract');
                    setWiredAppToOracle({ status: true, loading: false });
                }, 2000);
            } else {
                setTimeout(() => {
                    toast.error('Failed to wire App Contract to Oracle Contract');
                    setWiredAppToOracle({ status: false, loading: false });
                }, 1000);
            }
        },
        wireDataToOracle() {
            setWiredDataToOracle({ status: false, loading: true });
            const DATA_CONTRACT_REGISTERED = oracleContract.events.DATA_CONTRACT_REGISTERED();
            DATA_CONTRACT_REGISTERED
                .on('data', () => {
                    setTimeout(() => {
                        toast.success('✅ Data Contract wired to Oracle Contract');
                        setWiredDataToOracle({ status: true, loading: false });
                    }, 2000);
                })
                .on('error', () => {
                    setTimeout(() => {
                        toast.error('❌ Failed to wire Data Contract to Oracle Contract');
                        setWiredDataToOracle({ loading: false, status: false });
                    }, 1000);
                });
            oracleContract.methods.registerDataContract(oracleContractAddress).send(DEFAULT_PAYLOAD)
                .on('error', () => {
                    setTimeout(() => {
                        toast.error('❌ Failed to wire Data Contract to Oracle Contract');
                        setWiredDataToOracle({ loading: false, status: false });
                    }, 1000);
                });
        },
        setOracleOperational() {
            setOracleIsOperational({ status: false, loading: true });
            const ORACLE_CONTRACT_OPERATIONAL = oracleContract.events.ORACLE_CONTRACT_OPERATIONAL();
            ORACLE_CONTRACT_OPERATIONAL
                .on('data', () => {
                    setTimeout(() => {
                        toast.success('✅ Oracle Contract set to Operational');
                        setOracleIsOperational({ status: true, loading: false });
                    }, 2000);
                })
                .on('error', () => {
                    setTimeout(() => {
                        toast.error('❌ Failed to set Oracle Contract to Operational');
                        setOracleIsOperational({ loading: false, status: false });
                    }, 1000);
                });
            oracleContract.methods.setOracleOperational().send(DEFAULT_PAYLOAD)
                .on('error', () => {
                    setTimeout(() => {
                        toast.error('❌ Failed to set Oracle Contract to Operational');
                        setOracleIsOperational({ loading: false, status: false });
                    }, 1000);
                });
        }
    };

    const operationalStatuses = {
        wiredDataToApp,
        wiredOracleToApp,
        appIsOperational,
        wiredAppToData,
        wiredOracleToData,
        dataIsOperational,
        wiredAppToOracle,
        wiredDataToOracle,
        oracleIsOperational
    };

    const state = {
        isOperational,
        MINIMUM_PARTNER_FEE,
        DEFAULT_GAS_SETTINGS
    };

    const airlineStates = {
        airlineApplyIsLoading,
        airlineVoteIsLoading,
        airlineFundIsLoading,
        airlineAddFlightIsLoading,
    };

    return (
        <DappContext.Provider value={{state, operationalMethods, operationalStatuses, airlineMethods, airlineStates}}>
            { children }
        </DappContext.Provider>
    );
}
