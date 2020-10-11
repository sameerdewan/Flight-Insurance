import React, { createContext, useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import Web3Context from './Web3';

const DappContext = createContext();

export default DappContext;

export function DappProvider({ children }) {
    const [isOperational, setOperationalStatus] = useState(false);
    const [allFlights, setFlights] = useState([]);

    const [wiredDataToApp, setWiredDataToApp] = useState({ status: false, loading: false });
    const [wiredOracleToApp, setWiredOracleToApp] = useState({ status: false, loading: false });
    const [appIsOperational, setAppIsOperational] = useState({ status: false, loading: false });

    const [wiredAppToData, setWiredAppToData] = useState({ status: false, loading: false });
    const [wiredOracleToData, setWiredOracleToData] = useState({ status: false, loading: false });
    const [dataIsOperational, setDataIsOperational] = useState({ status: false, loading: false });

    const [wiredAppToOracle, setWiredAppToOracle] = useState({ status: false, loading: false });
    const [wirdeDataToOracle, setWiredDataToOracle] = useState({ status: false, loading: false });
    const [oracleIsOperational, setOracleIsOperational] = useState({ status: false, loading: false });

    const { 
        web3Enabled, 
        appContract, 
        appContractAddress, 
        dataContract, 
        dataContractAddress, 
        oracleContract,
        oracleContractAddress,
        account, 
        web3 
    } = useContext(Web3Context);

    useEffect(() => {
        (async () => {
            if (!web3 || !web3Enabled || !appContract || !dataContract || !oracleContract) {
                return;
            }
            const local_wiredDataToApp = await appContract.methods.DATA_OPERATIONAL().call();
            const local_wiredOracleToApp = await appContract.methods.ORACLE_OPERATIONAL().call();
            const local_appIsOperational = await appContract.methods.APP_OPERATIONAL().call();

            setWiredDataToApp(local_wiredDataToApp);
            setWiredOracleToApp(local_wiredOracleToApp);
            setAppIsOperational(local_appIsOperational);

            const local_wiredAppToData = await dataContract.methods.APP_OPERATIONAL().call();
            const local_wiredOracleToData = await dataContract.methods.ORACLE_OPERATIONAL().call();
            const local_dataIsOperational = await dataContract.methods.DATA_OPERATIONAL().call();

            setWiredAppToData(local_wiredAppToData);
            setWiredOracleToData(local_wiredOracleToData);
            setDataIsOperational(local_dataIsOperational);

            const local_wiredAppToOracle = await oracleContract.methods.APP_OPERATIONAL().call();
            const local_wirdeDataToOracle = await oracleContract.methods.ORACLE_OPERATIONAL().call();
            const local_oracleIsOperational = await oracleContract.methods.ORACLE_OPERATIONAL().call();

            setWiredAppToOracle(local_wiredAppToOracle);
            setWiredDataToOracle(local_wirdeDataToOracle);
            setOracleIsOperational(local_oracleIsOperational);

            const allOperationalStatuses = [
                local_wiredDataToApp,
                local_wiredOracleToApp,
                local_appIsOperational,
                local_wiredAppToData,
                local_wiredOracleToData,
                local_dataIsOperational,
                local_wiredAppToOracle,
                local_wirdeDataToOracle,
                local_oracleIsOperational
            ];

            const overallOperationalStatus = !allOperationalStatuses.includes(false);
            setOperationalStatus(overallOperationalStatus);
        })();
    }, [web3Enabled, 
        appContract, 
        appContract?.methods, 
        dataContract, 
        dataContract?.methods, 
        oracleContract, 
        oracleContract?.methods]
    );

    useEffect(() => {
        (async () => {
            if (!web3Enabled || !dataContract) {
                return;
            }
            const amountOfFlights = Number(await dataContract.methods.TOTAL_FLIGHTS().call());
            const flights = [];
            for (let flightIndex = 0; flightIndex < amountOfFlights.length + 1; flightIndex++) {
                const flight = await dataContract.methods.getFlightAtIndex(flightIndex).call();
                flights.push(flight);
            }
            setFlights(flights);
        })();
    }, [dataContract, web3Enabled]);

    const DEFAULT_GAS_SETTINGS = { gas: 4712388, gasPrice: 100000000000 };

    const operationalMethods = {
        async wireDataToApp() {
            const DATA_CONTRACT_REGISTERED = appContract.events.DATA_CONTRACT_REGISTERED();
            DATA_CONTRACT_REGISTERED
                .on('data', () => toast.success('✅ Data Contract wired'))
                .on('error', () => toast.error('❌ Failed to wire Data Contract'));
            await appContract.methods.registerDataContract(dataContractAddress).send({ from: account, ...DEFAULT_GAS_SETTINGS });
        },
        async wireOracleToApp() {
            await appContract.methods.registerOracleContract(oracleContractAddress).send({ from: account });
        },
        async setAppOperational() {
            await appContract.methods.setAppOperational().send({ from: account });
        },
        async wireAppToData() {
            await dataContract.methods.registerAppContract(appContractAddress).send({ from: account });
        },
        async wireOracleToData() {
            await dataContract.methods.registerOracleContract(oracleContractAddress).send({ from: account });
        },
        async wireAppToOracle() {
            await oracleContract.methods.registerAppContract(appContractAddress).send({ from: account });
        },
        async wireDataToOracle() {
            await oracleContract.methods.registerDataContract(dataContractAddress).send({ from: account });
        },
        async setOracleOperational() {
            await oracleContract.methods.setOracleOperational().send({ from: account });
        }
    };

    const state = {
        isOperational,
        allFlights
    };

    return (
        <DappContext.Provider value={{state, operationalMethods}}>
            { children }
        </DappContext.Provider>
    );
}
