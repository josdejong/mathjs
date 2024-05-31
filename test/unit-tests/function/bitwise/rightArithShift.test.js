// test rightArithShift
import assert from 'assert'

import math from '../../../../src/defaultInstance.js'
const matrix = math.matrix
const sparse = math.sparse
const bignumber = math.bignumber
const rightArithShift = math.rightArithShift

describe('rightArithShift', function () {
  it('should right arithmetically shift a number by a given amount', function () {
    assert.strictEqual(rightArithShift(0, 1000), 0)
    assert.strictEqual(rightArithShift(2, 0), 2)
    assert.strictEqual(rightArithShift(12, 3), 1)
    assert.strictEqual(rightArithShift(32, 4), 2)
    assert.strictEqual(rightArithShift(-1, 1000), -1)
    assert.strictEqual(rightArithShift(-12, 2), -3)
    assert.strictEqual(rightArithShift(122, 3), 15)
    assert.strictEqual(rightArithShift(-13, 2), -4)
    assert.strictEqual(rightArithShift(-13, 3), -2)
  })

  it('should right arithmetically shift a bigint by a given amount', function () {
    assert.strictEqual(rightArithShift(0n, 1000n), 0n)
    assert.strictEqual(rightArithShift(2n, 0n), 2n)
    assert.strictEqual(rightArithShift(12n, 3n), 1n)
    assert.strictEqual(rightArithShift(32n, 4n), 2n)
    assert.strictEqual(rightArithShift(-1n, 1000n), -1n)
    assert.strictEqual(rightArithShift(-12n, 2n), -3n)
    assert.strictEqual(rightArithShift(122n, 3n), 15n)
    assert.strictEqual(rightArithShift(-13n, 2n), -4n)
    assert.strictEqual(rightArithShift(-13n, 3n), -2n)
  })

  it('should right arithmetically shift booleans by a boolean amount', function () {
    assert.strictEqual(rightArithShift(true, true), 0)
    assert.strictEqual(rightArithShift(true, false), 1)
    assert.strictEqual(rightArithShift(false, true), 0)
    assert.strictEqual(rightArithShift(false, false), 0)
  })

  it('should right arithmetically shift with a mix of numbers and booleans', function () {
    assert.strictEqual(rightArithShift(2, true), 1)
    assert.strictEqual(rightArithShift(2, false), 2)
    assert.strictEqual(rightArithShift(true, 0), 1)
    assert.strictEqual(rightArithShift(true, 1), 0)
    assert.strictEqual(rightArithShift(false, 2), 0)
  })

  it('should right arithmetically shift with a mix of numbers and bigints', function () {
    assert.strictEqual(rightArithShift(122, 3n), 15)
    assert.strictEqual(rightArithShift(122n, 3), 15)
  })

  it('should right arithmetically shift bignumbers', function () {
    assert.deepStrictEqual(rightArithShift(bignumber(17), bignumber(3)), bignumber(2))
    assert.deepStrictEqual(rightArithShift(bignumber('633825300114114700748351602688000'), bignumber(100)), bignumber(500))
    assert.deepStrictEqual(rightArithShift(bignumber(-17), bignumber(3)), bignumber(-3))
    assert.strictEqual(rightArithShift(bignumber(-17), bignumber(-3)).isNaN(), true)
    assert.strictEqual(rightArithShift(bignumber(Infinity), bignumber(Infinity)).isNaN(), true)
    assert.deepStrictEqual(rightArithShift(bignumber(-Infinity), bignumber(Infinity)), bignumber(-1))
  })

  it('should right arithmetically shift mixed numbers and bignumbers', function () {
    assert.deepStrictEqual(rightArithShift(bignumber(17), 3), bignumber(2))
    assert.deepStrictEqual(rightArithShift(bignumber('-633825300114114700748351602688000'), 100), bignumber(-500))
    assert.strictEqual(rightArithShift(bignumber(-17), -3).isNaN(), true)
    assert.deepStrictEqual(rightArithShift(17, bignumber(3)), bignumber(2))
    assert.deepStrictEqual(rightArithShift(-17, bignumber(3)), bignumber(-3))
    assert.strictEqual(rightArithShift(-3, bignumber(-17)).isNaN(), true)
    assert.deepStrictEqual(rightArithShift(bignumber(-Infinity), Infinity), bignumber(-1))
    assert.strictEqual(rightArithShift(bignumber(Infinity), Infinity).isNaN(), true)
    assert.strictEqual(rightArithShift(Infinity, bignumber(Infinity)).isNaN(), true)
  })

  it('should right arithmetically shift mixed booleans and bignumbers', function () {
    assert.deepStrictEqual(rightArithShift(true, bignumber(0)), bignumber(1))
    assert.deepStrictEqual(rightArithShift(false, bignumber('1000000')), bignumber(0))
    assert.deepStrictEqual(rightArithShift(bignumber(3), false), bignumber(3))
    assert.deepStrictEqual(rightArithShift(bignumber(3), true), bignumber(1))
  })

  it('should throw an error if the parameters are not integers', function () {
    assert.throws(function () {
      rightArithShift(1.1, 1)
    }, /Integers expected in function rightArithShift/)
    assert.throws(function () {
      rightArithShift(1, 1.1)
    }, /Integers expected in function rightArithShift/)
    assert.throws(function () {
      rightArithShift(1.1, 1.1)
    }, /Integers expected in function rightArithShift/)
    assert.throws(function () {
      rightArithShift(bignumber(1.1), 1)
    }, /Integers expected in function rightArithShift/)
    assert.throws(function () {
      rightArithShift(1, bignumber(1.1))
    }, /Integers expected in function rightArithShift/)
    assert.throws(function () {
      rightArithShift(bignumber(1.1), bignumber(1))
    }, /Integers expected in function rightArithShift/)
    assert.throws(function () {
      rightArithShift(bignumber(1), bignumber(1.1))
    }, /Integers expected in function rightArithShift/)
  })

  it('should throw an error if used with a unit', function () {
    assert.throws(function () { rightArithShift(math.unit('5cm'), 2) }, /TypeError: Unexpected type of argument/)
    assert.throws(function () { rightArithShift(2, math.unit('5cm')) }, /TypeError: Unexpected type of argument/)
    assert.throws(function () { rightArithShift(math.unit('2cm'), math.unit('5cm')) }, /TypeError: Unexpected type of argument/)
  })

  describe('Array', function () {
    it('should right arithmetically shift array - scalar', function () {
      assert.deepStrictEqual(rightArithShift([[1, 2], [8, 0]], 2), [[0, 0], [2, 0]])
      assert.deepStrictEqual(rightArithShift(2, [[1, 2], [8, 0]]), [[1, 0], [0, 2]])
    })

    it('should right arithmetically shift array - array', function () {
      assert.deepStrictEqual(rightArithShift([[1, 2], [8, 0]], [[4, 8], [32, 0]]), [[0, 0], [8, 0]])
      assert.deepStrictEqual(rightArithShift([[4, 8], [32, 0]], [[1, 2], [8, 0]]), [[2, 2], [0, 0]])
    })

    it('should right arithmetically shift between broadcastable arrays', function () {
      assert.deepStrictEqual(rightArithShift([[1, 2]], [[4], [32]]), [[0, 0], [1, 2]])
      assert.deepStrictEqual(rightArithShift([[4], [32]], [[1, 2]]), [[2, 1], [16, 8]])
    })

    it('should right arithmetically shift array - dense matrix', function () {
      assert.deepStrictEqual(rightArithShift([[1, 2], [8, 0]], matrix([[4, 8], [32, 0]])), matrix([[0, 0], [8, 0]]))
      assert.deepStrictEqual(rightArithShift([[4, 8], [32, 0]], matrix([[1, 2], [8, 0]])), matrix([[2, 2], [0, 0]]))
    })

    it('should right arithmetically shift array - sparse matrix', function () {
      assert.deepStrictEqual(rightArithShift([[1, 2], [8, 0]], sparse([[4, 8], [32, 0]])), matrix([[0, 0], [8, 0]]))
      assert.deepStrictEqual(rightArithShift([[4, 8], [32, 0]], sparse([[1, 2], [8, 0]])), matrix([[2, 2], [0, 0]]))
    })
  })

  describe('DenseMatrix', function () {
    it('should right arithmetically shift dense matrix - scalar', function () {
      assert.deepStrictEqual(rightArithShift(matrix([[1, 2], [8, 0]]), 2), matrix([[0, 0], [2, 0]]))
      assert.deepStrictEqual(rightArithShift(2, matrix([[1, 2], [8, 0]])), matrix([[1, 0], [0, 2]]))
    })

    it('should right arithmetically shift dense matrix - array', function () {
      assert.deepStrictEqual(rightArithShift(matrix([[1, 2], [8, 0]]), [[4, 8], [32, 0]]), matrix([[0, 0], [8, 0]]))
      assert.deepStrictEqual(rightArithShift(matrix([[4, 8], [32, 0]]), [[1, 2], [8, 0]]), matrix([[2, 2], [0, 0]]))
    })

    it('should right arithmetically shift dense matrix - dense matrix', function () {
      assert.deepStrictEqual(rightArithShift(matrix([[1, 2], [8, 0]]), matrix([[4, 8], [32, 0]])), matrix([[0, 0], [8, 0]]))
      assert.deepStrictEqual(rightArithShift(matrix([[4, 8], [32, 0]]), matrix([[1, 2], [8, 0]])), matrix([[2, 2], [0, 0]]))
    })

    it('should right arithmetically shift dense matrix - sparse matrix', function () {
      assert.deepStrictEqual(rightArithShift(matrix([[1, 2], [8, 0]]), sparse([[4, 8], [32, 0]])), matrix([[0, 0], [8, 0]]))
      assert.deepStrictEqual(rightArithShift(matrix([[4, 8], [32, 0]]), sparse([[1, 2], [8, 0]])), matrix([[2, 2], [0, 0]]))
    })
  })

  describe('SparseMatrix', function () {
    it('should right arithmetically shift sparse matrix - scalar', function () {
      assert.deepStrictEqual(rightArithShift(sparse([[1, 2], [8, 0]]), 2), sparse([[0, 0], [2, 0]]))
      assert.deepStrictEqual(rightArithShift(2, sparse([[1, 2], [8, 0]])), matrix([[1, 0], [0, 2]]))
    })

    it('should right arithmetically shift sparse matrix - array', function () {
      assert.deepStrictEqual(rightArithShift(sparse([[1, 2], [8, 0]]), [[4, 8], [32, 0]]), sparse([[0, 0], [8, 0]]))
      assert.deepStrictEqual(rightArithShift(sparse([[4, 8], [32, 0]]), [[1, 2], [8, 0]]), sparse([[2, 2], [0, 0]]))
    })

    it('should right arithmetically shift sparse matrix - dense matrix', function () {
      assert.deepStrictEqual(rightArithShift(sparse([[1, 2], [8, 0]]), matrix([[4, 8], [32, 0]])), sparse([[0, 0], [8, 0]]))
      assert.deepStrictEqual(rightArithShift(sparse([[4, 8], [32, 0]]), matrix([[1, 2], [8, 0]])), sparse([[2, 2], [0, 0]]))
    })

    it('should right arithmetically shift sparse matrix - sparse matrix', function () {
      assert.deepStrictEqual(rightArithShift(sparse([[1, 2], [8, 0]]), sparse([[4, 8], [32, 0]])), sparse([[0, 0], [8, 0]]))
      assert.deepStrictEqual(rightArithShift(sparse([[4, 8], [32, 0]]), sparse([[1, 2], [8, 0]])), sparse([[2, 2], [0, 0]]))
    })
  })

  it('should throw an error if used with wrong number of arguments', function () {
    assert.throws(function () { rightArithShift(1) }, /TypeError: Too few arguments/)
    assert.throws(function () { rightArithShift(1, 2, 3) }, /TypeError: Too many arguments/)
  })

  it('should throw an error in case of invalid type of arguments', function () {
    assert.throws(function () { rightArithShift(new Date(), true) }, /TypeError: Unexpected type of argument/)
    assert.throws(function () { rightArithShift(2, null) }, /TypeError: Unexpected type of argument/)
    assert.throws(function () { rightArithShift(true, new Date()) }, /TypeError: Unexpected type of argument/)
    assert.throws(function () { rightArithShift(true, undefined) }, /TypeError: Unexpected type of argument/)
    assert.throws(function () { rightArithShift(undefined, true) }, /TypeError: Unexpected type of argument/)
  })

  it('should LaTeX rightArithShift', function () {
    const expression = math.parse('rightArithShift(3,2)')
    assert.strictEqual(expression.toTex(), '\\left(3>>2\\right)')
  })
})
