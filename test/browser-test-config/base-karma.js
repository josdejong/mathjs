const webpack = require('webpack')

module.exports = function (config) {
  return {

    basePath: '../..',

    frameworks: [
      'mocha'
    ],

    mochaReporter: {
      output: 'minimal'
    },

    reporters: ['mocha'],

    // list of files / patterns to load in the browser
    files: [
      'test/browser-test-config/browser-tests.test.js'
    ],

    plugins: [
      'karma-webpack',
      'karma-mocha',
      'karma-mocha-reporter',
      'karma-firefox-launcher'
    ],

    preprocessors: {
      'test/**/*.js': ['webpack']
    },

    captureTimeout: 210000,
    browserDisconnectTolerance: 3, // this one helps
    browserDisconnectTimeout: 210000,
    browserNoActivityTimeout: 210000,

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,

    webpack: {
      // don't use esm
      mode: 'development',

      plugins: [
        new webpack.ProvidePlugin({
          process: 'process'
        })
      ],

      resolve: {
        // unless we disallow .mjs files here the tests fail
        // due to decimal.mjs being imported.
        extensions: ['.js', '.json'],
        // same as above, disallow 'module' field to prevent
        // decimal.mjs from breaking tests.
        mainFields: ['browser', 'main']
      },

      module: {
        rules: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            use: 'babel-loader'
          }
        ]
      }
    }

  }
}
