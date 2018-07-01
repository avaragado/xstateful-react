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
        first: {
            activities: ['one'],
        },
        second: {
            activities: ['two'],
        },
        three: {
            activities: ['three'],
        },
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
        render: (Provider, Activity) => (
            <Provider>
                <Activity is="one">{expectMatch(true)}</Activity>
                <Activity is="two">{expectMatch(false)}</Activity>
            </Provider>
        ),
    },

    {
        title: 'is array',
        config: {
            machine,
        },
        render: (Provider, Activity) => (
            <Provider>
                <Activity is={['one', 'three']}>{expectMatch(true)}</Activity>
                <Activity is={['two', 'three']}>{expectMatch(false)}</Activity>
            </Provider>
        ),
    },

    {
        title: 'is function',
        config: {
            machine,
        },
        render: (Provider, Activity) => (
            <Provider>
                <Activity is={activities => activities.one}>
                    {expectMatch(true)}
                </Activity>
                <Activity is={activities => activities.two}>
                    {expectMatch(false)}
                </Activity>
            </Provider>
        ),
    },

    {
        title: 'not string',
        config: {
            machine,
        },
        render: (Provider, Activity) => (
            <Provider>
                <Activity not="one">{expectMatch(false)}</Activity>
                <Activity not="two">{expectMatch(true)}</Activity>
            </Provider>
        ),
    },

    {
        title: 'not array',
        config: {
            machine,
        },
        render: (Provider, Activity) => (
            <Provider>
                <Activity not={['one', 'three']}>{expectMatch(false)}</Activity>
                <Activity not={['two', 'three']}>{expectMatch(true)}</Activity>
            </Provider>
        ),
    },

    {
        title: 'not function',
        config: {
            machine,
        },
        render: (Provider, Activity) => (
            <Provider>
                <Activity not={activities => activities.one}>
                    {expectMatch(false)}
                </Activity>
                <Activity not={activities => activities.two}>
                    {expectMatch(true)}
                </Activity>
            </Provider>
        ),
    },

    {
        title: 'no test prop at all is equivalent to a match',
        config: {
            machine,
        },
        render: (Provider, Activity) => (
            <Provider>
                <Activity>{expectMatch(true)}</Activity>
            </Provider>
        ),
    },

    {
        title: 'passes component/render/children props down',
        config: {
            machine,
        },
        render: (Provider, Activity) => (
            <Provider>
                <Activity is="one">{expectMatch(true)}</Activity>
                <Activity is="one" render={pass} />
                <Activity is="one" component={pass} />
                <Activity is="two">{expectMatch(false)}</Activity>
                <Activity is="two" render={fail} />
                <Activity is="two" component={fail} />
            </Provider>
        ),
    },

    {
        title: 'is > not',
        config: {
            machine,
        },
        render: (Provider, Activity) => (
            <Provider>
                <Activity is="one" not="one">
                    {expectMatch(true)}
                </Activity>
            </Provider>
        ),
    },
];

describe('Activity', () => {
    test('exists', () => {
        const xsf = createStatefulMachine({ machine });
        xsf.init();

        const { Activity } = createReactMachine(xsf);

        expect(Activity).toBeDefined();
    });

    test('copes before xsf.init()', () => {
        const xsf = createStatefulMachine({ machine });

        const { Provider, Activity } = createReactMachine(xsf);

        // before init, state is null.
        const component = renderer.create(
            <Provider>
                <Activity is="one">{expectMatch(false)}</Activity>
                <Activity not="one">{expectMatch(true)}</Activity>
                <Activity is={['one', 'three']}>{expectMatch(false)}</Activity>
                <Activity not={['one', 'three']}>{expectMatch(true)}</Activity>
                <Activity is={as => as.one}>{expectMatch(false)}</Activity>
                <Activity not={as => as.one}>{expectMatch(true)}</Activity>
            </Provider>,
        );

        const tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });

    fixtures.forEach(fixture => {
        test(fixture.title, () => {
            const xsf = createStatefulMachine(fixture.config);
            xsf.init();

            const { Provider, Activity } = createReactMachine(xsf);

            const component = renderer.create(
                fixture.render(Provider, Activity),
            );

            const tree = component.toJSON();
            expect(tree).toMatchSnapshot();
        });
    });
});
