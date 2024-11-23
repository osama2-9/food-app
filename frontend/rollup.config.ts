import typescript from '@rollup/plugin-typescript';
import path from 'path';

export default {
    input: 'src/index.ts',
    output: {
        file: 'dist/bundle.js', 
        format: 'es',
    },
    plugins: [
        typescript(), 
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'), 
        },
    },
};
