import React, { useContext, useState } from 'react';
import { Container, Row, Form, Button } from 'react-bootstrap';
import { DappColumn } from './Reusables';
import ViewFlights from '../images/view_flights.png';
import BuyInsurance from '../images/buy_insurance.png';
import CheckPolicy from '../images/check_policy.png';
import ClaimInsurance from '../images/claim_insurance.png';
import DappContext from '../contexts/Dapp';


export default function PassengerInsurance() {
    const { state } = useContext(DappContext);
    const { flights, MINIMUM_INSURANCE_FUNDING, MAXIMUM_INSURANCE_FUNDING } = state;
    return (
        <Container fluid>
            <Row>
                <DappColumn image={ViewFlights} name="View Flights">
                    <br />
                    <Form>
                        <Form.Label>Select Airline and Flight</Form.Label>
                        <Form.Control as="select">
                            {flights.map(f => <option>{f.airlineName} ➡️ {f.flightName}</option>)}
                        </Form.Control>
                        <Form.Text className="text-muted">
                            Select airline and flight pair to retrieve info for
                        </Form.Text>
                    </Form>
                    <br />
                    <center>
                        <Button 
                            variant="dark"
                            style={{position: 'absolute', bottom: 25, right: '33%'}} 
                        >
                            📥 Retrieve Flight Info
                        </Button>
                    </center>
                </DappColumn>
                <DappColumn image={BuyInsurance} name="Buy Insurance">
                    <br />
                    <Form>
                        <Form.Label>Select Airline and Flight</Form.Label>
                        <Form.Control as="select">
                            {flights.map(f => <option>{f.airlineName} ➡️ {f.flightName}</option>)}
                        </Form.Control>
                        <Form.Text className="text-muted">
                            Select airline and flight pair to purchase insurance for
                        </Form.Text>
                        <Form.Label>Insurance Amount</Form.Label>
                        <Form.Control placeholder="Enter insurance amount in wei..." />
                        <Form.Text className="text-muted">
                            Minimum insurance funding amount is currently {MINIMUM_INSURANCE_FUNDING} wei and maximum funding is {MAXIMUM_INSURANCE_FUNDING} wei
                        </Form.Text>
                    </Form>
                    <br />
                    <center>
                        <Button 
                            variant="dark"
                            style={{position: 'absolute', bottom: 25, right: '33%'}} 
                        >
                            🛡️ Buy Insurance
                        </Button>
                    </center>
                </DappColumn>
                <DappColumn image={CheckPolicy} name="Check Policy">
                    <br />
                    <Form>
                        <Form.Label>Select Airline and Flight</Form.Label>
                        <Form.Control as="select">
                            {flights.map(f => <option>{f.airlineName} ➡️ {f.flightName}</option>)}
                        </Form.Control>
                        <Form.Text className="text-muted">
                            Select airline and flight pair to check current address policy 
                        </Form.Text>
                    </Form>
                    <br />
                    <center>
                        <Button 
                            variant="dark"
                            style={{position: 'absolute', bottom: 25, right: '33%'}} 
                        >
                            🔎 Check Policy
                        </Button>
                    </center>
                </DappColumn>
                <DappColumn image={ClaimInsurance} name="Claim Insurance">
                    <br />
                    <Form>
                        <Form.Label>Select Airline and Flight</Form.Label>
                        <Form.Control as="select">
                            {flights.map(f => <option>{f.airlineName} ➡️ {f.flightName}</option>)}
                        </Form.Control>
                        <Form.Text className="text-muted">
                            Select airline and flight pair to claim insurance for
                        </Form.Text>
                    </Form>
                    <br />
                    <center>
                        <Button 
                            variant="dark"
                            style={{position: 'absolute', bottom: 25, right: '33%'}} 
                        >
                            💰 Claim Insurance
                        </Button>
                    </center>
                </DappColumn>
            </Row>
        </Container>
    )
}