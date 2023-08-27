import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import json from "@rollup/plugin-json";
import terser from "@rollup/plugin-terser";
import serve from "rollup-plugin-serve";

const dev = process.env.ROLLUP_WATCH;

const serveOptions = {
    contentBase: ['./dist'],
    host: '0.0.0.0',
    port: 5000,
    allowCrossOrigin: true,
    headers: {
        'Access-Control-Allow-Origin': '*',
    },
};

const plugins = [
    nodeResolve({}),
    commonjs(),
    typescript(),
    json(),
    terser(),
    dev && serve(serveOptions)
];

export default [
    {
        input: "src/simple-slider-thermostat.ts",
        output: {
            dir: "./dist",
            format: "es",
            sourcemap: dev ? true : false
        },
        watch: {
            exclude: 'node_modules/**',
            chokidar: false,
        },
        plugins: [...plugins]
    }
];