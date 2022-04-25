// Only use native node.js API's and references to ./lib here, this file is not transpiled!
const assert = require('assert')
const cp = require('child_process')
const path = require('path')

describe('lib/esm', function () {
  it('should load via mjs', function (done) {
    const filename = path.join(__dirname, 'esmApp.mjs')
    cp.exec('node ' + filename, function (error, result) {
      assert.strictEqual(error, null)
      assert.strictEqual(result, '2\n2i\n')
      done()
    })
  })

  it('should load number only via mjs', function (done) {
    const filename = path.join(__dirname, 'esmAppNumberOnly.mjs')
    cp.exec('node ' + filename, function (error, result) {
      assert.strictEqual(error, null)
      assert.strictEqual(result, '2\nNaN\n2\n4\n7\n')
      done()
    })
  })
})
