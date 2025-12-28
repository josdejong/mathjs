import assert from 'assert'
import math from '../../../../src/defaultInstance.js'

describe('broadcastMatrices', function () {
  const matrix = math.matrix
  const broadcastMatrices = math.broadcastMatrices
  const A = [[1], [2], [3]]
  const B = [[10, 20, 30]]
  const C = [100]
  const broadcastedA = [[1, 1, 1], [2, 2, 2], [3, 3, 3]]
  const broadcastedB = [[10, 20, 30], [10, 20, 30], [10, 20, 30]]
  const broadcastedC = [[100, 100, 100], [100, 100, 100], [100, 100, 100]]

  it('should broadcast matrices', function () {
    assert.deepStrictEqual(broadcastMatrices(matrix(A), matrix(B)), [matrix(broadcastedA), matrix(broadcastedB)])
    assert.deepStrictEqual(broadcastMatrices(matrix(A), matrix(C)), [matrix(A), matrix([[100], [100], [100]])])
    assert.deepStrictEqual(broadcastMatrices(matrix(B), matrix(A)), [matrix(broadcastedB), matrix(broadcastedA)])
    assert.deepStrictEqual(broadcastMatrices(matrix(A), matrix(B), matrix(C)), [matrix(broadcastedA), matrix(broadcastedB), matrix(broadcastedC)])
  })

  it('should broadcast arrays', function () {
    assert.deepStrictEqual(broadcastMatrices(A, B), [broadcastedA, broadcastedB])
    assert.deepStrictEqual(broadcastMatrices(B, A), [broadcastedB, broadcastedA])
    assert.deepStrictEqual(broadcastMatrices(A, B, C), [broadcastedA, broadcastedB, broadcastedC])
    assert.deepStrictEqual(broadcastMatrices(A), [A])
    assert.deepStrictEqual(broadcastMatrices(B, C, A), [broadcastedB, broadcastedC, broadcastedA])
  })

  it('should throw an error if sizes are not compatible', function () {
    assert.throws(function () { broadcastMatrices(matrix([[1, 2], [3, 4]]), matrix([[1, 2, 3]])) }, /Error: shape mismatch: /)
    assert.throws(function () { broadcastMatrices([[1, 2], [3, 4]], matrix([[1, 2, 3]])) }, /Error: shape mismatch: /)
    assert.throws(function () { broadcastMatrices(matrix([[1, 2], [3, 4]]), [[1, 2, 3]]) }, /Error: shape mismatch: /)
    assert.throws(function () { broadcastMatrices([[1, 2], [3, 4]], [[1, 2, 3]]) }, /Error: shape mismatch: /)
  })
})
