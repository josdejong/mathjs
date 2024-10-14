// test add
import assert from 'assert'

import math from '../../../../src/defaultInstance.js'
const add = math.add

// TODO: make unit tests independent of math
describe('add', function () {
  describe('Array', function () {
    it('should convert strings and add them element wise', function () {
      assert.deepStrictEqual(add('2', ['3', '4']), [5, 6])
      assert.deepStrictEqual(add(['2', '3'], '4'), [6, 7])
    })

    it('should add arrays correctly', function () {
      const a2 = [[1, 2], [3, 4]]
      const a3 = [[5, 6], [7, 8]]
      const a4 = add(a2, a3)
      assert.deepStrictEqual(a4, [[6, 8], [10, 12]])
    })

    it('should add 3 dimension arrays correctly', function () {
      const a2 = [[[1, 1], [2, 2]], [[3, 3], [4, 4]]]
      const a3 = [[[5, 5], [6, 6]], [[7, 7], [8, 8]]]
      const a4 = add(a2, a3)
      assert.deepStrictEqual(a4, [[[6, 6], [8, 8]], [[10, 10], [12, 12]]])
    })

    it('should add a scalar and an array correctly', function () {
      assert.deepStrictEqual(add(2, [3, 4]), [5, 6])
      assert.deepStrictEqual(add([3, 4], 2), [5, 6])
    })

    it('should add broadcastable arrays correctly', function () {
      const a2 = [1, 2]
      const a3 = [[3], [4]]
      const a4 = add(a2, a3)
      const a5 = add(a3, a2)
      assert.deepStrictEqual(a4, [[4, 5], [5, 6]])
      assert.deepStrictEqual(a5, [[4, 5], [5, 6]])
    })

    it('should add array and dense matrix correctly', function () {
      const a = [1, 2, 3]
      const b = math.matrix([3, 2, 1])
      const c = add(a, b)

      assert.ok(c instanceof math.Matrix)
      assert.deepStrictEqual(c, math.matrix([4, 4, 4]))
    })

    it('should add array and sparse matrix correctly', function () {
      const a = [[1, 2, 3], [4, 5, 6]]
      const b = math.sparse([[6, 5, 4], [3, 2, 1]])
      const c = add(a, b)

      assert.ok(c instanceof math.Matrix)
      assert.deepStrictEqual(c, math.matrix([[7, 7, 7], [7, 7, 7]]))
    })
  })

  describe('DenseMatrix', function () {
    it('should handle strings and matrices element wise', function () {
      assert.deepStrictEqual(add('2', math.matrix(['3', '4'])), math.matrix([5, 6]))
      assert.deepStrictEqual(add(math.matrix(['2', '3']), '4'), math.matrix([6, 7]))
    })

    it('should add matrices correctly', function () {
      const a2 = math.matrix([[1, 2], [3, 4]])
      const a3 = math.matrix([[5, 6], [7, 8]])
      const a4 = add(a2, a3)
      assert.ok(a4 instanceof math.Matrix)
      assert.deepStrictEqual(a4.size(), [2, 2])
      assert.deepStrictEqual(a4.valueOf(), [[6, 8], [10, 12]])
    })

    it('should add 3 dimension natrices correctly', function () {
      const a2 = math.matrix([[[1, 1], [2, 2]], [[3, 3], [4, 4]]])
      const a3 = math.matrix([[[5, 5], [6, 6]], [[7, 7], [8, 8]]])
      const a4 = add(a2, a3)
      assert.deepStrictEqual(a4, math.matrix([[[6, 6], [8, 8]], [[10, 10], [12, 12]]]))
    })

    it('should add a scalar and a matrix correctly', function () {
      assert.deepStrictEqual(add(2, math.matrix([3, 4])), math.matrix([5, 6]))
      assert.deepStrictEqual(add(math.matrix([3, 4]), 2), math.matrix([5, 6]))
    })

    it('should add matrix and array correctly', function () {
      const a = math.matrix([1, 2, 3])
      const b = [3, 2, 1]
      const c = add(a, b)

      assert.ok(c instanceof math.Matrix)
      assert.deepStrictEqual(c, math.matrix([4, 4, 4]))
    })

    it('should add dense and sparse matrices correctly', function () {
      const a = math.matrix([[1, 2, 3], [1, 0, 0]])
      const b = math.sparse([[3, 2, 1], [0, 0, 1]])
      const c = add(a, b)

      assert.ok(c instanceof math.Matrix)
      assert.deepStrictEqual(c, math.matrix([[4, 4, 4], [1, 0, 1]]))
    })

    it('should add matrices with a datatype correctly', function () {
      const a2 = math.matrix([[1, 2], [3, 4]], 'dense', 'number')
      const a3 = math.matrix([[5, 6], [7, 8]], 'dense', 'number')
      const a4 = add(a2, a3)
      assert.ok(a4 instanceof math.Matrix)
      assert.strictEqual(a4._datatype, 'number')
      assert.deepStrictEqual(a4.size(), [2, 2])
      assert.deepStrictEqual(a4.valueOf(), [[6, 8], [10, 12]])
    })

    it('should add matrices with a datatype correctly', function () {
      const a2 = math.matrix([math.bignumber(3), math.bignumber(4)], 'dense', 'BigNumber')
      const a3 = math.matrix([math.bignumber(5), math.bignumber(6)], 'dense', 'BigNumber')
      const a4 = add(a2, a3)
      assert.ok(a4 instanceof math.Matrix)
      assert.strictEqual(a4._datatype, 'BigNumber')
      assert.deepStrictEqual(a4.size(), [2])
      assert.deepStrictEqual(a4.valueOf(), [math.bignumber(8), math.bignumber(10)])
    })
  })

  describe('SparseMatrix', function () {
    it('should add matrices correctly', function () {
      const a2 = math.matrix([[1, 2], [3, 4]], 'sparse')
      const a3 = math.matrix([[5, -2], [7, -4]], 'sparse')
      const a4 = add(a2, a3)
      assert.ok(a4 instanceof math.Matrix)
      assert.deepStrictEqual(a4, math.sparse([[6, 0], [10, 0]]))
    })

    it('should add a scalar and a matrix correctly', function () {
      assert.deepStrictEqual(add(2, math.matrix([[3, 4], [5, 6]], 'sparse')), math.matrix([[5, 6], [7, 8]], 'dense'))
      assert.deepStrictEqual(add(math.matrix([[3, 4], [5, 6]], 'sparse'), 2), math.matrix([[5, 6], [7, 8]], 'dense'))
    })

    it('should add matrix and array correctly', function () {
      const a = math.matrix([[1, 2, 3], [1, 0, 0]], 'sparse')
      const b = [[3, 2, 1], [0, 0, 1]]
      const c = add(a, b)

      assert.ok(c instanceof math.Matrix)
      assert.deepStrictEqual(c, math.matrix([[4, 4, 4], [1, 0, 1]]))
    })

    it('should add sparse and dense matrices correctly', function () {
      const a = math.sparse([[1, 2, 3], [1, 0, 0]])
      const b = math.matrix([[3, 2, 1], [0, 0, 1]])
      const c = add(a, b)

      assert.ok(c instanceof math.Matrix)
      assert.deepStrictEqual(c, math.matrix([[4, 4, 4], [1, 0, 1]]))
    })

    it('should add sparse and sparse matrices correctly', function () {
      const a = math.sparse([[1, 2, 3], [1, 0, 0]])
      const b = math.sparse([[3, 2, 1], [0, 0, 1]])
      const c = add(a, b)

      assert.ok(c instanceof math.Matrix)
      assert.deepStrictEqual(c, math.sparse([[4, 4, 4], [1, 0, 1]]))
    })

    it('should add two pattern matrices correctly', function () {
      const a = new math.SparseMatrix({
        values: undefined,
        index: [0, 1, 2, 0],
        ptr: [0, 2, 3, 4],
        size: [3, 3]
      })

      const b = new math.SparseMatrix({
        values: undefined,
        index: [0, 1, 2, 1],
        ptr: [0, 3, 3, 4],
        size: [3, 3]
      })

      const c = add(a, b)

      assert.deepStrictEqual(
        c,
        new math.SparseMatrix({
          values: undefined,
          index: [0, 1, 2, 2, 0, 1],
          ptr: [0, 3, 4, 6],
          size: [3, 3]
        }))
    })

    it('should add pattern and value matrices correctly', function () {
      const a = new math.SparseMatrix({
        values: undefined,
        index: [0, 1, 2, 0],
        ptr: [0, 2, 3, 4],
        size: [3, 3]
      })

      const b = new math.SparseMatrix({
        values: [1, 2, 3, 4],
        index: [0, 1, 2, 1],
        ptr: [0, 3, 3, 4],
        size: [3, 3]
      })

      const c = add(a, b)

      assert.deepStrictEqual(
        c,
        new math.SparseMatrix({
          values: undefined,
          index: [0, 1, 2, 2, 0, 1],
          ptr: [0, 3, 4, 6],
          size: [3, 3]
        }))
    })

    it('should add value and pattern matrices correctly', function () {
      const a = new math.SparseMatrix({
        values: [1, 2, 3, 4],
        index: [0, 1, 2, 0],
        ptr: [0, 2, 3, 4],
        size: [3, 3]
      })

      const b = new math.SparseMatrix({
        values: undefined,
        index: [0, 1, 2, 1],
        ptr: [0, 3, 3, 4],
        size: [3, 3]
      })

      const c = add(a, b)

      assert.deepStrictEqual(
        c,
        new math.SparseMatrix({
          values: undefined,
          index: [0, 1, 2, 2, 0, 1],
          ptr: [0, 3, 4, 6],
          size: [3, 3]
        }))
    })
  })

  describe('multiple arguments', function () {
    it('should add more than two arguments', function () {
      assert.deepStrictEqual(add(2, 3, 4), 9)
      assert.deepStrictEqual(add(2, 3, [5, 6]), [10, 11])

      assert.deepStrictEqual(add([1, 1], [2, 2], [3, 3]), [6, 6])
      assert.deepStrictEqual(add([1, 1], [2, 2], 3), [6, 6])
      assert.deepStrictEqual(add([1, 1], 2, 3), [6, 6])

      assert.deepStrictEqual(add(math.matrix([1, 1]), math.matrix([2, 2]), math.matrix([3, 3])), math.matrix([6, 6]))
      assert.deepStrictEqual(add(math.matrix([1, 1]), math.matrix([2, 2]), 3), math.matrix([6, 6]))
      assert.deepStrictEqual(add(math.matrix([1, 1]), 2, 3), math.matrix([6, 6]))
    })
  })
})
