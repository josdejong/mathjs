// test equal
import assert from 'assert'

import math from '../../../../src/defaultInstance.js'
const bignumber = math.bignumber
const complex = math.complex
const matrix = math.matrix
const sparse = math.sparse
const unit = math.unit
const equal = math.equal

describe('equal', function () {
  it('should compare two numbers correctly', function () {
    assert.strictEqual(equal(2, 3), false)
    assert.strictEqual(equal(2, 2), true)
    assert.strictEqual(equal(0, 0), true)
    assert.strictEqual(equal(-2, 2), false)
  })

  it('should compare two bigints correctly', function () {
    assert.strictEqual(equal(2n, 3n), false)
    assert.strictEqual(equal(2n, 2n), true)
    assert.strictEqual(equal(0n, 0n), true)
    assert.strictEqual(equal(-2n, 2n), false)
  })

  it('should compare two floating point numbers correctly', function () {
    // NaN
    assert.strictEqual(equal(Number.NaN, Number.NaN), false)
    // Infinity
    assert.strictEqual(equal(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY), true)
    assert.strictEqual(equal(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY), true)
    assert.strictEqual(equal(Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY), false)
    assert.strictEqual(equal(Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY), false)
    assert.strictEqual(equal(Number.POSITIVE_INFINITY, 2.0), false)
    assert.strictEqual(equal(2.0, Number.POSITIVE_INFINITY), false)
    assert.strictEqual(equal(Number.NEGATIVE_INFINITY, 2.0), false)
    assert.strictEqual(equal(2.0, Number.NEGATIVE_INFINITY), false)
    assert.strictEqual(equal(Number.NaN, Number.POSITIVE_INFINITY), false)
    assert.strictEqual(equal(Number.POSITIVE_INFINITY, Number.NaN), false)
    assert.strictEqual(equal(Number.NaN, Number.NEGATIVE_INFINITY), false)
    assert.strictEqual(equal(Number.NEGATIVE_INFINITY, Number.NaN), false)
    // floating point numbers
    assert.strictEqual(equal(0.3 - 0.2, 0.1), true)
  })

  it('should compare two booleans', function () {
    assert.strictEqual(equal(true, true), true)
    assert.strictEqual(equal(true, false), false)
    assert.strictEqual(equal(false, true), false)
    assert.strictEqual(equal(false, false), true)
  })

  it('should compare mixed numbers and booleans', function () {
    assert.strictEqual(equal(2, true), false)
    assert.strictEqual(equal(1, true), true)
    assert.strictEqual(equal(0, true), false)
    assert.strictEqual(equal(true, 2), false)
    assert.strictEqual(equal(true, 1), true)
    assert.strictEqual(equal(false, 2), false)
    assert.strictEqual(equal(false, 0), true)
  })

  it('should compare bignumbers', function () {
    assert.strictEqual(equal(bignumber(2), bignumber(3)), false)
    assert.strictEqual(equal(bignumber(2), bignumber(2)), true)
    assert.strictEqual(equal(bignumber(3), bignumber(2)), false)
    assert.strictEqual(equal(bignumber(0), bignumber(0)), true)
    assert.strictEqual(equal(bignumber(-2), bignumber(2)), false)
  })

  it('should compare mixed numbers and bignumbers', function () {
    assert.deepStrictEqual(equal(bignumber(2), 3), false)
    assert.deepStrictEqual(equal(2, bignumber(2)), true)

    assert.throws(function () { equal(1 / 3, bignumber(1).div(3)) }, /Cannot implicitly convert a number with >15 significant digits to BigNumber/)
    assert.throws(function () { equal(bignumber(1).div(3), 1 / 3) }, /Cannot implicitly convert a number with >15 significant digits to BigNumber/)
  })

  it('should compare mixed numbers and bigint', function () {
    assert.deepStrictEqual(equal(2n, 3), false)
    assert.deepStrictEqual(equal(2, 2n), true)

    assert.throws(function () { equal(123123123123123123123n, 1) }, /Cannot implicitly convert bigint to number: value exceeds the max safe integer value/)
    assert.throws(function () { equal(1, 123123123123123123123n) }, /Cannot implicitly convert bigint to number: value exceeds the max safe integer value/)
  })

  it('should compare mixed booleans and bignumbers', function () {
    assert.strictEqual(equal(bignumber(0.1), true), false)
    assert.strictEqual(equal(bignumber(1), true), true)
    assert.strictEqual(equal(bignumber(1), false), false)
    assert.strictEqual(equal(false, bignumber(0)), true)
    assert.strictEqual(equal(true, bignumber(0)), false)
  })

  it('should compare two complex numbers correctly', function () {
    assert.strictEqual(equal(complex(2, 3), complex(2, 4)), false)
    assert.strictEqual(equal(complex(2, 3), complex(2, 3)), true)
    assert.strictEqual(equal(complex(1, 3), complex(2, 3)), false)
    assert.strictEqual(equal(complex(1, 3), complex(2, 4)), false)
    assert.strictEqual(equal(complex(2, 0), 2), true)
    assert.strictEqual(equal(complex(2, 1), 2), false)
    assert.strictEqual(equal(2, complex(2, 0)), true)
    assert.strictEqual(equal(2, complex(2, 1)), false)
    assert.strictEqual(equal(complex(2, 0), 3), false)
  })

  it('should compare mixed complex numbers and bignumbers (downgrades to numbers)', function () {
    assert.deepStrictEqual(equal(math.complex(6, 0), bignumber(6)), true)
    assert.deepStrictEqual(equal(math.complex(6, -2), bignumber(6)), false)
    assert.deepStrictEqual(equal(bignumber(6), math.complex(6, 0)), true)
    assert.deepStrictEqual(equal(bignumber(6), math.complex(6, 4)), false)
  })

  it('should compare two fractions', function () {
    const a = math.fraction(3)
    assert.strictEqual(equal(a, math.fraction(2)).valueOf(), false)
    assert.strictEqual(a.toString(), '3')

    assert.strictEqual(equal(math.fraction(2), math.fraction(3)).valueOf(), false)
    assert.strictEqual(equal(math.fraction(3), math.fraction(3)).valueOf(), true)

    assert.strictEqual(equal(math.add(math.fraction(0.1), math.fraction(0.2)), math.fraction(0.3)).valueOf(), true) // this would fail with numbers
  })

  it('should compare mixed fractions and numbers', function () {
    assert.strictEqual(equal(1, math.fraction(1, 3)), false)
    assert.strictEqual(equal(math.fraction(2), 2), true)
  })

  it('should compare two units correctly', function () {
    assert.strictEqual(equal(unit('100cm'), unit('10inch')), false)
    assert.strictEqual(equal(unit('100cm'), unit('1m')), true)
    assert.strictEqual(equal(unit('12inch'), unit('1foot')), true) // round-off error should be no issue
    assert.strictEqual(equal(unit('2.54cm'), unit('1inch')), true) // round-off error should be no issue
  })

  it('should compare null', function () {
    assert.strictEqual(equal(null, null), true)
    assert.strictEqual(equal(null, undefined), false)
    assert.strictEqual(equal(undefined, null), false)
    assert.strictEqual(equal(0, null), false)
    assert.strictEqual(equal(null, 0), false)
    assert.strictEqual(equal('null', null), false)
  })

  it('should compare undefined', function () {
    assert.strictEqual(equal(undefined, undefined), true)
    assert.strictEqual(equal(undefined, 'undefined'), false)
    assert.strictEqual(equal(undefined, null), false)
    assert.strictEqual(equal(undefined, 0), false)
    assert.strictEqual(equal(2, undefined), false)
  })

  it('should compare strings by their numeric value', function () {
    assert.strictEqual(equal('2', 2), true)
    assert.strictEqual(equal(10, '10'), true)
    assert.strictEqual(equal('1e2', '100'), true)
    assert.strictEqual(equal(10, '8'), false)

    assert.throws(function () { equal('A', 'B') }, /Cannot convert "A" to a number/)
  })

  it('should apply configuration option relTol', function () {
    const mymath = math.create()
    assert.strictEqual(mymath.equal(1, 0.991), false)
    assert.strictEqual(mymath.equal(mymath.bignumber(1), mymath.bignumber(0.991)), false)
    assert.strictEqual(mymath.equal(mymath.complex(1, 0), mymath.complex(0.991, 0)), false)

    mymath.config({ relTol: 1e-2 })
    assert.strictEqual(mymath.equal(1, 0.991), true)
    assert.strictEqual(mymath.equal(mymath.bignumber(1), mymath.bignumber(0.991)), true)
    assert.strictEqual(mymath.equal(mymath.complex(1, 0), mymath.complex(0.991, 0)), true)
  })

  it('should throw an error when comparing a unit with a big number', function () {
    assert.throws(function () { equal(math.unit('5 m'), bignumber(10)).toString() })
  })

  it('should throw an error when comparing a unit with a number', function () {
    assert.throws(function () { equal(unit('100cm'), 22) })
  })

  it('should throw an error for two measures of different units', function () {
    assert.throws(function () { equal(math.unit(5, 'km'), math.unit(100, 'gram')) })
  })

  describe('Array', function () {
    it('should compare array - scalar', function () {
      assert.deepStrictEqual(equal(2, [1, 2, 3]), [false, true, false])
      assert.deepStrictEqual(equal([1, 2, 3], 2), [false, true, false])
    })

    it('should compare array - array', function () {
      assert.deepStrictEqual(equal([[1, 2, 0], [-1, 0, 2]], [[1, -1, 0], [-1, 1, 0]]), [[true, false, true], [true, false, false]])
    })

    it('should compare broadcastable arrays', function () {
      assert.deepStrictEqual(equal([[1, 2, 0]], [[1], [0]]), [[true, false, false], [false, false, true]])
    })

    it('should compare array - dense matrix', function () {
      assert.deepStrictEqual(equal([[1, 2, 0], [-1, 0, 2]], matrix([[1, -1, 0], [-1, 1, 0]])), matrix([[true, false, true], [true, false, false]]))
    })

    it('should compare array - sparse matrix', function () {
      assert.deepStrictEqual(equal([[1, 2, 0], [-1, 0, 2]], sparse([[1, -1, 0], [-1, 1, 0]])), matrix([[true, false, true], [true, false, false]]))
    })

    it('should throw an error if arrays have different sizes', function () {
      assert.throws(function () { equal([1, 4, 5], [3, 4]) })
    })
  })

  describe('DenseMatrix', function () {
    it('should compare dense matrix - scalar', function () {
      assert.deepStrictEqual(equal(2, matrix([1, 2, 3])), matrix([false, true, false]))
      assert.deepStrictEqual(equal(matrix([1, 2, 3]), 2), matrix([false, true, false]))
    })

    it('should compare dense matrix - array', function () {
      assert.deepStrictEqual(equal(matrix([[1, 2, 0], [-1, 0, 2]]), [[1, -1, 0], [-1, 1, 0]]), matrix([[true, false, true], [true, false, false]]))
    })

    it('should compare dense matrix - dense matrix', function () {
      assert.deepStrictEqual(equal(matrix([[1, 2, 0], [-1, 0, 2]]), matrix([[1, -1, 0], [-1, 1, 0]])), matrix([[true, false, true], [true, false, false]]))
    })

    it('should compare dense matrix - sparse matrix', function () {
      assert.deepStrictEqual(equal(matrix([[1, 2, 0], [-1, 0, 2]]), sparse([[1, -1, 0], [-1, 1, 0]])), matrix([[true, false, true], [true, false, false]]))
    })
  })

  describe('SparseMatrix', function () {
    it('should compare sparse matrix - scalar', function () {
      assert.deepStrictEqual(equal(2, sparse([[1, 2], [3, 4]])), matrix([[false, true], [false, false]]))
      assert.deepStrictEqual(equal(sparse([[1, 2], [3, 4]]), 2), matrix([[false, true], [false, false]]))
    })

    it('should compare sparse matrix - array', function () {
      assert.deepStrictEqual(equal(sparse([[1, 2, 0], [-1, 0, 2]]), [[1, -1, 0], [-1, 1, 0]]), matrix([[true, false, true], [true, false, false]]))
    })

    it('should compare sparse matrix - dense matrix', function () {
      assert.deepStrictEqual(equal(sparse([[1, 2, 0], [-1, 0, 2]]), matrix([[1, -1, 0], [-1, 1, 0]])), matrix([[true, false, true], [true, false, false]]))
    })

    it('should compare sparse matrix - sparse matrix', function () {
      assert.deepStrictEqual(equal(sparse([[1, 2, 0], [-1, 0, 2]]), sparse([[1, -1, 0], [-1, 1, 0]])), sparse([[true, false, true], [true, false, false]]))
    })
  })

  it('should throw an error in case of invalid number of arguments', function () {
    assert.throws(function () { equal(1) }, /Too few arguments/)
    assert.throws(function () { equal(1, 2, 3) }, /Too many arguments/)
  })

  it('should LaTeX equal', function () {
    const expression = math.parse('equal(1,2)')
    assert.strictEqual(expression.toTex(), '\\left(1=2\\right)')
  })
})
