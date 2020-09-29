import React, { useContext } from 'react';
import { Tab, Row, Col, ListGroup, Badge } from 'react-bootstrap'; 
import DappContext from '../contexts/Dapp';

function ListItem({ flight }) {
    return (
        <ListGroup.Item action eventKey={flight._flight}>
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

function ListItemContent({ flight }) {
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
        </Tab.Pane>
    );
}

export default function BuyFlightInsurance() {
    const { state } = useContext(DappContext);
    const { allFlights } = state;

    return (
        <React.Fragment>
            <br />
            <Tab.Container>
                <Row>
                    <Col sm={4}>
                        <ListGroup>
                            {allFlights.map(f => <ListItem flight={f} />)}
                        </ListGroup>
                    </Col>
                    <Col sm={8}>
                        <Tab.Content>
                            {allFlights.map(f => <ListItemContent flight={f} />)}
                        </Tab.Content>
                    </Col>
                </Row>
            </Tab.Container>
        </React.Fragment>
    )
}