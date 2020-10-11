import React, { useContext } from 'react';
import styled from 'styled-components';
import { Form, Alert, Spinner, Badge } from 'react-bootstrap';
import DappContext from '../contexts/Dapp';
import Web3Context from '../contexts/Web3';

const Container = styled.div`
    width: 100%;
    margin-top: 20px;
`;

const SwitchContainer = styled(Alert)`
    display: flex;
    width: 100%;
    height: 40px;
    border-bottom: 1px dashed #343a40;
`;

const SwitchLoader = styled(Badge)`
    margin-left: 10px;
    position: absolute;
    left: 340px;
`;

function ContractSwitch({ label, onClick, status = false, loading = false }) {
    return (
        <SwitchContainer>
            <Form.Check 
                type="switch"
                id={label}
                label={label}
                onClick={onClick}
                checked={status}
                variant="danger"
            />
          {
            loading && <SwitchLoader variant="warning">
                <Spinner size="sm" animation="border" variant="danger" />
                <span>&nbsp;loading...</span>
            </SwitchLoader>
          }
        </SwitchContainer>
    );
}

const contractOptions = [
    { label: 'Wire Data Contract ➡ App Contract', onClick: () => console.log('app > data') },
    { label: 'Wire Oracle Contract ➡ App Contract', onClick: () => console.log('app > oracle') },
    { label: 'Set App Contract Operational 💡', onClick: () => console.log('app >>> opp') },
    { label: 'Wire App Contract ➡ Data Contract', onClick: () => console.log('app+data') },
    { label: 'Wire Oracle Contract ➡ Data Contract', onClick: () => console.log('app+data') },
    { label: 'Set Data Contract Operational 💡', onClick: () => console.log('app >>> opp') },
    { label: 'Wire App Contract ➡ Oracle Contract', onClick: () => console.log('oracle > app') },
    { label: 'Wire Data Contract ➡ Oracle Contract', onClick: () => console.log('oracle > data') },
    { label: 'Set Oracle Contract Operational 💡', onClick: () => console.log('oracle >>> opp') },
];

export default function ContractAdmin() {
    return (
        <Container>
            {contractOptions.map(cO => <ContractSwitch label={cO.label} onClick={cO.onClick} key={cO.label} />)}
        </Container>
    );
}
