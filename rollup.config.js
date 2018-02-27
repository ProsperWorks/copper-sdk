import replace from 'rollup-plugin-replace'
import typescript from 'rollup-plugin-typescript2'
import uglify from 'rollup-plugin-uglify'

const env = process.env.NODE_ENV
const compileEnv = process.env.COMPILE_ENV || 'umd'
const config = {
  input: 'src/index.ts',
  plugins: [],
}

if (compileEnv === 'es')  {
  config.output = {
    format: 'es',
  }

  config.plugins.push(
    typescript({
      tsconfigOverride: {
        compilerOptions: {
          target: 'es2017',
        },
      },
    })
  )
}

if (compileEnv === 'cjs')  {
  config.output = {
    format: 'cjs',
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
