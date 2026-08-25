import assert from 'assert'
import math from '../../../../src/defaultInstance.js'

describe('broadcastTo', function () {
  const broadcastTo = math.broadcastTo
  const matrix = math.matrix

  it('should broadcast arrays to a given size', function () {
    assert.deepStrictEqual(broadcastTo([1, 2, 3], [2, 3]), [[1, 2, 3], [1, 2, 3]])
    assert.deepStrictEqual(broadcastTo([2, 3], [2, 2]), [[2, 3], [2, 3]])
  })

  it('should broadcast matrices to a given size', function () {
    assert.deepStrictEqual(broadcastTo(matrix([1, 2, 3]), [2, 3]), matrix([[1, 2, 3], [1, 2, 3]]))
    assert.deepStrictEqual(broadcastTo(matrix([2, 3]), [2, 2]), matrix([[2, 3], [2, 3]]))
  })

  it('should broadcast mixed arrays and matrices to a given size', function () {
    assert.deepStrictEqual(broadcastTo([1, 2, 3], matrix([2, 3])), [[1, 2, 3], [1, 2, 3]])
    assert.deepStrictEqual(broadcastTo(matrix([2, 3]), [2, 2]), matrix([[2, 3], [2, 3]]))
    assert.deepStrictEqual(broadcastTo(matrix([1, 2, 3]), matrix([2, 3])), matrix([[1, 2, 3], [1, 2, 3]]))
    assert.deepStrictEqual(broadcastTo([2, 3], matrix([2, 2])), [[2, 3], [2, 3]])
  })

  it('should throw an error if sizes are not compatible', function () {
    assert.throws(function () { broadcastTo([1, 2], [2, 3]) }, /Error: shape mismatch: /)
    assert.throws(function () { broadcastTo(matrix([1, 2]), [2, 3]) }, /Error: shape mismatch: /)
  })
})
