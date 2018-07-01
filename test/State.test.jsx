// @flow

import React from 'react';
import renderer from 'react-test-renderer';
import { Machine } from 'xstate';
import { createStatefulMachine } from '@avaragado/xstateful';

import { createReactMachine } from '..';

const machine = Machine({
    key: 'test',
    initial: 'first',
    states: {
        first: {},
        second: {},
        third: {},
    },
});

const expectMatch = expectedMatch => props =>
    props.match === expectedMatch ? 'pass' : 'fail';

const pass = () => 'pass';
const fail = () => 'fail';

const fixtures = [
    {
        title: 'is string',
        config: {
            machine,
        },
        render: (Provider, State) => (
            <Provider>
                <State is="first">{expectMatch(true)}</State>
                <State is="second">{expectMatch(false)}</State>
            </Provider>
        ),
    },

    {
        title: 'is array',
        config: {
            machine,
        },
        render: (Provider, State) => (
            <Provider>
                <State is={['first', 'third']}>{expectMatch(true)}</State>
                <State is={['second', 'third']}>{expectMatch(false)}</State>
            </Provider>
        ),
    },

    {
        title: 'is function',
        config: {
            machine,
        },
        render: (Provider, State) => (
            <Provider>
                <State is={value => value === 'first'}>
                    {expectMatch(true)}
                </State>
                <State is={value => value === 'second'}>
                    {expectMatch(false)}
                </State>
            </Provider>
        ),
    },

    {
        title: 'not string',
        config: {
            machine,
        },
        render: (Provider, State) => (
            <Provider>
                <State not="first">{expectMatch(false)}</State>
                <State not="second">{expectMatch(true)}</State>
            </Provider>
        ),
    },

    {
        title: 'not array',
        config: {
            machine,
        },
        render: (Provider, State) => (
            <Provider>
                <State not={['first', 'third']}>{expectMatch(false)}</State>
                <State not={['second', 'third']}>{expectMatch(true)}</State>
            </Provider>
        ),
    },

    {
        title: 'not function',
        config: {
            machine,
        },
        render: (Provider, State) => (
            <Provider>
                <State not={value => value === 'first'}>
                    {expectMatch(false)}
                </State>
                <State not={value => value === 'second'}>
                    {expectMatch(true)}
                </State>
            </Provider>
        ),
    },

    {
        title: 'no test prop at all is equivalent to a match',
        config: {
            machine,
        },
        render: (Provider, State) => (
            <Provider>
                <State>{expectMatch(true)}</State>
            </Provider>
        ),
    },

    {
        title: 'passes component/render/children props down',
        config: {
            machine,
        },
        render: (Provider, State) => (
            <Provider>
                <State is="first">{expectMatch(true)}</State>
                <State is="first" render={pass} />
                <State is="first" component={pass} />
                <State is="second">{expectMatch(false)}</State>
                <State is="second" render={fail} />
                <State is="second" component={fail} />
            </Provider>
        ),
    },

    {
        title: 'is > not',
        config: {
            machine,
        },
        render: (Provider, State) => (
            <Provider>
                <State is="first" not="first">
                    {expectMatch(true)}
                </State>
            </Provider>
        ),
    },
];

describe('State', () => {
    test('exists', () => {
        const xsf = createStatefulMachine({ machine });
        xsf.init();

        const { State } = createReactMachine(xsf);

        expect(State).toBeDefined();
    });

    test('copes before xsf.init()', () => {
        const xsf = createStatefulMachine({ machine });

        const { Provider, State } = createReactMachine(xsf);

        // before init, state is null.
        const component = renderer.create(
            <Provider>
                <State is="first">{expectMatch(false)}</State>
                <State not="first">{expectMatch(true)}</State>
                <State is={['first', 'third']}>{expectMatch(false)}</State>
                <State not={['first', 'third']}>{expectMatch(true)}</State>
                <State is={value => value === 'first'}>
                    {expectMatch(false)}
                </State>
                <State not={value => value === 'first'}>
                    {expectMatch(true)}
                </State>
            </Provider>,
        );

        const tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });

    fixtures.forEach(fixture => {
        test(fixture.title, () => {
            const xsf = createStatefulMachine(fixture.config);
            xsf.init();

            const { Provider, State } = createReactMachine(xsf);

            const component = renderer.create(fixture.render(Provider, State));

            const tree = component.toJSON();
            expect(tree).toMatchSnapshot();
        });
    });
});
