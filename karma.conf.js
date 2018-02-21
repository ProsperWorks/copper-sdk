const nodeResolve = require('rollup-plugin-node-resolve')
const babel = require('rollup-plugin-babel')
const replace = require('rollup-plugin-replace')

const env = process.env.NODE_ENV
module.exports = function(config) {
  config.set({
    frameworks: ['mocha', 'chai'],
    files: ['test/**/*.spec.js'],
    reporters: ['mocha'],
    port: 9876,  // karma web server port
    colors: true,
    logLevel: config.LOG_INFO,
    browsers: ['Chrome'],
    // autoWatch: true,
    // singleRun: false, // Karma captures browsers, runs the tests and exits
    concurrency: Infinity,

    preprocessors: {
      'test/**/*.spec.js': ['rollup']
    },

    rollupPreprocessor: {
      /**
       * This is just a normal Rollup config object,
       * except that `input` is handled for you.
       */
      plugins: [
        nodeResolve({
          jsnext: true
        }),
        babel({
          exclude: 'node_modules/**',
        }),
        replace({
          'process.env.NODE_ENV': JSON.stringify(env)
        })
      ],
      output: {
        format: 'iife',            // Helps prevent naming collisions.
        name: 'PWSDK',    // Required for 'iife' format.
        sourcemap: 'inline'        // Sensible for testing.
      }
    }
  })
}
