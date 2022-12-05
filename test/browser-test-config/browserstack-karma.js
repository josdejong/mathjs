const baseKarma = require('./base-karma')
const mochaConfig = require('../../.mocharc.json')

module.exports = function (config) {
  const baseConfig = baseKarma(config)

  config.set(Object.assign(baseConfig, {
    browsers: [
      'bs_firefox_android',
      'bs_firefox_windows',
      'bs_chrome_mac',
      'bs_safari_mac',
      'bs_edge'
    ],

    reporters: [
      'mocha', 'BrowserStack'
    ],

    client: {
      mocha: {
        timeout: mochaConfig.timeout
      }
    },

    browserStack: {
      startTunnel: true
    },

    customLaunchers: {
      bs_firefox_android: {
        base: 'BrowserStack',
        browser: 'Android Browser',
        real_mobile: true,
        device: 'Samsung Galaxy S22',
        os: 'android',
        os_version: '12.0'
      },
      bs_firefox_windows: {
        base: 'BrowserStack',
        browser: 'firefox',
        browser_version: '107',
        os: 'Windows',
        os_version: '11'
      },
      bs_chrome_mac: {
        base: 'BrowserStack',
        browser: 'Chrome',
        browser_version: '107',
        os: 'OS X',
        os_version: 'Ventura'
      },
      bs_safari_mac: {
        base: 'BrowserStack',
        browser: 'Safari',
        browser_version: '16.0',
        os: 'OS X',
        os_version: 'Ventura'
      },
      bs_edge: {
        base: 'BrowserStack',
        browser: 'Edge',
        browser_version: '107',
        os: 'Windows',
        os_version: '11'
      }
    }
  }))
}
