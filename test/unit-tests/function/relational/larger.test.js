// test larger
import assert from 'assert'

import math from '../../../../src/defaultInstance.js'
const bignumber = math.bignumber
const complex = math.complex
const fraction = math.fraction
const matrix = math.matrix
const sparse = math.sparse
const unit = math.unit
const larger = math.larger

describe('larger', function () {
  it('should compare two numbers correctly', function () {
    assert.strictEqual(larger(2, 3), false)
    assert.strictEqual(larger(2, 2), false)
    assert.strictEqual(larger(2, 1), true)
    assert.strictEqual(larger(0, 0), false)
    assert.strictEqual(larger(-2, 2), false)
    assert.strictEqual(larger(-2, -3), true)
    assert.strictEqual(larger(-3, -2), false)
  })

  it('should compare two bigints correctly', function () {
    assert.strictEqual(larger(2n, 3n), false)
    assert.strictEqual(larger(2n, 2n), false)
    assert.strictEqual(larger(2n, 1n), true)
    assert.strictEqual(larger(0n, 0n), false)
    assert.strictEqual(larger(-2n, 2n), false)
    assert.strictEqual(larger(-2n, -3n), true)
    assert.strictEqual(larger(-3n, -2n), false)
  })

  it('should compare two floating point numbers correctly', function () {
    // Infinity
    assert.strictEqual(larger(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY), false)
    assert.strictEqual(larger(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY), false)
    assert.strictEqual(larger(Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY), true)
    assert.strictEqual(larger(Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY), false)
    assert.strictEqual(larger(Number.POSITIVE_INFINITY, 2.0), true)
    assert.strictEqual(larger(2.0, Number.POSITIVE_INFINITY), false)
    assert.strictEqual(larger(Number.NEGATIVE_INFINITY, 2.0), false)
    assert.strictEqual(larger(2.0, Number.NEGATIVE_INFINITY), true)
    // floating point numbers
    assert.strictEqual(larger(0.3 - 0.2, 0.1), false)
  })

  it('should compare two booleans', function () {
    assert.strictEqual(larger(true, true), false)
    assert.strictEqual(larger(true, false), true)
    assert.strictEqual(larger(false, true), false)
    assert.strictEqual(larger(false, false), false)
  })

  it('should compare mixed numbers and booleans', function () {
    assert.strictEqual(larger(2, true), true)
    assert.strictEqual(larger(0, true), false)
    assert.strictEqual(larger(true, 2), false)
    assert.strictEqual(larger(false, 2), false)
  })

  it('should compare bignumbers', function () {
    assert.strictEqual(larger(bignumber(2), bignumber(3)), false)
    assert.strictEqual(larger(bignumber(2), bignumber(2)), false)
    assert.strictEqual(larger(bignumber(3), bignumber(2)), true)
    assert.strictEqual(larger(bignumber(0), bignumber(0)), false)
    assert.strictEqual(larger(bignumber(-2), bignumber(2)), false)
  })

  it('should compare mixed numbers and bignumbers', function () {
    assert.strictEqual(larger(bignumber(2), 3), false)
    assert.strictEqual(larger(2, bignumber(2)), false)

    assert.throws(function () { larger(1 / 3, bignumber(1).div(3)) }, /Cannot implicitly convert a number with >15 significant digits to BigNumber/)
    assert.throws(function () { larger(bignumber(1).div(3), 1 / 3) }, /Cannot implicitly convert a number with >15 significant digits to BigNumber/)
  })

  it('should compare mixed numbers and bigints', function () {
    assert.strictEqual(larger(2n, 3), false)
    assert.strictEqual(larger(2, 2n), false)

    assert.throws(function () { larger(1 / 3, bignumber(1).div(3)) }, /Cannot implicitly convert a number with >15 significant digits to BigNumber/)
    assert.throws(function () { larger(bignumber(1).div(3), 1 / 3) }, /Cannot implicitly convert a number with >15 significant digits to BigNumber/)

    assert.throws(function () { larger(123123123123123123123n, 1) }, /Cannot implicitly convert bigint to number: value exceeds the max safe integer value/)
    assert.throws(function () { larger(1, 123123123123123123123n) }, /Cannot implicitly convert bigint to number: value exceeds the max safe integer value/)
  })

  it('should compare mixed booleans and bignumbers', function () {
    assert.strictEqual(larger(bignumber(0.1), true), false)
    assert.strictEqual(larger(bignumber(1), true), false)
    assert.strictEqual(larger(bignumber(1), false), true)
    assert.strictEqual(larger(false, bignumber(0)), false)
    assert.strictEqual(larger(true, bignumber(0)), true)
  })

  it('should compare two fractions', function () {
    assert.strictEqual(larger(fraction(3), fraction(2)).valueOf(), true)
    assert.strictEqual(larger(fraction(2), fraction(3)).valueOf(), false)
    assert.strictEqual(larger(fraction(3), fraction(3)).valueOf(), false)
  })

  it('should compare mixed fractions and numbers', function () {
    assert.strictEqual(larger(1, fraction(1, 3)), true)
    assert.strictEqual(larger(fraction(2), 2), false)
  })

  it('should compare mixed fractions and bigints', function () {
    assert.strictEqual(larger(1n, fraction(1, 3)), true)
    assert.strictEqual(larger(fraction(2), 2n), false)
  })

  it('should compare mixed fractions and bignumbers', function () {
    assert.strictEqual(larger(bignumber(1), fraction(1, 3)), true)
    assert.strictEqual(larger(fraction(2), bignumber(2)), false)
  })

  it('should add two measures of the same unit', function () {
    assert.strictEqual(larger(unit('100cm'), unit('10inch')), true)
    assert.strictEqual(larger(unit('99cm'), unit('1m')), false)
    // assert.strictEqual(larger(unit('100cm'), unit('1m')), false); // dangerous, round-off errors
    assert.strictEqual(larger(unit('101cm'), unit('1m')), true)
  })

  it('should apply configuration option relTol', function () {
    const mymath = math.create()
    assert.strictEqual(mymath.larger(1, 0.991), true)
    assert.strictEqual(mymath.larger(mymath.bignumber(1), mymath.bignumber(0.991)), true)

    mymath.config({ relTol: 1e-2 })
    assert.strictEqual(mymath.larger(1, 0.991), false)
    assert.strictEqual(mymath.larger(mymath.bignumber(1), mymath.bignumber(0.991)), false)
  })

  it('should throw an error if comparing a unit with a number', function () {
    assert.throws(function () { larger(unit('100cm'), 22) })
  })

  it('should throw an error for two measures of different units', function () {
    assert.throws(function () { larger(math.unit(5, 'km'), math.unit(100, 'gram')) })
  })

  it('should throw an error if comparing a unit with a bignumber', function () {
    assert.throws(function () { larger(unit('100cm'), bignumber(22)) })
  })

  it('should compare two strings by their numerical value', function () {
    assert.strictEqual(larger('0', 0), false)
    assert.strictEqual(larger('10', '2'), true)

    assert.throws(function () { larger('A', 'B') }, /Cannot convert "A" to a number/)
  })

  it('should result in false when comparing a something with NaN', function () {
    // Number
    assert.strictEqual(larger(NaN, 3), false)
    assert.strictEqual(larger(3, NaN), false)
    assert.strictEqual(larger(NaN, NaN), false)

    // BigNumber
    assert.strictEqual(larger(NaN, bignumber(3)), false)
    assert.strictEqual(larger(bignumber(3), NaN), false)
    assert.strictEqual(larger(3, bignumber(NaN)), false)
    assert.strictEqual(larger(bignumber(NaN), 3), false)
    assert.strictEqual(larger(bignumber(NaN), bignumber(3)), false)
    assert.strictEqual(larger(bignumber(3), bignumber(NaN)), false)

    // Fraction
    assert.strictEqual(larger(NaN, fraction(3)), false)
    assert.strictEqual(larger(fraction(3), NaN), false)
    assert.strictEqual(larger(fraction(3), bignumber(NaN)), false)
    assert.strictEqual(larger(bignumber(NaN), fraction(3)), false)
    // A fraction itself will throw an error when it's NaN

    // Unit
    assert.strictEqual(larger(unit('3', 's'), unit(NaN, 's')), false)
    assert.strictEqual(larger(unit(NaN, 's'), unit('3', 's')), false)
    assert.strictEqual(larger(unit(NaN, 's'), unit(NaN, 's')), false)
  })

  describe('Array', function () {
    it('should compare array - scalar', function () {
      assert.deepStrictEqual(larger(2, [1, 2, 3]), [true, false, false])
      assert.deepStrictEqual(larger([1, 2, 3], 2), [false, false, true])
    })

    it('should compare array - array', function () {
      assert.deepStrictEqual(larger([[1, 2, 0], [-1, 0, 2]], [[1, -1, 0], [-1, 1, 0]]), [[false, true, false], [false, false, true]])
    })

    it('should compare broadcastable arrays', function () {
      assert.deepStrictEqual(larger([[1, 2, 0]], [[1], [-1]]), [[false, true, false], [true, true, true]])
    })

    it('should compare array - dense matrix', function () {
      assert.deepStrictEqual(larger([[1, 2, 0], [-1, 0, 2]], matrix([[1, -1, 0], [-1, 1, 0]])), matrix([[false, true, false], [false, false, true]]))
    })

    it('should compare array - sparse matrix', function () {
      assert.deepStrictEqual(larger([[1, 2, 0], [-1, 0, 2]], sparse([[1, -1, 0], [-1, 1, 0]])), matrix([[false, true, false], [false, false, true]]))
    })

    it('should throw an error if arrays have different sizes', function () {
      assert.throws(function () { larger([1, 4, 5], [3, 4]) })
    })
  })

  describe('DenseMatrix', function () {
    it('should compare dense matrix - scalar', function () {
      assert.deepStrictEqual(larger(2, matrix([1, 2, 3])), matrix([true, false, false]))
      assert.deepStrictEqual(larger(matrix([1, 2, 3]), 2), matrix([false, false, true]))
    })

    it('should compare dense matrix - array', function () {
      assert.deepStrictEqual(larger(matrix([[1, 2, 0], [-1, 0, 2]]), [[1, -1, 0], [-1, 1, 0]]), matrix([[false, true, false], [false, false, true]]))
    })

    it('should compare dense matrix - dense matrix', function () {
      assert.deepStrictEqual(larger(matrix([[1, 2, 0], [-1, 0, 2]]), matrix([[1, -1, 0], [-1, 1, 0]])), matrix([[false, true, false], [false, false, true]]))
    })

    it('should compare dense matrix - sparse matrix', function () {
      assert.deepStrictEqual(larger(matrix([[1, 2, 0], [-1, 0, 2]]), sparse([[1, -1, 0], [-1, 1, 0]])), matrix([[false, true, false], [false, false, true]]))
    })
  })

  describe('SparseMatrix', function () {
    it('should compare sparse matrix - scalar', function () {
      assert.deepStrictEqual(larger(2, sparse([[1, 2], [3, 4]])), matrix([[true, false], [false, false]]))
      assert.deepStrictEqual(larger(sparse([[1, 2], [3, 4]]), 2), matrix([[false, false], [true, true]]))
    })

    it('should compare sparse matrix - array', function () {
      assert.deepStrictEqual(larger(sparse([[1, 2, 0], [-1, 0, 2]]), [[1, -1, 0], [-1, 1, 0]]), matrix([[false, true, false], [false, false, true]]))
    })

    it('should compare sparse matrix - dense matrix', function () {
      assert.deepStrictEqual(larger(sparse([[1, 2, 0], [-1, 0, 2]]), matrix([[1, -1, 0], [-1, 1, 0]])), matrix([[false, true, false], [false, false, true]]))
    })

    it('should compare sparse matrix - sparse matrix', function () {
      assert.deepStrictEqual(larger(sparse([[1, 2, 0], [-1, 0, 2]]), sparse([[1, -1, 0], [-1, 1, 0]])), sparse([[false, true, false], [false, false, true]]))
    })
  })

  it('should throw an error when comparing complex numbers', function () {
    assert.throws(function () { larger(complex(1, 1), complex(1, 2)) }, TypeError)
    assert.throws(function () { larger(complex(2, 1), 3) }, TypeError)
    assert.throws(function () { larger(3, complex(2, 4)) }, TypeError)
    assert.throws(function () { larger(math.bignumber(3), complex(2, 4)) }, TypeError)
    assert.throws(function () { larger(complex(2, 4), math.bignumber(3)) }, TypeError)
  })

  it('should throw an error if matrices are different sizes', function () {
    assert.throws(function () { larger([1, 4, 6], [3, 4]) })
  })

  it('should throw an error in case of invalid number of arguments', function () {
    assert.throws(function () { larger(1) }, /Too few arguments/)
    assert.throws(function () { larger(1, 2, 3) }, /Too many arguments/)
  })

  it('should throw an error in case of invalid type of arguments', function () {
    assert.throws(function () { larger(2, null) }, /TypeError: Unexpected type of argument/)
  })

  it('should LaTeX larger', function () {
    const expression = math.parse('larger(1,2)')
    assert.strictEqual(expression.toTex(), '\\left(1>2\\right)')
  })
})
