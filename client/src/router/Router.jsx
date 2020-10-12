import React, { lazy, Suspense } from 'react';
import { HashRouter, Switch, Route } from 'react-router-dom'; 
import { HOME, PASSENGER_INSURANCE, CONTRACT_ADMIN, AIRLINE_ADMIN } from './routerPaths';
import Loader from '../components/Loader';

const PassengerInsurance = lazy(() => import('../components/PassengerInsurance'));
const ContractAdmin = lazy(() => import('../components/ContractAdmin'));
const AirlineAdmin = lazy(() => import('../components/AirlineAdmin'));

export default function Router() {
    return (
        <Suspense fallback={<Loader message="Loading..." />}>
            <HashRouter basename={HOME}>
                <Switch>
                    <Route exact path={HOME} component={() => <div>HOME!</div>} />
                    <Route exact path={PASSENGER_INSURANCE} component={PassengerInsurance} />
                    <Route exact path={AIRLINE_ADMIN} component={AirlineAdmin} />
                    <Route exact path={CONTRACT_ADMIN} component={ContractAdmin} />
                </Switch>
            </HashRouter>
        </Suspense>
    );
}
