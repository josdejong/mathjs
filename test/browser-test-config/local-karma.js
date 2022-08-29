const baseKarma = require('./base-karma')
const mochaConfig = require('../../.mocharc.json')

module.exports = function (config) {
  const baseConfig = baseKarma(config)

  config.set(Object.assign(baseConfig, {
    browsers: ['FirefoxHeadless'],

    reporters: ['mocha'],

    client: {
      captureConsole: true,
      mocha: {
        timeout: mochaConfig.timeout
      }
    }
  }))
}
