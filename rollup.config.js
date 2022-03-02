import { join } from 'path';
import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import dts from "rollup-plugin-dts";
import copy from 'rollup-plugin-copy'
import { terser } from 'rollup-plugin-terser';

export default args => {
    const TEMP_PACKAGE_PATH =  Array.isArray(args.input) ? args.input[0] : args.input;
    const inTempPackageDir = (...paths) => join(TEMP_PACKAGE_PATH, ...paths);
    delete args.input;

    const PACKAGE_PATH = Array.isArray(args.output) ? args.output[0] : args.output;
    const inPackageDir = (...paths) => join(PACKAGE_PATH, ...paths);
    delete args.output;

    return [
        {
            input: inTempPackageDir('index.js'),
            output: [{
                file: inPackageDir('index.js'),
                format: 'es'
            }],
            plugins: [
                typescript(),
                commonjs(),
                resolve(),
                copy({
                    targets: [
                    { src: inTempPackageDir('package.json'), dest: PACKAGE_PATH },
                    { src: inTempPackageDir('README.md'), dest: PACKAGE_PATH },
                    ]
                }),
                terser()
            ]
        },
        {
            input: inTempPackageDir("index.d.ts"),
            output: [{ file: inPackageDir("index.d.ts"), format: "es" }],
            plugins: [dts()],
        },
    ];
}
