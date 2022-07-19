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
        device: 'Samsung Galaxy S10',
        os: 'android',
        os_version: '9.0'
      },
      bs_firefox_windows: {
        base: 'BrowserStack',
        browser: 'firefox',
        browser_version: '92',
        os: 'Windows',
        os_version: '10'
      },
      bs_chrome_mac: {
        base: 'BrowserStack',
        browser: 'Chrome',
        browser_version: '93',
        os: 'OS X',
        os_version: 'High Sierra'
      },
      bs_safari_mac: {
        base: 'BrowserStack',
        browser: 'Safari',
        browser_version: '14.1',
        os: 'OS X',
        os_version: 'Big Sur'
      },
      bs_ie_11: {
        base: 'BrowserStack',
        browser: 'IE',
        browser_version: '11',
        os: 'Windows',
        os_version: '10'
      },
      bs_edge: {
        base: 'BrowserStack',
        browser: 'Edge',
        browser_version: '93',
        os: 'Windows',
        os_version: '10'
      }
    }
  }))
}
