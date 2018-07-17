// test compare
const assert = require('assert')
const math = require('../../../src/main')
const bignumber = math.bignumber
const complex = math.complex
const matrix = math.matrix
const sparse = math.sparse
const unit = math.unit
const compare = math.compare

describe('compare', function () {
  it('should compare two numbers correctly', function () {
    assert.equal(compare(2, 3), -1)
    assert.equal(compare(2, 2), 0)
    assert.equal(compare(2, 1), 1)
    assert.equal(compare(0, 0), 0)
    assert.equal(compare(-2, 2), -1)
    assert.equal(compare(-2, -3), 1)
    assert.equal(compare(-3, -2), -1)
  })

  it('should compare two floating point numbers correctly', function () {
    // Infinity
    assert.equal(compare(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY), 0)
    assert.equal(compare(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY), 0)
    assert.equal(compare(Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY), 1)
    assert.equal(compare(Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY), -1)
    assert.equal(compare(Number.POSITIVE_INFINITY, 2.0), 1)
    assert.equal(compare(2.0, Number.POSITIVE_INFINITY), -1)
    assert.equal(compare(Number.NEGATIVE_INFINITY, 2.0), -1)
    assert.equal(compare(2.0, Number.NEGATIVE_INFINITY), 1)
    // floating point numbers
    assert.equal(compare(0.3 - 0.2, 0.1), 0)
  })

  it('should compare two booleans', function () {
    assert.equal(compare(true, true), 0)
    assert.equal(compare(true, false), 1)
    assert.equal(compare(false, true), -1)
    assert.equal(compare(false, false), 0)
  })

  it('should compare mixed numbers and booleans', function () {
    assert.equal(compare(2, true), 1)
    assert.equal(compare(0, true), -1)
    assert.equal(compare(true, 2), -1)
    assert.equal(compare(false, 2), -1)
  })

  it('should compare bignumbers', function () {
    assert.deepEqual(compare(bignumber(2), bignumber(3)), bignumber(-1))
    assert.deepEqual(compare(bignumber(2), bignumber(2)), bignumber(0))
    assert.deepEqual(compare(bignumber(3), bignumber(2)), bignumber(1))
    assert.deepEqual(compare(bignumber(0), bignumber(0)), bignumber(0))
    assert.deepEqual(compare(bignumber(-2), bignumber(2)), bignumber(-1))
  })

  it('should compare mixed numbers and bignumbers', function () {
    assert.deepEqual(compare(bignumber(2), 3), bignumber(-1))
    assert.deepEqual(compare(2, bignumber(2)), bignumber(0))
  })

  it('should compare mixed booleans and bignumbers', function () {
    assert.deepEqual(compare(bignumber(0.1), true), bignumber(-1))
    assert.deepEqual(compare(bignumber(1), true), bignumber(0))
    assert.deepEqual(compare(bignumber(1), false), bignumber(1))
    assert.deepEqual(compare(false, bignumber(0)), bignumber(0))
    assert.deepEqual(compare(true, bignumber(0)), bignumber(1))
  })

  it('should compare two fractions', function () {
    const a = math.fraction(1, 3)
    const b = math.fraction(1, 6)
    assert(compare(a, b) instanceof math.type.Fraction)
    assert.equal(a.toString(), '0.(3)')
    assert.equal(b.toString(), '0.1(6)')

    assert.equal(compare(math.fraction(3), math.fraction(2)).valueOf(), 1)
    assert.equal(compare(math.fraction(2), math.fraction(3)).valueOf(), -1)
    assert.equal(compare(math.fraction(3), math.fraction(3)).valueOf(), 0)

    assert.strictEqual(compare(math.add(math.fraction(0.1), math.fraction(0.2)), math.fraction(0.3)).valueOf(), 0) // this would fail with numbers
  })

  it('should compare mixed fractions and numbers', function () {
    assert.deepEqual(compare(1, math.fraction(1, 3)), math.fraction(1))
    assert.deepEqual(compare(math.fraction(1, 3), 1), math.fraction(-1))
  })

  it('should add two measures of the same unit', function () {
    assert.equal(compare(unit('100cm'), unit('10inch')), 1)
    assert.equal(compare(unit('99cm'), unit('1m')), -1)
    assert.equal(compare(unit('1m'), unit('1m')), bignumber(0))
    assert.equal(compare(unit('101cm'), unit('1m')), 1)
  })

  it('should throw an error if comparing a unit with a number', function () {
    assert.throws(function () { compare(unit('100cm'), 22) })
  })

  it('should throw an error for two measures of different units', function () {
    assert.throws(function () { compare(math.unit(5, 'km'), math.unit(100, 'gram')) })
  })

  it('should throw an error if comparing a unit with a bignumber', function () {
    assert.throws(function () { compare(unit('100cm'), bignumber(22)) })
  })

  it('should compare two strings', function () {
    assert.equal(compare('0', 0), 0)
    assert.equal(compare('10', '2'), 1)
  })

  describe('Array', function () {
    it('should compare array - scalar', function () {
      assert.deepEqual(compare(2, [1, 2, 3]), [1, 0, -1])
      assert.deepEqual(compare([1, 2, 3], 2), [-1, 0, 1])
    })

    it('should compare array - array', function () {
      assert.deepEqual(compare([[1, 2, 0], [-1, 0, 2]], [[3, -1, 0], [-2, 1, 0]]), [[-1, 1, 0], [1, -1, 1]])
    })

    it('should compare array - dense matrix', function () {
      assert.deepEqual(compare([[1, 2, 0], [-1, 0, 2]], matrix([[3, -1, 0], [-2, 1, 0]])), matrix([[-1, 1, 0], [1, -1, 1]]))
    })

    it('should compare array - sparse matrix', function () {
      assert.deepEqual(compare([[1, 2, 0], [-1, 0, 2]], sparse([[3, -1, 0], [-2, 1, 0]])), matrix([[-1, 1, 0], [1, -1, 1]]))
    })
  })

  describe('DenseMatrix', function () {
    it('should compare dense matrix - scalar', function () {
      assert.deepEqual(compare(2, matrix([1, 2, 3])), matrix([1, 0, -1]))
      assert.deepEqual(compare(matrix([1, 2, 3]), 2), matrix([-1, 0, 1]))
    })

    it('should compare dense matrix - array', function () {
      assert.deepEqual(compare(matrix([[1, 2, 0], [-1, 0, 2]]), [[3, -1, 0], [-2, 1, 0]]), matrix([[-1, 1, 0], [1, -1, 1]]))
    })

    it('should compare dense matrix - dense matrix', function () {
      assert.deepEqual(compare(matrix([[1, 2, 0], [-1, 0, 2]]), matrix([[3, -1, 0], [-2, 1, 0]])), matrix([[-1, 1, 0], [1, -1, 1]]))
    })

    it('should compare dense matrix - sparse matrix', function () {
      assert.deepEqual(compare(matrix([[1, 2, 0], [-1, 0, 2]]), sparse([[3, -1, 0], [-2, 1, 0]])), matrix([[-1, 1, 0], [1, -1, 1]]))
    })
  })

  describe('SparseMatrix', function () {
    it('should compare sparse matrix - scalar', function () {
      assert.deepEqual(compare(2, sparse([[1, 2], [3, 4]])), matrix([[1, 0], [-1, -1]]))
      assert.deepEqual(compare(sparse([[1, 2], [3, 4]]), 2), matrix([[-1, 0], [1, 1]]))
    })

    it('should compare sparse matrix - array', function () {
      assert.deepEqual(compare(sparse([[1, 2, 0], [-1, 0, 2]]), [[3, -1, 0], [-2, 1, 0]]), matrix([[-1, 1, 0], [1, -1, 1]]))
    })

    it('should compare sparse matrix - dense matrix', function () {
      assert.deepEqual(compare(sparse([[1, 2, 0], [-1, 0, 2]]), matrix([[3, -1, 0], [-2, 1, 0]])), matrix([[-1, 1, 0], [1, -1, 1]]))
    })

    it('should compare sparse matrix - sparse matrix', function () {
      assert.deepEqual(compare(sparse([[1, 2, 0], [-1, 0, 2]]), sparse([[3, -1, 0], [-2, 1, 0]])), sparse([[-1, 1, 0], [1, -1, 1]]))
    })
  })

  it('should apply configuration option epsilon', function () {
    const mymath = math.create()

    assert.equal(mymath.compare(1, 0.991), 1)
    assert.equal(mymath.compare(math.bignumber(1), math.bignumber(0.991)).valueOf(), 1)

    mymath.config({epsilon: 1e-2})
    assert.equal(mymath.compare(1, 0.991), 0)
    assert.equal(mymath.compare(math.bignumber(1), math.bignumber(0.991)), 0)
  })

  it('should throw an error when comparing complex numbers', function () {
    assert.throws(function () { compare(complex(1, 1), complex(1, 2)) }, TypeError)
    assert.throws(function () { compare(complex(2, 1), 3) }, TypeError)
    assert.throws(function () { compare(3, complex(2, 4)) }, TypeError)
    assert.throws(function () { compare(math.bignumber(3), complex(2, 4)) }, TypeError)
    assert.throws(function () { compare(complex(2, 4), math.bignumber(3)) }, TypeError)
  })

  it('should throw an error if matrices are different sizes', function () {
    assert.throws(function () { compare([1, 4, 6], [3, 4]) })
  })

  it('should throw an error in case of invalid number of arguments', function () {
    assert.throws(function () { compare(1) }, /TypeError: Too few arguments/)
    assert.throws(function () { compare(1, 2, 3) }, /TypeError: Too many arguments/)
  })

  it('should throw an error in case of invalid type of arguments', function () {
    assert.throws(function () { compare(2, null) }, /TypeError: Unexpected type of argument/)
  })

  it('should LaTeX compare', function () {
    const expression = math.parse('compare(1,2)')
    assert.equal(expression.toTex(), '\\mathrm{compare}\\left(1,2\\right)')
  })
})
