import replace from 'rollup-plugin-replace'
import typescript from 'rollup-plugin-typescript2'
import uglify from 'rollup-plugin-uglify'
import json from 'rollup-plugin-json'

const env = process.env.NODE_ENV
const compileEnv = process.env.COMPILE_ENV || 'umd'
const config = {
  input: 'src/index.ts',
  plugins: [
    json(),
  ],
}

if (compileEnv === 'es' || compileEnv === 'cjs')  {
  config.output = {
    format: compileEnv,
  }

  config.plugins.push(
    typescript()
  )
}

if (compileEnv === 'umd') {
  config.plugins.push(
    typescript(),
    replace({
      'process.env.NODE_ENV': JSON.stringify(env),
    })
  )

  config.output = {
    format: 'umd',
    name: 'PWSDK',
  }
}

if (env === 'production') {
  config.plugins.push(
    uglify({
      compress: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        warnings: false,
      },
    })
  )
}

export default config
