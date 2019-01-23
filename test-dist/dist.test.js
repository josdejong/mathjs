//
// WARNING: don't use code here that can't run natively in node.js (like import)
// else Webpack will need to transpile and bundle the bundles which is slow
//
const assert = require('assert')
const validateBundle = require('../tools/validateBundle').validateBundle
const expectedBundleStructure = require('../test/snapshot').expectedInstanceStructure
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

  it('should have all expected functions in dist/main.js', function () {
    // snapshot testing
    const math = require('../dist/math.js')

    validateBundle(expectedBundleStructure, math)
  })

  it('should have all expected functions in dist/main.min.js', function () {
    // snapshot testing
    const math = require('../dist/math.js')

    validateBundle(expectedBundleStructure, math)
  })
})
