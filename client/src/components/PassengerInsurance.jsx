import React, { useContext, useState } from 'react';
import { Container, Row, Form, Button } from 'react-bootstrap';
import { DappColumn, SwitchLoaderComponent } from './Reusables';
import ViewFlights from '../images/view_flights.png';
import BuyInsurance from '../images/buy_insurance.png';
import CheckPolicy from '../images/check_policy.png';
import ClaimInsurance from '../images/claim_insurance.png';
import DappContext from '../contexts/Dapp';


export default function PassengerInsurance() {
    const { state, insuranceMethods, insuranceStates } = useContext(DappContext);
    const { flights,viewFlightDetails, viewFlightDetailsVisible, checkPolicyDetails, checkPolicyDetailsVisible } = state;
    const [viewFlightAirlineFlightNamePair, setViewFlightAirlineFlightNamePair] = useState(undefined);
    const [buyInsuranceAirlineFlightNamePair, setBuyInsuranceAirlineFlightNamePair] = useState(undefined);
    const [buyInsuranceFundingAmount, setBuyInsuranceFundingAmount] = useState(undefined);
    const [checkPolicyAirlineFlightNamePair, setCheckPolicyAirlineFlightNamePair] = useState(undefined);
    const [claimInsuranceAirlineFlightNamePair, setClaimInsuranceAirlineFlightNamePair] = useState(undefined);

    return (
        <Container fluid>
            <Row>
                <DappColumn image={ViewFlights} name="View Flight Status">
                    <br />
                    <Form>
                        <Form.Label>Select Airline and Flight</Form.Label>
                        <Form.Control as="select" onChange={e => setViewFlightAirlineFlightNamePair(e.target.value.split(' ➡️ '))}>
                            <option />
                            {flights.map((f, i) => <option key={i}>{f.airlineName} ➡️ {f.flightName}</option>)}
                        </Form.Control>
                        <Form.Text className="text-muted">
                            Select airline and flight pair to retrieve info for and pull the latest information for from our oracle network. If the flight has not left yet, our oracles will
                            not be contacted, and the flight status will be unknown.
                        </Form.Text>
                    </Form>
                    <br />
                    <center>
                        <Button 
                            onClick={() => insuranceMethods.viewFlight(viewFlightAirlineFlightNamePair)}
                            variant="dark"
                            style={{position: 'absolute', bottom: 25, right: '33%'}} 
                        >
                            📥 Retrieve Flight Info
                        </Button>
                    </center>
                    {
                        viewFlightDetails && viewFlightDetailsVisible && (
                            <React.Fragment>
                                <code>RESPONSE:</code>
                                <div style={{border: '1px dashed hotpink', padding: 10}}>
                                    <code>{JSON.stringify({ flightStatus: viewFlightDetails.flightStatus })}</code>
                                    <br/>
                                    <code>{JSON.stringify({ flightTime: new Date(viewFlightDetails.flightTimestamp * 1000).toUTCString() })}</code>
                                    <br />
                                    <code>{JSON.stringify({ airlineFunds: `${viewFlightDetails.airlineFunds} wei` })}</code>
                                </div>
                            </React.Fragment>
                        )
                    }
                    <br />
                    { insuranceStates.viewFlightIsLoading && <center><SwitchLoaderComponent /></center> }
                </DappColumn>
                <DappColumn image={BuyInsurance} name="Buy Insurance">
                    <br />
                    <Form>
                        <Form.Label>Select Airline and Flight</Form.Label>
                        <Form.Control as="select" onChange={e => setBuyInsuranceAirlineFlightNamePair(e.target.value.split(' ➡️ '))}>
                            <option />
                            {flights.map((f, i) => <option key={i}>{f.airlineName} ➡️ {f.flightName}</option>)}
                        </Form.Control>
                        <Form.Text className="text-muted">
                            Select airline and flight pair to purchase insurance for
                        </Form.Text>
                        <Form.Label>Insurance Amount</Form.Label>
                        <Form.Control placeholder="Enter insurance amount in wei..." onChange={e => setBuyInsuranceFundingAmount(Number(e.target.value))}/>
                        <Form.Text className="text-muted">
                            Insurance funding amount. It is <u>not</u> recommended to insure yourself for more than the funds available for an airline.
                        </Form.Text>
                    </Form>
                    <br />
                    <center>
                        <Button 
                            onClick={() => insuranceMethods.buyInsurance(buyInsuranceAirlineFlightNamePair, buyInsuranceFundingAmount)}
                            variant="dark"
                            style={{position: 'absolute', bottom: 25, right: '33%'}} 
                        >
                            🛡️ Buy Insurance
                        </Button>
                    </center>
                    <br />
                    { insuranceStates.buyInsuranceIsLoading && <center><SwitchLoaderComponent /></center> }
                </DappColumn>
                <DappColumn image={CheckPolicy} name="Check Policy">
                    <br />
                    <Form>
                        <Form.Label>Select Airline and Flight</Form.Label>
                        <Form.Control as="select" onChange={e => setCheckPolicyAirlineFlightNamePair(e.target.value.split(' ➡️ '))}>
                            <option />
                            {flights.map((f, i) => <option key={i}>{f.airlineName} ➡️ {f.flightName}</option>)}
                        </Form.Control>
                        <Form.Text className="text-muted">
                            Select airline and flight pair to check current address policy 
                        </Form.Text>
                    </Form>
                    <br />
                    <center>
                        <Button 
                            onClick={() => insuranceMethods.checkPolicy(checkPolicyAirlineFlightNamePair)}
                            variant="dark"
                            style={{position: 'absolute', bottom: 25, right: '33%'}} 
                        >
                            🔎 Check Policy
                        </Button>
                    </center>
                    {
                        checkPolicyDetails && checkPolicyDetailsVisible && (
                            <React.Fragment>
                                <code>RESPONSE:</code>
                                <div style={{border: '1px dashed hotpink', padding: 10}}>
                                    <code>{JSON.stringify({ policyActive: checkPolicyDetails.policyActive })}</code>
                                    <br/>
                                    <code>{JSON.stringify({ policyFunds: `${checkPolicyDetails.policyFunds} wei` })}</code>
                                    <br />
                                    <code>{JSON.stringify({ payoutAvailable: checkPolicyDetails.payoutAvailable })}</code>
                                </div>
                            </React.Fragment>
                        )
                    }
                    <br />
                    { insuranceStates.checkPolicyIsLoading && <center><SwitchLoaderComponent /></center> }
                </DappColumn>
                <DappColumn image={ClaimInsurance} name="Claim Insurance">
                    <br />
                    <Form>
                        <Form.Label>Select Airline and Flight</Form.Label>
                        <Form.Control as="select" onChange={e => setClaimInsuranceAirlineFlightNamePair(e.target.value.split(' ➡️ '))}>
                            <option />
                            {flights.map((f, i) => <option key={i}>{f.airlineName} ➡️ {f.flightName}</option>)}
                        </Form.Control>
                        <Form.Text className="text-muted">
                            Select airline and flight pair to claim insurance for. This requires first checking the flight status and reaching out to our oracles.
                        </Form.Text>
                    </Form>
                    <br />
                    <center>
                        <Button 
                            onClick={() => insuranceMethods.claimInsurance(claimInsuranceAirlineFlightNamePair)}
                            variant="dark"
                            style={{position: 'absolute', bottom: 25, right: '33%'}} 
                        >
                            💰 Claim Insurance
                        </Button>
                    </center>
                    <br />
                    { insuranceStates.claimInsuranceIsLoading && <center><SwitchLoaderComponent /></center> }
                </DappColumn>
            </Row>
        </Container>
    )
}