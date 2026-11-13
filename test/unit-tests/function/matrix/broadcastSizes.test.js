import assert from 'assert'
import math from '../../../../src/defaultInstance.js'

describe('broadcastSizes', function () {
  const broadcastSizes = math.broadcastSizes
  const matrix = math.matrix

  it('should broadcast sizes', function () {
    assert.deepStrictEqual(broadcastSizes([2, 3]), [2, 3])
    assert.deepStrictEqual(broadcastSizes([3, 3], [3, 1]), [3, 3])
    assert.deepStrictEqual(broadcastSizes([2, 1], [1, 3]), [2, 3])
    assert.deepStrictEqual(broadcastSizes([5, 4, 3], [1, 4, 1]), [5, 4, 3])
    assert.deepStrictEqual(broadcastSizes([3], [2, 3]), [2, 3])
    assert.deepStrictEqual(broadcastSizes([1, 3], [2, 1]), [2, 3])
  })

  it('should throw an error if sizes are not compatible', function () {
    assert.throws(function () { broadcastSizes([2, 3], [3, 2]) }, /Error: shape mismatch: /)
    assert.throws(function () { broadcastSizes([2, 3], [2, 3, 4]) }, /Error: shape mismatch: /)
  })

  it('should broadcast sizes of mixed arrays and matrices', function () {
    assert.deepStrictEqual(broadcastSizes([3, 3], matrix([3, 1])), [3, 3])
    assert.deepStrictEqual(broadcastSizes(matrix([2, 1]), [1, 3]), [2, 3])
    assert.deepStrictEqual(broadcastSizes(matrix([5, 4, 3]), matrix([1, 4, 1])), [5, 4, 3])
  })
})
