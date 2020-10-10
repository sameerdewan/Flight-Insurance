import React, { useEffect, useState } from 'react';
import { Nav } from 'react-bootstrap';
import { HOME, FLIGHTS, ADMIN } from '../router/routerPaths';
import { changePath } from '../utils/routerFunctions';
import { upperFirst } from 'lodash';

const TABS = [
    {
        label: 'Home',
        path: HOME
    },
    {
        label: 'Flights',
        path: FLIGHTS
    },
    {
        label: 'Admin',
        path: ADMIN
    }
];

function Tab({ tab }) {
    return (
        <Nav.Item>
            <Nav.Link onClick={() => changePath(tab.path)} eventKey={tab.label}>{tab.label}</Nav.Link>
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
        let _label = upperFirst(hash.replace('#/', ''));
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
