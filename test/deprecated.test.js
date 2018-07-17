// test error messages for deprecated functions
const assert = require('assert')
const math = require('../src/main')

describe('deprecated stuff', function () {
  it('should throw a deprecation error when using UpdateNode', function () {
    assert.throws(function () {
      console.log(new math.expression.node.UpdateNode())
    }, /UpdateNode is deprecated/)
  })
})
