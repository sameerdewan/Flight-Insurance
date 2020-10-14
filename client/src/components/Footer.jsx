import React, { useContext } from 'react';
import Web3Context from '../contexts/Web3'; 
import MetamaskLogo from '../images/metamask_logo.png';
import { Badge, Navbar } from 'react-bootstrap'; 
import styled from 'styled-components';
import DappContext from '../contexts/Dapp';

const AccountCode = styled.code`
    color: white;
    font-size: 14px;
`;

export default function Footer() {
    const { account } = useContext(Web3Context);
    const { state } = useContext(DappContext);
    const { airlines } = state;

    const name = airlines.filter(a => a.address.toLowerCase() === account.toLowerCase())[0]?.name || account;
    const status = airlines.filter(a => a.address.toLowerCase() === account.toLowerCase())[0]?.status || '???';
    const isAirline = airlines.filter(a => a.address.toLowerCase() === account.toLowerCase()).length;

    return (
        <Navbar fixed="bottom" variant="dark" bg="dark">
            <Navbar.Brand>
                <img
                alt=""
                src={MetamaskLogo}
                width="40"
                height="30"
                className="d-inline-block align-top"
                />{' '}
                {
                    !isAirline && <AccountCode>{account}</AccountCode>
                }
                {isAirline &&
                    <AccountCode>Airline: {name} || Status: <Badge>{status}</Badge></AccountCode>
                }
            </Navbar.Brand>
        </Navbar>
    );
}
