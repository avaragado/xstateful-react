import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';
import copy from 'rollup-plugin-copy';

const NODE_ENV = process.env.NODE_ENV || 'development';

export default {
    input: 'src/index.jsx',
    output: {
        file: 'dist/bundle.js',
        format: 'iife',
    },
    plugins: [
        resolve(),
        commonjs(),
        replace({
            'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
        }),
        babel({
            babelrc: false,
            presets: [
                [
                    'env',
                    {
                        targets: {
                            browsers: ['last 2 versions', 'safari >= 7'],
                        },
                        modules: false,
                    },
                ],
                'react',
            ],
            plugins: ['external-helpers'],
            exclude: ['node_modules/**'],
        }),
        copy({
            'src/index.html': 'dist/index.html',
        }),
    ],
    onwarn: warning => {
        if (warning.code === 'THIS_IS_UNDEFINED') {
            return;
        }

        console.error(warning.message);
    },
};
