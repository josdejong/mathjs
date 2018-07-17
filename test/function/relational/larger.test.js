// test larger
const assert = require('assert')
const math = require('../../../src/main')
const bignumber = math.bignumber
const complex = math.complex
const matrix = math.matrix
const sparse = math.sparse
const unit = math.unit
const larger = math.larger

describe('larger', function () {
  it('should compare two numbers correctly', function () {
    assert.equal(larger(2, 3), false)
    assert.equal(larger(2, 2), false)
    assert.equal(larger(2, 1), true)
    assert.equal(larger(0, 0), false)
    assert.equal(larger(-2, 2), false)
    assert.equal(larger(-2, -3), true)
    assert.equal(larger(-3, -2), false)
  })

  it('should compare two floating point numbers correctly', function () {
    // Infinity
    assert.equal(larger(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY), false)
    assert.equal(larger(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY), false)
    assert.equal(larger(Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY), true)
    assert.equal(larger(Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY), false)
    assert.equal(larger(Number.POSITIVE_INFINITY, 2.0), true)
    assert.equal(larger(2.0, Number.POSITIVE_INFINITY), false)
    assert.equal(larger(Number.NEGATIVE_INFINITY, 2.0), false)
    assert.equal(larger(2.0, Number.NEGATIVE_INFINITY), true)
    // floating point numbers
    assert.equal(larger(0.3 - 0.2, 0.1), false)
  })

  it('should compare two booleans', function () {
    assert.equal(larger(true, true), false)
    assert.equal(larger(true, false), true)
    assert.equal(larger(false, true), false)
    assert.equal(larger(false, false), false)
  })

  it('should compare mixed numbers and booleans', function () {
    assert.equal(larger(2, true), true)
    assert.equal(larger(0, true), false)
    assert.equal(larger(true, 2), false)
    assert.equal(larger(false, 2), false)
  })

  it('should compare bignumbers', function () {
    assert.equal(larger(bignumber(2), bignumber(3)), false)
    assert.equal(larger(bignumber(2), bignumber(2)), false)
    assert.equal(larger(bignumber(3), bignumber(2)), true)
    assert.equal(larger(bignumber(0), bignumber(0)), false)
    assert.equal(larger(bignumber(-2), bignumber(2)), false)
  })

  it('should compare mixed numbers and bignumbers', function () {
    assert.equal(larger(bignumber(2), 3), false)
    assert.equal(larger(2, bignumber(2)), false)

    assert.throws(function () { larger(1 / 3, bignumber(1).div(3)) }, /Cannot implicitly convert a number with >15 significant digits to BigNumber/)
    assert.throws(function () { larger(bignumber(1).div(3), 1 / 3) }, /Cannot implicitly convert a number with >15 significant digits to BigNumber/)
  })

  it('should compare mixed booleans and bignumbers', function () {
    assert.equal(larger(bignumber(0.1), true), false)
    assert.equal(larger(bignumber(1), true), false)
    assert.equal(larger(bignumber(1), false), true)
    assert.equal(larger(false, bignumber(0)), false)
    assert.equal(larger(true, bignumber(0)), true)
  })

  it('should compare two fractions', function () {
    assert.strictEqual(larger(math.fraction(3), math.fraction(2)).valueOf(), true)
    assert.strictEqual(larger(math.fraction(2), math.fraction(3)).valueOf(), false)
    assert.strictEqual(larger(math.fraction(3), math.fraction(3)).valueOf(), false)
  })

  it('should compare mixed fractions and numbers', function () {
    assert.strictEqual(larger(1, math.fraction(1, 3)), true)
    assert.strictEqual(larger(math.fraction(2), 2), false)
  })

  it('should add two measures of the same unit', function () {
    assert.equal(larger(unit('100cm'), unit('10inch')), true)
    assert.equal(larger(unit('99cm'), unit('1m')), false)
    // assert.equal(larger(unit('100cm'), unit('1m')), false); // dangerous, round-off errors
    assert.equal(larger(unit('101cm'), unit('1m')), true)
  })

  it('should apply configuration option epsilon', function () {
    const mymath = math.create()
    assert.equal(mymath.larger(1, 0.991), true)
    assert.equal(mymath.larger(math.bignumber(1), math.bignumber(0.991)), true)

    mymath.config({epsilon: 1e-2})
    assert.equal(mymath.larger(1, 0.991), false)
    assert.equal(mymath.larger(math.bignumber(1), math.bignumber(0.991)), false)
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
    assert.equal(larger('0', 0), false)
    assert.equal(larger('10', '2'), true)

    assert.throws(function () { larger('A', 'B') }, /Cannot convert "A" to a number/)
  })

  describe('Array', function () {
    it('should compare array - scalar', function () {
      assert.deepEqual(larger(2, [1, 2, 3]), [true, false, false])
      assert.deepEqual(larger([1, 2, 3], 2), [false, false, true])
    })

    it('should compare array - array', function () {
      assert.deepEqual(larger([[1, 2, 0], [-1, 0, 2]], [[1, -1, 0], [-1, 1, 0]]), [[false, true, false], [false, false, true]])
    })

    it('should compare array - dense matrix', function () {
      assert.deepEqual(larger([[1, 2, 0], [-1, 0, 2]], matrix([[1, -1, 0], [-1, 1, 0]])), matrix([[false, true, false], [false, false, true]]))
    })

    it('should compare array - sparse matrix', function () {
      assert.deepEqual(larger([[1, 2, 0], [-1, 0, 2]], sparse([[1, -1, 0], [-1, 1, 0]])), matrix([[false, true, false], [false, false, true]]))
    })

    it('should throw an error if arrays have different sizes', function () {
      assert.throws(function () { larger([1, 4, 5], [3, 4]) })
    })
  })

  describe('DenseMatrix', function () {
    it('should compare dense matrix - scalar', function () {
      assert.deepEqual(larger(2, matrix([1, 2, 3])), matrix([true, false, false]))
      assert.deepEqual(larger(matrix([1, 2, 3]), 2), matrix([false, false, true]))
    })

    it('should compare dense matrix - array', function () {
      assert.deepEqual(larger(matrix([[1, 2, 0], [-1, 0, 2]]), [[1, -1, 0], [-1, 1, 0]]), matrix([[false, true, false], [false, false, true]]))
    })

    it('should compare dense matrix - dense matrix', function () {
      assert.deepEqual(larger(matrix([[1, 2, 0], [-1, 0, 2]]), matrix([[1, -1, 0], [-1, 1, 0]])), matrix([[false, true, false], [false, false, true]]))
    })

    it('should compare dense matrix - sparse matrix', function () {
      assert.deepEqual(larger(matrix([[1, 2, 0], [-1, 0, 2]]), sparse([[1, -1, 0], [-1, 1, 0]])), matrix([[false, true, false], [false, false, true]]))
    })
  })

  describe('SparseMatrix', function () {
    it('should compare sparse matrix - scalar', function () {
      assert.deepEqual(larger(2, sparse([[1, 2], [3, 4]])), matrix([[true, false], [false, false]]))
      assert.deepEqual(larger(sparse([[1, 2], [3, 4]]), 2), matrix([[false, false], [true, true]]))
    })

    it('should compare sparse matrix - array', function () {
      assert.deepEqual(larger(sparse([[1, 2, 0], [-1, 0, 2]]), [[1, -1, 0], [-1, 1, 0]]), matrix([[false, true, false], [false, false, true]]))
    })

    it('should compare sparse matrix - dense matrix', function () {
      assert.deepEqual(larger(sparse([[1, 2, 0], [-1, 0, 2]]), matrix([[1, -1, 0], [-1, 1, 0]])), matrix([[false, true, false], [false, false, true]]))
    })

    it('should compare sparse matrix - sparse matrix', function () {
      assert.deepEqual(larger(sparse([[1, 2, 0], [-1, 0, 2]]), sparse([[1, -1, 0], [-1, 1, 0]])), matrix([[false, true, false], [false, false, true]]))
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
    assert.equal(expression.toTex(), '\\left(1>2\\right)')
  })
})
