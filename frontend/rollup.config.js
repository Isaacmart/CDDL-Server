import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import postcss from 'rollup-plugin-postcss'

export default {
   input: 'src/index.js',
   output: {
      file: 'public/index.js',
      format: 'iife',
   },
   plugins: [
      replace({
         'process.env.NODE_ENV': JSON.stringify('production'),
      }),
      commonjs({
         include: [
            'node_modules/**',
         ],
         exclude: [
            'node_modules/process-es6/**',
         ],
      }),
      resolve(),
      babel({
         exclude: 'node_modules/**'
      }),
      postcss({
         autoModules: true
      })
   ]
}
