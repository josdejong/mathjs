var assert = require('assert')
var version = require('../package.json').version

describe('lib', function () {
  it('should load lib/index.js', function () {
    var math = require('../lib/index.js')

    assert.equal(math.add(2, 3), 5)
    assert.equal(math.version, version)
  })
})
