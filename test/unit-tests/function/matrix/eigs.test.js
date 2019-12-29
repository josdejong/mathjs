import assert from 'assert'
import math from '../../../../src/bundleAny'
const eigs = math.eigs

describe('eigs', function () {
  it('should only accept a square matrix', function () {
    assert.throws(function () { eigs(math.matrix([[1, 2, 3], [4, 5, 6]])) }, /Matrix must be square/)
    assert.throws(function () { eigs([[1, 2, 3], [4, 5, 6]]) }, /Matrix must be square/)
  })
})
