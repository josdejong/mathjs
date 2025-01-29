// test compareNatural
import assert from 'assert'

import math from '../../../../src/defaultInstance.js'
const bignumber = math.bignumber
const complex = math.complex
const matrix = math.matrix
const sparse = math.sparse
const unit = math.unit
const compareNatural = math.compareNatural

describe('compareNatural', function () {
  it('should compare two numbers correctly', function () {
    assert.strictEqual(compareNatural(2, 3), -1)
    assert.strictEqual(compareNatural(2, 2), 0)
    assert.strictEqual(compareNatural(2, 1), 1)
    assert.strictEqual(compareNatural(0, 0), 0)
    assert.strictEqual(compareNatural(-2, 2), -1)
    assert.strictEqual(compareNatural(-2, -3), 1)
    assert.strictEqual(compareNatural(-3, -2), -1)
  })

  it('should compare two floating point numbers correctly', function () {
    // Infinity
    assert.strictEqual(compareNatural(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY), 0)
    assert.strictEqual(compareNatural(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY), 0)
    assert.strictEqual(compareNatural(Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY), 1)
    assert.strictEqual(compareNatural(Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY), -1)
    assert.strictEqual(compareNatural(Number.POSITIVE_INFINITY, 2.0), 1)
    assert.strictEqual(compareNatural(2.0, Number.POSITIVE_INFINITY), -1)
    assert.strictEqual(compareNatural(Number.NEGATIVE_INFINITY, 2.0), -1)
    assert.strictEqual(compareNatural(2.0, Number.NEGATIVE_INFINITY), 1)
    // floating point numbers
    assert.strictEqual(compareNatural(0.3 - 0.2, 0.1), 0)
  })

  it('should compare two booleans', function () {
    assert.strictEqual(compareNatural(true, true), 0)
    assert.strictEqual(compareNatural(true, false), 1)
    assert.strictEqual(compareNatural(false, true), -1)
    assert.strictEqual(compareNatural(false, false), 0)
  })

  it('should compare bignumbers', function () {
    assert.strictEqual(compareNatural(bignumber(2), bignumber(3)), -1)
    assert.strictEqual(compareNatural(bignumber(2), bignumber(2)), 0)
    assert.strictEqual(compareNatural(bignumber(3), bignumber(2)), 1)
    assert.strictEqual(compareNatural(bignumber(0), bignumber(0)), 0)
    assert.strictEqual(compareNatural(bignumber(-2), bignumber(2)), -1)
    assert.strictEqual(typeof compareNatural(bignumber(-2), bignumber(2)), 'number')
  })

  it('should compare two fractions', function () {
    const a = math.fraction(1, 3)
    const b = math.fraction(1, 6)
    assert.strictEqual(typeof compareNatural(a, b), 'number')
    assert.strictEqual(a.toString(), '0.(3)')
    assert.strictEqual(b.toString(), '0.1(6)')

    assert.strictEqual(compareNatural(math.fraction(3), math.fraction(2)).valueOf(), 1)
    assert.strictEqual(compareNatural(math.fraction(2), math.fraction(3)).valueOf(), -1)
    assert.strictEqual(compareNatural(math.fraction(3), math.fraction(3)).valueOf(), 0)

    assert.strictEqual(compareNatural(math.add(math.fraction(0.1), math.fraction(0.2)), math.fraction(0.3)).valueOf(), 0) // this would fail with numbers
  })

  it('should compare two measures of the same unit', function () {
    assert.strictEqual(compareNatural(unit('100cm'), unit('10inch')), 1)
    assert.strictEqual(compareNatural(unit('99cm'), unit('1m')), -1)
    assert.strictEqual(compareNatural(unit('1m'), unit('1m')), 0)
    assert.strictEqual(compareNatural(unit('1m'), unit('100 cm')), 0)
    assert.strictEqual(compareNatural(unit('101cm'), unit('1m')), 1)
  })

  it('should compare two measures of different unit', function () {
    assert.strictEqual(compareNatural(math.unit(5, 'km'), math.unit(100, 'gram')), 1)
    assert.strictEqual(compareNatural(math.unit(4, 'km/h'), math.unit(2, 'm/s^2')), -1)
    assert.strictEqual(compareNatural(math.unit(2, 'm/s^2'), math.unit(4, 'km/h')), 1)
  })

  it('should compare mixed types (by type name)', function () {
    // booleans
    assert.strictEqual(compareNatural(2, true), 1)
    assert.strictEqual(compareNatural(0, false), 1)
    assert.strictEqual(compareNatural(true, 2), -1)
    assert.strictEqual(compareNatural(false, 2), -1)

    // null
    assert.strictEqual(compareNatural(2, null), 1)
    assert.strictEqual(compareNatural(null, 2), -1)

    // undefined
    assert.strictEqual(compareNatural(2, undefined), -1)
    assert.strictEqual(compareNatural(undefined, 2), 1)

    // fractions and units
    assert.strictEqual(compareNatural(1, math.fraction(1, 3)), 1)
    assert.strictEqual(compareNatural(math.fraction(1, 3), 1), -1)
    assert.strictEqual(compareNatural(1, math.fraction(1)), 1)
    assert.strictEqual(compareNatural(math.fraction(1), 1), -1)

    // units and numbers
    assert.strictEqual(compareNatural(unit('100cm'), 22), -1)
    assert.strictEqual(compareNatural(22, unit('100cm')), 1)

    // units and bignumbers
    assert.strictEqual(compareNatural(unit('100cm'), bignumber(22)), 1)
    assert.strictEqual(compareNatural(bignumber(22), unit('100cm')), -1)

    // numbers and complex
    assert.strictEqual(compareNatural(1, complex(2, 3)), 1)
    assert.strictEqual(compareNatural(complex(2, 3), 1), -1)

    // numbers and bignumbers
    assert.strictEqual(compareNatural(bignumber(2), 3), -1)
    assert.strictEqual(compareNatural(3, bignumber(2)), 1)
    assert.strictEqual(compareNatural(bignumber(2), 2), -1)
    assert.strictEqual(compareNatural(2, bignumber(2)), 1)

    // array, DenseMatrix, SparseMatrix
    assert.strictEqual(compareNatural([2], matrix([2])), -1)
    assert.strictEqual(compareNatural(matrix([2]), [2]), 1)
    assert.strictEqual(compareNatural(sparse([2]), [2]), -1)
    assert.strictEqual(compareNatural([2], sparse([2])), 1)
    assert.strictEqual(compareNatural(sparse([2]), matrix([2])), -1)
    assert.strictEqual(compareNatural(matrix([2]), sparse([2])), 1)

    // string and number
    assert.strictEqual(compareNatural('0', 0), 1)
  })

  it('should perform natural comparison for two strings', function () {
    assert.strictEqual(compareNatural('abd', 'abc'), 1)
    assert.strictEqual(compareNatural('abc', 'abc'), 0)
    assert.strictEqual(compareNatural('abc', 'abd'), -1)

    // natural sorting of strings
    assert.strictEqual(compareNatural('10', '2'), 1)
  })

  it('should compare arrays', function () {
    // mixed number/array
    assert.strictEqual(compareNatural(5, [1, 2, 3]), 1)
    assert.strictEqual(compareNatural([1, 2, 3], 5), -1)

    // same size
    assert.strictEqual(compareNatural([1, 2, 4], [1, 2, 3]), 1)

    // unequal size
    assert.strictEqual(compareNatural([1, 2, 3, 4], [1, 2, 3]), 1)
    assert.strictEqual(compareNatural([1, 2, 3], [1, 2, 3, 4]), -1)
    assert.strictEqual(compareNatural([1, 4], [1, 2, 3]), 1)

    // unequal dimensions
    assert.strictEqual(compareNatural([[2]], [1]), 1)

    // multiple dimensions
    assert.strictEqual(compareNatural([[2, 3]], [[2, 4]]), -1)
    assert.strictEqual(compareNatural([[2, 3], [5, 6]], [[2, 3], [5, 6]]), 0)
  })

  it('should compare dense matrices', function () {
    // mixed number/matrix
    assert.strictEqual(compareNatural(5, matrix([1, 2, 3])), 1)
    assert.strictEqual(compareNatural(matrix([1, 2, 3]), 5), -1)

    // same size
    assert.strictEqual(compareNatural(matrix([1, 2, 4]), matrix([1, 2, 3])), 1)

    // unequal size
    assert.strictEqual(compareNatural(matrix([1, 2, 3, 4]), matrix([1, 2, 3])), 1)
    assert.strictEqual(compareNatural(matrix([1, 2, 3]), matrix([1, 2, 3, 4])), -1)
    assert.strictEqual(compareNatural(matrix([1, 4]), matrix([1, 2, 3])), 1)

    // unequal dimensions
    assert.strictEqual(compareNatural(matrix([[2]]), matrix([1])), 1)

    // multiple dimensions
    assert.strictEqual(compareNatural(matrix([[2, 3]]), matrix([[2, 4]])), -1)
    assert.strictEqual(compareNatural(matrix([[2, 3], [5, 6]]), matrix([[2, 3], [5, 6]])), 0)
  })

  it('should compare sparse matrices', function () {
    // mixed number/sparse
    assert.strictEqual(compareNatural(5, sparse([1, 2, 3])), 1)
    assert.strictEqual(compareNatural(sparse([1, 2, 3]), 5), -1)

    // same size
    assert.strictEqual(compareNatural(sparse([1, 2, 4]), sparse([1, 2, 3])), 1)

    // unequal size
    assert.strictEqual(compareNatural(sparse([1, 2, 3, 4]), sparse([1, 2, 3])), 1)
    assert.strictEqual(compareNatural(sparse([1, 2, 3]), sparse([1, 2, 3, 4])), -1)
    assert.strictEqual(compareNatural(sparse([1, 4]), sparse([1, 2, 3])), 1)

    // unequal dimensions
    assert.strictEqual(compareNatural(sparse([[2]]), sparse([1])), 1)

    // multiple dimensions
    assert.strictEqual(compareNatural(sparse([[2, 3]]), sparse([[2, 4]])), -1)
    assert.strictEqual(compareNatural(sparse([[2, 3], [5, 6]]), sparse([[2, 3], [5, 6]])), 0)
  })

  it('should compare objects', function () {
    // different number of keys
    assert.strictEqual(compareNatural({ a: 2, b: 3 }, { a: 2 }), 1)

    // different keys
    assert.strictEqual(compareNatural({ b: 3 }, { a: 2 }), 1)

    // different values
    assert.strictEqual(compareNatural({ a: 3 }, { a: 2 }), 1)

    // equal
    assert.strictEqual(compareNatural({ a: 2, b: 3 }, { a: 2, b: 3 }), 0)

    // nesting
    assert.strictEqual(compareNatural({ a: 2, b: { c: 4 } }, { a: 2, b: { c: 3 } }), 1)
    assert.strictEqual(compareNatural({ a: 2, b: { c: 3 } }, { a: 2, b: { c: 4 } }), -1)
  })

  it('should apply configuration option relTol', function () {
    const mymath = math.create()

    assert.strictEqual(mymath.compareNatural(1, 0.991), 1)
    assert.strictEqual(mymath.compareNatural(mymath.bignumber(1), mymath.bignumber(0.991)).valueOf(), 1)

    mymath.config({ relTol: 1e-2 })
    assert.strictEqual(mymath.compareNatural(1, 0.991), 0)
    assert.strictEqual(mymath.compareNatural(mymath.bignumber(1), mymath.bignumber(0.991)), 0)
  })

  it('should compare complex numbers', function () {
    assert.strictEqual(compareNatural(complex(1, 1), complex(1, 1)), 0)
    assert.strictEqual(compareNatural(complex(2, 1), complex(1, 2)), 1)
    assert.strictEqual(compareNatural(complex(0, 1), complex(1, 2)), -1)
  })

  it('should throw an error in case of invalid number of arguments', function () {
    assert.throws(function () { compareNatural(1) }, /TypeError: Too few arguments/)
    assert.throws(function () { compareNatural(1, 2, 3) }, /TypeError: Too many arguments/)
  })

  it('should LaTeX compare', function () {
    const expression = math.parse('compareNatural(1,2)')
    assert.strictEqual(expression.toTex(), '\\mathrm{compareNatural}\\left(1,2\\right)')
  })
})
