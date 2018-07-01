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
            on: {
                NEXT: 'second',
            },
        },
        second: {},
    },
});

const renderable = props => (
    <div>
        <p>Keys: {Object.keys(props)}</p>
        <p>JSON: {JSON.stringify(props)}</p>
    </div>
);

const Pass = () => 'pass';
const Fail = () => 'fail';

const fixtures = [
    // component prop
    {
        title: 'component - cond boolean true',
        config: {
            machine,
        },
        render: TestMachine => (
            <TestMachine.Provider>
                <TestMachine cond component={renderable} />
            </TestMachine.Provider>
        ),
    },

    {
        title: 'component - cond boolean false',
        config: {
            machine,
        },
        render: TestMachine => (
            <TestMachine.Provider>
                <TestMachine cond={false} component={renderable} />
            </TestMachine.Provider>
        ),
    },

    {
        title: 'component - cond function true',
        config: {
            machine,
            extstate: { foo: 1 },
        },
        render: TestMachine => (
            <TestMachine.Provider>
                <TestMachine
                    cond={({ state, extstate }) =>
                        state.value === 'first' && extstate.foo === 1
                    }
                    component={renderable}
                />
            </TestMachine.Provider>
        ),
    },

    {
        title: 'component - cond function false',
        config: {
            machine,
            extstate: { foo: 1 },
        },
        render: TestMachine => (
            <TestMachine.Provider>
                <TestMachine
                    cond={({ state, extstate }) =>
                        state.value !== 'first' || extstate.foo !== 1
                    }
                    component={renderable}
                />
            </TestMachine.Provider>
        ),
    },

    // render prop
    {
        title: 'render - cond boolean true',
        config: {
            machine,
        },
        render: TestMachine => (
            <TestMachine.Provider>
                <TestMachine cond render={renderable} />
            </TestMachine.Provider>
        ),
    },

    {
        title: 'render - cond boolean false',
        config: {
            machine,
        },
        render: TestMachine => (
            <TestMachine.Provider>
                <TestMachine cond={false} render={renderable} />
            </TestMachine.Provider>
        ),
    },

    {
        title: 'render - cond function true',
        config: {
            machine,
            extstate: { foo: 1 },
        },
        render: TestMachine => (
            <TestMachine.Provider>
                <TestMachine
                    cond={({ state, extstate }) =>
                        state.value === 'first' && extstate.foo === 1
                    }
                    render={renderable}
                />
            </TestMachine.Provider>
        ),
    },

    {
        title: 'render - cond function false',
        config: {
            machine,
            extstate: { foo: 1 },
        },
        render: TestMachine => (
            <TestMachine.Provider>
                <TestMachine
                    cond={({ state, extstate }) =>
                        state.value !== 'first' || extstate.foo !== 1
                    }
                    render={renderable}
                />
            </TestMachine.Provider>
        ),
    },

    // children prop node
    {
        title: 'children node - cond boolean true',
        config: {
            machine,
        },
        render: TestMachine => (
            <TestMachine.Provider>
                <TestMachine cond>pass</TestMachine>
            </TestMachine.Provider>
        ),
    },

    {
        title: 'children node - cond boolean false',
        config: {
            machine,
        },
        render: TestMachine => (
            <TestMachine.Provider>
                <TestMachine cond={false}>fail</TestMachine>
            </TestMachine.Provider>
        ),
    },

    {
        title: 'children node - cond function true',
        config: {
            machine,
            extstate: { foo: 1 },
        },
        render: TestMachine => (
            <TestMachine.Provider>
                <TestMachine
                    cond={({ state, extstate }) =>
                        state.value === 'first' && extstate.foo === 1
                    }
                >
                    pass
                </TestMachine>
            </TestMachine.Provider>
        ),
    },

    {
        title: 'children node - cond function false',
        config: {
            machine,
            extstate: { foo: 1 },
        },
        render: TestMachine => (
            <TestMachine.Provider>
                <TestMachine
                    cond={({ state, extstate }) =>
                        state.value !== 'first' || extstate.foo !== 1
                    }
                >
                    fail
                </TestMachine>
            </TestMachine.Provider>
        ),
    },

    // children prop function
    {
        title: 'children function - cond boolean true',
        config: {
            machine,
        },
        render: TestMachine => (
            <TestMachine.Provider>
                <TestMachine cond>{renderable}</TestMachine>
            </TestMachine.Provider>
        ),
    },

    {
        title: 'children function - cond boolean false',
        config: {
            machine,
        },
        render: TestMachine => (
            <TestMachine.Provider>
                <TestMachine cond={false}>{renderable}</TestMachine>
            </TestMachine.Provider>
        ),
    },

    {
        title: 'children function - cond function true',
        config: {
            machine,
            extstate: { foo: 1 },
        },
        render: TestMachine => (
            <TestMachine.Provider>
                <TestMachine
                    cond={({ state, extstate }) =>
                        state.value === 'first' && extstate.foo === 1
                    }
                >
                    {renderable}
                </TestMachine>
            </TestMachine.Provider>
        ),
    },

    {
        title: 'children function - cond function false',
        config: {
            machine,
            extstate: { foo: 1 },
        },
        render: TestMachine => (
            <TestMachine.Provider>
                <TestMachine
                    cond={({ state, extstate }) =>
                        state.value !== 'first' || extstate.foo !== 1
                    }
                >
                    {renderable}
                </TestMachine>
            </TestMachine.Provider>
        ),
    },

    // component then render then children
    {
        title: 'order - component > render',
        config: {
            machine,
        },
        render: TestMachine => (
            <TestMachine.Provider>
                <TestMachine cond component={Pass} render={Fail} />
            </TestMachine.Provider>
        ),
    },

    {
        title: 'order - component > children',
        config: {
            machine,
        },
        render: TestMachine => (
            <TestMachine.Provider>
                <TestMachine cond component={Pass}>
                    {Fail}
                </TestMachine>
            </TestMachine.Provider>
        ),
    },

    {
        title: 'order - render > children',
        config: {
            machine,
        },
        render: TestMachine => (
            <TestMachine.Provider>
                <TestMachine cond render={Pass}>
                    {Fail}
                </TestMachine>
            </TestMachine.Provider>
        ),
    },

    // neither component nor render nor children
    {
        title: 'missing component/render/children',
        config: {
            machine,
        },
        render: TestMachine => (
            <TestMachine.Provider>
                <TestMachine cond />
            </TestMachine.Provider>
        ),
    },

    // no cond
    {
        title: 'missing cond - component',
        config: {
            machine,
        },
        render: TestMachine => (
            <TestMachine.Provider>
                <TestMachine component={Pass} />
            </TestMachine.Provider>
        ),
    },

    {
        title: 'missing cond - render',
        config: {
            machine,
        },
        render: TestMachine => (
            <TestMachine.Provider>
                <TestMachine render={Pass} />
            </TestMachine.Provider>
        ),
    },

    {
        title: 'missing cond - children fn',
        config: {
            machine,
        },
        render: TestMachine => (
            <TestMachine.Provider>
                <TestMachine>{Pass}</TestMachine>
            </TestMachine.Provider>
        ),
    },

    {
        title: 'missing cond - children node',
        config: {
            machine,
        },
        render: TestMachine => (
            <TestMachine.Provider>
                <TestMachine>pass</TestMachine>
            </TestMachine.Provider>
        ),
    },
];

describe('TestMachine', () => {
    test('exists', () => {
        const xsf = createStatefulMachine({ machine });
        xsf.init();

        const TestMachine = createReactMachine(xsf);

        expect(TestMachine).toBeDefined();
    });

    fixtures.forEach(fixture => {
        test(fixture.title, () => {
            const xsf = createStatefulMachine(fixture.config);
            xsf.init();

            const TestMachine = createReactMachine(xsf);

            const component = renderer.create(fixture.render(TestMachine));

            const tree = component.toJSON();
            expect(tree).toMatchSnapshot();
        });
    });
});
