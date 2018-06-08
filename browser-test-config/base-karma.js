var path = require('path');

module.exports = function(config) {
  return {

    basePath: '../',


    frameworks: ['mocha'],


    // list of files / patterns to load in the browser
    files: [
      'browser-test-config/browser-tests.test.js',
    ],

    preprocessors: {
      '**/*.js': ['webpack'],
    },

    captureTimeout: 210000,
    browserDisconnectTolerance: 3, //this one helps
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

      resolve: {
        // unless we disallow .mjs files here the tests fail
        // due to decimal.mjs being imported.
        extensions: [".js", ".json"],
        // same as above, disallow 'module' field to prevent
        // decimal.mjs from breaking tests.
        mainFields: ['browser', 'main'],
      },
    },

  };
};
