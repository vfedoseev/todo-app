import babel from 'rollup-plugin-babel';
import {uglify} from 'rollup-plugin-uglify';

let isProduction = (process.env.BUILD === 'production');

export default {
  input: 'src/js/index.js',
  output: {
    file: 'dist/main.bundle.js',
    format: 'iife',
    sourcemap: (isProduction ? false : 'inline')
  },
  plugins: [
    babel({
      exclude: 'node_modules/**'
    }),
    (isProduction && uglify())
  ]
}
