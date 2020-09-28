import React, { createContext, useState, useEffect, useContext } from 'react';
import Web3Context from './Web3';

const DappContext = createContext();

export default DappContext;

export function DappProvider({ children }) {
    const [isOperational, setOperationalStatus] = useState(false);
    const [allFlights, setFlights] = useState([]);

    const { web3Enabled, appContract, dataContract } = useContext(Web3Context);

    const methods = {
    };

    useEffect(() => {
        (async () => {
            if (!web3Enabled || !appContract) {
                return;
            }
            const response = await appContract.methods.getContractOperationalStatus().call();
            setOperationalStatus(response);
        })();
    }, [web3Enabled, appContract, appContract.methods]);

    useEffect(() => {
        (async () => {
            if (!web3Enabled || !dataContract) {
                return;
            }
            const amountOfFlights = await dataContract.methods.getFlightsLength().call();
            const flights = [];
            for (let flightIndex = 0; flightIndex < amountOfFlights.length; flightIndex++) {
                const flight = await dataContract.methods.getFlightByIndex(flightIndex).call();
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
        <DappContext.Provider value={{ methods, state }}>
            { children }
        </DappContext.Provider>
    );
}
