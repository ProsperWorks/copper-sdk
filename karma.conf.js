const replace = require('rollup-plugin-replace')
const typescript = require('rollup-plugin-typescript2')
const json = require('rollup-plugin-json')
const istanbul = require('rollup-plugin-istanbul')

const env = process.env.NODE_ENV

const baseConfig = {
  frameworks: ['mocha', 'chai', 'sinon'],

  files: ['test/**/*.spec.ts'],

  port: 9876,  // karma web server port

  colors: true,

  browsers: ['ChromeHeadless'],
  // autoWatch: true,
  // singleRun: false, // Karma captures browsers, runs the tests and exits
  concurrency: Infinity,

  preprocessors: {
    'test/**/*.spec.ts': ['rollup'],
  },

  mime: {
    'text/x-typescript': ['ts', 'tsx'],
  },

  rollupPreprocessor: {
    plugins: [
      typescript({
        tsconfig: './test/tsconfig.json',
      }),
      replace({
        'process.env.NODE_ENV': JSON.stringify(env),
      }),
      json(),
    ],
    output: {
      format: 'iife',
      sourcemap: 'inline',        // Sensible for testing.
      globals: {
        chai: 'chai',
        sinon: 'sinon',
      },
    },
    external: ['chai', 'sinon'],
  },

  reporters: ['mocha'],

}

function addCoverage(config) {
  config.rollupPreprocessor.plugins.push(
    istanbul({
      exclude: ['test/**/*.ts'],
    })
  )

  config.reporters.push('coverage-istanbul')

  config.coverageIstanbulReporter = {
    dir: 'coverage',
    reports: ['html', 'lcovonly', 'text-summary'],
  }
}

module.exports = function (config) {
  // we only do coverage when in single run
  if (config.singleRun) {
    addCoverage(baseConfig)
  }

  config.set({
    ...baseConfig,
    logLevel: config.LOG_INFO,
  })
}
