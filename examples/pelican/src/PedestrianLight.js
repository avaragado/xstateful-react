import React from 'react';
import styled from 'styled-components';

import LightMachine from './LightMachine';
import PedWalkIcon from './PedWalkIcon';
import PedStopIcon from './PedStopIcon';

const PedBox = styled('div')`
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    margin: 1em;
    border: 1px solid black;
    background-color: #666;
    border-radius: 3px;
    padding: 0.5em;
    width: 6em;
    height: 12em;
`;

const Text = styled('div')`
    color: white;
    font-weight: bold;
    font-size: 6px;
    text-align: center;
`;

const RequestButton = styled('div')`
    background-color: #ccc;
    width: 1em;
    height: 1em;
    border: 0.25em solid ${props => (props.pressed ? 'white' : '#999')};
    cursor: pointer;
    border-radius: 0.25em;
`;

const PedestrianLight = () => (
    <PedBox>
        <LightMachine.Activity is="p_stop">
            {({ match }) => <PedStopIcon height="3em" lit={match} />}
        </LightMachine.Activity>

        <LightMachine.Activity is="p_walk">
            {({ match }) => <PedWalkIcon height="3em" lit={match} />}
        </LightMachine.Activity>

        <Text>
            Push button<br />Wait for signal
        </Text>

        <div>
            <LightMachine cond={({ extstate }) => extstate.isRequested}>
                {({ match, transition }) => (
                    <RequestButton
                        pressed={match}
                        onClick={() => transition('P_REQUEST')}
                    />
                )}
            </LightMachine>
        </div>
    </PedBox>
);

export default PedestrianLight;
