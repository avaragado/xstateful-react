// @flow

import React from 'react';
import renderer from 'react-test-renderer';
import { Machine } from 'xstate';
import { createStatefulMachine } from '@avaragado/xstateful';

import { createReactMachine } from '..';

const machine = Machine({
    key: 'test',
    initial: 'idle',
    states: {
        idle: {
            on: {
                POWER: 'buzzing',
            },
        },
        buzzing: {
            on: {
                POWER: 'idle',
            },
        },
    },
});

describe('Control', () => {
    test('exists', () => {
        const xsf = createStatefulMachine({ machine });
        xsf.init();

        const { Control } = createReactMachine(xsf);

        expect(Control).toBeDefined();
    });

    test('always renders children', () => {
        const xsf = createStatefulMachine({ machine });
        xsf.init();

        const { Provider, Control } = createReactMachine(xsf);

        const component = renderer.create(
            <Provider>
                <Control>pass</Control>
            </Provider>,
        );

        const tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });

    test('invokes appropriate callback when mounted', () => {
        const xsf = createStatefulMachine({ machine });
        xsf.init();

        const { Provider, Control } = createReactMachine(xsf);

        const mount = jest.fn();

        const component = renderer.create(
            <Provider>
                <Control onDidMount={mount}>pass</Control>
            </Provider>,
        );

        const tree = component.toJSON();
        expect(tree).toMatchSnapshot();

        expect(mount.mock.calls).toHaveLength(1);
        expect(mount.mock.calls[0]).toHaveLength(1);

        expect(mount.mock.calls[0][0]).toMatchObject({
            state: {},
            extstate: {},
        });
        expect(mount.mock.calls[0][0].init).toBeInstanceOf(Function);
        expect(mount.mock.calls[0][0].transition).toBeInstanceOf(Function);
    });

    test('invokes appropriate callback when unmounted', () => {
        const xsf = createStatefulMachine({ machine });
        xsf.init();

        const { Provider, Control } = createReactMachine(xsf);

        const unmount = jest.fn();

        const component = renderer.create(
            <Provider>
                <Control onWillUnmount={unmount}>pass</Control>
            </Provider>,
        );

        const tree = component.toJSON();
        expect(tree).toMatchSnapshot();

        component.unmount();

        expect(unmount.mock.calls).toHaveLength(1);
        expect(unmount.mock.calls[0]).toHaveLength(1);

        expect(unmount.mock.calls[0][0]).toMatchObject({
            state: {},
            extstate: {},
        });
        expect(unmount.mock.calls[0][0].init).toBeInstanceOf(Function);
        expect(unmount.mock.calls[0][0].transition).toBeInstanceOf(Function);
    });

    test('works', () => {
        const xsf = createStatefulMachine({ machine });

        const TestMachine = createReactMachine(xsf);

        const component = renderer.create(
            <TestMachine.Provider>
                <TestMachine.Control
                    onDidMount={({ init, transition }) => {
                        init();
                        transition('POWER');
                    }}
                    onWillUnmount={({ transition }) => transition('POWER')}
                >
                    <TestMachine.State is="buzzing">pass</TestMachine.State>
                    <TestMachine.State not="buzzing">fail</TestMachine.State>
                </TestMachine.Control>
            </TestMachine.Provider>,
        );

        const tree = component.toJSON();
        expect(tree).toMatchSnapshot();

        component.unmount();

        expect(xsf.state.toString()).toBe('idle');
    });
});
