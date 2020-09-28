import React, { createContext, useState, useEffect } from 'react';
import Web3 from 'web3';
import { localhost } from '../deployments.json'; 

const { FlightSuretyData, FlightSuretyApp, url } = localhost;

const Web3Context = createContext({ web3Enabled: false });

export default Web3Context;

export function Web3Provider({ children }) {
    const [web3Enabled, setWeb3Enabled] = useState(false);
    const [web3, setWeb3] = useState(undefined);
    const [account, setAccount] = useState(undefined);
    const [dataContract, setDataContract] = useState(undefined);
    const [appContract, setAppContract] = useState({ methods: {} });

    useEffect(() => {
        const enableWeb3 = async () => {
            await window.ethereum.enable();
            const localWeb3 = new Web3(window.etheruem);
            localWeb3.setProvider(new Web3.providers.HttpProvider(url));
            setWeb3(localWeb3);
        };
        if (window.ethereum && !web3) {
            enableWeb3();
        }
    });

    useEffect(() => {
        if (!web3) {
            return;
        }
        const connectDataContract = async () => {
            const { abi, address } = FlightSuretyData; 
            setDataContract(new web3.eth.Contract(abi, address));
        };
    
        const connectAppContract = async () => {
            const { abi, address } = FlightSuretyApp;
            setAppContract(new web3.eth.Contract(abi, address));
        };

        (async () => {
            const accounts = await web3.eth.getAccounts();
            await connectDataContract();
            await connectAppContract();
            setAccount(accounts[0]);
            setWeb3Enabled(true);
        })();
    }, [web3]);

    const values = {
        web3Enabled,
        web3,
        account,
        dataContract,
        appContract
    };

    return (
        <Web3Context.Provider value={values}>
            { children }
        </Web3Context.Provider>
    );
}
