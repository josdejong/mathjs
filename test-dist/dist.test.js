const assert = require('assert')
const version = require('../package.json').version

describe('dist', function () {
  it('should load dist/math.js', function () {
    const math = require('../dist/math.js')

    assert.strictEqual(math.add(2, 3), 5)
    assert.strictEqual(math.version, version)
  })

  it('should load dist/math.min.js', function () {
    const math = require('../dist/math.min.js')

    assert.strictEqual(math.add(2, 3), 5)
    assert.strictEqual(math.version, version)
  })
})
