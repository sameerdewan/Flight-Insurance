import React, { useContext } from 'react';
import { Navbar, Badge } from 'react-bootstrap'; 
import DappContext from '../contexts/Dapp';
import Logo from '../images/logo.png';
import { HOME } from '../router/routerPaths'; 
import { changePath } from '../utils/routerFunctions';

export default function Titlebar() {
  const { state } = useContext(DappContext);
  const { isOperational } = state;

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
        Status: <Badge pill variant={isOperational ? 'success' : 'danger'}>{isOperational ? 'Operational' : 'Not Operational'}</Badge>
        </Navbar.Text>
      </Navbar.Collapse>
    </Navbar>
  );
}