import React, { useEffect, useState, useContext } from 'react';
import { Nav } from 'react-bootstrap';
import { HOME, BUY_INSURANCE, CLAIM_INSURANCE, AIRLINE_ADMIN, CONTRACT_ADMIN } from '../router/routerPaths';
import { changePath } from '../utils/routerFunctions';
import { upperFirst } from 'lodash';
import DappContext from '../contexts/Dapp';

const TABS = [
    {
        label: 'Home',
        path: HOME
    },
    {
        label: 'Buy Insurance',
        path: BUY_INSURANCE
    },
    {
        label: 'Claim Insurance',
        path: CLAIM_INSURANCE
    },
    {
        label: 'Airline Administration',
        path: AIRLINE_ADMIN
    },
    {
        label: 'Contract Administration',
        path: CONTRACT_ADMIN
    }
];

function Tab({ tab }) {
    const { state } = useContext(DappContext);
    const { isOperational } = state;
    const isDisabled = !(tab.label === 'Home' || tab.label === 'Contract Administration');
    return (
        <Nav.Item>
            <Nav.Link disabled={isDisabled === true && isOperational === false} onClick={() => changePath(tab.path)} eventKey={tab.label}>{tab.label}</Nav.Link>
        </Nav.Item>
    );
}

const useHashRouter = () => {
    const [hash, setHash] = React.useState(window.location.hash);
    const listenToPopstate = () => {
      const winHash = window.location.hash;
      setHash(winHash);
    };
    React.useEffect(() => {
      window.addEventListener("popstate", listenToPopstate);
      return () => {
        window.removeEventListener("popstate", listenToPopstate);
      };
    }, []);
    return hash;
  };

export default function Navigation() {
    const [label, setLabel] = useState(TABS[0].label);
    const hash = useHashRouter();
    useEffect(() => {
        let _label = hash.replace('#/', '').split('-').map(w => upperFirst(w)).join(' ');
        if (_label === "") {
            _label = TABS[0].label;
        }
        setLabel(_label);
    }, [hash]);

    return (
        <Nav variant="tabs" defaultActiveKey={TABS[0].label} activeKey={label}>
          { TABS.map(tab => <Tab tab={tab} key={tab.label} />) }
        </Nav>
    );
}
