import React from 'react';
import renderer from 'react-test-renderer';
import { Machine } from 'xstate';
import { createStatefulMachine } from '@avaragado/xstateful';

import { createReactMachine } from '..';

describe('Consumer', () => {
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

    test('renders current state and extstate', () => {
        const exts = { foo: 1 };
        const xsf = createStatefulMachine({ machine, extstate: exts });
        xsf.init();

        const { Provider, Consumer } = createReactMachine(xsf);

        const component = renderer.create(
            <Provider>
                <Consumer>
                    {({ state, extstate }) => (
                        <div>
                            <p>state: {JSON.stringify(state)}</p>
                            <p>extstate: {JSON.stringify(extstate)}</p>
                        </div>
                    )}
                </Consumer>
            </Provider>,
        );

        // initial render
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();

        xsf.transition('NEXT');

        // subsequent render
        tree = component.toJSON();
        expect(tree).toMatchSnapshot();

        xsf.setExtState({ foo: 2 });

        // subsequent render
        tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });

    test('supplies init callback', () => {
        const xsf = createStatefulMachine({ machine });
        xsf.init();

        const { Provider, Consumer } = createReactMachine(xsf);

        const component = renderer.create(
            <Provider>
                <Consumer>
                    {({ init }) =>
                        typeof init === 'function' ? 'pass' : 'fail'
                    }
                </Consumer>
            </Provider>,
        );

        const tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });

    test('supplies transition callback', () => {
        const xsf = createStatefulMachine({ machine });
        xsf.init();

        const { Provider, Consumer } = createReactMachine(xsf);

        const component = renderer.create(
            <Provider>
                <Consumer>
                    {({ transition }) =>
                        typeof transition === 'function' ? 'pass' : 'fail'
                    }
                </Consumer>
            </Provider>,
        );

        const tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });

    test('supplies setExtState callback', () => {
        const xsf = createStatefulMachine({ machine });
        xsf.init();

        const { Provider, Consumer } = createReactMachine(xsf);

        const component = renderer.create(
            <Provider>
                <Consumer>
                    {({ setExtState }) =>
                        typeof setExtState === 'function' ? 'pass' : 'fail'
                    }
                </Consumer>
            </Provider>,
        );

        const tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });

    test('invoking init callback calls xsf.init', () => {
        const xsf = createStatefulMachine({ machine });

        const { Provider, Consumer } = createReactMachine(xsf);

        const component = renderer.create(
            <Provider>
                <Consumer>
                    {({ init, state }) => (
                        <div>
                            <p>state: {JSON.stringify(state)}</p>
                            <button type="button" onClick={init}>
                                init
                            </button>
                        </div>
                    )}
                </Consumer>
            </Provider>,
        );

        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();

        tree.children[1].props.onClick();

        tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });

    test('invoking transition callback calls xsf.transition', () => {
        const xsf = createStatefulMachine({ machine });
        xsf.init();

        const { Provider, Consumer } = createReactMachine(xsf);

        const component = renderer.create(
            <Provider>
                <Consumer>
                    {({ transition, state }) => (
                        <div>
                            <p>state: {JSON.stringify(state)}</p>
                            <button
                                type="button"
                                onClick={() => transition('NEXT')}
                            >
                                transition
                            </button>
                        </div>
                    )}
                </Consumer>
            </Provider>,
        );

        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();

        tree.children[1].props.onClick();

        tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });

    test('invoking setExtState callback calls xsf.setExtState', () => {
        const extstate = { foo: 1 };
        const xsf = createStatefulMachine({ machine, extstate });
        xsf.init();

        const { Provider, Consumer } = createReactMachine(xsf);

        const component = renderer.create(
            <Provider>
                <Consumer>
                    {({ setExtState, extstate: xs }) => (
                        <div>
                            <p>extstate: {JSON.stringify(xs)}</p>
                            <button
                                type="button"
                                onClick={() =>
                                    setExtState(xxs => ({ foo: xxs.foo + 1 }))
                                }
                            >
                                transition
                            </button>
                        </div>
                    )}
                </Consumer>
            </Provider>,
        );

        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();

        tree.children[1].props.onClick();

        tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });
});
