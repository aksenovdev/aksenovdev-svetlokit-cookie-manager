import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import dts from "rollup-plugin-dts";
import copy from 'rollup-plugin-copy'

export default [
    {
        input: './temp-package/index.js',
        output: [
            {
            file: 'package/index.js',
            format: 'es'
            }
        ],
        plugins: [
            typescript(),
            commonjs(),
            resolve(),
            copy({
                targets: [
                  { src: './temp-package/package.json', dest: './package/' },
                  { src: './temp-package/README.md', dest: './package/' },
                ]
            })
        ]
    },
    {
        input: "./temp-package/index.d.ts",
        output: [{ file: "package/index.d.ts", format: "es" }],
        plugins: [dts()],
    },
];
