import React from 'react';
import { Navbar } from 'react-bootstrap'; 
import Logo from '../images/logo.png';
import { changePath } from '../utils/routerFunctions';

export default function Titlebar() {
    return (
        <Navbar bg="dark" variant="dark">
          <Navbar.Brand onClick={() => changePath('/')} style={{cursor: 'pointer'}}>
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