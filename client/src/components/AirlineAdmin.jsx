import React, { useContext } from 'react';
import { Container, Row, Form, Button } from 'react-bootstrap';
import ApplyAirline from '../images/apply_airline.png';
import VoteAirline from '../images/vote_airline.png';
import FundAirline from '../images/fund_airline.png';
import AddFlight from '../images/add_flight.png';
import DappContext from '../contexts/Dapp';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { SwitchLoaderComponent, DappColumn } from './Reusables';
import { useState } from 'react';

export default function AirlineAdmin() {
    const { state, airlineMethods, airlineStates } = useContext(DappContext);
    const { MINIMUM_PARTNER_FEE } = state;
    const [applyAirlineName, setApplyAirlineName] = useState(undefined);
    const [voteAirlineName, setVoteAirlineName] = useState(undefined);
    const [fundAirlineValue, setFundAirlineValue] = useState(undefined);
    const [fundAirlineName, setFundAirlineName] = useState(undefined);
    const [addFlightDateTimeDeparture, setAddFlightDateTimeDeparture] = useState(undefined);
    const [addFlightName, setAddFlightName] = useState(undefined);

    return (
        <Container fluid>
            <Row>
                <DappColumn image={ApplyAirline} name='Apply Airline' >
                    <br/>
                    <Form>
                        <Form.Label>Airline Name</Form.Label>
                        <Form.Control placeholder="Enter Airline Name..." onChange={e => setApplyAirlineName(e.target.value)} />
                        <Form.Text className="text-muted">
                            Current account address will be made airline address
                        </Form.Text>
                        <br/>
                        <center>
                            <Button 
                                onClick={() => airlineMethods.applyAirline(applyAirlineName)} 
                                style={{position: 'absolute', bottom: 25, right: '33%'}} 
                                variant='dark'
                            >
                                📝 Apply Airline
                            </Button>
                        </center>
                        <br/>
                        { airlineStates.airlineApplyIsLoading && <center><SwitchLoaderComponent /></center> }
                    </Form>
                </DappColumn>
                <DappColumn image={VoteAirline} name='Vote for Airline'>
                    <br/>
                    <Form>
                        <Form.Label>Airline Name</Form.Label>
                        <Form.Control placeholder="Enter Airline Name..." onChange={e => setVoteAirlineName(e.target.value)} />
                        <Form.Text className="text-muted">
                            Current account address must be owner or approved airline
                        </Form.Text>
                        <br/>
                        <center>
                            <Button 
                                onClick={() => airlineMethods.voteAirline(voteAirlineName)}
                                style={{position: 'absolute', bottom: 25, right: '33%'}} 
                                variant='dark'
                            >
                                🗳️ Vote for Airline
                            </Button>
                        </center>
                        <br/>
                        { airlineStates.airlineVoteIsLoading && <center><SwitchLoaderComponent /></center> }
                    </Form>
                </DappColumn>
                <DappColumn image={FundAirline} name='Fund Airline'>
                    <br/>
                    <Form>
                        <Form.Label>Airline Name</Form.Label>
                        <Form.Control placeholder="Enter Airline Name..." onChange={e => setFundAirlineName(e.target.value)} />
                        <Form.Text className="text-muted">
                            Airline name to fund
                        </Form.Text>
                        <Form.Label>Funding Amount</Form.Label>
                        <Form.Control placeholder="Enter funds in wei..." onChange={e => setFundAirlineValue(Number(e.target.value))} />
                        <Form.Text className="text-muted">
                            Minimum funding is currently {">"} {Number(MINIMUM_PARTNER_FEE) + 10} wei
                        </Form.Text>
                        <br/>
                        <center>
                            <Button 
                                onClick={() => airlineMethods.fundAirline(fundAirlineName, fundAirlineValue)}
                                variant='dark'
                                style={{position: 'absolute', bottom: 25, right: '33%'}}
                            >
                                💰 Fund Airline
                            </Button>
                        </center>
                        <br/>
                        { airlineStates.airlineFundIsLoading && <center><SwitchLoaderComponent /></center> }
                    </Form>
                </DappColumn>
                <DappColumn image={AddFlight} name='Add Flight'>
                    <br/>
                    <Form.Label>Flight Date/Time Departure</Form.Label>
                    <DatePicker
                        selected={addFlightDateTimeDeparture}
                        onChange={setAddFlightDateTimeDeparture}
                        showTimeSelect
                        dateFormat="Pp"
                    />
                    <Form.Text className="text-muted">
                        Select date and time of flight
                    </Form.Text>
                    <br/>
                    <Form.Label>Flight Name</Form.Label>
                    <Form.Control placeholder="Enter flight name..." onChange={e => setAddFlightName(e.target.value)} />
                    <Form.Text className="text-muted">
                        Example: [MIA, FL {">"} LA, CA]
                    </Form.Text>
                    <br/>
                    <center>
                        <Button 
                            onClick={() => airlineMethods.addFlight(addFlightDateTimeDeparture, addFlightName)}
                            style={{position: 'absolute', bottom: 25, right: '33%'}} 
                            variant='dark'
                        >
                            ✈️ Add Flight
                        </Button>
                    </center>
                    <br/>
                    { airlineStates.airlineAddFlightIsLoading && <center><SwitchLoaderComponent /></center> }
                </DappColumn>
            </Row>
        </Container>
    );
}