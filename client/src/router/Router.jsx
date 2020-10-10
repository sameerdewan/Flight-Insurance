import React, { lazy, Suspense } from 'react';
import { HashRouter, Switch, Route } from 'react-router-dom'; 
import { HOME, FLIGHTS, ADMIN } from './routerPaths';
import Loader from '../components/Loader';

const Flights = lazy(() => import('../components/Flights'));

export default function Router() {
    return (
        <Suspense fallback={<Loader message="Loading..." />}>
            <HashRouter basename={HOME}>
                <Switch>
                    <Route exact path={HOME} component={() => <div>HOME!</div>} />
                    <Route exact path={FLIGHTS} component={Flights} />
                    <Route exact path={ADMIN} component={() => <div>ADMIN!</div>} />
                </Switch>
            </HashRouter>
        </Suspense>
    );
}
