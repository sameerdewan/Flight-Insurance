import React from 'react';
import styled from 'styled-components';
import { Badge, Spinner } from 'react-bootstrap';

export default function SwitchLoaderComponent({absolute}) {
    const SwitchLoader = styled(Badge)`
        margin-left: ${props => props.absolute === true ? '10px' : '0px'};
        position: ${props => props.absolute == true ? 'absolute' : 'unset'};
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