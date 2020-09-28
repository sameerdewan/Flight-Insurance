import React, { useContext } from 'react';
import Web3Context from '../contexts/Web3'; 
import MetamaskLogo from '../images/metamask_logo.png';
import { Navbar } from 'react-bootstrap'; 
import styled from 'styled-components';

const AccountCode = styled.code`
    color: white;
    font-size: 14px;
`;

export default function Footer() {
    const { account } = useContext(Web3Context);
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
                <AccountCode>{account}</AccountCode>
            </Navbar.Brand>
        </Navbar>
    );
}
