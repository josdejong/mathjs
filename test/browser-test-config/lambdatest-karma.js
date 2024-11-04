const baseKarma = require('./base-karma')
const mochaConfig = require('../../.mocharc.json')

module.exports = function (config) {
  const webdriverConfig = {
    hostname: 'hub.lambdatest.com', // lambdatest hub address
    port: 80
  }

  const baseConfig = baseKarma(config)

  const launcherDefaults = {
    base: 'WebDriver',
    config: webdriverConfig,
    build: 'OSS',
    name: 'mathjs',
    video: false, // capture video for your test
    visual: false, // capture screenshots on each step
    network: false, // capture network logs for your test
    console: false, // capture browser console logs
    terminal: true,
    user: process.env.LT_USERNAME,
    accessKey: process.env.LT_ACCESS_KEY,
    pseudoActivityInterval: 15000 // 5000 ms heartbeat
  }

  const customLaunchers = {
    chrome_windows: {
      ...launcherDefaults,
      browserName: 'chrome',
      version: '130',
      platform: 'windows 11'
    },
    firefox_windows: {
      ...launcherDefaults,
      browserName: 'firefox',
      version: '131',
      platform: 'windows 11'
    },
    // FIXME: test on Safari on Mac
    // safari_mac: {
    //   ...launcherDefaults,
    //   browserName: 'safari',
    //   version: '18',
    //   platform: 'mac sequoia'
    // },
    edge_windows: {
      ...launcherDefaults,
      browserName: 'edge',
      version: '130',
      platform: 'windows 11'
    }
    // FIXME: test on Chrome on Android
    // chrome_android: {
    //   ...launcherDefaults,
    //   browserName: 'chrome',
    //   version: '130',
    //   platform: 'android 15'
    // }
  }

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
      'karma-webdriver-launcher'
    ],

    captureTimeout: 600000,
    retryLimit: 1,
    browserDisconnectTimeout: 90000,
    browserDisconnectTolerance: 1,
    browserNoActivityTimeout: 90000,

    concurrency: 1,
    logLevel: config.LOG_DEBUG,

    browsers: Object.keys(customLaunchers),
    customLaunchers,

    singleRun: true,
    autoWatch: true
  }))
}
