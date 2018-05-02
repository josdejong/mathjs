var path = require('path');

module.exports = function(config) {
  config.set({

    basePath: '',


    frameworks: ['mocha'],


    // list of files / patterns to load in the browser
    files: [
      'browser-tests/browser-tests.test.js',
    ],

    preprocessors: {
      '**/*.js': [ 'webpack' ],
    },


    reporters: ['mocha'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,

    browsers: ['ChromeHeadless', 'FirefoxHeadless'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,

    webpack: {
      // don't use esm
      resolve: {
        mainFields: ['browser', 'main'],
      },
    },

    client: {
      captureConsole: true,
      mocha: {
        reporter: 'html',
      }
    },
  })
}
