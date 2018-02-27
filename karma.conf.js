const replace = require('rollup-plugin-replace')
const typescript = require('rollup-plugin-typescript2')

const env = process.env.NODE_ENV
module.exports = function(config) {
  config.set({
    frameworks: ['mocha', 'chai', 'sinon'],
    files: ['test/**/*.spec.ts'],
    reporters: ['mocha'],
    port: 9876,  // karma web server port
    colors: true,
    logLevel: config.LOG_INFO,
    browsers: ['ChromeHeadless'],
    // autoWatch: true,
    // singleRun: false, // Karma captures browsers, runs the tests and exits
    concurrency: Infinity,

    preprocessors: {
      'test/**/*.spec.ts': ['rollup'],
    },

    rollupPreprocessor: {
      plugins: [
        typescript(),
        replace({
          'process.env.NODE_ENV': JSON.stringify(env),
        }),
      ],
      output: {
        format: 'iife',
        sourcemap: 'inline',        // Sensible for testing.
      },
      globals: {
        chai: 'chai',
        sinon: 'sinon',
      },
    },
  })
}
