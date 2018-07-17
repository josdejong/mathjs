const assert = require('assert')
const version = require('../package.json').version

describe('lib', function () {
  it('should load lib/index.js', function () {
    const math = require('../lib/main')

    assert.equal(math.add(2, 3), 5)
  })

  it('should have the correct version number', function () {
    const math = require('../lib/main')

    assert.equal(math.version, version)
  })
})
