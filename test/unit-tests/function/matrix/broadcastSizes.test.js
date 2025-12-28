import assert from 'assert'
import math from '../../../../src/defaultInstance.js'

describe('broadcastSizes', function () {
  it('should broadcast sizes', function () {
    assert.deepStrictEqual(math.broadcastSizes([2, 3]), [2, 3])
    assert.deepStrictEqual(math.broadcastSizes([3, 3], [3, 1]), [3, 3])
    assert.deepStrictEqual(math.broadcastSizes([2, 1], [1, 3]), [2, 3])
    assert.deepStrictEqual(math.broadcastSizes([5, 4, 3], [1, 4, 1]), [5, 4, 3])
    assert.deepStrictEqual(math.broadcastSizes([3], [2, 3]), [2, 3])
    assert.deepStrictEqual(math.broadcastSizes([1, 3], [2, 1]), [2, 3])
  })

  it('should throw an error if sizes are not compatible', function () {
    assert.throws(function () { math.broadcastSizes([2, 3], [3, 2]) }, /Error: shape mismatch: /)
    assert.throws(function () { math.broadcastSizes([2, 3], [2, 3, 4]) }, /Error: shape mismatch: /)
  })

  it('should broadcast sizes of mixed arrays and matrices', function () {
    assert.deepStrictEqual(math.broadcastSizes([3, 3], math.matrix([3, 1])), [3, 3])
    assert.deepStrictEqual(math.broadcastSizes(math.matrix([2, 1]), [1, 3]), [2, 3])
    assert.deepStrictEqual(math.broadcastSizes(math.matrix([5, 4, 3]), math.matrix([1, 4, 1])), [5, 4, 3])
  })
})
