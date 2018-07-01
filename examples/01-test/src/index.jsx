import React from 'react';
import ReactDOM from 'react-dom';

import { Machine } from 'xstate';
import { createStatefulMachine } from '@avaragado/xstateful';
import { createReactMachine } from '@avaragado/xstateful-react';

const machine = Machine({
    key: 'test',
    initial: 'first',
    states: {
        first: {
            activities: ['one'],
            on: {
                NEXT: 'second',
            },
        },
        second: {
            activities: ['two'],
            on: {
                NEXT: 'first',
            },
        },
    },
});

const xsf = createStatefulMachine({ machine });
xsf.init();

const { Provider, Consumer, Activity, State } = createReactMachine(xsf);

ReactDOM.render(
    <Provider>
        <State is="first">
            <p>FIRST</p>
        </State>

        <State is="second">
            <p>SECOND</p>
        </State>

        <Activity is="one">
            <p>ONE</p>
        </Activity>

        <Activity is="two">
            <p>TWO</p>
        </Activity>

        <Consumer>
            {({ state, extstate, init, transition }) => (
                <React.Fragment>
                    <p>
                        <button type="button" onClick={init}>
                            Init
                        </button>
                        <button
                            type="button"
                            onClick={() => transition('NEXT')}
                        >
                            NEXT
                        </button>
                    </p>
                    <pre>{JSON.stringify(state, null, 4)}</pre>
                    <pre>{JSON.stringify(extstate, null, 4)}</pre>
                </React.Fragment>
            )}
        </Consumer>
    </Provider>,
    document.getElementById('root'),
);
