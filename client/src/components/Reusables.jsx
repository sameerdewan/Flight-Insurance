import React from 'react';
import styled from 'styled-components';
import { Badge, Spinner, Col } from 'react-bootstrap';

export function SwitchLoaderComponent({absolute}) {
    const SwitchLoader = styled(Badge)`
        margin-left: ${props => props.absolute === true ? '10px' : '0px'};
        position: ${props => props.absolute === true ? 'absolute' : 'unset'};
        left: ${props => props.absolute === true ? '340px' : '0px'};
        height: fit-content;
    `;
    return (
        <SwitchLoader variant="warning" absolute={absolute}>
            <Spinner size="sm" animation="border" variant="danger" />
            <span>&nbsp;loading...</span>
        </SwitchLoader>
    );
}

const Column = styled(Col)`
    border-right: 1px dashed lightgrey;
    height: calc(100vh - 150px);
`;

export const DappColumn = ({ image, name, children }) => {
    const proportion = 250;
    return (
        <Column>
            <center>
                <img src={image} height={proportion} width={proportion} />
                <h5><u>{name}</u></h5>
            </center>
            {children}
        </Column>
    );
};