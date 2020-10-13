import React, { lazy, Suspense } from 'react';
import { HashRouter, Switch, Route } from 'react-router-dom'; 
import { HOME, PASSENGER_INSURANCE, CONTRACT_ADMIN, AIRLINE_ADMIN } from './routerPaths';
import Loader from '../components/Loader';
import { Card } from 'react-bootstrap';
import Oracle from '../images/oracle.png';

const PassengerInsurance = lazy(() => import('../components/PassengerInsurance'));
const ContractAdmin = lazy(() => import('../components/ContractAdmin'));
const AirlineAdmin = lazy(() => import('../components/AirlineAdmin'));

export default function Router() {
    return (
        <Suspense fallback={<Loader message="Loading..." />}>
            <HashRouter basename={HOME}>
                <Switch>
                    <Route exact path={HOME} component={() => 
                        <div style={{ display: 'flex' }}>
                            <Card style={{ width: '25rem', margin: 50 }}>
                                <Card.Body>
                                    <Card.Title>Oracles</Card.Title>
                                    <Card.Subtitle className="mb-2 text-muted">View API exposed oracle data</Card.Subtitle>
                                    <Card.Text>
                                        Note: These URLs will not work until <code>npm run server</code> has been ran, which
                                        must be run <b>after</b> initializing all contracts under the <b>Contract Administration</b> tab.
                                    </Card.Text>
                                    <Card.Link href="http://localhost:5000/oracles">View All Oracles</Card.Link>
                                    <Card.Link href="http://localhost:5000/logs">View Oracle Logs</Card.Link>
                                    <center><img src={Oracle} height={250} width={250} /></center>
                                </Card.Body>
                            </Card>
                            <Card style={{ width: '45rem', height: '30rem', margin: 50 }}>
                                <Card.Body>
                                    <Card.Title>Block Airline Insurance Tutorial</Card.Title>
                                    <Card.Subtitle className="mb-2 text-muted">View a short guided video </Card.Subtitle>
                                    <Card.Text>
                                        Watch a short guided video which explains how to set up and interact with this <b>dApp</b>.
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </div>
                    }/>
                    <Route exact path={PASSENGER_INSURANCE} component={PassengerInsurance} />
                    <Route exact path={AIRLINE_ADMIN} component={AirlineAdmin} />
                    <Route exact path={CONTRACT_ADMIN} component={ContractAdmin} />
                </Switch>
            </HashRouter>
        </Suspense>
    );
}
