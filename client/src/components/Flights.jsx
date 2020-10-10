import React, { useContext, useState } from 'react';
import { Tab, Row, Col, ListGroup, Badge, Button } from 'react-bootstrap'; 
import styled from 'styled-components';
import { get } from 'lodash';
import DappContext from '../contexts/Dapp';

function ListItem({ flight, setActiveKey }) {
    return (
        <ListGroup.Item action eventKey={flight._flight} onClick={() => setActiveKey(flight._flight)}>
            {flight._flight}
        </ListGroup.Item>
    );
}

function StatusCodeBadge({ statusCode }) {
    let variant = 'danger';
    const getStatusCode = () => {
        const STATUSES = [
            "STATUS_CODE_UNKNOWN", 
            "STATUS_CODE_ON_TIME", 
            "STATUS_CODE_LATE_AIRLINE",
            "STATUS_CODE_LATE_WEATHER",
            "STATUS_CODE_LATE_TECHNICAL",
            "STATUS_CODE_LATE_OTHER"
        ];
        const CODES = [0, 10, 20, 30, 40, 50];

        if (Number(statusCode) === 0) {
            variant = "secondary";
        }
        if (Number(statusCode) === 10) {
            variant = "success";
        }
        if (Number(statusCode) === 30) {
            variant = "primary";
        }
        return STATUSES[CODES.indexOf(Number(statusCode))].replace('STATUS_CODE', '').replace('_', ' ');
    }
    return (
        <Badge pill variant={variant}>
            {getStatusCode()}
        </Badge>
    );
}

const FlightSuretyButton = styled(Button)`
    margin-top: 100px;
    width: 99%;
`;

const BuyInsuranceTextContainer = styled.div`
    width: 100%;
    text-align: center;
`;

const BuyInsuranceSubText = styled.code`
    color: black;
    font-size: 12px;
    display: block;
`;

function ListItemContent({ flight }) {
    const { methods } = useContext(DappContext);
    const { buyFlightInsurance } = methods;

    const flightDate = new Date(flight._timestamp * 1000).toDateString();
    const flightTime = new Date(flight._timestamp * 1000).toTimeString();
    return (
        <Tab.Pane eventKey={flight._flight}>
            <ListGroup variant="flush">
                <ListGroup.Item><b>Airline Address: </b>{flight._airline}</ListGroup.Item>
                <ListGroup.Item><b>Flight: </b>{flight._flight}</ListGroup.Item>
                <ListGroup.Item><b>Flight Time: </b>{flightDate} {flightTime}</ListGroup.Item>
                <ListGroup.Item><b>Flight Status: </b><StatusCodeBadge statusCode={flight._statusCode} /></ListGroup.Item>
            </ListGroup>
            <FlightSuretyButton variant="dark" size="lg" block onClick={() => buyFlightInsurance(flight._airline, flight._flight)}>
                Buy Flight Insurance
            </FlightSuretyButton>
            <BuyInsuranceTextContainer>
                <BuyInsuranceSubText>1 ETH</BuyInsuranceSubText>
                <BuyInsuranceSubText>for {flight._flight}</BuyInsuranceSubText>
            </BuyInsuranceTextContainer>
        </Tab.Pane>
    );
}

export default function Home() {
    const { state } = useContext(DappContext);
    const { allFlights } = state;
    const [activeKey, setActiveKey] = useState(undefined);

    return (
        <React.Fragment>
            <br />
            <Tab.Container activeKey={activeKey || get(allFlights, '[0]._flight')}>
                <Row>
                    <Col sm={4}>
                        <ListGroup>
                            {allFlights.map(f => <ListItem setActiveKey={setActiveKey} flight={f} key={f._flight} />)}
                        </ListGroup>
                    </Col>
                    <Col sm={8}>
                        <Tab.Content>
                            {allFlights.map(f => <ListItemContent flight={f} key={f._flight} />)}
                        </Tab.Content>
                    </Col>
                </Row>
            </Tab.Container>
        </React.Fragment>
    )
}