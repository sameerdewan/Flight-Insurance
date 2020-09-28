import React from 'react';
import { Navbar } from 'react-bootstrap'; 
import Logo from '../images/logo.png';

export default function Titlebar() {
    return (
        <Navbar bg="light">
          <Navbar.Brand href="#home">
            <img
              alt=""
              src={Logo}
              width="30"
              height="30"
              className="d-inline-block align-top"
            />{' '}
            Block Airline Insurance
        </Navbar.Brand>
      </Navbar>
    );
}