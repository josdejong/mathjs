const baseKarma = require('./base-karma')

module.exports = function (config) {
  const baseConfig = baseKarma(config)

  config.set(Object.assign(baseConfig, {
    browsers: ['FirefoxHeadless'],

    reporters: ['mocha'],

    client: {
      captureConsole: true,
      mocha: {
        reporter: 'html'
      }
    }
  }))
}
