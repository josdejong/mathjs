// test round
import assert from 'assert'

import { approxEqual } from '../../../../tools/approx.js'
import math from '../../../../src/defaultInstance.js'
const bignumber = math.bignumber
const complex = math.complex
const fraction = math.fraction
const matrix = math.matrix
const sparse = math.sparse
const round = math.round
const unit = math.unit
const math2 = math.create()

//                                        1         2         3         4         5         6
//                            xx.1234567890123456789012345678901234567890123456789012345678901234
const testBigNum = bignumber('10.9999999999999999999999999999999999999999999999999999999999999998')

describe('round', function () {
  it('should round a number to te given number of decimals', function () {
    approxEqual(round(math.pi), 3)
    approxEqual(round(math.pi * 1000), 3142)
    approxEqual(round(math.pi, 3), 3.142)
    approxEqual(round(math.pi, 6), 3.141593)
    approxEqual(round(1234.5678, 2), 1234.57)
    approxEqual(round(2.135, 2), 2.14)

    assert.strictEqual(round(2.7), 3)
    assert.strictEqual(round(2.5), 3)
    assert.strictEqual(round(2.5, 0), 3)
    assert.strictEqual(round(-2.5), -3)
    assert.strictEqual(round(-2.7), -3)
    assert.strictEqual(round(-2.5, 0), -3)
    assert.strictEqual(round(6.999999999999998, 15), 6.999999999999998)
    assert.strictEqual(round(6.999999999999998, 14), 7)
    assert.strictEqual(round(2.555555555555555, 13), 2.5555555555556)
  })

  it('should round booleans (yeah, not really useful but it should be supported)', function () {
    approxEqual(round(true), 1)
    approxEqual(round(false), 0)
    approxEqual(round(true, 2), 1)
    approxEqual(round(false, 2), 0)
  })

  it('should throw an error on invalid type of value', function () {
    assert.throws(function () { round(new Date()) }, /TypeError: Unexpected type of argument/)
  })

  it('should throw an error on invalid type of n', function () {
    assert.throws(function () { round(math.pi, new Date()) }, /TypeError: Unexpected type of argument/)
  })

  it('should throw an error on invalid value of n', function () {
    assert.throws(function () { round(math.pi, -2) }, /Number of decimals in function round must be .* 0 .* 15/)
    assert.throws(function () { round(math.pi, 20) }, /Number of decimals in function round must be .* 0 .* 15/)
    assert.throws(function () { round(math.pi, 2.5) }, /Number of decimals in function round must be an integer/)
    assert.throws(function () { round(1, 1.2) }, /Error: Number of decimals in function round must be an integer/)
    assert.throws(function () { round(1, bignumber(1.2)) }, /Error: Number of decimals in function round must be an integer/)
    assert.throws(function () { round(complex(1, 1), 1.2) }, /Error: Number of decimals in function round must be an integer/)
    assert.throws(function () { round(complex(1, 1), bignumber(1.2)) }, /Error: Number of decimals in function round must be an integer/)
    assert.throws(function () { round(bignumber(1.2), bignumber(1.2)) }, /Error: Number of decimals in function round must be an integer/)
    assert.throws(function () { round(round(fraction('1/2'), 1.2)) }, /Error: Number of decimals in function round must be an integer/)
  })

  it('should throw an error if used with wrong number of arguments', function () {
    assert.throws(function () { round() }, /TypeError: Too few arguments/)
    assert.throws(function () { round(1, 2, 3) }, /TypeError: Too many arguments/)
  })

  it('should throw an in case of wrong type of arguments', function () {
    assert.throws(function () { round(null) }, /TypeError: Unexpected type of argument/)
  })

  it('should be safe to call with a bigint', function () {
    const b = 12345678901234567890n
    assert.strictEqual(round(b), b)
    assert.strictEqual(round(b, 7), b)
  })

  it('should round bignumbers', function () {
    assert.deepStrictEqual(round(bignumber(0.145 * 100)), bignumber(15))
    assert.deepStrictEqual(round(bignumber(0.145 * 100), bignumber(0)), bignumber(15))
    assert.deepStrictEqual(round(testBigNum, bignumber(63)), bignumber(11))
    assert.deepStrictEqual(round(testBigNum, bignumber(64)), testBigNum)
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
    assert.deepStrictEqual(round(fraction(2, 3), bignumber(2)), fraction(67, 100))
  })

  it('should gracefully handle round-off errors', function () {
    assert.strictEqual(round(0.145 * 100), 15)
    assert.strictEqual(round((0.145 * 100), 0), 15)
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
    assert.deepStrictEqual(round(complex(2.2, math.pi)), complex(2, 3))
  })

  it('should round a complex number with a bignumber as number of decimals', function () {
    assert.deepStrictEqual(round(complex(2.157, math.pi), bignumber(2)), complex(2.16, 3.14))
  })

  it('should round units', function () {
    assert.deepStrictEqual(round(unit('3.12345 cm'), 3, unit('cm')), unit('3.123 cm'))
    assert.deepStrictEqual(round(unit('3.12345 cm'), unit('cm')), unit('3 cm'))
    assert.deepStrictEqual(round(unit('2 inch'), unit('cm')), unit('5 cm'))
    assert.deepStrictEqual(round(unit('2 inch'), 1, unit('cm')), unit('5.1 cm'))

    // bignumber values
    assert.deepStrictEqual(round(unit('3.12345 cm'), bignumber(2), unit('cm')), unit('3.12 cm'))
    assert.deepStrictEqual(round(unit(bignumber('2'), 'inch'), unit('cm')), unit(bignumber('5'), 'cm'))
    assert.deepStrictEqual(round(unit(bignumber('2'), 'inch'), bignumber(1), unit('cm')), unit(bignumber('5.1'), 'cm'))

    // first argument is a collection
    assert.deepStrictEqual(round([unit('2 inch'), unit('3 inch')], unit('cm')), [unit('5 cm'), unit('8 cm')])
    assert.deepStrictEqual(round(matrix([unit('2 inch'), unit('3 inch')]), unit('cm')), matrix([unit('5 cm'), unit('8 cm')]))
  })

  it('should throw an error if used with a unit without valueless unit', function () {
    assert.throws(function () { round(unit('5cm')) }, TypeError, 'Function round(unit) not supported')
    assert.throws(function () { round(unit('5cm'), 2) }, TypeError, 'Function round(unit) not supported')
    assert.throws(function () { round(unit('5cm'), bignumber(2)) }, TypeError, 'Function round(unit) not supported')
  })

  it('should throw an error if used with a unit with a second unit that is not valueless', function () {
    assert.throws(function () { round(unit('2 inch'), 1, unit('10 cm')) }, Error)
    assert.throws(function () { round(unit('2 inch'), unit('10 cm')) }, Error)
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

  describe('changing config.relTol during runtime', function () {
    it('uses default config.relTol of 1e-12', function () {
      assert.strictEqual(math2.round((0.000000000001459), 12), 1e-12)
      assert.deepStrictEqual(math2.round(bignumber(1.49e-12), bignumber(12)), bignumber(1e-12))
    })

    it('uses updated config.relTol value', function () {
      math2.config({ relTol: 1e-13 })
      assert.strictEqual(math2.round((0.000000000001459), 12), 1e-12)
      assert.deepStrictEqual(math2.round(bignumber(1.49e-12), bignumber(12)), bignumber(1e-12))
    })
  })

  describe('Array', function () {
    it('should round array', function () {
      assert.deepStrictEqual(round([1.7, 2.3]), [2, 2])
    })

    it('should round array and scalar', function () {
      assert.deepStrictEqual(round([1.7777, 2.3456], 3), [1.778, 2.346])
      assert.deepStrictEqual(round(3.12385, [2, 3]), [3.12, 3.124])
      assert.deepStrictEqual(round(fraction(44, 7), [2, 3]),
        [fraction(629, 100), fraction(6286, 1000)])
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
      assert.deepStrictEqual(round(complex(2.7182, 6.2831), matrix([2, 3])),
        matrix([complex(2.72, 6.28), complex(2.718, 6.283)]))
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
      assert.deepStrictEqual(round(bignumber(6.28318), sparse([0, 4])),
        matrix([[bignumber(6)], [bignumber(6.2832)]]))
    })
  })

  it('should LaTeX round', function () {
    const expr1 = math.parse('round(1.1)')
    const expr2 = math.parse('round(1.1,2)')

    assert.strictEqual(expr1.toTex(), '\\left\\lfloor1.1\\right\\rceil')
    assert.strictEqual(expr2.toTex(), '\\mathrm{round}\\left(1.1,2\\right)')
  })
})
