import json from '@rollup/plugin-json'
import replace from '@rollup/plugin-replace'
import terser from '@rollup/plugin-terser'
import typescript from '@rollup/plugin-typescript'

const env = process.env.NODE_ENV
const compileEnv = process.env.COMPILE_ENV || 'umd'

const config = {
  input: 'src/index.ts',
  output: {
    format: compileEnv,
  },
  plugins: [
    json(),
  ],
}

if (compileEnv === 'es')  {
  config.plugins.push(
    typescript({
      compilerOptions: {
        declarationDir: 'es'
      },
    })
  )
}
else if (compileEnv === 'cjs') {
  config.plugins.push(
    typescript({
      compilerOptions: {
        declarationDir: 'lib'
      },
    })
  )
}
else if (compileEnv === 'umd') {
  config.plugins.push(
    typescript({
      compilerOptions: {
        declarationDir: 'dist'
      },
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify(env),
    })
  )

  config.output = {
    name: 'Copper',
  }
}

if (env === 'production') {
  config.plugins.push(
    terser()
  )
}

export default config
