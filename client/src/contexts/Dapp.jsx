import React, { createContext, useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import Web3Context from './Web3';

const DappContext = createContext();

export default DappContext;

export function DappProvider({ children }) {
    const [isOperational, setOperationalStatus] = useState(false);
    const [allFlights, setFlights] = useState([]);

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

    // const methods = {
    //     async buyFlightInsurance(airline, flight) {
    //         const payload = {
    //             from: account,
    //             value: web3.utils.toWei("1")
    //         };
    //         try {
    //             await appContract.methods.appBuyInsurance(airline, flight).send(payload);
    //             toast.success(`Success: Bought insurance for flight ${flight}`);
    //         } catch (error) {
    //             console.log({error});
    //             toast.error(`Error: Failed to purchase insurance for flight ${flight}`);
    //         }
    //     }
    // };

    const operationalMethods = {
        async wireDataToApp() {
            console.log(await appContract.methods.OWNER_ADDRESS().call());
            console.log(account);
            // const DATA_CONTRACT_REGISTERED = appContract.events.DATA_CONTRACT_REGISTERED();
            // DATA_CONTRACT_REGISTERED
            //     .on('data', event => console.log({event}, 'data'))
            //     .on('changed', event => console.log({event}, 'changed'))
            //     .on('error', error => console.log({error}, 'error'));
            await appContract.methods.registerDataContract(dataContractAddress).send({ from: account });
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

    useEffect(() => {
        (async () => {
            if (!web3Enabled || !appContract) {
                return;
            }
            const response = await appContract.methods.APP_OPERATIONAL().call();
            setOperationalStatus(response);
        })();
    }, [web3Enabled, appContract, appContract.methods]);

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
