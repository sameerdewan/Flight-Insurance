import React, { createContext, useState, useEffect, useCallback } from 'react';
import Web3 from 'web3';
import { localhost } from '../deployments.json'; 

const { FlightSuretyData, FlightSuretyApp } = localhost;

const Web3Context = createContext();

export default Web3Context;

export function Web3Provider({ children }) {
    const [web3Enabled, setWeb3Enabled] = useState(false);
    const [web3, setWeb3] = useState(undefined);
    const [account, setAccount] = useState(undefined);
    const [dataContract, setDataContract] = useState(undefined);
    const [appContract, setAppContract] = useState(undefined);

    const connectDataContract = useCallback(async () => {
        const { abi, address } = FlightSuretyData; 
        setDataContract(new web3.eth.Contract(abi, address));
    }, [web3.eth.Contract]);

    const connectAppContract = useCallback(async () => {
        const { abi, address } = FlightSuretyApp;
        setAppContract(new web3.eth.Contract(abi, address));
    }, [web3.eth.Contract]);

    const enableWeb3 = useCallback(async () => {
        await window.ethereum.enable();
        const currentAccount = await web3.eth.getAccounts();
        await connectDataContract();
        await connectAppContract();
        setAccount(currentAccount);
        setWeb3Enabled(true);
    }, [web3.eth, connectAppContract, connectDataContract]);

    useEffect(() => {
        if (window.ethereum && !web3) {
            setWeb3(new Web3(window.etheruem));
            enableWeb3();
        }
    }, [enableWeb3, web3]);

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
