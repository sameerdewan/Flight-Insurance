import React from 'react';
import { Nav } from 'react-bootstrap';
import { HOME, FLIGHTS, ADMIN } from '../router/routerPaths';
import { changePath } from '../utils/routerFunctions';

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

export default function Navigation() {
    return (
        <Nav variant="tabs" defaultActiveKey={TABS[0].label}>
          { TABS.map(tab => <Tab tab={tab} key={tab.label} />) }
        </Nav>
    );
}
