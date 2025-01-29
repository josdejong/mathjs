const baseKarma = require('./base-karma')
const mochaConfig = require('../../.mocharc.json')

module.exports = function (config) {
  const createWebDriverConfig = (hostname) => ({
    hostname,
    port: 80
  })

  const createLauncher = (config, overrides = {}) => ({
    base: 'WebDriver',
    config,
    'LT:Options': {
      build: 'OSS',
      name: 'mathjs',
      video: false,
      visual: false,
      network: false,
      console: false,
      terminal: true,
      tunnel: true,
      user: process.env.LT_USERNAME,
      accessKey: process.env.LT_ACCESS_KEY,
      pseudoActivityInterval: 15000,
      w3c: true
    },
    ...overrides
  })

  const webdriverConfig = createWebDriverConfig('hub.lambdatest.com')
  // const mobileWebDriverConfig = createWebDriverConfig('mobile-hub.lambdatest.com')

  const customLaunchers = {
    chrome_windows: createLauncher(webdriverConfig, {
      browserName: 'Chrome',
      version: 'latest',
      platform: 'Windows 11'
    }),

    firefox_windows: createLauncher(webdriverConfig, {
      browserName: 'Firefox',
      version: 'latest',
      platform: 'Windows 11'
    }),

    safari_mac: createLauncher(webdriverConfig, {
      browserName: 'Safari',
      version: 'latest',
      platform: 'macOS Ventura',
      webdriverMode: true
    }),

    edge_windows: createLauncher(webdriverConfig, {
      browserName: 'MicrosoftEdge',
      version: 'latest',
      platform: 'Windows 11'
    })

    // TODO: get testing on iphone and android working
    // ios: createLauncher(mobileWebDriverConfig, {
    //   deviceName: 'iPhone.*',
    //   browserName: 'Safari',
    //   appiumVersion: '1.22.3',
    //   isRealMobile: true,
    //   platformName: 'ios'
    // })
  }

  const baseConfig = baseKarma(config)

  config.set({
    ...baseConfig,
    hostname: 'localhost.lambdatest.com',
    port: 9876,
    basePath: '../..',
    frameworks: ['mocha'],
    client: {
      mocha: {
        timeout: mochaConfig.timeout
      }
    },
    reporters: ['spec'],
    files: [
      'test/browser-test-config/browser-tests.test.js'
    ],
    plugins: [
      'karma-webpack',
      'karma-mocha',
      'karma-webdriver-launcher',
      'karma-spec-reporter'
    ],
    captureTimeout: 600000,
    retryLimit: 1,
    browserDisconnectTimeout: 90000,
    browserDisconnectTolerance: 1,
    browserNoActivityTimeout: 90000,
    concurrency: Infinity,
    logLevel: config.LOG_INFO,
    browsers: Object.keys(customLaunchers),
    customLaunchers,
    singleRun: true,
    autoWatch: false
  })
}
