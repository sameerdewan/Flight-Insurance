import React, { lazy, Suspense } from 'react';
import { HashRouter, Switch, Route } from 'react-router-dom'; 
import { HOME, CLAIM_INSURANCE, BUY_INSURANCE, CONTRACT_ADMIN, AIRLINE_ADMIN } from './routerPaths';
import Loader from '../components/Loader';

const BuyInsurance = lazy(() => import('../components/BuyInsurance'));
const ContractAdmin = lazy(() => import('../components/ContractAdmin'));

export default function Router() {
    return (
        <Suspense fallback={<Loader message="Loading..." />}>
            <HashRouter basename={HOME}>
                <Switch>
                    <Route exact path={HOME} component={() => <div>HOME!</div>} />
                    <Route exact path={BUY_INSURANCE} component={BuyInsurance} />
                    <Route exact path={CLAIM_INSURANCE} component={() => <div>CLAIM INSURANCE!</div>} />
                    <Route exact path={AIRLINE_ADMIN} component={() => <div>AIRLINE ADMIN!</div>} />
                    <Route exact path={CONTRACT_ADMIN} component={ContractAdmin} />
                </Switch>
            </HashRouter>
        </Suspense>
    );
}
