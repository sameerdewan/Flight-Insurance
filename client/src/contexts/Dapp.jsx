import React, { createContext, useState, useEffect, useContext } from 'react';
import Web3Context from './Web3';

const DappContext = createContext();

export default DappContext;

export function DappProvider({ children }) {
    const [isOperational, setOperationalStatus] = useState(false);

    const { web3Enabled, appContract } = useContext(Web3Context);

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
    }, [web3Enabled, appContract.methods]);

    const state = {
        isOperational
    };

    return (
        <DappContext.Provider value={{ methods, state }}>
            { children }
        </DappContext.Provider>
    );
}
