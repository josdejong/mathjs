// test mod
import assert from 'assert'

import { approxEqual, approxDeepEqual } from '../../../../tools/approx.js'
import math from '../../../../src/defaultInstance.js'
const bignumber = math.bignumber
const matrix = math.matrix
const sparse = math.sparse
const mod = math.mod

describe('mod', function () {
  it('should calculate the modulus of booleans correctly', function () {
    assert.strictEqual(mod(true, true), 0)
    assert.strictEqual(mod(false, true), 0)
    assert.strictEqual(mod(true, false), 1)
    assert.strictEqual(mod(false, false), 0)
  })

  it('should calculate the modulus of two numbers', function () {
    assert.strictEqual(mod(1, 1), 0)
    assert.strictEqual(mod(0, 1), 0)
    assert.strictEqual(mod(1, 0), 1)
    assert.strictEqual(mod(0, 0), 0)
    assert.strictEqual(mod(7, 0), 7)

    approxEqual(mod(7, 2), 1)
    approxEqual(mod(9, 3), 0)
    approxEqual(mod(10, 4), 2)
    approxEqual(mod(-10, 4), 2)
    approxEqual(mod(8.2, 3), 2.2)
    approxEqual(mod(4, 1.5), 1)
    approxEqual(mod(0, 3), 0)
    approxEqual(mod(-10, 4), 2)
    approxEqual(mod(-5, 3), 1)
    approxEqual(mod(-7, 6), 5)
    approxEqual(mod(-8, 4), 0)
  })

  it('should calculate the modulus of two bigints', function () {
    assert.strictEqual(mod(1n, 1n), 0n)
    assert.strictEqual(mod(0n, 1n), 0n)
    assert.strictEqual(mod(1n, 0n), 1n)
    assert.strictEqual(mod(0n, 0n), 0n)
    assert.strictEqual(mod(7n, 0n), 7n)
    assert.strictEqual(mod(-10, 4), 2)
    assert.strictEqual(mod(-5n, 3n), 1n)
    assert.strictEqual(mod(-7n, 6n), 5n)
    assert.strictEqual(mod(-8n, 4n), 0n)
  })

  it('should handle precise approximation of float approximation', function () {
    approxEqual(mod(0.1, 0.01), 0)
    approxEqual(mod(0.15, 0.05), 0)
    approxEqual(mod(1.23456789, 0.00000000001), 0)
  })

  it('should calculate mod for negative divisor', function () {
    assert.strictEqual(mod(10, -4), -2)
  })

  it('should throw an error if used with wrong number of arguments', function () {
    assert.throws(function () { mod(1) }, /TypeError: Too few arguments/)
    assert.throws(function () { mod(1, 2, 3) }, /TypeError: Too many arguments/)
  })

  it('should throw an error if used with wrong type of arguments', function () {
    assert.throws(function () { mod(1, new Date()) }, /TypeError: Unexpected type of argument/)
    assert.throws(function () { mod(1, null) }, /TypeError: Unexpected type of argument/)
    assert.throws(function () { mod(new Date(), bignumber(2)) }, /TypeError: Unexpected type of argument/)
  })

  it('should calculate the modulus of bignumbers', function () {
    assert.deepStrictEqual(mod(bignumber(7), bignumber(2)), bignumber(1))
    assert.deepStrictEqual(mod(bignumber(7), bignumber(0)), bignumber(7))
    assert.deepStrictEqual(mod(bignumber(0), bignumber(3)), bignumber(0))
    assert.deepStrictEqual(mod(bignumber(7), bignumber(2)), bignumber(1))
    assert.deepStrictEqual(mod(bignumber(8), bignumber(3)).valueOf(), bignumber(2).valueOf())
  })

  // eslint-disable-next-line mocha/no-skipped-tests
  it.skip('should calculate the modulus of bignumbers for fractions', function () {
    assert.deepStrictEqual(mod(bignumber(7).div(3), bignumber(1).div(3)), bignumber(0))
  })

  it('should calculate the modulus of bignumbers for negative dividend', function () {
    assert.deepStrictEqual(mod(bignumber(-10), bignumber(4)), bignumber(2))
    assert.deepStrictEqual(mod(bignumber(-5), bignumber(3)), bignumber(1))
  })

  it('should calculate the modulus of bignumbers for a negative divisor', function () {
    assert.deepStrictEqual(mod(bignumber(10), bignumber(-4)), bignumber(-2))
  })

  it('should calculate the modulus of mixed numbers and bignumbers', function () {
    assert.deepStrictEqual(mod(bignumber(7), 2), bignumber(1))
    assert.deepStrictEqual(mod(bignumber(7), 0), bignumber(7))
    assert.deepStrictEqual(mod(8, bignumber(3)), bignumber(2))
    assert.deepStrictEqual(mod(7, bignumber(0)), bignumber(7))
    assert.deepStrictEqual(mod(bignumber(0), 3), bignumber(0))
    assert.deepStrictEqual(mod(bignumber(7), 0), bignumber(7))
    assert.deepStrictEqual(mod(bignumber(-5), 3), bignumber(1))
    assert.deepStrictEqual(mod(-5, bignumber(3)), bignumber(1))

    assert.throws(function () { mod(7 / 3, bignumber(2)) }, /TypeError: Cannot implicitly convert a number with >15 significant digits to BigNumber/)
    assert.throws(function () { mod(bignumber(7).div(3), 1 / 3) }, /TypeError: Cannot implicitly convert a number with >15 significant digits to BigNumber/)
  })

  it('should calculate the modulus of mixed booleans and bignumbers', function () {
    assert.deepStrictEqual(mod(bignumber(7), true), bignumber(0))
    assert.deepStrictEqual(mod(bignumber(7), false), bignumber(7))
    assert.deepStrictEqual(mod(true, bignumber(3)), bignumber(1))
    assert.deepStrictEqual(mod(false, bignumber(3)), bignumber(0))
  })

  it('should throw an error if used on complex numbers', function () {
    assert.throws(function () { mod(math.complex(1, 2), 3) }, TypeError)
    assert.throws(function () { mod(3, math.complex(1, 2)) }, TypeError)
    assert.throws(function () { mod(bignumber(3), math.complex(1, 2)) }, TypeError)
  })

  it('should convert string to number', function () {
    assert.strictEqual(mod('8', '3'), 2)
    assert.strictEqual(mod('8', 3), 2)
    assert.strictEqual(mod(8, '3'), 2)
    assert.throws(function () { mod(5, 'a') }, /Cannot convert "a" to a number/)
  })

  it('should calculate modulus of two fractions', function () {
    const b = math.fraction(8)
    const a = mod(b, math.fraction(3))
    assert.strictEqual(a.toString(), '2')
    assert.strictEqual(b.toString(), '8')
    assert(a instanceof math.Fraction)

    assert.strictEqual(mod(math.fraction(4.55), math.fraction(0.05)).toString(), '0')
  })

  it('should calculate the modulus of fractions for negative dividend', function () {
    assert.strictEqual(mod(math.fraction(-10), math.fraction(4)).toString(), '2')
    assert.strictEqual(mod(math.fraction(-5), math.fraction(3)).toString(), '1')
  })

  it('should calculate the modulus of fractions for a negative divisor', function () {
    assert.strictEqual(mod(math.fraction(10), math.fraction(-4)).toString(), '-2')
  })

  it('should calculate modulus of mixed fractions and numbers', function () {
    assert.deepStrictEqual(mod(8, math.fraction(3)), math.fraction(2))
    assert.deepStrictEqual(mod(math.fraction(8), 3), math.fraction(2))
  })

  describe('Array', function () {
    it('should perform element-wise modulus on array and scalar', function () {
      approxDeepEqual(mod([[-4, -3, 0, -1], [0, 1, 2, 3]], 3), [[2, 0, 0, 2], [0, 1, 2, 0]])
      approxDeepEqual(mod(3, [[4, 3], [2, 1]]), [[3, 0], [1, 0]])
    })

    it('should perform element-wise modulus on broadcastable arrays', function () {
      approxDeepEqual(mod([-40, -31], [[3], [1]]), [[2, 2], [0, 0]])
      approxDeepEqual(mod([[-40], [-31]], [3, 1]), [[2, 0], [2, 0]])
    })

    it('should perform element-wise modulus on array and array', function () {
      approxDeepEqual(mod([[-40, -31], [11, -23]], [[3, 7], [1, 3]]), [[2, 4], [0, 1]])
    })

    it('should perform element-wise modulus on array and dense matrix', function () {
      approxDeepEqual(mod([[-40, -31], [11, -23]], matrix([[3, 7], [1, 3]])), matrix([[2, 4], [0, 1]]))
    })

    it('should perform element-wise modulus on array and sparse matrix', function () {
      approxDeepEqual(mod([[-40, -31], [11, -23]], sparse([[3, 7], [1, 3]])), matrix([[2, 4], [0, 1]]))
    })
  })

  describe('DenseMatrix', function () {
    it('should perform element-wise modulus on dense matrix and scalar', function () {
      approxDeepEqual(mod(matrix([[-4, -3, 0, -1], [0, 1, 2, 3]]), 3), matrix([[2, 0, 0, 2], [0, 1, 2, 0]]))
      approxDeepEqual(mod(3, matrix([[4, 3], [2, 1]])), matrix([[3, 0], [1, 0]]))
    })

    it('should perform element-wise modulus on dense matrix and array', function () {
      approxDeepEqual(mod(matrix([[-40, -31], [11, -23]]), [[3, 7], [1, 3]]), matrix([[2, 4], [0, 1]]))
    })

    it('should perform element-wise modulus on dense matrix and dense matrix', function () {
      approxDeepEqual(mod(matrix([[-40, -31], [11, -23]]), matrix([[3, 7], [1, 3]])), matrix([[2, 4], [0, 1]]))
    })

    it('should perform element-wise modulus on dense matrix and sparse matrix', function () {
      approxDeepEqual(mod(matrix([[-40, -31], [11, -23]]), sparse([[3, 7], [1, 3]])), matrix([[2, 4], [0, 1]]))
    })
  })

  describe('SparseMatrix', function () {
    it('should perform element-wise modulus on sparse matrix and scalar', function () {
      approxDeepEqual(mod(sparse([[-4, -3, 0, -1], [0, 1, 2, 3]]), 3), sparse([[2, 0, 0, 2], [0, 1, 2, 0]]))
      approxDeepEqual(mod(3, sparse([[4, 3], [2, 1]])), matrix([[3, 0], [1, 0]]))
    })

    it('should perform element-wise modulus on sparse matrix and array', function () {
      approxDeepEqual(mod(sparse([[-40, -31], [11, -23]]), [[3, 7], [1, 3]]), sparse([[2, 4], [0, 1]]))
    })

    it('should perform element-wise modulus on sparse matrix and dense matrix', function () {
      approxDeepEqual(mod(sparse([[-40, -31], [11, -23]]), matrix([[3, 7], [1, 3]])), sparse([[2, 4], [0, 1]]))
    })

    it('should perform element-wise modulus on sparse matrix and sparse matrix', function () {
      approxDeepEqual(mod(sparse([[-40, -31], [11, -23]]), sparse([[3, 7], [1, 3]])), sparse([[2, 4], [0, 1]]))
    })
  })

  it('should LaTeX mod', function () {
    const expression = math.parse('mod(11,2)')
    assert.strictEqual(expression.toTex(), '\\left(11\\mod2\\right)')
  })
})
