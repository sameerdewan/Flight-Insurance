import React from 'react';
import styled from 'styled-components';
import { Spinner } from 'react-bootstrap';

const LoaderWidget = styled(Spinner)`
    height: 300px;
    width: 300px;
    border-width: 20px;
    margin: auto auto;
`;

const LoaderContainer = styled.div`
    width: 100vw;
    height: 80vh;
    display: flex;
    justify-content: center;
`;

const LoaderText = styled.h2`
    text-align: center;
`;

export default function Loader({ message }) {
    return (
        <React.Fragment>
            <LoaderContainer>
                <LoaderWidget animation="border" variant="danger" size="lg" />
            </LoaderContainer>
            <LoaderText className="text-danger">{message}</LoaderText>
        </React.Fragment>
    );
}
