import React from 'react';
import styled from 'styled-components';

import LightMachine from './LightMachine';

const Circle = styled('div')`
    margin: 0.5em;
    width: 2.5em;
    height: 2.5em;
    background-color: ${props => props.color};
    border: 2px solid rgba(0, 0, 0, 0.25);
    border-radius: 9999px;
`;

const CircleBox = styled('div')`
    margin: 1em;
    border: 1px solid black;
    background-color: #666;
    border-radius: 0.5em;
    padding: 0.75em;
`;

const VehicleLight = () => (
    <CircleBox>
        <LightMachine.Activity is="v_red">
            <Circle color="#f33" />
        </LightMachine.Activity>
        <LightMachine.Activity not="v_red">
            <Circle color="#555" />
        </LightMachine.Activity>

        <LightMachine.Activity is="v_amber">
            <Circle color="#fa0" />
        </LightMachine.Activity>
        <LightMachine.Activity not="v_amber">
            <Circle color="#555" />
        </LightMachine.Activity>

        <LightMachine.Activity is="v_green">
            <Circle color="#4e9" />
        </LightMachine.Activity>
        <LightMachine.Activity not="v_green">
            <Circle color="#555" />
        </LightMachine.Activity>
    </CircleBox>
);

export default VehicleLight;
