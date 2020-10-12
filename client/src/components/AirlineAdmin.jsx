import React, { useContext } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import styled from 'styled-components';
import ApplyAirline from '../images/apply_airline.png';
import VoteAirline from '../images/vote_airline.png';
import FundAirline from '../images/fund_airline.png';
import AddFlight from '../images/add_flight.png';
import DappContext from '../contexts/Dapp';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SwitchLoaderComponent from './Reusables';
import { useState } from 'react';

const Column = styled(Col)`
    border-right: 1px dashed lightgrey;
    height: calc(100vh - 150px);
`;

const AirlineAdminColumn = ({ image, name, children }) => {
    const proportion = 250;
    return (
        <Column>
            <center>
                <img src={image} height={proportion} width={proportion} />
                <h5><u>{name}</u></h5>
            </center>
            {children}
        </Column>
    );
};

export default function AirlineAdmin() {
    const { state, airlineMethods, airlineStates } = useContext(DappContext);
    const { MINIMUM_PARTNER_FEE } = state;
    const [applyAirlineName, setApplyAirlineName] = useState(undefined);
    const [voteAirlineName, setVoteAirlineName] = useState(undefined);
    const [fundAirlineValue, setFundAirlineValue] = useState(undefined);
    const [fundAirlineName, setFundAirlineName] = useState(undefined);
    return (
        <Container fluid>
            <Row height={'100%'}>
                <AirlineAdminColumn image={ApplyAirline} name='Apply Airline' >
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
                                style={{marginTop: 91}} 
                                variant='dark'
                            >
                                📝 Apply Airline
                            </Button>
                        </center>
                        <br/>
                        { airlineStates.airlineApplyIsLoading && <center><SwitchLoaderComponent /></center> }
                    </Form>
                </AirlineAdminColumn>
                <AirlineAdminColumn image={VoteAirline} name='Vote for Airline'>
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
                                style={{marginTop: 91}} 
                                variant='dark'
                            >
                                🗳️ Vote for Airline
                            </Button>
                        </center>
                        <br/>
                        { airlineStates.airlineVoteIsLoading && <center><SwitchLoaderComponent /></center> }
                    </Form>
                </AirlineAdminColumn>
                <AirlineAdminColumn image={FundAirline} name='Fund Airline'>
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
                            Minimum funding is currently {MINIMUM_PARTNER_FEE + ' wei'}
                        </Form.Text>
                        <br/>
                        <center>
                            <Button 
                                onClick={() => airlineMethods.fundAirline(fundAirlineName, fundAirlineValue)}
                                variant='dark'
                                style={{marginTop: 0}}
                            >
                                💰 Fund Airline
                            </Button>
                        </center>
                        <br/>
                        { airlineStates.airlineFundIsLoading && <center><SwitchLoaderComponent /></center> }
                    </Form>
                </AirlineAdminColumn>
                <AirlineAdminColumn image={AddFlight} name='Add Flight'>
                    <br/>
                    <Form.Label>Flight Date/Time Departure</Form.Label>
                    <DatePicker
                        // selected={date}
                        // onChange={handleDateChange}
                        showTimeSelect
                        dateFormat="Pp"
                    />
                    <br/>
                    <Form.Label>Flight Name</Form.Label>
                    <Form.Control placeholder="Enter flight name..." />
                    <Form.Text className="text-muted">
                        Example: [MIA, FL {">"} LA, CA]
                    </Form.Text>
                    <br/>
                    <center><Button style={{marginTop: 31}} variant='dark'>✈️ Add Flight</Button></center>
                    <br/>
                    { airlineStates.airlineAddFlightIsLoading && <center><SwitchLoaderComponent /></center> }
                </AirlineAdminColumn>
            </Row>
        </Container>
    );
}