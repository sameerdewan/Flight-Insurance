import React, { lazy, Suspense } from 'react';
import { HashRouter, Switch, Route } from 'react-router-dom'; 
import { HOME, BUY_FLIGHT_INSURANCE, CHECK_FLIGHT_STATUS, CLAIM_FLIGHT_INSURANCE } from './routerPaths';
import Loader from '../components/Loader';

export default function Router() {
    return (
        <Suspense fallback={<Loader message="Loading..." />}>
            <HashRouter basename={HOME}>
                <Switch>
                    <Route exact path={HOME} component={() => <div>home/buy insurance bro</div>} />
                    <Route exact path={BUY_FLIGHT_INSURANCE} component={() => <div>home</div>} />
                    <Route exact path={CHECK_FLIGHT_STATUS} component={() => <div>check yo flight</div>} />
                    <Route exact path={CLAIM_FLIGHT_INSURANCE} component={() => <div>claim dat boy</div>} />
                </Switch>
            </HashRouter>
        </Suspense>
    );
}
