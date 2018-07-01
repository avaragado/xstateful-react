import React from 'react';
import renderer from 'react-test-renderer';
import { Machine } from 'xstate';
import { createStatefulMachine } from '@avaragado/xstateful';

import { createReactMachine } from '..';

describe('Provider', () => {
    const machine = Machine({
        key: 'test',
        initial: 'first',
        states: {
            first: {},
        },
    });

    test('ignores value prop', () => {
        const xsf = createStatefulMachine({ machine });
        xsf.init();

        const { Provider, Consumer } = createReactMachine(xsf);

        const component = renderer.create(
            <Provider value="should-ignore-this">
                <Consumer>{value => JSON.stringify(value)}</Consumer>
            </Provider>,
        );

        const tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });
});
