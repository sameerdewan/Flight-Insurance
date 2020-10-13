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
    const { flights, MINIMUM_INSURANCE_FUNDING, MAXIMUM_INSURANCE_FUNDING } = state;
    const [viewFlightAirlineFlightNamePair, setViewFlightAirlineFlightNamePair] = useState(undefined);
    const [buyInsuranceAirlineFlightNamePair, setBuyInsuranceAirlineFlightNamePair] = useState(undefined);
    const [buyInsuranceFundingAmount, setBuyInsuranceFundingAmount] = useState(undefined);
    const [checkPolicyAirlineFlightNamePair, setCheckPolicyAirlineFlightNamePair] = useState(undefined);
    const [claimInsuranceAirlineFlightNamePair, setClaimInsuranceAirlineFlightNamePair] = useState(undefined);

    return (
        <Container fluid>
            <Row>
                <DappColumn image={ViewFlights} name="View Flights">
                    <br />
                    <Form>
                        <Form.Label>Select Airline and Flight</Form.Label>
                        <Form.Control as="select" onChange={e => setViewFlightAirlineFlightNamePair(e.target.value.split(' ➡️ '))}>
                            <option />
                            {flights.map((f, i) => <option key={i}>{f.airlineName} ➡️ {f.flightName}</option>)}
                        </Form.Control>
                        <Form.Text className="text-muted">
                            Select airline and flight pair to retrieve info for and pull the latest information for from our oracle network
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
                    <br />
                    { insuranceStates.viewFlightsIsLoading && <center><SwitchLoaderComponent /></center> }
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
                            Minimum insurance funding amount is currently {Number(MINIMUM_INSURANCE_FUNDING) + 20} wei and maximum funding is {Number(MAXIMUM_INSURANCE_FUNDING)} wei
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
                            Select airline and flight pair to claim insurance for
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