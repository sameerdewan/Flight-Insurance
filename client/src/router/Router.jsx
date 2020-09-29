import React, { lazy, Suspense } from 'react';
import { HashRouter, Switch, Route } from 'react-router-dom'; 
import { HOME } from './routerPaths';
import Loader from '../components/Loader';

const BuyFlightInsurance = lazy(() => import('../components/Home'));

export default function Router() {
    return (
        <Suspense fallback={<Loader message="Loading..." />}>
            <HashRouter basename={HOME}>
                <Switch>
                    <Route exact path={HOME} component={BuyFlightInsurance} />
                </Switch>
            </HashRouter>
        </Suspense>
    );
}
