var baseKarma = require('./base-karma')

module.exports = function(config) {

  var baseConfig = baseKarma(config);

  config.set(Object.assign(baseConfig, {
    browsers: [
      'bs_firefox_android',
      'bs_chrome_mac',
    ],
    reporters: [
      'mocha', 'BrowserStack',
    ],
    client: {
      mocha: {
        reporter: 'html',
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
        device: 'Samsung Galaxy S8',
        os: 'android',
        os_version: '7.0',
      },
      bs_chrome_mac: {
        base: 'BrowserStack',
        browser: 'Chrome',
        browser_version: '66',
        os: 'OS X',
        os_version: 'High Sierra',
      },
    },
  }));

};
