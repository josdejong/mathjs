import assert from 'assert'
import math from '../../../../../src/defaultInstance.js'
import { broadcastMatrices, broadcast } from '../../../../../src/type/matrix/utils/broadcast.js'
const matrix = math.matrix

describe('broadcast utils', function () {
  describe('broadcastMatrices', function () {
    it('should return matrices as such if they are the same size', function () {
      const A = matrix([1, 2])
      const B = matrix([3, 4])
      const r = broadcastMatrices(A, B)
      assert.deepStrictEqual(r[0].valueOf(), A.valueOf())
      assert.deepStrictEqual(r[1].valueOf(), B.valueOf())
    })

    it('should throw an error if they are not broadcastable', function () {
      const A = matrix([1, 2])
      const B = matrix([3, 4, 5])
      assert.throws(function () { broadcastMatrices(A, B) })
    })

    it('should not mutate the original matrices', function () {
      const A = matrix([1, 2])
      const B = matrix([[3], [4]])
      broadcastMatrices(A, B)
      assert.deepStrictEqual(A.valueOf(), [1, 2])
      assert.deepStrictEqual(B.valueOf(), [[3], [4]])
    })

    it('should broadcast the first matrix', function () {
      const A = matrix([1, 2])
      const B = matrix([[3, 3], [4, 4]])
      const r = broadcastMatrices(A, B)
      assert.deepStrictEqual(r[0].valueOf(), [[1, 2], [1, 2]])
      assert.deepStrictEqual(r[1].valueOf(), B.valueOf())
    })

    it('should broadcast the second matrix', function () {
      const A = matrix([[1, 2], [1, 2]])
      const B = matrix([[3], [4]])
      const r = broadcastMatrices(A, B)
      assert.deepStrictEqual(r[0].valueOf(), A.valueOf())
      assert.deepStrictEqual(r[1].valueOf(), [[3, 3], [4, 4]])
    })

    it('should broadcast both matrices', function () {
      const A = matrix([1, 2])
      const B = matrix([[3], [4]])
      const r = broadcastMatrices(A, B)
      assert.deepStrictEqual(r[0].valueOf(), [[1, 2], [1, 2]])
      assert.deepStrictEqual(r[1].valueOf(), [[3, 3], [4, 4]])
    })

    it('should broadcast a scalar and a column vector', function () {
      const A = matrix([1])
      const B = matrix([[3], [4]])
      const r = broadcastMatrices(A, B)
      assert.deepStrictEqual(r[0].valueOf(), [[1], [1]])
      assert.deepStrictEqual(r[1].valueOf(), B.valueOf())
    })

    it('should broadcast a row vector and a scalar', function () {
      const A = matrix([1, 2])
      const B = matrix([3])
      const r = broadcastMatrices(A, B)
      assert.deepStrictEqual(r[0].valueOf(), A.valueOf())
      assert.deepStrictEqual(r[1].valueOf(), [3, 3])
    })

    it('should broadcast higher dimensions', function () {
      const A = matrix([[[1, 2]]])
      const B = matrix([[[3]], [[4]]])
      const r = broadcastMatrices(A, B)
      assert.deepStrictEqual(r[0].valueOf(), [[[1, 2]], [[1, 2]]])
      assert.deepStrictEqual(r[1].valueOf(), [[[3, 3]], [[4, 4]]])
    })

    describe('broadcast', function () {
      it('should apply a broadcasting function on two arrays of the same size', function () {
        const a = [[1, 2], [3, 4]]
        const b = [[5, 6], [7, 8]]
        const result = broadcast(a, b, [2, 2], [2, 2], (x, y) => x + y)
        assert.deepStrictEqual(result.data, [[6, 8], [10, 12]])
        assert.deepStrictEqual(result.size, [2, 2])
      })

      it('should apply a broadcasting function on two arrays of different sizes', function () {
        const a = [[1, 2], [3, 4]]
        const b = [10, 20]
        const result = broadcast(a, b, [2, 2], [2], (x, y) => x + y)
        assert.deepStrictEqual(result.data, [[11, 22], [13, 24]])
        assert.deepStrictEqual(result.size, [2, 2])
      })

      it('should throw an error if arrays and sizes are not provided', function () {
        assert.throws(function () { broadcast([1, 2], [3, 4], [2], null, (x, y) => x + y) })
      })

      it('should throw an error if callback is not a function', function () {
        assert.throws(function () { broadcast([1, 2], [3, 4], [2], [2], null) })
      })

      it('should handle broadcasting with empty arrays', function () {
        const a = []
        const b = []
        const result = broadcast(a, b, [0], [0], (x, y) => x + y)
        assert.deepStrictEqual(result.data, [])
        assert.deepStrictEqual(result.size, [0])
      })

      it('shoudl throw an error if arrays are not broadcastable', function () {
        const a = [[1, 2], [3, 4]]
        const b = [10, 20, 30]
        assert.throws(function () { broadcast(a, b, [2, 2], [3], (x, y) => x + y) })
      })
    })
  })
})
