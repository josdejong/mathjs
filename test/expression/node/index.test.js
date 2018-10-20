// test the contents of index.js
const assert = require('assert')
const index = require('../../../src/expression/node/index')

describe('node/index', function () {
  it('should contain all nodes', function () {
    assert.strictEqual(index.length, 17)
  })
})
