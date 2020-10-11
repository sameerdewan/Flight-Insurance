import React, { createContext, useState, useEffect } from 'react';
import Web3 from 'web3';
import { localhost } from '../deployments.json'; 

const { Data, App, Oracle, url } = localhost;

const Web3Context = createContext({ web3Enabled: false });

export default Web3Context;

export function Web3Provider({ children }) {
    const [web3Enabled, setWeb3Enabled] = useState(false);
    const [web3, setWeb3] = useState(undefined);
    const [account, setAccount] = useState(undefined);
    const [dataContract, setDataContract] = useState(undefined);
    const [dataContractAddress, setDataContractAddress] = useState(undefined);
    const [appContract, setAppContract] = useState({ methods: {} });
    const [appContractAddress, setAppContractAddress] = useState(undefined);
    const [oracleContract, setOracleContract] = useState(undefined);  
    const [oracleContractAddress, setOracleContractAddress] = useState(undefined);

    useEffect(() => {
        const enableWeb3 = async () => {
            await window.ethereum.enable();
            const localWeb3 = new Web3(window.etheruem);
            localWeb3.setProvider(new Web3.providers.WebsocketProvider(url.replace('http', 'ws')));
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
            const { abi, address } = Data; 
            setDataContract(new web3.eth.Contract(abi, address));
            setDataContractAddress(address);
        };
    
        const connectAppContract = async () => {
            const { abi, address } = App;
            setAppContract(new web3.eth.Contract(abi, address));
            setAppContractAddress(address);
        };

        const connectOracleContract = async () => {
            const { abi, address } = Oracle;
            setOracleContract(new web3.eth.Contract(abi, address));
            setOracleContractAddress(address);
        }

        (async () => {
            const accounts = await web3.eth.getAccounts();
            await connectDataContract();
            await connectAppContract();
            await connectOracleContract();
            setAccount(accounts[0]);
            setWeb3Enabled(true);
        })();
    }, [web3]);

    const values = {
        web3Enabled,
        web3,
        account,
        dataContract,
        dataContractAddress,
        appContract,
        appContractAddress,
        oracleContract,
        oracleContractAddress
    };

    return (
        <Web3Context.Provider value={values}>
            { children }
        </Web3Context.Provider>
    );
}
