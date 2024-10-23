var fs = require('fs');
const baseKarma = require('./base-karma')
const mochaConfig = require('../../.mocharc.json')
const webpack = require('webpack')


module.exports = function(config) {
  var webdriverConfig = {
      hostname: 'hub.lambdatest.com', //lambdatest hub address
      port: 80
  }

  const baseConfig = baseKarma(config)

  config.set(Object.assign(baseConfig, {
      hostname: '127.0.0.1', // hostname, where karma web server will run
      port: 9876,
      basePath: '../..',
      frameworks: ['mocha'],
      
 
      client: {
        mocha: {
          timeout: mochaConfig.timeout
        }
      },
      files: [
        'test/browser-test-config/browser-tests.test.js'
      ],
  
      plugins: [
     
         'karma-webpack',
         'karma-mocha',
       
         'karma-webdriver-launcher',
      
      ],
  
      captureTimeout: 600000,
      retryLimit: 1,
      browserDisconnectTimeout: 90000,
      browserDisconnectTolerance: 1,
      browserNoActivityTimeout: 90000,
  
      concurrency: 1,
      logLevel: config.LOG_DEBUG,
      browsers: ['Windows_Chrome'],
      customLaunchers: {
        'Windows_Chrome': {
              base: 'WebDriver',
              config: webdriverConfig,
              browserName: 'chrome',
              version: 'latest',
              build: 'OSS',
              name: 'Jos MathJs',
              video: true, // capture video for your test
              visual: true, // capture screenshots on each step
              network: true, // capture network logs for your test
              console: true, // capture browser console logs
              terminal: true,
              user: process.env.LT_USERNAME,
              accessKey: process.env.LT_ACCESS_KEY,
              pseudoActivityInterval: 15000 // 5000 ms heartbeat
          }
      },
      singleRun: true,
      autoWatch: true
  }));
};