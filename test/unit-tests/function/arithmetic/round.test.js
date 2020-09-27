// test round
import assert from 'assert'

import approx from '../../../../tools/approx'
import math from '../../../../src/bundleAny'
const bignumber = math.bignumber
const fraction = math.fraction
const matrix = math.matrix
const sparse = math.sparse
const round = math.round

describe('round', function () {
  it('should round a number to te given number of decimals', function () {
    approx.equal(round(math.pi), 3)
    approx.equal(round(math.pi * 1000), 3142)
    approx.equal(round(math.pi, 3), 3.142)
    approx.equal(round(math.pi, 6), 3.141593)
    approx.equal(round(1234.5678, 2), 1234.57)
    approx.equal(round(2.135, 2), 2.14)

    assert.strictEqual(round(2.7), 3)
    assert.strictEqual(round(2.5), 3)
    assert.strictEqual(round(2.5, 0), 3)
    assert.strictEqual(round(-2.5), -3)
    assert.strictEqual(round(-2.7), -3)
    assert.strictEqual(round(-2.5, 0), -3)
  })

  it('should round booleans (yeah, not really useful but it should be supported)', function () {
    approx.equal(round(true), 1)
    approx.equal(round(false), 0)
    approx.equal(round(true, 2), 1)
    approx.equal(round(false, 2), 0)
  })

  it('should throw an error on invalid type of value', function () {
    assert.throws(function () { round(new Date()) }, /TypeError: Unexpected type of argument/)
  })

  it('should throw an error on invalid type of n', function () {
    assert.throws(function () { round(math.pi, new Date()) }, /TypeError: Unexpected type of argument/)
  })

  it('should throw an error on invalid value of n', function () {
    assert.throws(function () { round(math.pi, -2) }, /Number of decimals in function round must be in te range of 0-15/)
    assert.throws(function () { round(math.pi, 20) }, /Number of decimals in function round must be in te range of 0-15/)
    assert.throws(function () { round(math.pi, 2.5) }, /Number of decimals in function round must be an integer/)
    assert.throws(function () { round(1, 1.2) }, /TypeError: Number of decimals in function round must be an integer/)
    assert.throws(function () { round(1, bignumber(1.2)) }, /TypeError: Number of decimals in function round must be an integer/)
    assert.throws(function () { round(math.complex(1, 1), 1.2) }, /TypeError: Number of decimals in function round must be an integer/)
    assert.throws(function () { round(math.complex(1, 1), bignumber(1.2)) }, /TypeError: Number of decimals in function round must be an integer/)
    assert.throws(function () { round(bignumber(1.2), bignumber(1.2)) }, /TypeError: Number of decimals in function round must be an integer/)
    assert.throws(function () { round(round(fraction('1/2'), 1.2)) }, /TypeError: Number of decimals in function round must be an integer/)
  })

  it('should throw an error if used with wrong number of arguments', function () {
    assert.throws(function () { round() }, /TypeError: Too few arguments/)
    assert.throws(function () { round(1, 2, 3) }, /TypeError: Too many arguments/)
  })

  it('should throw an in case of wrong type of arguments', function () {
    assert.throws(function () { round(null) }, /TypeError: Unexpected type of argument/)
  })

  it('should round bignumbers', function () {
    assert.deepStrictEqual(round(bignumber(2.7)), bignumber(3))
    assert.deepStrictEqual(round(bignumber(2.5)), bignumber(3))
    assert.deepStrictEqual(round(bignumber(-2.5)), bignumber(-3))
    assert.deepStrictEqual(round(bignumber(2.5), 0), bignumber(3))
    assert.deepStrictEqual(round(bignumber(-2.5), 0), bignumber(-3))
    assert.deepStrictEqual(round(bignumber(2.1)), bignumber(2))
    assert.deepStrictEqual(round(bignumber(2.123456), bignumber(3)), bignumber(2.123))
    assert.deepStrictEqual(round(bignumber(2.123456), 3), bignumber(2.123))
    assert.deepStrictEqual(round(2.1234567, bignumber(3)), bignumber(2.123))
    assert.deepStrictEqual(round(true, bignumber(3)), bignumber(1))
    assert.deepStrictEqual(round(bignumber(1.23), true), bignumber(1.2))
  })

  it('should round fractions', function () {
    const a = fraction('2/3')
    assert(round(a) instanceof math.Fraction)
    assert.strictEqual(a.toString(), '0.(6)')

    assert.strictEqual(round(fraction('2/3')).toString(), '1')
    assert.strictEqual(round(fraction('1/3')).toString(), '0')
    assert.strictEqual(round(fraction('1/2')).toString(), '1')

    assert.strictEqual(round(fraction('1/2'), 1).toString(), '0.5')
  })

  it('should gracefully handle round-off errors', function () {
    assert.strictEqual(round(3.0000000000000004), 3)
    assert.strictEqual(round(7.999999999999999), 8)
    assert.strictEqual(round(-3.0000000000000004), -3)
    assert.strictEqual(round(-7.999999999999999), -8)
    assert.strictEqual(round(30000.000000000004), 30000)
    assert.strictEqual(round(799999.9999999999), 800000)
    assert.strictEqual(round(-30000.000000000004), -30000)
    assert.strictEqual(round(-799999.9999999999), -800000)

    assert.strictEqual(round(3.0000000000000004, 2), 3)
    assert.strictEqual(round(7.999999999999999, 2), 8)
    assert.strictEqual(round(-3.0000000000000004, 2), -3)
    assert.strictEqual(round(-7.999999999999999, 2), -8)
    assert.strictEqual(round(30000.000000000004, 2), 30000)
    assert.strictEqual(round(799999.9999999999, 2), 800000)
    assert.strictEqual(round(-30000.000000000004, 2), -30000)
    assert.strictEqual(round(-799999.9999999999, 2), -800000)
  })

  it('should round real and imag part of a complex number', function () {
    assert.deepStrictEqual(round(math.complex(2.2, math.pi)), math.complex(2, 3))
  })

  it('should round a complex number with a bignumber as number of decimals', function () {
    assert.deepStrictEqual(round(math.complex(2.157, math.pi), bignumber(2)), math.complex(2.16, 3.14))
  })

  it('should throw an error if used with a unit', function () {
    assert.throws(function () { round(math.unit('5cm')) }, TypeError, 'Function round(unit) not supported')
    assert.throws(function () { round(math.unit('5cm'), 2) }, TypeError, 'Function round(unit) not supported')
    assert.throws(function () { round(math.unit('5cm'), bignumber(2)) }, TypeError, 'Function round(unit) not supported')
  })

  it('should convert to a number when used with a string', function () {
    assert.strictEqual(round('3.6'), 4)
    assert.strictEqual(round('3.12345', '3'), 3.123)
    assert.throws(function () { round('hello world') }, /Cannot convert "hello world" to a number/)
  })

  it('should round each element in a matrix, array, range', function () {
    assert.deepStrictEqual(round(math.range(0, 2.1, 1 / 3), 2), math.matrix([0, 0.33, 0.67, 1, 1.33, 1.67, 2]))
    assert.deepStrictEqual(round(math.range(0, 2.1, 1 / 3)), math.matrix([0, 0, 1, 1, 1, 2, 2]))
    assert.deepStrictEqual(round([1.7, 2.3]), [2, 2])
    assert.deepStrictEqual(round(math.matrix([1.7, 2.3])).valueOf(), [2, 2])
  })

  describe('Array', function () {
    it('should round array', function () {
      assert.deepStrictEqual(round([1.7, 2.3]), [2, 2])
    })

    it('should round array and scalar', function () {
      assert.deepStrictEqual(round([1.7777, 2.3456], 3), [1.778, 2.346])
      assert.deepStrictEqual(round(3.12385, [2, 3]), [3.12, 3.124])
    })
  })

  describe('DenseMatrix', function () {
    it('should round dense matrix', function () {
      assert.deepStrictEqual(round(matrix([[1.7, 2.3], [8.987, -3.565]])), matrix([[2, 2], [9, -4]]))
    })

    it('should round dense matrix and scalar', function () {
      assert.deepStrictEqual(round(matrix([[1.7777, 2.3456], [-90.8272, 0]]), 3), matrix([[1.778, 2.346], [-90.827, 0]]))
      assert.deepStrictEqual(round(3.12385, matrix([[2, 3], [0, 2]])), matrix([[3.12, 3.124], [3, 3.12]]))
      assert.deepStrictEqual(round(0.0, matrix([2, 3])), matrix([0, 0]))
    })
  })

  describe('SparseMatrix', function () {
    it('should round sparse matrix', function () {
      assert.deepStrictEqual(round(sparse([[1.7, 0], [8.987, -3.565]])), sparse([[2, 0], [9, -4]]))
    })

    it('should round sparse matrix and scalar', function () {
      assert.deepStrictEqual(round(sparse([[1.7777, 2.3456], [-90.8272, 0]]), 3), sparse([[1.778, 2.346], [-90.827, 0]]))
      assert.deepStrictEqual(round(3.12385, sparse([[2, 3], [0, 2]])), matrix([[3.12, 3.124], [3, 3.12]]))
      assert.deepStrictEqual(round(0.0, sparse([2, 3])), sparse([0, 0]))
    })
  })

  it('should LaTeX round', function () {
    const expr1 = math.parse('round(1.1)')
    const expr2 = math.parse('round(1.1,2)')

    assert.strictEqual(expr1.toTex(), '\\left\\lfloor1.1\\right\\rceil')
    assert.strictEqual(expr2.toTex(), '\\mathrm{round}\\left(1.1,2\\right)')
  })
})
