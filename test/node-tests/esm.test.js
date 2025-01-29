// Only use native node.js API's and references to ./lib here, this file is not transpiled!
import assert from 'node:assert'
import cp from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

describe('lib/esm', function () {
  it('should load via mjs', function (done) {
    const filename = path.join(__dirname, 'esmApp.js')
    cp.exec('node ' + filename, function (error, result) {
      assert.strictEqual(error, null)
      assert.strictEqual(result, '2\n2i\n')
      done()
    })
  })

  it('should load number only via mjs', function (done) {
    const filename = path.join(__dirname, 'esmAppNumberOnly.js')
    cp.exec('node ' + filename, function (error, result) {
      assert.strictEqual(error, null)
      assert.strictEqual(result, '2\nNaN\n2\n4\n7\n')
      done()
    })
  })
})
