import React from 'react';
import styled, { injectGlobal } from 'styled-components';

import LightMachine from './LightMachine';
import ResetButton from './ResetButton';
import EventButton from './EventButton';
import Logger from './Logger';
import VehicleLight from './VehicleLight';
import PedestrianLight from './PedestrianLight';

injectGlobal`
    body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
        font-size: 1rem;
        font-weight: 400;
        line-height: 1.5;
        color: #222;
        text-align: left;
        background-color: #fff;
    }
`;

const Flex = styled('div')`
    display: flex;
    align-items: center;
`;

const App = () => (
    <LightMachine.Provider>
        <LightMachine.Control onDidMount={props => props.init()}>
            <div>
                <ResetButton>Reset</ResetButton>{' '}
                <LightMachine.State is="powered_off">
                    <EventButton event="POWER_ON">Power on</EventButton>
                </LightMachine.State>
                <LightMachine.State is="powered_on">
                    <EventButton event="POWER_OFF">Power off</EventButton>
                </LightMachine.State>
            </div>

            <Flex>
                <VehicleLight />
                <PedestrianLight />
            </Flex>

            <div>
                <Logger />
            </div>
        </LightMachine.Control>
    </LightMachine.Provider>
);

export default App;
