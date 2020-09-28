import React, { useContext } from 'react';
import Web3Context from '../contexts/Web3'; 
import MetamaskLogo from '../images/metamask_logo.png';
import { Navbar } from 'react-bootstrap'; 

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
                {account}
            </Navbar.Brand>
        </Navbar>
    );
}
