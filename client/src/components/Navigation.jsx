import React from 'react';
import { Nav } from 'react-bootstrap';
import { BUY_FLIGHT_INSURANCE, CHECK_FLIGHT_STATUS, CLAIM_FLIGHT_INSURANCE } from '../router/routerPaths';
import { changePath } from '../utils/routerFunctions';

const TABS = [
    {
        label: 'Buy Flight Insurance',
        path: BUY_FLIGHT_INSURANCE
    },
    {
        label: 'Check Flight Status',
        path: CHECK_FLIGHT_STATUS
    },
    {
        label: 'Claim Flight Insurance',
        path: CLAIM_FLIGHT_INSURANCE
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
