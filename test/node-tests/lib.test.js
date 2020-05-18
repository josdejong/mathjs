// Only use native node.js API's and references to ./lib here, this file is not transpiled!
const assert = require('assert')
const cp = require('child_process')
const path = require('path')
const version = require('../../package.json').version

describe('lib', function () {
  it('should load lib/mainAny.js', function () {
    const math = require('../../lib/entry/mainAny')

    assert.strictEqual(math.add(2, 3), 5)
  })

  it('should load lib/mainNumber.js', function () {
    const math = require('../../lib/entry/mainNumber')

    assert.strictEqual(math.add(2, 3), 5)
  })

  it('should have the correct version number', function () {
    const math = require('../../lib/entry/mainAny')

    assert.strictEqual(math.version, version)
  })

  it('should be robust against pollution of the Object prototype', function (done) {
    const filename = path.join(__dirname, 'polluted_object_prototype.js')
    cp.exec('node ' + filename, function (error, result) {
      assert.strictEqual(error, null)
      assert.strictEqual(result, '2i\n')
      done()
    })
  })
})
