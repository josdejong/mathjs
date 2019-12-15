const baseKarma = require('./base-karma')

module.exports = function (config) {
  const baseConfig = baseKarma(config)

  config.set(Object.assign(baseConfig, {
    browsers: [
      'bs_firefox_android',
      'bs_firefox_windows',
      'bs_chrome_mac',
      'bs_safari_mac',
      'bs_ie_11',
      'bs_edge'
    ],

    reporters: [
      'mocha', 'BrowserStack'
    ],

    client: {
      mocha: {
        reporter: 'html'
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
        browser_version: '71',
        os: 'Windows',
        os_version: '10'
      },
      bs_chrome_mac: {
        base: 'BrowserStack',
        browser: 'Chrome',
        browser_version: '78',
        os: 'OS X',
        os_version: 'High Sierra'
      },
      bs_safari_mac: {
        base: 'BrowserStack',
        browser: 'Safari',
        browser_version: '13',
        os: 'OS X',
        os_version: 'Catalina'
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
        browser_version: '18',
        os: 'Windows',
        os_version: '10'
      }
    }
  }))
}
