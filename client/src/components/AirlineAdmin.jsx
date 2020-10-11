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

const Column = styled(Col)`
    border-right: 1px dotted lightgrey;
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
    const { state } = useContext(DappContext);
    const { MINIMUM_PARTNER_FEE } = state;
    return (
        <Container fluid>
            <Row height={'100%'}>
                <AirlineAdminColumn image={ApplyAirline} name='Apply Airline' >
                    <br/>
                    <Form>
                        <Form.Label>Airline Name</Form.Label>
                        <Form.Control placeholder="Enter Airline Name..." />
                        <Form.Text className="text-muted">
                            Current account address will be made airline address
                        </Form.Text>
                        <br/>
                        <center><Button style={{marginTop: 61}} variant='dark'>📝 Apply Airline</Button></center>
                    </Form>
                </AirlineAdminColumn>
                <AirlineAdminColumn image={VoteAirline} name='Vote for Airline'>
                    <br/>
                    <Form>
                        <Form.Label>Airline Name</Form.Label>
                        <Form.Control placeholder="Enter Airline Name..." />
                        <Form.Text className="text-muted">
                            Current account address must be owner/airline
                        </Form.Text>
                        <br/>
                        <center><Button style={{marginTop: 61}} variant='dark'>🗳️ Vote for Airline</Button></center>
                    </Form>
                </AirlineAdminColumn>
                <AirlineAdminColumn image={FundAirline} name='Fund Airline'>
                    <br/>
                    <Form>
                        <Form.Label>Funding Amount</Form.Label>
                        <Form.Control placeholder="Enter funds in wei..." />
                        <Form.Text className="text-muted">
                            Minimum funding is currently {MINIMUM_PARTNER_FEE + ' wei'}
                        </Form.Text>
                        <br/>
                        <center><Button style={{marginTop: 61}} variant='dark'>💰 Fund Airline</Button></center>
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
                    <center><Button variant='dark'>✈️ Add Flight</Button></center>
                </AirlineAdminColumn>
            </Row>
        </Container>
    );
}