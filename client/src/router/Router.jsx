import React, { lazy, Suspense } from 'react';
import { HashRouter, Switch, Route } from 'react-router-dom'; 
import { HOME, BUY_FLIGHT_INSURANCE, CHECK_FLIGHT_STATUS, CLAIM_FLIGHT_INSURANCE } from './routerPaths';
import Loader from '../components/Loader';

const BuyFlightInsurance = lazy(() => import('../components/BuyFlightInsurance'));

export default function Router() {
    return (
        <Suspense fallback={<Loader message="Loading..." />}>
            <HashRouter basename={HOME}>
                <Switch>
                    <Route exact path={HOME} component={BuyFlightInsurance} />
                    <Route exact path={BUY_FLIGHT_INSURANCE} component={BuyFlightInsurance} />
                    <Route exact path={CHECK_FLIGHT_STATUS} component={() => <div>check yo flight</div>} />
                    <Route exact path={CLAIM_FLIGHT_INSURANCE} component={() => <div>claim dat boy</div>} />
                </Switch>
            </HashRouter>
        </Suspense>
    );
}
