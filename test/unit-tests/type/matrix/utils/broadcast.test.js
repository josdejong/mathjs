import assert from 'assert'
import math from '../../../../../src/defaultInstance.js'
import { broadcast } from '../../../../../src/type/matrix/utils/broadcast.js'
const matrix = math.matrix

describe('broadcast', function () {
  it('should return matrices as such if they are the same size', function () {
    const A = matrix([1, 2])
    const B = matrix([3, 4])
    const r = broadcast(A, B)
    assert.deepStrictEqual(r[0].valueOf(), A.valueOf())
    assert.deepStrictEqual(r[1].valueOf(), B.valueOf())
  })

  it('should throw an error if they are not broadcastable', function () {
    const A = matrix([1, 2])
    const B = matrix([3, 4, 5])
    assert.throws(function () { broadcast(A, B) })
  })

  it('should not mutate the original matrices', function () {
    const A = matrix([1, 2])
    const B = matrix([[3], [4]])
    broadcast(A, B)
    assert.deepStrictEqual(A.valueOf(), [1, 2])
    assert.deepStrictEqual(B.valueOf(), [[3], [4]])
  })

  it('should broadcast the first matrix', function () {
    const A = matrix([1, 2])
    const B = matrix([[3, 3], [4, 4]])
    const r = broadcast(A, B)
    assert.deepStrictEqual(r[0].valueOf(), [[1, 2], [1, 2]])
    assert.deepStrictEqual(r[1].valueOf(), B.valueOf())
  })

  it('should broadcast the second matrix', function () {
    const A = matrix([[1, 2], [1, 2]])
    const B = matrix([[3], [4]])
    const r = broadcast(A, B)
    assert.deepStrictEqual(r[0].valueOf(), A.valueOf())
    assert.deepStrictEqual(r[1].valueOf(), [[3, 3], [4, 4]])
  })

  it('should broadcast both matrices', function () {
    const A = matrix([1, 2])
    const B = matrix([[3], [4]])
    const r = broadcast(A, B)
    assert.deepStrictEqual(r[0].valueOf(), [[1, 2], [1, 2]])
    assert.deepStrictEqual(r[1].valueOf(), [[3, 3], [4, 4]])
  })

  it('should broadcast a scalar and a column vector', function () {
    const A = matrix([1])
    const B = matrix([[3], [4]])
    const r = broadcast(A, B)
    assert.deepStrictEqual(r[0].valueOf(), [[1], [1]])
    assert.deepStrictEqual(r[1].valueOf(), B.valueOf())
  })

  it('should broadcast a row vector and a scalar', function () {
    const A = matrix([1, 2])
    const B = matrix([3])
    const r = broadcast(A, B)
    assert.deepStrictEqual(r[0].valueOf(), A.valueOf())
    assert.deepStrictEqual(r[1].valueOf(), [3, 3])
  })

  it('should broadcast higher dimensions', function () {
    const A = matrix([[[1, 2]]])
    const B = matrix([[[3]], [[4]]])
    const r = broadcast(A, B)
    assert.deepStrictEqual(r[0].valueOf(), [[[1, 2]], [[1, 2]]])
    assert.deepStrictEqual(r[1].valueOf(), [[[3, 3]], [[4, 4]]])
  })
})
