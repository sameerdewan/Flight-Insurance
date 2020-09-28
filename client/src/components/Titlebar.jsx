import React from 'react';
import { Navbar, Badge } from 'react-bootstrap'; 
import Logo from '../images/logo.png';
import { HOME } from '../router/routerPaths'; 
import { changePath } from '../utils/routerFunctions';

export default function Titlebar() {
    return (
        <Navbar bg="dark" variant="dark">
          <Navbar.Brand onClick={() => changePath(HOME)} style={{cursor: 'pointer'}}>
            <img
              alt=""
              src={Logo}
              width="30"
              height="30"
              className="d-inline-block align-top"
            />{' '}
            Block Airline Insurance
        </Navbar.Brand>
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
            Status: <Badge pill variant="success">Operational</Badge>
          </Navbar.Text>
        </Navbar.Collapse>
      </Navbar>
    );
}