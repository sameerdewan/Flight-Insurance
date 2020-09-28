import { create } from 'lodash';
import React, { createContext, useState, useEffect, useContext } from 'react';
import Web3Context from './Web3';

const DappContext = createContext();

export default DappContext;

export function DappProvider({ children }) {
    const { web3Enabled, appContract } = useContext(Web3Context);

    const methods = {
        async getContractOperationalStatus() {
            if (!web3Enabled) {
                return;
            }
            // const response = await appContract.methods.getContractOperationalStatus();
            console.log({ appContract });
        }
    };

    return (
        <DappContext.Provider value={methods}>
            { children }
        </DappContext.Provider>
    );
}
