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
    const { operationalStatuses, operationalMethods } = useContext(DappContext);
    const contractOptions = [
        { label: 'Wire Data Contract ➡ App Contract', onClick: operationalMethods.wireDataToApp, state: operationalStatuses.wiredDataToApp },
        { label: 'Wire Oracle Contract ➡ App Contract', onClick: operationalMethods.wireOracleToApp, state: operationalStatuses.wiredOracleToApp },
        { label: 'Set App Contract Operational 💡', onClick: operationalMethods.setAppOperational, state: operationalStatuses.appIsOperational },
        { label: 'Wire App Contract ➡ Data Contract', onClick: operationalMethods.wireAppToData, state: operationalStatuses.wiredAppToData },
        { label: 'Wire Oracle Contract ➡ Data Contract', onClick: operationalMethods.wireOracleToData, state: operationalStatuses.wiredOracleToData },
        { label: 'Set Data Contract Operational 💡', onClick: operationalMethods.setDataOperational, state: operationalStatuses.dataIsOperational },
        { label: 'Wire App Contract ➡ Oracle Contract', onClick: operationalMethods.wireAppToOracle, state: operationalStatuses.wiredAppToOracle },
        { label: 'Wire Data Contract ➡ Oracle Contract', onClick: operationalMethods.wireDataToOracle, state: operationalStatuses.wiredDataToOracle },
        { label: 'Set Oracle Contract Operational 💡', onClick: operationalMethods.setOracleOperational, state: operationalStatuses.oracleIsOperational },
    ];
    return (
        <Container>
            <Alert variant="warning">
                The owner of this contract application (deploying address) is the only address that can use this page. 
                &nbsp;<b>All actions are <u><i>irreversible</i></u> and the contract must be <u><i>redeployed</i></u> to reset</b>.
            </Alert>
            {contractOptions.map(cO => <ContractSwitch label={cO.label} onClick={cO.onClick} state={cO.state} key={cO.label} />)}
        </Container>
    );
}
