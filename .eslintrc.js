module.exports = {
    root: true,

    extends: [
        'airbnb',
        'plugin:prettier/recommended',
        'plugin:flowtype/recommended',
        'plugin:jest/recommended',
    ],

    plugins: ['flowtype', 'jest'],

    env: {
        'jest/globals': true,
        browser: true,
    },

    rules: {
        // allow console methods
        'no-console': 'off',

        // wish i could say 4 once.
        'react/jsx-indent': ['error', 4],
        'react/jsx-indent-props': ['error', 4],

        // as we're using flow for typing
        'react/require-default-props': 'off',

        // needless pickiness, even for me
        'react/destructuring-assignment': 'off',
        'react/jsx-one-expression-per-line': 'off',
        'react/no-multi-comp': 'off',

        // as prettier owns code formatting
        'flowtype/space-after-type-colon': 'off',
    },

    globals: {},
};
