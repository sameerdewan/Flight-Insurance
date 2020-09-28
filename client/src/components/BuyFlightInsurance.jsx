import React, { useContext } from 'react';
import DappContext from '../contexts/Dapp';

export default function BuyFlightInsurance() {
    const { state } = useContext(DappContext);
    const { allFlights } = state;

    return (
        <React.Fragment>
            {
                allFlights.map(flight => <span>{JSON.stringify(flight)}</span>)
            }
        </React.Fragment>
    )
}