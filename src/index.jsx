// @flow

import type { XStateful } from '@avaragado/xstateful';

import type { Node, ComponentType } from 'react';
import React from 'react';
import { matchesState } from 'xstate';

type XSFState = {|
    state: Object,
    extstate: Object,
|};

type Cond = boolean | (XSFState => boolean);

type ProviderProps = {|
    children: Node,
|};

type ProviderState = {
    ...XSFState,
    init: Function,
    transition: Function,
    setExtState: Function,
};

type ConsumerFnProps = ProviderState;

type RenderableProps = {|
    component?: ComponentType<*>,
    render?: ProviderState => Node,
    children?:
        | Node
        | (({
              ...ProviderState,
              match: boolean,
          }) => Node),
|};

type MachineProps = {|
    cond?: Cond,
    ...RenderableProps,
|};

type StateProps = {|
    is?: string | Array<string> | ((string | Object) => boolean),
    not?: string | Array<string> | ((string | Object) => boolean),
    ...RenderableProps,
|};

type ActivityProps = {|
    is?:
        | string
        | Array<string>
        | (({ [activity: string]: boolean }) => boolean),
    not?:
        | string
        | Array<string>
        | (({ [activity: string]: boolean }) => boolean),
    ...RenderableProps,
|};

type ControlProps = {|
    children: Node,
    onDidMount?: ProviderState => void,
    onWillUnmount?: ProviderState => void,
|};

const getMatch = (cond, { state, extstate }) => {
    // if cond is not specified, default to true
    if (cond === undefined) {
        return true;
    }

    if (typeof cond === 'function') {
        return cond({ state, extstate });
    }

    return cond;
};

const getNode = (match, props, component, render, children) => {
    if (component) {
        return match ? React.createElement(component, props) : null;
    }

    if (render) {
        return match ? render(props) : null;
    }

    if (typeof children === 'function') {
        return children({
            ...props,
            match,
        });
    }

    return match ? children : null;
};

const getCond = (is, not, map) => {
    const stateTest = is || not;

    return stateTest
        ? map[typeof stateTest][is ? 'is' : 'not'](stateTest)
        : true;
};

const createReactMachine = (xsf: XStateful) => {
    const context = React.createContext({
        state: xsf.state,
        extstate: xsf.extstate,
        init: () => {},
        transition: () => {},
        setExtState: () => {},
    });

    class Provider extends React.Component<ProviderProps, ProviderState> {
        constructor() {
            super();

            this.state = {
                state: xsf.state,
                extstate: xsf.extstate,
                init: xsf.init.bind(xsf),
                transition: xsf.transition.bind(xsf),
                setExtState: xsf.setExtState.bind(xsf),
            };

            xsf.on('change', this.update);
        }

        componentWillUnmount() {
            xsf.off('change', this.update);
        }

        update = ({ state, extstate }: XSFState) => {
            this.setState({ state, extstate });
        };

        render() {
            // avoid passing the state object down
            const {
                state,
                extstate,
                init,
                transition,
                setExtState,
            } = this.state;

            return (
                <context.Provider
                    {...this.props}
                    value={{ state, extstate, init, transition, setExtState }}
                />
            );
        }
    }

    const Machine = ({ cond, component, render, children }: MachineProps) => (
        <context.Consumer>
            {(props: ConsumerFnProps) =>
                getNode(
                    getMatch(cond, props),
                    props,
                    component,
                    render,
                    children,
                )
            }
        </context.Consumer>
    );

    const State = ({ is, not, ...propsRest }: StateProps) => {
        const map = {
            function: {
                is: fn => ({ state }) => !!(state && fn(state.value)),
                not: fn => ({ state }) => !(state && fn(state.value)),
            },
            string: {
                is: str => ({ state }) =>
                    !!(state && matchesState(str, state.value)),
                not: str => ({ state }) =>
                    !(state && matchesState(str, state.value)),
            },
            // code relies on typeof [] === 'object'
            object: {
                is: arr => ({ state }) =>
                    !!(
                        state && arr.some(str => matchesState(str, state.value))
                    ),
                not: arr => ({ state }) =>
                    !(state && arr.some(str => matchesState(str, state.value))),
            },
        };

        return <Machine {...propsRest} cond={getCond(is, not, map)} />;
    };

    const Activity = ({ is, not, ...propsRest }: ActivityProps) => {
        const map = {
            function: {
                is: fn => ({ state }) => !!(state && fn(state.activities)),
                not: fn => ({ state }) => !(state && fn(state.activities)),
            },
            string: {
                is: str => ({ state }) => !!(state && state.activities[str]),
                not: str => ({ state }) => !(state && state.activities[str]),
            },
            // code relies on typeof [] === 'object'
            object: {
                is: arr => ({ state }) =>
                    !!(state && arr.some(str => !!state.activities[str])),
                not: arr => ({ state }) =>
                    !(state && arr.some(str => !!state.activities[str])),
            },
        };

        return <Machine {...propsRest} cond={getCond(is, not, map)} />;
    };

    class Control extends React.Component<ControlProps> {
        componentDidMount() {
            const { onDidMount } = this.props;

            if (typeof onDidMount === 'function') {
                onDidMount({
                    state: xsf.state,
                    extstate: xsf.exstate,
                    init: xsf.init.bind(xsf),
                    transition: xsf.transition.bind(xsf),
                    setExtState: xsf.setExtState.bind(xsf),
                });
            }
        }

        componentWillUnmount() {
            const { onWillUnmount } = this.props;

            if (typeof onWillUnmount === 'function') {
                onWillUnmount({
                    state: xsf.state,
                    extstate: xsf.exstate,
                    init: xsf.init.bind(xsf),
                    transition: xsf.transition.bind(xsf),
                    setExtState: xsf.setExtState.bind(xsf),
                });
            }
        }

        render() {
            return this.props.children;
        }
    }

    Machine.Provider = Provider;
    Machine.Activity = Activity;
    Machine.State = State;
    Machine.Control = Control;
    Machine.Consumer = context.Consumer;

    return Machine;
};

// eslint-disable-next-line import/prefer-default-export
export { createReactMachine };
