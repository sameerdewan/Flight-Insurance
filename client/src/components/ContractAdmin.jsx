import React, { useContext } from 'react';
import { Form } from 'react-bootstrap';
import DappContext from '../contexts/Dapp';
import Web3Context from '../contexts/Web3';


function ContractSwitch({ label, onClick }) {
    return (
        <Form.Check 
            type="switch"
            id={label}
            label={label}
            onClick={onClick}
            checked={true}
            disabled
        />
    );
}

const contractOptions = [
    { label: 'Wire App Contract -> Data Contract', onClick: () => console.log('app > data') },
    { label: 'Wire App Contract -> Oracle Contract', onClick: () => console.log('app > oracle') },
    { label: 'Set App Contract Operational', onClick: () => console.log('app >>> opp') },
    { label: 'Wire Oracle Contract -> App Contract', onClick: () => console.log('oracle > app') },
    { label: 'Wire Oracle Contract -> Data Contract', onClick: () => console.log('oracle > data') },
    { label: 'Wire App Contract + Data Contract', onClick: () => console.log('app+data') },
    { label: 'Set Oracle Contract Operational', onClick: () => console.log('oracle >>> opp') },
];

export default function ContractAdmin() {
    const { dataContractAddress, appContractAddress, oracleContractAddress } = useContext(Web3Context);
    const { operationalMethods } = useContext(DappContext);
    console.log({operationalMethods});
    return (
        <div>
            <button onClick={operationalMethods.wireDataToApp}>fire wire data to app</button>
            {contractOptions.map(cO => <ContractSwitch label={cO.label} onClick={cO.onClick} key={cO.label} />)}
        </div>
    );
}
