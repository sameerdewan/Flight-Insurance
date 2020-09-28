import React from 'react';
import { Nav } from 'react-bootstrap';
import { changePath } from '../utils/routerFunctions';

const TABS = [
    {
        label: 'Buy Flight Insurance',
        path: '/'
    },
    {
        label: 'Check Flight Status',
        path: '/flight-status'
    },
    {
        label: 'Claim Flight Insurance',
        path: '/claims'
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
          { TABS.map(tab => <Tab tab={tab} />) }
        </Nav>
    );
}