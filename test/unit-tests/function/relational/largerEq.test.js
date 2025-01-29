// test largerEq
import assert from 'assert'

import math from '../../../../src/defaultInstance.js'
const bignumber = math.bignumber
const complex = math.complex
const matrix = math.matrix
const sparse = math.sparse
const unit = math.unit
const largerEq = math.largerEq

describe('largerEq', function () {
  it('should compare two numbers correctly', function () {
    assert.strictEqual(largerEq(2, 3), false)
    assert.strictEqual(largerEq(2, 2), true)
    assert.strictEqual(largerEq(2, 1), true)
    assert.strictEqual(largerEq(0, 0), true)
    assert.strictEqual(largerEq(-2, 2), false)
    assert.strictEqual(largerEq(-2, -3), true)
    assert.strictEqual(largerEq(-3, -2), false)
  })

  it('should compare two bigints correctly', function () {
    assert.strictEqual(largerEq(2n, 3n), false)
    assert.strictEqual(largerEq(2n, 2n), true)
    assert.strictEqual(largerEq(2n, 1n), true)
    assert.strictEqual(largerEq(0n, 0n), true)
    assert.strictEqual(largerEq(-2n, 2n), false)
    assert.strictEqual(largerEq(-2n, -3n), true)
    assert.strictEqual(largerEq(-3n, -2n), false)
  })

  it('should compare two floating point numbers correctly', function () {
    // Infinity
    assert.strictEqual(largerEq(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY), true)
    assert.strictEqual(largerEq(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY), true)
    assert.strictEqual(largerEq(Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY), true)
    assert.strictEqual(largerEq(Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY), false)
    assert.strictEqual(largerEq(Number.POSITIVE_INFINITY, 2.0), true)
    assert.strictEqual(largerEq(2.0, Number.POSITIVE_INFINITY), false)
    assert.strictEqual(largerEq(Number.NEGATIVE_INFINITY, 2.0), false)
    assert.strictEqual(largerEq(2.0, Number.NEGATIVE_INFINITY), true)
    // floating point numbers
    assert.strictEqual(largerEq(0.3 - 0.2, 0.1), true)
  })

  it('should compare two booleans', function () {
    assert.strictEqual(largerEq(true, true), true)
    assert.strictEqual(largerEq(true, false), true)
    assert.strictEqual(largerEq(false, true), false)
    assert.strictEqual(largerEq(false, false), true)
  })

  it('should compare mixed numbers and booleans', function () {
    assert.strictEqual(largerEq(2, true), true)
    assert.strictEqual(largerEq(0, true), false)
    assert.strictEqual(largerEq(true, 2), false)
    assert.strictEqual(largerEq(true, 1), true)
    assert.strictEqual(largerEq(false, 0), true)
  })

  it('should compare bignumbers', function () {
    assert.strictEqual(largerEq(bignumber(2), bignumber(3)), false)
    assert.strictEqual(largerEq(bignumber(2), bignumber(2)), true)
    assert.strictEqual(largerEq(bignumber(3), bignumber(2)), true)
    assert.strictEqual(largerEq(bignumber(0), bignumber(0)), true)
    assert.strictEqual(largerEq(bignumber(-2), bignumber(2)), false)
  })

  it('should compare mixed numbers and bignumbers', function () {
    assert.strictEqual(largerEq(bignumber(2), 3), false)
    assert.strictEqual(largerEq(2, bignumber(2)), true)

    assert.throws(function () { largerEq(1 / 3, bignumber(1).div(3)) }, /TypeError: Cannot implicitly convert a number with >15 significant digits to BigNumber/)
    assert.throws(function () { largerEq(bignumber(1).div(3), 1 / 3) }, /TypeError: Cannot implicitly convert a number with >15 significant digits to BigNumber/)
  })

  it('should compare mixed numbers and bigints', function () {
    assert.strictEqual(largerEq(2n, 3), false)
    assert.strictEqual(largerEq(2, 2n), true)

    assert.throws(function () { largerEq(123123123123123123123n, 1) }, /Cannot implicitly convert bigint to number: value exceeds the max safe integer value/)
    assert.throws(function () { largerEq(1, 123123123123123123123n) }, /Cannot implicitly convert bigint to number: value exceeds the max safe integer value/)
  })

  it('should compare mixed booleans and bignumbers', function () {
    assert.strictEqual(largerEq(bignumber(0.1), true), false)
    assert.strictEqual(largerEq(bignumber(1), true), true)
    assert.strictEqual(largerEq(bignumber(1), false), true)
    assert.strictEqual(largerEq(false, bignumber(0)), true)
    assert.strictEqual(largerEq(true, bignumber(0)), true)
    assert.strictEqual(largerEq(true, bignumber(1)), true)
  })

  it('should compare two fractions', function () {
    assert.strictEqual(largerEq(math.fraction(3), math.fraction(2)).valueOf(), true)
    assert.strictEqual(largerEq(math.fraction(2), math.fraction(3)).valueOf(), false)
    assert.strictEqual(largerEq(math.fraction(3), math.fraction(3)).valueOf(), true)
  })

  it('should compare mixed fractions and numbers', function () {
    assert.strictEqual(largerEq(1, math.fraction(1, 3)), true)
    assert.strictEqual(largerEq(math.fraction(2), 2), true)
  })

  it('should compare mixed fractions and bigints', function () {
    assert.strictEqual(largerEq(1n, math.fraction(1, 3)), true)
    assert.strictEqual(largerEq(math.fraction(2), 2n), true)
  })

  it('should compare two units correctly', function () {
    assert.strictEqual(largerEq(unit('100cm'), unit('10inch')), true)
    assert.strictEqual(largerEq(unit('99cm'), unit('1m')), false)
    // assert.strictEqual(largerEq(unit('100cm'), unit('1m')), true); // dangerous, round-off errors
    assert.strictEqual(largerEq(unit('101cm'), unit('1m')), true)
  })

  it('should apply configuration option relTol', function () {
    const mymath = math.create()
    assert.strictEqual(mymath.largerEq(1, 1.01), false)
    assert.strictEqual(mymath.largerEq(mymath.bignumber(1), mymath.bignumber(1.01)), false)

    mymath.config({ relTol: 1e-2 })
    assert.strictEqual(mymath.largerEq(1, 1.01), true)
    assert.strictEqual(mymath.largerEq(mymath.bignumber(1), mymath.bignumber(1.01)), true)
  })

  it('should throw an error if comparing a unit with a number', function () {
    assert.throws(function () { largerEq(unit('100cm'), 22) })
  })

  it('should throw an error for two measures of different units', function () {
    assert.throws(function () { largerEq(math.unit(5, 'km'), math.unit(100, 'gram')) })
  })

  it('should throw an error if comparing a unit with a bignumber', function () {
    assert.throws(function () { largerEq(unit('100cm'), bignumber(22)) })
  })

  it('should compare two strings by their numerical value', function () {
    assert.strictEqual(largerEq('0', 0), true)
    assert.strictEqual(largerEq('10', '2'), true)
    assert.strictEqual(largerEq('1e3', '1000'), true)

    assert.throws(function () { largerEq('A', 'B') }, /Cannot convert "A" to a number/)
  })

  describe('Array', function () {
    it('should compare array - scalar', function () {
      assert.deepStrictEqual(largerEq(2, [1, 2, 3]), [true, true, false])
      assert.deepStrictEqual(largerEq([1, 2, 3], 2), [false, true, true])
    })

    it('should compare array - array', function () {
      assert.deepStrictEqual(largerEq([[1, 2, 0], [-1, 0, 2]], [[1, -1, 0], [-1, 1, 0]]), [[true, true, true], [true, false, true]])
    })

    it('should compare broadcastable arrays', function () {
      assert.deepStrictEqual(largerEq([1, 2, 0], [[1], [-1]]), [[true, true, false], [true, true, true]])
    })

    it('should compare array - dense matrix', function () {
      assert.deepStrictEqual(largerEq([[1, 2, 0], [-1, 0, 2]], matrix([[1, -1, 0], [-1, 1, 0]])), matrix([[true, true, true], [true, false, true]]))
    })

    it('should compare array - sparse matrix', function () {
      assert.deepStrictEqual(largerEq([[1, 2, 0], [-1, 0, 2]], sparse([[1, -1, 0], [-1, 1, 0]])), matrix([[true, true, true], [true, false, true]]))
    })

    it('should throw an error if arrays have different sizes', function () {
      assert.throws(function () { largerEq([1, 4, 5], [3, 4]) })
    })
  })

  describe('DenseMatrix', function () {
    it('should compare dense matrix - scalar', function () {
      assert.deepStrictEqual(largerEq(2, matrix([1, 2, 3])), matrix([true, true, false]))
      assert.deepStrictEqual(largerEq(matrix([1, 2, 3]), 2), matrix([false, true, true]))
    })

    it('should compare dense matrix - array', function () {
      assert.deepStrictEqual(largerEq(matrix([[1, 2, 0], [-1, 0, 2]]), [[1, -1, 0], [-1, 1, 0]]), matrix([[true, true, true], [true, false, true]]))
    })

    it('should compare dense matrix - dense matrix', function () {
      assert.deepStrictEqual(largerEq(matrix([[1, 2, 0], [-1, 0, 2]]), matrix([[1, -1, 0], [-1, 1, 0]])), matrix([[true, true, true], [true, false, true]]))
    })

    it('should compare dense matrix - sparse matrix', function () {
      assert.deepStrictEqual(largerEq(matrix([[1, 2, 0], [-1, 0, 2]]), sparse([[1, -1, 0], [-1, 1, 0]])), matrix([[true, true, true], [true, false, true]]))
    })
  })

  describe('SparseMatrix', function () {
    it('should compare sparse matrix - scalar', function () {
      assert.deepStrictEqual(largerEq(2, sparse([[1, 2], [3, 4]])), matrix([[true, true], [false, false]]))
      assert.deepStrictEqual(largerEq(sparse([[1, 2], [3, 4]]), 2), matrix([[false, true], [true, true]]))
    })

    it('should compare sparse matrix - array', function () {
      assert.deepStrictEqual(largerEq(sparse([[1, 2, 0], [-1, 0, 2]]), [[1, -1, 0], [-1, 1, 0]]), matrix([[true, true, true], [true, false, true]]))
    })

    it('should compare sparse matrix - dense matrix', function () {
      assert.deepStrictEqual(largerEq(sparse([[1, 2, 0], [-1, 0, 2]]), matrix([[1, -1, 0], [-1, 1, 0]])), matrix([[true, true, true], [true, false, true]]))
    })

    it('should compare sparse matrix - sparse matrix', function () {
      assert.deepStrictEqual(largerEq(sparse([[1, 2, 0], [-1, 0, 2]]), sparse([[1, -1, 0], [-1, 1, 0]])), sparse([[true, true, true], [true, false, true]]))
    })
  })

  it('should throw an error when comparing complex numbers', function () {
    assert.throws(function () { largerEq(complex(1, 1), complex(1, 2)) }, TypeError)
    assert.throws(function () { largerEq(complex(2, 1), 3) }, TypeError)
    assert.throws(function () { largerEq(3, complex(2, 4)) }, TypeError)
    assert.throws(function () { largerEq(math.bignumber(3), complex(2, 4)) }, TypeError)
    assert.throws(function () { largerEq(complex(2, 4), math.bignumber(3)) }, TypeError)
  })

  it('should throw an error if comparing two matrices of different sizes', function () {
    assert.throws(function () { largerEq([1, 4, 6], [3, 4]) })
  })

  it('should throw an error in case of invalid number of arguments', function () {
    assert.throws(function () { largerEq(1) }, /TypeError: Too few arguments/)
    assert.throws(function () { largerEq(1, 2, 3) }, /TypeError: Too many arguments/)
  })

  it('should throw an error in case of invalid type of arguments', function () {
    assert.throws(function () { largerEq(2, null) }, /TypeError: Unexpected type of argument/)
  })

  it('should LaTeX largerEq', function () {
    const expression = math.parse('largerEq(1,2)')
    assert.strictEqual(expression.toTex(), '\\left(1\\geq2\\right)')
  })
})
