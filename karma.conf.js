const babel = require('rollup-plugin-babel')
const replace = require('rollup-plugin-replace')

const env = process.env.NODE_ENV
module.exports = function(config) {
  config.set({
    frameworks: ['mocha', 'chai', 'sinon'],
    files: ['test/**/*.spec.js'],
    reporters: ['mocha'],
    port: 9876,  // karma web server port
    colors: true,
    logLevel: config.LOG_INFO,
    browsers: ['ChromeHeadless'],
    // autoWatch: true,
    // singleRun: false, // Karma captures browsers, runs the tests and exits
    concurrency: Infinity,

    preprocessors: {
      'test/**/*.spec.js': ['rollup'],
    },

    rollupPreprocessor: {
      plugins: [
        babel(),
        replace({
          'process.env.NODE_ENV': JSON.stringify(env),
        }),
      ],
      output: {
        format: 'umd',
        name: 'PWSDK',
        sourcemap: 'inline',        // Sensible for testing.
      },
    },
  })
}
