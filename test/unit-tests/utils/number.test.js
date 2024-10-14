// test number utils
import assert from 'assert'

import {
  digits,
  format,
  isInteger,
  nearlyEqual,
  roundDigits,
  sign,
  splitNumber,
  toExponential,
  toFixed,
  toPrecision
} from '../../../src/utils/number.js'

describe('number', function () {
  it('isInteger', function () {
    assert.strictEqual(isInteger(1), true)
    assert.strictEqual(isInteger(3), true)
    assert.strictEqual(isInteger(-4), true)
    assert.strictEqual(isInteger(0), true)
    assert.strictEqual(isInteger(12000), true)
    assert.strictEqual(isInteger(-3000), true)

    assert.strictEqual(isInteger(1.1), false)
    assert.strictEqual(isInteger(0.1), false)
    assert.strictEqual(isInteger(-2.3), false)
    assert.strictEqual(isInteger(-2.3), false)
    assert.strictEqual(isInteger(NaN), false)
  })

  it('sign', function () {
    assert.strictEqual(sign(1), 1)
    assert.strictEqual(sign(3), 1)
    assert.strictEqual(sign(4.5), 1)
    assert.strictEqual(sign(0.00234), 1)

    assert.strictEqual(sign(0), 0)

    assert.strictEqual(sign(-1), -1)
    assert.strictEqual(sign(-3), -1)
    assert.strictEqual(sign(-0.23), -1)
  })

  it('should count the number of significant digits of a number', function () {
    assert.strictEqual(digits(0), 0)
    assert.strictEqual(digits(2), 1)
    assert.strictEqual(digits(1234), 4)
    assert.strictEqual(digits(2.34), 3)
    assert.strictEqual(digits(3000), 1)
    assert.strictEqual(digits(0.0034), 2)
    assert.strictEqual(digits(120.5e50), 4)
    assert.strictEqual(digits(1120.5e+50), 5)
    assert.strictEqual(digits(120.52e-50), 5)
    assert.strictEqual(digits(Math.PI), 16)
  })

  it('should format a number using toFixed', function () {
    assert.strictEqual(toFixed(2.34), '2.34')
    assert.strictEqual(toFixed(2.34, 1), '2.3')
    assert.strictEqual(toFixed(-2.34, 1), '-2.3')
    assert.strictEqual(toFixed(2.34e10), '23400000000')
    assert.strictEqual(toFixed(2.34e10, 1), '23400000000.0')
    assert.strictEqual(toFixed(123456789.1234), '123456789.1234')
    assert.strictEqual(toFixed(2.34e30), '2340000000000000000000000000000') // test above the 21 digit limit of toPrecision
    assert.strictEqual(toFixed(2.34e30, 1), '2340000000000000000000000000000.0') // test above the 21 digit limit of toPrecision
    assert.strictEqual(toFixed(2.34e-10, 1), '0.0')
    assert.strictEqual(toFixed(2, 20), '2.00000000000000000000')
    assert.strictEqual(toFixed(2, 21), '2.000000000000000000000')
    assert.strictEqual(toFixed(2, 22), '2.0000000000000000000000')
    assert.strictEqual(toFixed(2, 30), '2.000000000000000000000000000000')
    assert.strictEqual(toFixed(-2e3, 0), '-2000')
    assert.strictEqual(toFixed(5.555, 1), '5.6')
    assert.strictEqual(toFixed(-5.555, 1), '-5.6')
    assert.strictEqual(toFixed(-0.005555), '-0.005555')
    assert.strictEqual(toFixed(-0.005555, 4), '-0.0056')
    assert.strictEqual(toFixed(-0.005555, 8), '-0.00555500')
    assert.strictEqual(toFixed(2.135, 2), '2.14')
    assert.strictEqual(toFixed(2.5, 0), '3')
    assert.strictEqual(toFixed(-2.5, 0), '-3')
  })

  it('should format a number using toPrecision', function () {
    assert.strictEqual(toPrecision(2.34), '2.34')
    assert.strictEqual(toPrecision(2.34, 2), '2.3')
    assert.strictEqual(toPrecision(-2.34, 2), '-2.3')
    assert.strictEqual(toPrecision(2.34e10, 2), '2.3e+10')
    assert.strictEqual(toPrecision(2.34e-10, 2), '2.3e-10')
    assert.strictEqual(toPrecision(2, 4), '2.000')
    assert.strictEqual(toPrecision(-0.005555, 2), '-0.0056')
    assert.strictEqual(toPrecision(2.135, 3), '2.14')

    // TODO: test upper and lower bounds here
  })

  it('should format a number using toExponential', function () {
    assert.strictEqual(toExponential(2.34), '2.34e+0')
    assert.strictEqual(toExponential(2.34e+3), '2.34e+3')
    assert.strictEqual(toExponential(2.34e-3), '2.34e-3')
    assert.strictEqual(toExponential(2.34e+3, 2), '2.3e+3')
    assert.strictEqual(toExponential(2.135, 3), '2.14e+0')
    assert.strictEqual(toExponential(2e+3, 20), '2.0000000000000000000e+3')
    assert.strictEqual(toExponential(2e+3, 21), '2.00000000000000000000e+3')
    assert.strictEqual(toExponential(2e+3, 22), '2.000000000000000000000e+3')
    assert.strictEqual(toExponential(2e+3, 30), '2.00000000000000000000000000000e+3')
  })

  describe('format', function () {
    it('should format special values Infinity, NaN', function () {
      assert.strictEqual(format(Infinity), 'Infinity')
      assert.strictEqual(format(-Infinity), '-Infinity')
      assert.strictEqual(format('no number'), 'NaN')
    })

    describe('should apply options', function () {
      it('fixed notation', function () {
        const options = { notation: 'fixed' }
        assert.strictEqual(format(0, options), '0')
        assert.strictEqual(format(123, options), '123')
        assert.strictEqual(format(123.456, options), '123.456')
        assert.strictEqual(format(123.7, options), '123.7')
        assert.strictEqual(format(-123.7, options), '-123.7')
        assert.strictEqual(format(-66, options), '-66')
        assert.strictEqual(format(0.123456, options), '0.123456')

        assert.strictEqual(format(123456789, options), '123456789')
        assert.strictEqual(format(-123456789, options), '-123456789')
        assert.strictEqual(format(123456789e+9, options), '123456789000000000')
        assert.strictEqual(format(123456789e+17, options), '12345678900000000000000000')
        assert.strictEqual(format(123456789e+18, options), '123456789000000000000000000')
        assert.strictEqual(format(123456789e+19, options), '1234567890000000000000000000')
        assert.strictEqual(format(123456789e+20, options), '12345678900000000000000000000')
        assert.strictEqual(format(123456789e+21, options), '123456789000000000000000000000')
        assert.strictEqual(format(123456789e+22, options), '1234567890000000000000000000000')

        assert.strictEqual(format(1e-18, options), '0.000000000000000001')
        assert.strictEqual(format(1e-22, options), '0.0000000000000000000001')
        assert.strictEqual(format(1e-32, options), '0.00000000000000000000000000000001')
      })

      it('fixed notation with precision', function () {
        const notation = 'fixed'
        const options = { notation, precision: 2 }

        assert.strictEqual(format(0, options), '0.00')
        assert.strictEqual(format(123, options), '123.00')
        assert.strictEqual(format(123.456, options), '123.46')
        assert.strictEqual(format(123.7, options), '123.70')
        assert.strictEqual(format(0.123456, options), '0.12')
        assert.strictEqual(format(-0.5555, options), '-0.56')

        assert.strictEqual(format(123456789, options), '123456789.00')
        assert.strictEqual(format(123456789e+9, options), '123456789000000000.00')
        assert.strictEqual(format(123456789e+18, options), '123456789000000000000000000.00')
        assert.strictEqual(format(123456789e+19, options), '1234567890000000000000000000.00')
        assert.strictEqual(format(123456789e+20, options), '12345678900000000000000000000.00')
        assert.strictEqual(format(123456789e+21, options), '123456789000000000000000000000.00')
        assert.strictEqual(format(123456789e+22, options), '1234567890000000000000000000000.00')

        assert.strictEqual(format(1.2e-14, options), '0.00')
        assert.strictEqual(format(1.3e-18, options), '0.00')
        assert.strictEqual(format(1.3e-19, options), '0.00')
        assert.strictEqual(format(1.3e-20, options), '0.00')
        assert.strictEqual(format(1.3e-21, options), '0.00')
        assert.strictEqual(format(1.3e-22, options), '0.00')

        assert.strictEqual(format(5.6789e-30, { notation, precision: 32 }),
          '0.00000000000000000000000000000568')
        assert.strictEqual(format(5.6999e-30, { notation, precision: 32 }),
          '0.00000000000000000000000000000570')

        assert.strictEqual(format(123.456, { notation, precision: 0 }), '123')
        assert.strictEqual(format(-123.456, { notation, precision: 0 }), '-123')
      })

      it('exponential notation', function () {
        const options = { notation: 'exponential' }
        assert.strictEqual(format(0, options), '0e+0')
        assert.strictEqual(format(123, options), '1.23e+2')
        assert.strictEqual(format(123.456, options), '1.23456e+2')
        assert.strictEqual(format(0.0123, options), '1.23e-2')
        assert.strictEqual(format(123456789, options), '1.23456789e+8')
        assert.strictEqual(format(123456789e+9, options), '1.23456789e+17')
        assert.strictEqual(format(123456789e-9, options), '1.23456789e-1')
      })

      it('exponential notation with precision', function () {
        const options = { notation: 'exponential', precision: 3 }
        assert.strictEqual(format(123, options), '1.23e+2')
        assert.strictEqual(format(123.456, options), '1.23e+2')
        assert.strictEqual(format(2, options), '2.00e+0')
      })

      it('auto notation', function () {
        assert.strictEqual(format(2 / 7), '0.2857142857142857')
        assert.strictEqual(format(0.10400), '0.104')
        assert.strictEqual(format(1000), '1000')
        // assert.strictEqual(format(-0.005), '-0.005')
        assert.strictEqual(format(-2300), '-2300')
        assert.strictEqual(format(-1.2e12), '-1.2e+12')

        assert.strictEqual(format(0), '0')

        assert.strictEqual(format(2.4e-7), '2.4e-7')
        assert.strictEqual(format(2.4e-6), '2.4e-6')
        assert.strictEqual(format(2.4e-5), '2.4e-5')
        assert.strictEqual(format(2.4e-4), '2.4e-4')
        assert.strictEqual(format(2.3e-3), '0.0023')
        assert.strictEqual(format(2.3e-2), '0.023')
        assert.strictEqual(format(2.3e-1), '0.23')
        assert.strictEqual(format(2.3), '2.3')
        assert.strictEqual(format(2.3e+1), '23')
        assert.strictEqual(format(2.3e+2), '230')
        assert.strictEqual(format(2.3e+3), '2300')
        assert.strictEqual(format(2.3e+4), '23000')
        assert.strictEqual(format(2.3e+5), '2.3e+5')
        assert.strictEqual(format(2.3e+6), '2.3e+6')

        assert.strictEqual(format(1.000000012), '1.000000012')
        assert.strictEqual(format(1000000012), '1.000000012e+9')

        assert.strictEqual(format(1234567), '1.234567e+6')
        assert.strictEqual(format(123456789123456), '1.23456789123456e+14')
        assert.strictEqual(format(123456789123456e-14), '1.23456789123456')
        assert.strictEqual(format(123456789123456789), '1.2345678912345678e+17') // eslint-disable-line no-loss-of-precision

        assert.strictEqual(format(0.1111e+6), '1.111e+5')
        assert.strictEqual(format(0.3333e+6), '3.333e+5')
        assert.strictEqual(format(0.6666e+6), '6.666e+5')
        assert.strictEqual(format(0.9999e+6), '9.999e+5')
        assert.strictEqual(format(1.111e+6), '1.111e+6')
      })

      it('auto notation with precision', function () {
        assert.strictEqual(format(1 / 3), '0.3333333333333333')
        assert.strictEqual(format(1 / 3, { precision: 3 }), '0.333')
        assert.strictEqual(format(1 / 3, { precision: 4 }), '0.3333')
        assert.strictEqual(format(1 / 3, { precision: 5 }), '0.33333')
        assert.strictEqual(format(0.05555, { precision: 2 }), '0.056')
        assert.strictEqual(format(-0.05555, { precision: 2 }), '-0.056')

        assert.strictEqual(format(1000.000, { precision: 5 }), '1000')
        assert.strictEqual(format(1000.0010, { precision: 5 }), '1000') // rounded off at 5 digits
        assert.strictEqual(format(1234, { precision: 3 }), '1230')
        assert.strictEqual(format(123.4, { precision: 6 }), '123.4')
        assert.strictEqual(format(0.001234, { precision: 3 }), '0.00123')

        assert.strictEqual(format(1234567, { precision: 4 }), '1.235e+6')
        assert.strictEqual(format(1234567, { precision: 2 }), '1.2e+6')
        assert.strictEqual(format(123e-6, { precision: 2 }), '1.2e-4')
        assert.strictEqual(format(123e-6, { precision: 8 }), '1.23e-4') // should remove trailing zeros
        assert.strictEqual(format(3e+6, { precision: 8 }), '3e+6') // should remove trailing zeros
        assert.strictEqual(format(1234, { precision: 2 }), '1200')

        // overflow the maximum allowed precision of 20
        assert.strictEqual(format(4, { precision: 30 }), '4')
      })

      it('auto notation with custom lower and upper bound', function () {
        const options = {
          lowerExp: -6,
          upperExp: 9
        }
        assert.strictEqual(format(0, options), '0')
        assert.strictEqual(format(1234567, options), '1234567')
        assert.strictEqual(format(1e+9, options), '1e+9')
        assert.strictEqual(format(1e+9 - 1, options), '999999999')
        assert.strictEqual(format(1e-6, options), '0.000001')
        assert.strictEqual(format(0.999e-6, options), '9.99e-7')
        assert.strictEqual(format(123456789123, options), '1.23456789123e+11')

        assert.strictEqual(format(Math.pow(2, 53), { upperExp: 20 }), '9007199254740992')
      })

      it('auto notation with custom lower bound', function () {
        const options = { lowerExp: -6 }
        assert.strictEqual(format(0, options), '0')
        assert.strictEqual(format(1e-6, options), '0.000001')
        assert.strictEqual(format(0.999e-6, options), '9.99e-7')
      })

      it('auto notation with very large custom lower bound', function () {
        assert.strictEqual(format(1, { lowerExp: -2 }), '1')
        assert.strictEqual(format(1e-1, { lowerExp: -2 }), '0.1')
        assert.strictEqual(format(1e-2, { lowerExp: -2 }), '0.01')
        assert.strictEqual(format(1e-3, { lowerExp: -2 }), '1e-3')
      })

      it('auto notation with very small custom lower bound', function () {
        assert.strictEqual(format(1, { lowerExp: -2 }), '1')
        assert.strictEqual(format(0.1, { lowerExp: -2 }), '0.1')
        assert.strictEqual(format(0.01, { lowerExp: -2 }), '0.01')
        assert.strictEqual(format(0.001, { lowerExp: -2 }), '1e-3')

        assert.strictEqual(format(0.009, { lowerExp: -2, precision: 1 }), '9e-3')
        assert.strictEqual(format(0.0096, { lowerExp: -2, precision: 1 }), '0.01')
        assert.strictEqual(format(0.01, { lowerExp: -2, precision: 1 }), '0.01')
        assert.strictEqual(format(0.001, { lowerExp: -2, precision: 1 }), '1e-3')

        assert.strictEqual(format(1e-18, { lowerExp: -30 }), '0.000000000000000001')
        assert.strictEqual(format(1e-19, { lowerExp: -30 }), '0.0000000000000000001')
        assert.strictEqual(format(1e-20, { lowerExp: -30 }), '0.00000000000000000001')
        assert.strictEqual(format(1e-21, { lowerExp: -30 }), '0.000000000000000000001')
        assert.strictEqual(format(1e-22, { lowerExp: -30 }), '0.0000000000000000000001')
        assert.strictEqual(format(1e-23, { lowerExp: -30 }), '0.00000000000000000000001')
        assert.strictEqual(format(1e-24, { lowerExp: -30 }), '0.000000000000000000000001')
      })

      it('auto notation with custom upper bound', function () {
        const options = { upperExp: 9 }
        assert.strictEqual(format(1e+9, options), '1e+9')
        assert.strictEqual(format(1e+9 - 1, options), '999999999')
      })

      it('auto notation with very large custom upper bound', function () {
        assert.strictEqual(format(1e+18, { upperExp: 30 }), '1000000000000000000')
        assert.strictEqual(format(1e+19, { upperExp: 30 }), '10000000000000000000')
        assert.strictEqual(format(1e+20, { upperExp: 30 }), '100000000000000000000')
        assert.strictEqual(format(1e+21, { upperExp: 30 }), '1000000000000000000000')
        assert.strictEqual(format(1e+22, { upperExp: 30 }), '10000000000000000000000')
        assert.strictEqual(format(1e+23, { upperExp: 30 }), '100000000000000000000000')
        assert.strictEqual(format(1e+24, { upperExp: 30 }), '1000000000000000000000000')
      })

      it('auto notation with very small custom upper bound', function () {
        assert.strictEqual(format(1, { upperExp: 2 }), '1')
        assert.strictEqual(format(1e1, { upperExp: 2 }), '10')
        assert.strictEqual(format(1e2, { upperExp: 2 }), '1e+2')
        assert.strictEqual(format(1e3, { upperExp: 2 }), '1e+3')
      })

      it('auto notation with custom precision, lower, and upper bound', function () {
        const options = {
          precision: 4,
          lowerExp: -6,
          upperExp: 9
        }

        assert.strictEqual(format(0, options), '0')
        assert.strictEqual(format(1234567, options), '1235000')
        assert.strictEqual(format(1e+9, options), '1e+9')
        assert.strictEqual(format(1.1e+9, options), '1.1e+9')
        assert.strictEqual(format(1e+9 - 1, options), '1e+9')
        assert.strictEqual(format(1e-6, options), '0.000001')
        assert.strictEqual(format(0.999e-6, options), '9.99e-7')
        assert.strictEqual(format(123456789123, options), '1.235e+11')
      })

      it('should throw an error on unknown notation', function () {
        assert.throws(function () {
          format(123, { notation: 'non existing' })
        })
      })

      it('should split a number into sign, coefficient, exponent', function () {
        assert.deepStrictEqual(splitNumber(0), { sign: '', coefficients: [0], exponent: 0 })
        assert.deepStrictEqual(splitNumber(2.3), { sign: '', coefficients: [2, 3], exponent: 0 })

        const a = splitNumber(2.3)
        assert.strictEqual(a.coefficients[0], 2)
        assert.strictEqual(a.coefficients[1], 3)
        assert.strictEqual(a.exponent, 0)

        assert.deepStrictEqual(splitNumber(-2.3), { sign: '-', coefficients: [2, 3], exponent: 0 })
        assert.deepStrictEqual(splitNumber('02.3'), { sign: '', coefficients: [2, 3], exponent: 0 })
        assert.deepStrictEqual(splitNumber(2300), { sign: '', coefficients: [2, 3], exponent: 3 })
        assert.deepStrictEqual(splitNumber(0.00023), { sign: '', coefficients: [2, 3], exponent: -4 })
        assert.deepStrictEqual(splitNumber('0.00023'), { sign: '', coefficients: [2, 3], exponent: -4 })
        assert.deepStrictEqual(splitNumber('000.0002300'), { sign: '', coefficients: [2, 3], exponent: -4 })
        assert.deepStrictEqual(splitNumber('002300'), { sign: '', coefficients: [2, 3], exponent: 3 })
        assert.deepStrictEqual(splitNumber('2.3e3'), { sign: '', coefficients: [2, 3], exponent: 3 })
        assert.deepStrictEqual(splitNumber('2.3e+3'), { sign: '', coefficients: [2, 3], exponent: 3 })
        assert.deepStrictEqual(splitNumber('-2.3e3'), { sign: '-', coefficients: [2, 3], exponent: 3 })
        assert.deepStrictEqual(splitNumber('23e3'), { sign: '', coefficients: [2, 3], exponent: 4 })
        assert.deepStrictEqual(splitNumber('-23e3'), { sign: '-', coefficients: [2, 3], exponent: 4 })
        assert.deepStrictEqual(splitNumber('2.3e-3'), { sign: '', coefficients: [2, 3], exponent: -3 })
        assert.deepStrictEqual(splitNumber('23e-3'), { sign: '', coefficients: [2, 3], exponent: -2 })
        assert.deepStrictEqual(splitNumber('000e+003'), { sign: '', coefficients: [0], exponent: 3 })
        assert.deepStrictEqual(splitNumber('-23e-3'), { sign: '-', coefficients: [2, 3], exponent: -2 })
        assert.deepStrictEqual(splitNumber('99.99'), { sign: '', coefficients: [9, 9, 9, 9], exponent: 1 })
      })

      it('should round digits of a a split number', function () {
        assert.deepStrictEqual(roundDigits(splitNumber(123456), 3), splitNumber(123000))
        assert.deepStrictEqual(roundDigits(splitNumber(123456), 4), splitNumber(123500))
        assert.deepStrictEqual(roundDigits(splitNumber(0.00555), 2), splitNumber(0.0056))
        assert.deepStrictEqual(roundDigits(splitNumber(99.99), 2), splitNumber(100))
      })

      it('should format a number with toFixed', function () {
        assert.strictEqual(toFixed(0), '0')
        assert.strictEqual(toFixed(2300), '2300')
        assert.strictEqual(toFixed(-2300), '-2300')
        assert.strictEqual(toFixed(19.9, 0), '20')
        assert.strictEqual(toFixed(99.9, 0), '100')
        assert.strictEqual(toFixed(99.5, 0), '100')
        assert.strictEqual(toFixed(99.4, 0), '99')
        assert.strictEqual(toFixed(2.3, 0), '2')
        assert.strictEqual(toFixed(2.5, 0), '3')
        assert.strictEqual(toFixed(2.9, 0), '3')
        assert.strictEqual(toFixed(1.5, 0), '2')
        assert.strictEqual(toFixed(-1.5, 0), '-2')
        assert.strictEqual(toFixed(123.45, 0), '123')
        assert.strictEqual(toFixed(0.005, 0), '0')
        assert.strictEqual(toFixed(0.7, 0), '1')

        assert.strictEqual(toFixed(0.15, 1), '0.2')
        assert.strictEqual(toFixed(123.4567, 1), '123.5')
        assert.strictEqual(toFixed(-123.4567, 1), '-123.5')
        assert.strictEqual(toFixed(0.23, 1), '0.2')
        assert.strictEqual(toFixed(0.005, 5), '0.00500')
        assert.strictEqual(toFixed(0.00567, 4), '0.0057')
        assert.strictEqual(toFixed(0.00999, 2), '0.01')
        assert.strictEqual(toFixed(0.00999, 3), '0.010')
        assert.strictEqual(toFixed(-0.00999, 3), '-0.010')

        assert.strictEqual(toFixed(NaN, 2), 'NaN')
        assert.strictEqual(toFixed(Infinity, 2), 'Infinity')
        assert.strictEqual(toFixed(-Infinity, 2), '-Infinity')
      })

      it('should format a number with toExponential', function () {
        assert.strictEqual(toExponential(0), '0e+0')
        assert.strictEqual(toExponential(0.15), '1.5e-1')
        assert.strictEqual(toExponential(1), '1e+0')
        assert.strictEqual(toExponential(-1), '-1e+0')
        assert.strictEqual(toExponential(1000), '1e+3')
        assert.strictEqual(toExponential(2300), '2.3e+3')
        assert.strictEqual(toExponential(-2300), '-2.3e+3')
        assert.strictEqual(toExponential(3.568), '3.568e+0')
        assert.strictEqual(toExponential(0.00123), '1.23e-3')
        assert.strictEqual(toExponential(-0.00123), '-1.23e-3')
        assert.strictEqual(toExponential('20.3e2'), '2.03e+3')

        assert.strictEqual(toExponential(0, 2), '0.0e+0')
        assert.strictEqual(toExponential(0.15, 1), '2e-1')
        assert.strictEqual(toExponential(1234, 2), '1.2e+3')
        assert.strictEqual(toExponential(-1234, 2), '-1.2e+3')
        assert.strictEqual(toExponential(1234, 6), '1.23400e+3')
        assert.strictEqual(toExponential(9999, 2), '1.0e+4')

        assert.strictEqual(toExponential(NaN, 2), 'NaN')
        assert.strictEqual(toExponential(Infinity, 2), 'Infinity')
        assert.strictEqual(toExponential(-Infinity, 2), '-Infinity')
      })

      it('should format a number with toPrecision', function () {
        assert.strictEqual(toPrecision(0), '0')
        assert.strictEqual(toPrecision(0.15), '0.15')
        assert.strictEqual(toPrecision(2300), '2300')
        assert.strictEqual(toPrecision(-2300), '-2300')
        assert.strictEqual(toPrecision(0.00123), '0.00123')
        assert.strictEqual(toPrecision(-0.00123), '-0.00123')
        assert.strictEqual(toPrecision(1.2e-8), '1.2e-8')

        assert.strictEqual(toPrecision(2300, 6), '2300.00')
        assert.strictEqual(toPrecision(1234.5678, 6), '1234.57')
        assert.strictEqual(toPrecision(1234.5678, 2), '1200')
        assert.strictEqual(toPrecision(1234, 2), '1200')
        assert.strictEqual(toPrecision(0.15, 1), '0.2')
        assert.strictEqual(toPrecision(0.004, 3), '0.00400')
        assert.strictEqual(toPrecision(0.00123456, 5), '0.0012346')
        assert.strictEqual(toPrecision(999, 2), '1000')
        assert.strictEqual(toPrecision(99900, 2), '1.0e+5')
        assert.strictEqual(toPrecision(99999, 2), '1.0e+5')
        assert.strictEqual(toPrecision(999e7, 2), '1.0e+10')
        assert.strictEqual(toPrecision(0.00999, 2), '0.010')
        assert.strictEqual(toPrecision(-0.00999, 2), '-0.010')

        assert.strictEqual(toPrecision(NaN, 2), 'NaN')
        assert.strictEqual(toPrecision(Infinity, 2), 'Infinity')
        assert.strictEqual(toPrecision(-Infinity, 2), '-Infinity')
      })

      it('should should throw an error on invalid input', function () {
        assert.throws(function () { splitNumber('2.3.4') }, /SyntaxError/)
        assert.throws(function () { splitNumber('2.3ee') }, /SyntaxError/)
        assert.throws(function () { splitNumber('2.3e4.3') }, /SyntaxError/)
        assert.throws(function () { splitNumber('2.3a') }, /SyntaxError/)
        assert.throws(function () { splitNumber('foo') }, /SyntaxError/)
        assert.throws(function () { splitNumber(NaN) }, /SyntaxError/)
        assert.throws(function () { splitNumber('NaN') }, /SyntaxError/)
        assert.throws(function () { splitNumber(new Date()) }, /SyntaxError/)
      })
    })

    it('should format numbers with precision as second parameter', function () {
      assert.strictEqual(format(1 / 3), '0.3333333333333333')
      assert.strictEqual(format(1 / 3, 5), '0.33333')
      assert.strictEqual(format(1 / 3, 3), '0.333')
      assert.strictEqual(format(2 / 3, 3), '0.667')
    })

    it('should format numbers with a custom formatting function', function () {
      function asCurrency (value) {
        return '$' + value.toFixed(2)
      }

      assert.strictEqual(format(12.4264, asCurrency), '$12.43')
      assert.strictEqual(format(0.1, asCurrency), '$0.10')
      assert.strictEqual(format(1.2e+6, asCurrency), '$1200000.00')
    })
  })

  describe('nearlyEqual', function () {
    it('should test whether two numbers are nearly equal', function () {
      const relTol = 1e-2
      const absTol = 1e-5
      assert.strictEqual(nearlyEqual(1, 0.9, relTol, absTol), false)
      assert.strictEqual(nearlyEqual(1, 0.95, relTol, absTol), false)
      assert.strictEqual(nearlyEqual(1, 0.98, relTol, absTol), false)
      assert.strictEqual(nearlyEqual(1, 0.991, relTol, absTol), true)
      assert.strictEqual(nearlyEqual(1, 1.1, relTol, absTol), false)
      assert.strictEqual(nearlyEqual(1, 1.05, relTol, absTol), false)
      assert.strictEqual(nearlyEqual(1, 1.02, relTol, absTol), false)
      assert.strictEqual(nearlyEqual(1, 1.01, relTol, absTol), true)
      assert.strictEqual(nearlyEqual(1, 1, relTol, absTol), true)

      // smaller absTol and relTol
      const relTol2 = 1e-4
      const absTol2 = 1e-7
      assert.strictEqual(nearlyEqual(1, 0.99, relTol2, absTol2), false)
      assert.strictEqual(nearlyEqual(1, 0.999, relTol2, absTol2), false)
      assert.strictEqual(nearlyEqual(1, 0.9999, relTol2, absTol2), true)

      // test one of these famous round-off errors
      assert.strictEqual((0.1 + 0.2) === 0.3, false)
      assert.strictEqual(nearlyEqual(0.1 + 0.2, 0.3, 1e-14), true)
    })

    it('should test whether a positive and negative number are nearly equal', function () {
      const relTol = 1e-3
      const absTol = 1e-6
      assert.strictEqual(nearlyEqual(1.2, 1.2, relTol, absTol), true)
      assert.strictEqual(nearlyEqual(1.2, -1.2, relTol, absTol), false)
      assert.strictEqual(nearlyEqual(-1.2, 1.2, relTol, absTol), false)
      assert.strictEqual(nearlyEqual(-1.2, -1.2, relTol, absTol), true)
    })

    it('should test whether two large numbers are nearly equal', function () {
      const relTol = 1e-2
      const absTol = 1e-5
      assert.strictEqual(nearlyEqual(1e200, 0.90e200, relTol, absTol), false)
      assert.strictEqual(nearlyEqual(1e200, 0.95e200, relTol, absTol), false)
      assert.strictEqual(nearlyEqual(1e200, 0.98e200, relTol, absTol), false)
      assert.strictEqual(nearlyEqual(1e200, 0.99e200, relTol, absTol), true)
    })

    it('should test whether two small numbers are nearly equal (always true)', function () {
      const relTol = 1e-2
      const absTol = 1e-5
      assert.strictEqual(nearlyEqual(1e-200, 0.99e-200, relTol, absTol), true)
      assert.strictEqual(nearlyEqual(1e-200, 10e-200, relTol, absTol), true) // FIXME: why is this true?
    })

    it('should compare with zero', function () {
      const relTol = 1e-3
      const absTol = 1e-6
      assert.strictEqual(nearlyEqual(0, 0, relTol, absTol), true)
      assert.strictEqual(nearlyEqual(0, -0, relTol, absTol), true)
      assert.strictEqual(nearlyEqual(0, 1.2, relTol, absTol), false)
      assert.strictEqual(nearlyEqual(0, 1e30, relTol, absTol), false)
      assert.strictEqual(nearlyEqual(0, 1e-30, relTol, absTol), true) // FIXME: why is this true?
    })

    it('should compare with Infinity', function () {
      const relTol = 1e-3
      const absTol = 1e-6

      assert.strictEqual(nearlyEqual(1.2, Infinity, relTol, absTol), false)
      assert.strictEqual(nearlyEqual(Infinity, 1.2, relTol, absTol), false)
      assert.strictEqual(nearlyEqual(Infinity, Infinity, relTol, absTol), true)
      assert.strictEqual(nearlyEqual(Infinity, -Infinity, relTol, absTol), false)
      assert.strictEqual(nearlyEqual(-Infinity, Infinity, relTol, absTol), false)
      assert.strictEqual(nearlyEqual(-Infinity, -Infinity, relTol, absTol), true)
    })

    it('should compare with NaN', function () {
      const relTol = 1e-3
      const absTol = 1e-6
      assert.strictEqual(nearlyEqual(1.2, NaN, relTol, absTol), false)
      assert.strictEqual(nearlyEqual(NaN, 1.2, relTol, absTol), false)
      assert.strictEqual(nearlyEqual(NaN, NaN, relTol, absTol), false)
    })

    it('should use default values when absTol and relTol are undefined', function () {
      assert.strictEqual(nearlyEqual(1.2, 1.2), true)
      assert.strictEqual(nearlyEqual(1.2, 1.2, undefined), true)
      assert.strictEqual(nearlyEqual(1.2, 1.2, undefined, undefined), true)

      assert.strictEqual(nearlyEqual(0.1 + 0.2, 0.3), true)
      assert.strictEqual(nearlyEqual(0.1 + 0.2, 0.3, undefined), true)
      assert.strictEqual(nearlyEqual(0.1 + 0.2, 0.3, undefined, undefined), true)

      assert.strictEqual(nearlyEqual(1.2 + 1e-7, 1.2), false)
      assert.strictEqual(nearlyEqual(1.2 + 1e-7, 1.2, undefined), false)
      assert.strictEqual(nearlyEqual(1.2 + 1e-7, 1.2, undefined, undefined), false)
    })
  })
})
