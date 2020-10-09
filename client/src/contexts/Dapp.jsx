import React, { createContext, useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import Web3Context from './Web3';

const DappContext = createContext();

export default DappContext;

export function DappProvider({ children }) {
    const [isOperational, setOperationalStatus] = useState(false);
    const [allFlights, setFlights] = useState([]);

    const { web3Enabled, appContract, dataContract, account, web3 } = useContext(Web3Context);

    const methods = {
        async buyFlightInsurance(airline, flight) {
            const payload = {
                from: account,
                value: web3.utils.toWei("1")
            };
            try {
                await appContract.methods.appBuyInsurance(airline, flight).send(payload);
                toast.success(`Success: Bought insurance for flight ${flight}`);
            } catch (error) {
                console.log({error});
                toast.error(`Error: Failed to purchase insurance for flight ${flight}`);
            }
        }
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
            for (let flightIndex = 0; flightIndex < amountOfFlights.length + 1; flightIndex++) {
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
