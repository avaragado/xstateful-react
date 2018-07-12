import { Machine } from 'xstate';
import { createStatefulMachine, Reducer } from '@avaragado/xstateful';
import { createReactMachine } from '@avaragado/xstateful-react';

const sec = 250;

const timeout = {
    v_prepare: Reducer.util.timeoutActivity({
        activity: 'to_v_prepare',
        ms: 2 * sec,
        event: 'TIMEOUT',
    }),

    v_move: Reducer.util.timeoutActivity({
        activity: 'to_v_move',
        ms: 60 * sec,
        event: 'TIMEOUT',
    }),

    v_move_min: Reducer.util.timeoutActivity({
        activity: 'to_v_move_min',
        ms: 30 * sec,
        event: 'V_MOVE_MIN_TIMEOUT',
    }),

    v_slow: Reducer.util.timeoutActivity({
        activity: 'to_v_slow',
        ms: 2 * sec,
        event: 'V_MOVE_TIMEOUT',
    }),

    p_prepare: Reducer.util.timeoutActivity({
        activity: 'to_p_prepare',
        ms: 5 * sec,
        event: 'TIMEOUT',
    }),

    p_move: Reducer.util.timeoutActivity({
        activity: 'to_p_move',
        ms: 20 * sec,
        event: 'TIMEOUT',
    }),

    p_slow: Reducer.util.timeoutActivity({
        activity: 'to_p_slow',
        ms: 5 * sec,
        event: 'TIMEOUT',
    }),

    p_warn: Reducer.util.timeoutActivity({
        activity: 'to_p_warn',
        ms: 5 * sec,
        event: 'P_MOVE_TIMEOUT',
    }),
};

const machine = Machine({
    key: 'light',
    initial: 'powered_on',
    states: {
        powered_off: {
            on: {
                POWER_ON: 'powered_on',
            },
        },
        powered_on: {
            on: {
                POWER_OFF: 'powered_off',
            },
            initial: 'p_priority',
            states: {
                p_priority: {
                    activities: ['v_red'],
                    initial: 'p_preparing',
                    states: {
                        p_preparing: {
                            activities: ['p_stop', timeout.p_prepare.activity],
                            on: {
                                TIMEOUT: 'p_moving',
                            },
                        },
                        p_moving: {
                            onEntry: ['clearRequestStop'],
                            activities: ['p_walk', timeout.p_move.activity],
                            on: {
                                TIMEOUT: 'p_slowing',
                            },
                        },
                        p_slowing: {
                            activities: [timeout.p_slow.activity],
                            on: {
                                TIMEOUT: 'p_warning',
                            },
                        },
                        p_warning: {
                            activities: ['p_stop', timeout.p_warn.activity],
                        },
                    },
                    on: {
                        P_MOVE_TIMEOUT: 'v_priority',
                    },
                },

                v_priority: {
                    activities: ['p_stop'],
                    initial: 'v_preparing',
                    states: {
                        v_preparing: {
                            activities: [
                                'v_red',
                                'v_amber',
                                timeout.v_prepare.activity,
                            ],
                            on: {
                                TIMEOUT: 'v_moving',
                            },
                        },
                        v_moving: {
                            activities: [
                                'v_green',
                                timeout.v_move.activity,
                                timeout.v_move_min.activity,
                            ],
                            on: {
                                TIMEOUT: 'v_slowing',
                            },
                            initial: 'p_request_disallowed',
                            states: {
                                p_request_disallowed: {
                                    on: {
                                        V_MOVE_MIN_TIMEOUT: 'p_request_allowed',
                                        P_REQUEST: {
                                            p_requested_early: {
                                                actions: ['requestStop'],
                                            },
                                        },
                                    },
                                },
                                p_request_allowed: {
                                    on: {
                                        P_REQUEST: {
                                            '#v_slowing': {
                                                actions: ['requestStop'],
                                            },
                                        },
                                    },
                                },
                                p_requested_early: {
                                    on: {
                                        V_MOVE_MIN_TIMEOUT: '#v_slowing',
                                    },
                                },
                            },
                        },
                        v_slowing: {
                            id: 'v_slowing',
                            activities: ['v_amber', timeout.v_slow.activity],
                        },
                    },
                    on: {
                        V_MOVE_TIMEOUT: 'p_priority',
                    },
                },
            },
        },
    },
});

const extstate = {
    isRequested: false,
};

const reducer = Reducer.map({
    ...timeout.v_prepare.map,
    ...timeout.v_move.map,
    ...timeout.v_move_min.map,
    ...timeout.v_slow.map,
    ...timeout.p_prepare.map,
    ...timeout.p_move.map,
    ...timeout.p_slow.map,
    ...timeout.p_warn.map,

    requestStop: Reducer.update({ isRequested: true }),
    clearRequestStop: Reducer.update({ isRequested: false }),
});

export const xsf = createStatefulMachine({ machine, extstate, reducer });

export default createReactMachine(xsf);
