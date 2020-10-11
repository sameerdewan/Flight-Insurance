import React, { useContext } from 'react';
import styled from 'styled-components';
import { Form, Alert, Spinner, Badge } from 'react-bootstrap';
import DappContext from '../contexts/Dapp';

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

function ContractSwitch({ label, onClick, state }) {
    return (
        <SwitchContainer>
            <Form.Check 
                type="switch"
                id={label}
                label={label}
                onClick={onClick}
                checked={state?.status}
                variant="danger"
                disabled={state?.status}
            />
          {
            state?.loading === true && <SwitchLoader variant="warning">
                <Spinner size="sm" animation="border" variant="danger" />
                <span>&nbsp;loading...</span>
            </SwitchLoader>
          }
        </SwitchContainer>
    );
}

export default function ContractAdmin() {
    const { wiredDataToApp, operationalMethods } = useContext(DappContext);
    console.log({ wiredDataToApp })
    const contractOptions = [
        { label: 'Wire Data Contract ➡ App Contract', onClick: operationalMethods.wireDataToApp, state: wiredDataToApp },
        // { label: 'Wire Oracle Contract ➡ App Contract', onClick: () => console.log('app > oracle') },
        // { label: 'Set App Contract Operational 💡', onClick: () => console.log('app >>> opp') },
        // { label: 'Wire App Contract ➡ Data Contract', onClick: () => console.log('app+data') },
        // { label: 'Wire Oracle Contract ➡ Data Contract', onClick: () => console.log('app+data') },
        // { label: 'Set Data Contract Operational 💡', onClick: () => console.log('app >>> opp') },
        // { label: 'Wire App Contract ➡ Oracle Contract', onClick: () => console.log('oracle > app') },
        // { label: 'Wire Data Contract ➡ Oracle Contract', onClick: () => console.log('oracle > data') },
        // { label: 'Set Oracle Contract Operational 💡', onClick: () => console.log('oracle >>> opp') },
    ];
    return (
        <Container>
            {contractOptions.map(cO => <ContractSwitch label={cO.label} onClick={cO.onClick} state={cO.state} key={cO.label} />)}
        </Container>
    );
}
