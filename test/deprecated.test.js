// test error messages for deprecated functions
import assert from 'assert'

import math from '../src/main'

describe('deprecated stuff', function () {
  it('should throw a deprecation error when using UpdateNode', function () {
    assert.throws(function () {
      console.log(new math.expression.node.UpdateNode())
    }, /UpdateNode is deprecated/)
  })
})
