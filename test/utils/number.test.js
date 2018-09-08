// test number utils
const assert = require('assert')
const number = require('../../src/utils/number')

describe('number', function () {
  it('isInteger', function () {
    assert.strictEqual(number.isInteger(1), true)
    assert.strictEqual(number.isInteger(3), true)
    assert.strictEqual(number.isInteger(-4), true)
    assert.strictEqual(number.isInteger(0), true)
    assert.strictEqual(number.isInteger(12000), true)
    assert.strictEqual(number.isInteger(-3000), true)

    assert.strictEqual(number.isInteger(1.1), false)
    assert.strictEqual(number.isInteger(0.1), false)
    assert.strictEqual(number.isInteger(-2.3), false)
    assert.strictEqual(number.isInteger(-2.3), false)
    assert.strictEqual(number.isInteger(NaN), false)
  })

  it('isNumber', function () {
    assert.strictEqual(number.isNumber(1), true)
    assert.strictEqual(number.isNumber(2e+3), true)
    assert.strictEqual(number.isNumber(Number(2.3)), true)
    assert.strictEqual(number.isNumber(NaN), true)
    assert.strictEqual(number.isNumber(-23), true)
    assert.strictEqual(number.isNumber(parseFloat('123')), true)

    assert.strictEqual(number.isNumber('23'), false)
    assert.strictEqual(number.isNumber('str'), false)
    assert.strictEqual(number.isNumber(new Date()), false)
    assert.strictEqual(number.isNumber({}), false)
    assert.strictEqual(number.isNumber([]), false)
    assert.strictEqual(number.isNumber(/regexp/), false)
    assert.strictEqual(number.isNumber(true), false)
    assert.strictEqual(number.isNumber(false), false)
    assert.strictEqual(number.isNumber(null), false)
    assert.strictEqual(number.isNumber(undefined), false)
    assert.strictEqual(number.isNumber(), false)
  })

  it('sign', function () {
    assert.strictEqual(number.sign(1), 1)
    assert.strictEqual(number.sign(3), 1)
    assert.strictEqual(number.sign(4.5), 1)
    assert.strictEqual(number.sign(0.00234), 1)

    assert.strictEqual(number.sign(0), 0)

    assert.strictEqual(number.sign(-1), -1)
    assert.strictEqual(number.sign(-3), -1)
    assert.strictEqual(number.sign(-0.23), -1)
  })

  it('should count the number of significant digits of a number', function () {
    assert.strictEqual(number.digits(0), 0)
    assert.strictEqual(number.digits(2), 1)
    assert.strictEqual(number.digits(1234), 4)
    assert.strictEqual(number.digits(2.34), 3)
    assert.strictEqual(number.digits(3000), 1)
    assert.strictEqual(number.digits(0.0034), 2)
    assert.strictEqual(number.digits(120.5e50), 4)
    assert.strictEqual(number.digits(1120.5e+50), 5)
    assert.strictEqual(number.digits(120.52e-50), 5)
    assert.strictEqual(number.digits(Math.PI), 16)
  })

  it('should format a number using toFixed', function () {
    assert.strictEqual(number.toFixed(2.34), '2.34')
    assert.strictEqual(number.toFixed(2.34, 1), '2.3')
    assert.strictEqual(number.toFixed(-2.34, 1), '-2.3')
    assert.strictEqual(number.toFixed(2.34e10), '23400000000')
    assert.strictEqual(number.toFixed(2.34e10, 1), '23400000000.0')
    assert.strictEqual(number.toFixed(123456789.1234), '123456789.1234')
    assert.strictEqual(number.toFixed(2.34e30), '2340000000000000000000000000000') // test above the 21 digit limit of toPrecision
    assert.strictEqual(number.toFixed(2.34e30, 1), '2340000000000000000000000000000.0') // test above the 21 digit limit of toPrecision
    assert.strictEqual(number.toFixed(2.34e-10, 1), '0.0')
    assert.strictEqual(number.toFixed(2, 20), '2.00000000000000000000')
    assert.strictEqual(number.toFixed(2, 21), '2.000000000000000000000')
    assert.strictEqual(number.toFixed(2, 22), '2.0000000000000000000000')
    assert.strictEqual(number.toFixed(2, 30), '2.000000000000000000000000000000')
    assert.strictEqual(number.toFixed(-2e3, 0), '-2000')
    assert.strictEqual(number.toFixed(5.555, 1), '5.6')
    assert.strictEqual(number.toFixed(-5.555, 1), '-5.6')
    assert.strictEqual(number.toFixed(-0.005555), '-0.005555')
    assert.strictEqual(number.toFixed(-0.005555, 4), '-0.0056')
    assert.strictEqual(number.toFixed(-0.005555, 8), '-0.00555500')
    assert.strictEqual(number.toFixed(2.135, 2), '2.14')
  })

  it('should format a number using toPrecision', function () {
    assert.strictEqual(number.toPrecision(2.34), '2.34')
    assert.strictEqual(number.toPrecision(2.34, 2), '2.3')
    assert.strictEqual(number.toPrecision(-2.34, 2), '-2.3')
    assert.strictEqual(number.toPrecision(2.34e10, 2), '2.3e+10')
    assert.strictEqual(number.toPrecision(2.34e-10, 2), '2.3e-10')
    assert.strictEqual(number.toPrecision(2, 4), '2.000')
    assert.strictEqual(number.toPrecision(-0.005555, 2), '-0.0056')
    assert.strictEqual(number.toPrecision(2.135, 3), '2.14')

    // TODO: test upper and lower bounds here
  })

  it('should format a number using toExponential', function () {
    assert.strictEqual(number.toExponential(2.34), '2.34e+0')
    assert.strictEqual(number.toExponential(2.34e+3), '2.34e+3')
    assert.strictEqual(number.toExponential(2.34e-3), '2.34e-3')
    assert.strictEqual(number.toExponential(2.34e+3, 2), '2.3e+3')
    assert.strictEqual(number.toExponential(2.135, 3), '2.14e+0')
    assert.strictEqual(number.toExponential(2e+3, 20), '2.0000000000000000000e+3')
    assert.strictEqual(number.toExponential(2e+3, 21), '2.00000000000000000000e+3')
    assert.strictEqual(number.toExponential(2e+3, 22), '2.000000000000000000000e+3')
    assert.strictEqual(number.toExponential(2e+3, 30), '2.00000000000000000000000000000e+3')
  })

  describe('format', function () {
    it('should format special values Infinity, NaN', function () {
      assert.strictEqual(number.format(Infinity), 'Infinity')
      assert.strictEqual(number.format(-Infinity), '-Infinity')
      assert.strictEqual(number.format('no number'), 'NaN')
    })

    describe('should apply options', function () {
      it('fixed notation', function () {
        const options = { notation: 'fixed' }
        assert.strictEqual(number.format(0, options), '0')
        assert.strictEqual(number.format(123, options), '123')
        assert.strictEqual(number.format(123.456, options), '123.456')
        assert.strictEqual(number.format(123.7, options), '123.7')
        assert.strictEqual(number.format(-123.7, options), '-123.7')
        assert.strictEqual(number.format(-66, options), '-66')
        assert.strictEqual(number.format(0.123456, options), '0.123456')

        assert.strictEqual(number.format(123456789, options), '123456789')
        assert.strictEqual(number.format(-123456789, options), '-123456789')
        assert.strictEqual(number.format(123456789e+9, options), '123456789000000000')
        assert.strictEqual(number.format(123456789e+17, options), '12345678900000000000000000')
        assert.strictEqual(number.format(123456789e+18, options), '123456789000000000000000000')
        assert.strictEqual(number.format(123456789e+19, options), '1234567890000000000000000000')
        assert.strictEqual(number.format(123456789e+20, options), '12345678900000000000000000000')
        assert.strictEqual(number.format(123456789e+21, options), '123456789000000000000000000000')
        assert.strictEqual(number.format(123456789e+22, options), '1234567890000000000000000000000')

        assert.strictEqual(number.format(1e-18, options), '0.000000000000000001')
        assert.strictEqual(number.format(1e-22, options), '0.0000000000000000000001')
        assert.strictEqual(number.format(1e-32, options), '0.00000000000000000000000000000001')
      })

      it('fixed notation with precision', function () {
        const options = { notation: 'fixed', precision: 2 }

        assert.strictEqual(number.format(0, options), '0.00')
        assert.strictEqual(number.format(123, options), '123.00')
        assert.strictEqual(number.format(123.456, options), '123.46')
        assert.strictEqual(number.format(123.7, options), '123.70')
        assert.strictEqual(number.format(0.123456, options), '0.12')
        assert.strictEqual(number.format(-0.5555, options), '-0.56')

        assert.strictEqual(number.format(123456789, options), '123456789.00')
        assert.strictEqual(number.format(123456789e+9, options), '123456789000000000.00')
        assert.strictEqual(number.format(123456789e+18, options), '123456789000000000000000000.00')
        assert.strictEqual(number.format(123456789e+19, options), '1234567890000000000000000000.00')
        assert.strictEqual(number.format(123456789e+20, options), '12345678900000000000000000000.00')
        assert.strictEqual(number.format(123456789e+21, options), '123456789000000000000000000000.00')
        assert.strictEqual(number.format(123456789e+22, options), '1234567890000000000000000000000.00')

        assert.strictEqual(number.format(1.2e-14, options), '0.00')
        assert.strictEqual(number.format(1.3e-18, options), '0.00')
        assert.strictEqual(number.format(1.3e-19, options), '0.00')
        assert.strictEqual(number.format(1.3e-20, options), '0.00')
        assert.strictEqual(number.format(1.3e-21, options), '0.00')
        assert.strictEqual(number.format(1.3e-22, options), '0.00')

        assert.strictEqual(number.format(5.6789e-30, { notation: 'fixed', precision: 32 }),
          '0.00000000000000000000000000000568')
        assert.strictEqual(number.format(5.6999e-30, { notation: 'fixed', precision: 32 }),
          '0.00000000000000000000000000000570')
      })

      it('exponential notation', function () {
        const options = { notation: 'exponential' }
        assert.strictEqual(number.format(0, options), '0e+0')
        assert.strictEqual(number.format(123, options), '1.23e+2')
        assert.strictEqual(number.format(123.456, options), '1.23456e+2')
        assert.strictEqual(number.format(0.0123, options), '1.23e-2')
        assert.strictEqual(number.format(123456789, options), '1.23456789e+8')
        assert.strictEqual(number.format(123456789e+9, options), '1.23456789e+17')
        assert.strictEqual(number.format(123456789e-9, options), '1.23456789e-1')
      })

      it('exponential notation with precision', function () {
        const options = { notation: 'exponential', precision: 3 }
        assert.strictEqual(number.format(123, options), '1.23e+2')
        assert.strictEqual(number.format(123.456, options), '1.23e+2')
        assert.strictEqual(number.format(2, options), '2.00e+0')
      })

      it('auto notation', function () {
        assert.strictEqual(number.format(2 / 7), '0.2857142857142857')
        assert.strictEqual(number.format(0.10400), '0.104')
        assert.strictEqual(number.format(1000), '1000')
        // assert.strictEqual(number.format(-0.005), '-0.005')
        assert.strictEqual(number.format(-2300), '-2300')
        assert.strictEqual(number.format(-1.2e12), '-1.2e+12')

        assert.strictEqual(number.format(0), '0')

        assert.strictEqual(number.format(2.4e-7), '2.4e-7')
        assert.strictEqual(number.format(2.4e-6), '2.4e-6')
        assert.strictEqual(number.format(2.4e-5), '2.4e-5')
        assert.strictEqual(number.format(2.4e-4), '2.4e-4')
        assert.strictEqual(number.format(2.3e-3), '0.0023')
        assert.strictEqual(number.format(2.3e-2), '0.023')
        assert.strictEqual(number.format(2.3e-1), '0.23')
        assert.strictEqual(number.format(2.3), '2.3')
        assert.strictEqual(number.format(2.3e+1), '23')
        assert.strictEqual(number.format(2.3e+2), '230')
        assert.strictEqual(number.format(2.3e+3), '2300')
        assert.strictEqual(number.format(2.3e+4), '23000')
        assert.strictEqual(number.format(2.3e+5), '2.3e+5')
        assert.strictEqual(number.format(2.3e+6), '2.3e+6')

        assert.strictEqual(number.format(1.000000012), '1.000000012')
        assert.strictEqual(number.format(1000000012), '1.000000012e+9')

        assert.strictEqual(number.format(1234567), '1.234567e+6')
        assert.strictEqual(number.format(123456789123456), '1.23456789123456e+14')
        assert.strictEqual(number.format(123456789123456e-14), '1.23456789123456')
        assert.strictEqual(number.format(123456789123456789), '1.2345678912345678e+17')

        assert.strictEqual(number.format(0.1111e+6), '1.111e+5')
        assert.strictEqual(number.format(0.3333e+6), '3.333e+5')
        assert.strictEqual(number.format(0.6666e+6), '6.666e+5')
        assert.strictEqual(number.format(0.9999e+6), '9.999e+5')
        assert.strictEqual(number.format(1.111e+6), '1.111e+6')
      })

      it('auto notation with precision', function () {
        assert.strictEqual(number.format(1 / 3), '0.3333333333333333')
        assert.strictEqual(number.format(1 / 3, { precision: 3 }), '0.333')
        assert.strictEqual(number.format(1 / 3, { precision: 4 }), '0.3333')
        assert.strictEqual(number.format(1 / 3, { precision: 5 }), '0.33333')
        assert.strictEqual(number.format(0.05555, { precision: 2 }), '0.056')
        assert.strictEqual(number.format(-0.05555, { precision: 2 }), '-0.056')

        assert.strictEqual(number.format(1000.000, { precision: 5 }), '1000')
        assert.strictEqual(number.format(1000.0010, { precision: 5 }), '1000') // rounded off at 5 digits
        assert.strictEqual(number.format(1234, { precision: 3 }), '1230')
        assert.strictEqual(number.format(123.4, { precision: 6 }), '123.4')
        assert.strictEqual(number.format(0.001234, { precision: 3 }), '0.00123')

        assert.strictEqual(number.format(1234567, { precision: 4 }), '1.235e+6')
        assert.strictEqual(number.format(1234567, { precision: 2 }), '1.2e+6')
        assert.strictEqual(number.format(123e-6, { precision: 2 }), '1.2e-4')
        assert.strictEqual(number.format(123e-6, { precision: 8 }), '1.23e-4') // should remove trailing zeros
        assert.strictEqual(number.format(3e+6, { precision: 8 }), '3e+6') // should remove trailing zeros
        assert.strictEqual(number.format(1234, { precision: 2 }), '1200')

        // overflow the maximum allowed precision of 20
        assert.strictEqual(number.format(4, { precision: 30 }), '4')
      })

      it('auto notation with custom lower and upper bound', function () {
        const options = {
          lowerExp: -6,
          upperExp: 9
        }
        assert.strictEqual(number.format(0, options), '0')
        assert.strictEqual(number.format(1234567, options), '1234567')
        assert.strictEqual(number.format(1e+9, options), '1e+9')
        assert.strictEqual(number.format(1e+9 - 1, options), '999999999')
        assert.strictEqual(number.format(1e-6, options), '0.000001')
        assert.strictEqual(number.format(0.999e-6, options), '9.99e-7')
        assert.strictEqual(number.format(123456789123, options), '1.23456789123e+11')

        assert.strictEqual(number.format(Math.pow(2, 53), { upperExp: 20 }), '9007199254740992')
      })

      it('auto notation with custom lower bound', function () {
        const options = { lowerExp: -6 }
        assert.strictEqual(number.format(0, options), '0')
        assert.strictEqual(number.format(1e-6, options), '0.000001')
        assert.strictEqual(number.format(0.999e-6, options), '9.99e-7')
      })

      it('auto notation with very large custom lower bound', function () {
        assert.strictEqual(number.format(1, { lowerExp: -2 }), '1')
        assert.strictEqual(number.format(1e-1, { lowerExp: -2 }), '0.1')
        assert.strictEqual(number.format(1e-2, { lowerExp: -2 }), '0.01')
        assert.strictEqual(number.format(1e-3, { lowerExp: -2 }), '1e-3')
      })

      it('auto notation with very small custom lower bound', function () {
        assert.strictEqual(number.format(1e-18, { lowerExp: -30 }), '0.000000000000000001')
        assert.strictEqual(number.format(1e-19, { lowerExp: -30 }), '0.0000000000000000001')
        assert.strictEqual(number.format(1e-20, { lowerExp: -30 }), '0.00000000000000000001')
        assert.strictEqual(number.format(1e-21, { lowerExp: -30 }), '0.000000000000000000001')
        assert.strictEqual(number.format(1e-22, { lowerExp: -30 }), '0.0000000000000000000001')
        assert.strictEqual(number.format(1e-23, { lowerExp: -30 }), '0.00000000000000000000001')
        assert.strictEqual(number.format(1e-24, { lowerExp: -30 }), '0.000000000000000000000001')
      })

      it('auto notation with custom upper bound', function () {
        const options = { upperExp: 9 }
        assert.strictEqual(number.format(1e+9, options), '1e+9')
        assert.strictEqual(number.format(1e+9 - 1, options), '999999999')
      })

      it('auto notation with very large custom upper bound', function () {
        assert.strictEqual(number.format(1e+18, { upperExp: 30 }), '1000000000000000000')
        assert.strictEqual(number.format(1e+19, { upperExp: 30 }), '10000000000000000000')
        assert.strictEqual(number.format(1e+20, { upperExp: 30 }), '100000000000000000000')
        assert.strictEqual(number.format(1e+21, { upperExp: 30 }), '1000000000000000000000')
        assert.strictEqual(number.format(1e+22, { upperExp: 30 }), '10000000000000000000000')
        assert.strictEqual(number.format(1e+23, { upperExp: 30 }), '100000000000000000000000')
        assert.strictEqual(number.format(1e+24, { upperExp: 30 }), '1000000000000000000000000')
      })

      it('auto notation with very small custom upper bound', function () {
        assert.strictEqual(number.format(1, { upperExp: 2 }), '1')
        assert.strictEqual(number.format(1e1, { upperExp: 2 }), '10')
        assert.strictEqual(number.format(1e2, { upperExp: 2 }), '1e+2')
        assert.strictEqual(number.format(1e3, { upperExp: 2 }), '1e+3')
      })

      it('auto notation with custom precision, lower, and upper bound', function () {
        const options = {
          precision: 4,
          lowerExp: -6,
          upperExp: 9
        }

        assert.strictEqual(number.format(0, options), '0')
        assert.strictEqual(number.format(1234567, options), '1235000')
        assert.strictEqual(number.format(1e+9, options), '1e+9')
        assert.strictEqual(number.format(1.1e+9, options), '1.1e+9')
        assert.strictEqual(number.format(1e+9 - 1, options), '1000000000')
        assert.strictEqual(number.format(1e-6, options), '0.000001')
        assert.strictEqual(number.format(0.999e-6, options), '9.99e-7')
        assert.strictEqual(number.format(123456789123, options), '1.235e+11')
      })

      it('should throw an error on unknown notation', function () {
        assert.throws(function () {
          number.format(123, { notation: 'non existing' })
        })
      })

      it('should split a number into sign, coefficient, exponent', function () {
        assert.deepStrictEqual(number.splitNumber(0), { sign: '', coefficients: [0], exponent: 0 })
        assert.deepStrictEqual(number.splitNumber(2.3), { sign: '', coefficients: [2, 3], exponent: 0 })

        const a = number.splitNumber(2.3)
        assert.strictEqual(a.coefficients[0], 2)
        assert.strictEqual(a.coefficients[1], 3)
        assert.strictEqual(a.exponent, 0)

        assert.deepStrictEqual(number.splitNumber(-2.3), { sign: '-', coefficients: [2, 3], exponent: 0 })
        assert.deepStrictEqual(number.splitNumber('02.3'), { sign: '', coefficients: [2, 3], exponent: 0 })
        assert.deepStrictEqual(number.splitNumber(2300), { sign: '', coefficients: [2, 3], exponent: 3 })
        assert.deepStrictEqual(number.splitNumber(0.00023), { sign: '', coefficients: [2, 3], exponent: -4 })
        assert.deepStrictEqual(number.splitNumber('0.00023'), { sign: '', coefficients: [2, 3], exponent: -4 })
        assert.deepStrictEqual(number.splitNumber('000.0002300'), { sign: '', coefficients: [2, 3], exponent: -4 })
        assert.deepStrictEqual(number.splitNumber('002300'), { sign: '', coefficients: [2, 3], exponent: 3 })
        assert.deepStrictEqual(number.splitNumber('2.3e3'), { sign: '', coefficients: [2, 3], exponent: 3 })
        assert.deepStrictEqual(number.splitNumber('2.3e+3'), { sign: '', coefficients: [2, 3], exponent: 3 })
        assert.deepStrictEqual(number.splitNumber('-2.3e3'), { sign: '-', coefficients: [2, 3], exponent: 3 })
        assert.deepStrictEqual(number.splitNumber('23e3'), { sign: '', coefficients: [2, 3], exponent: 4 })
        assert.deepStrictEqual(number.splitNumber('-23e3'), { sign: '-', coefficients: [2, 3], exponent: 4 })
        assert.deepStrictEqual(number.splitNumber('2.3e-3'), { sign: '', coefficients: [2, 3], exponent: -3 })
        assert.deepStrictEqual(number.splitNumber('23e-3'), { sign: '', coefficients: [2, 3], exponent: -2 })
        assert.deepStrictEqual(number.splitNumber('-23e-3'), { sign: '-', coefficients: [2, 3], exponent: -2 })
        assert.deepStrictEqual(number.splitNumber('99.99'), { sign: '', coefficients: [9, 9, 9, 9], exponent: 1 })
      })

      it('should round digits of a a split number', function () {
        assert.deepStrictEqual(number.roundDigits(number.splitNumber(123456), 3), number.splitNumber(123000))
        assert.deepStrictEqual(number.roundDigits(number.splitNumber(123456), 4), number.splitNumber(123500))
        assert.deepStrictEqual(number.roundDigits(number.splitNumber(0.00555), 2), number.splitNumber(0.0056))
        assert.deepStrictEqual(number.roundDigits(number.splitNumber(99.99), 2), number.splitNumber(100))
      })

      it('should format a number with toFixed', function () {
        assert.strictEqual(number.toFixed(0), '0')
        assert.strictEqual(number.toFixed(2300), '2300')
        assert.strictEqual(number.toFixed(-2300), '-2300')
        assert.strictEqual(number.toFixed(19.9, 0), '20')
        assert.strictEqual(number.toFixed(99.9, 0), '100')
        assert.strictEqual(number.toFixed(99.5, 0), '100')
        assert.strictEqual(number.toFixed(99.4, 0), '99')
        assert.strictEqual(number.toFixed(2.3, 0), '2')
        assert.strictEqual(number.toFixed(2.5, 0), '3')
        assert.strictEqual(number.toFixed(2.9, 0), '3')
        assert.strictEqual(number.toFixed(1.5, 0), '2')
        assert.strictEqual(number.toFixed(-1.5, 0), '-2')
        assert.strictEqual(number.toFixed(123.45, 0), '123')
        assert.strictEqual(number.toFixed(0.005, 0), '0')
        assert.strictEqual(number.toFixed(0.7, 0), '1')

        assert.strictEqual(number.toFixed(0.15, 1), '0.2')
        assert.strictEqual(number.toFixed(123.4567, 1), '123.5')
        assert.strictEqual(number.toFixed(-123.4567, 1), '-123.5')
        assert.strictEqual(number.toFixed(0.23, 1), '0.2')
        assert.strictEqual(number.toFixed(0.005, 5), '0.00500')
        assert.strictEqual(number.toFixed(0.00567, 4), '0.0057')
        assert.strictEqual(number.toFixed(0.00999, 2), '0.01')
        assert.strictEqual(number.toFixed(0.00999, 3), '0.010')
        assert.strictEqual(number.toFixed(-0.00999, 3), '-0.010')

        assert.strictEqual(number.toFixed(NaN, 2), 'NaN')
        assert.strictEqual(number.toFixed(Infinity, 2), 'Infinity')
        assert.strictEqual(number.toFixed(-Infinity, 2), '-Infinity')
      })

      it('should format a number with toExponential', function () {
        assert.strictEqual(number.toExponential(0), '0e+0')
        assert.strictEqual(number.toExponential(0.15), '1.5e-1')
        assert.strictEqual(number.toExponential(1), '1e+0')
        assert.strictEqual(number.toExponential(-1), '-1e+0')
        assert.strictEqual(number.toExponential(1000), '1e+3')
        assert.strictEqual(number.toExponential(2300), '2.3e+3')
        assert.strictEqual(number.toExponential(-2300), '-2.3e+3')
        assert.strictEqual(number.toExponential(3.568), '3.568e+0')
        assert.strictEqual(number.toExponential(0.00123), '1.23e-3')
        assert.strictEqual(number.toExponential(-0.00123), '-1.23e-3')
        assert.strictEqual(number.toExponential('20.3e2'), '2.03e+3')

        assert.strictEqual(number.toExponential(0, 2), '0.0e+0')
        assert.strictEqual(number.toExponential(0.15, 1), '2e-1')
        assert.strictEqual(number.toExponential(1234, 2), '1.2e+3')
        assert.strictEqual(number.toExponential(-1234, 2), '-1.2e+3')
        assert.strictEqual(number.toExponential(1234, 6), '1.23400e+3')
        assert.strictEqual(number.toExponential(9999, 2), '1.0e+4')

        assert.strictEqual(number.toExponential(NaN, 2), 'NaN')
        assert.strictEqual(number.toExponential(Infinity, 2), 'Infinity')
        assert.strictEqual(number.toExponential(-Infinity, 2), '-Infinity')
      })

      it('should format a number with toPrecision', function () {
        assert.strictEqual(number.toPrecision(0), '0')
        assert.strictEqual(number.toPrecision(0.15), '0.15')
        assert.strictEqual(number.toPrecision(2300), '2300')
        assert.strictEqual(number.toPrecision(-2300), '-2300')
        assert.strictEqual(number.toPrecision(0.00123), '0.00123')
        assert.strictEqual(number.toPrecision(-0.00123), '-0.00123')
        assert.strictEqual(number.toPrecision(1.2e-8), '1.2e-8')

        assert.strictEqual(number.toPrecision(2300, 6), '2300.00')
        assert.strictEqual(number.toPrecision(1234.5678, 6), '1234.57')
        assert.strictEqual(number.toPrecision(1234.5678, 2), '1200')
        assert.strictEqual(number.toPrecision(1234, 2), '1200')
        assert.strictEqual(number.toPrecision(0.15, 1), '0.2')
        assert.strictEqual(number.toPrecision(0.004, 3), '0.00400')
        assert.strictEqual(number.toPrecision(0.00123456, 5), '0.0012346')
        assert.strictEqual(number.toPrecision(999, 2), '1000')
        assert.strictEqual(number.toPrecision(99900, 2), '100000')
        assert.strictEqual(number.toPrecision(99999, 2), '100000')
        assert.strictEqual(number.toPrecision(999e7, 2), '1.0e+10')
        assert.strictEqual(number.toPrecision(0.00999, 2), '0.010')
        assert.strictEqual(number.toPrecision(-0.00999, 2), '-0.010')

        assert.strictEqual(number.toPrecision(NaN, 2), 'NaN')
        assert.strictEqual(number.toPrecision(Infinity, 2), 'Infinity')
        assert.strictEqual(number.toPrecision(-Infinity, 2), '-Infinity')
      })

      it('should should throw an error on invalid input', function () {
        assert.throws(function () { number.splitNumber('2.3.4') }, /SyntaxError/)
        assert.throws(function () { number.splitNumber('2.3ee') }, /SyntaxError/)
        assert.throws(function () { number.splitNumber('2.3e4.3') }, /SyntaxError/)
        assert.throws(function () { number.splitNumber('2.3a') }, /SyntaxError/)
        assert.throws(function () { number.splitNumber('foo') }, /SyntaxError/)
        assert.throws(function () { number.splitNumber(NaN) }, /SyntaxError/)
        assert.throws(function () { number.splitNumber('NaN') }, /SyntaxError/)
        assert.throws(function () { number.splitNumber(new Date()) }, /SyntaxError/)
      })
    })

    it('should format numbers with precision as second parameter', function () {
      assert.strictEqual(number.format(1 / 3), '0.3333333333333333')
      assert.strictEqual(number.format(1 / 3, 5), '0.33333')
      assert.strictEqual(number.format(1 / 3, 3), '0.333')
      assert.strictEqual(number.format(2 / 3, 3), '0.667')
    })

    it('should format numbers with a custom formatting function', function () {
      function asCurrency (value) {
        return '$' + value.toFixed(2)
      }

      assert.strictEqual(number.format(12.4264, asCurrency), '$12.43')
      assert.strictEqual(number.format(0.1, asCurrency), '$0.10')
      assert.strictEqual(number.format(1.2e+6, asCurrency), '$1200000.00')
    })
  })

  describe('nearlyEqual', function () {
    it('should test whether two numbers are nearly equal', function () {
      const epsilon = 1e-2
      assert.strictEqual(number.nearlyEqual(1, 0.9, epsilon), false)
      assert.strictEqual(number.nearlyEqual(1, 0.95, epsilon), false)
      assert.strictEqual(number.nearlyEqual(1, 0.98, epsilon), false)
      assert.strictEqual(number.nearlyEqual(1, 0.991, epsilon), true)
      assert.strictEqual(number.nearlyEqual(1, 1.1, epsilon), false)
      assert.strictEqual(number.nearlyEqual(1, 1.05, epsilon), false)
      assert.strictEqual(number.nearlyEqual(1, 1.02, epsilon), false)
      assert.strictEqual(number.nearlyEqual(1, 1.01, epsilon), true)
      assert.strictEqual(number.nearlyEqual(1, 1, epsilon), true)

      // smaller epsilon
      const epsilon2 = 1e-4
      assert.strictEqual(number.nearlyEqual(1, 0.99, epsilon2), false)
      assert.strictEqual(number.nearlyEqual(1, 0.999, epsilon2), false)
      assert.strictEqual(number.nearlyEqual(1, 0.9999, epsilon2), true)

      // test one of these famous round-off errors
      assert.strictEqual((0.1 + 0.2) === 0.3, false)
      assert.strictEqual(number.nearlyEqual(0.1 + 0.2, 0.3, 1e-14), true)
    })

    it('should test whether a positive and negative number are nearly equal', function () {
      const epsilon = 1e-3
      assert.strictEqual(number.nearlyEqual(1.2, 1.2, epsilon), true)
      assert.strictEqual(number.nearlyEqual(1.2, -1.2, epsilon), false)
      assert.strictEqual(number.nearlyEqual(-1.2, 1.2, epsilon), false)
      assert.strictEqual(number.nearlyEqual(-1.2, -1.2, epsilon), true)
    })

    it('should test whether two large numbers are nearly equal', function () {
      const epsilon = 1e-2
      assert.strictEqual(number.nearlyEqual(1e200, 0.90e200, epsilon), false)
      assert.strictEqual(number.nearlyEqual(1e200, 0.95e200, epsilon), false)
      assert.strictEqual(number.nearlyEqual(1e200, 0.98e200, epsilon), false)
      assert.strictEqual(number.nearlyEqual(1e200, 0.99e200, epsilon), true)
    })

    it('should test whether two small numbers are nearly equal (always true)', function () {
      const epsilon = 1e-2
      assert.strictEqual(number.nearlyEqual(1e-200, 0.99e-200, epsilon), true)
      assert.strictEqual(number.nearlyEqual(1e-200, 10e-200, epsilon), true) // FIXME: why is this true?
    })

    it('should compare with zero', function () {
      const epsilon = 1e-3
      assert.strictEqual(number.nearlyEqual(0, 0, epsilon), true)
      assert.strictEqual(number.nearlyEqual(0, -0, epsilon), true)
      assert.strictEqual(number.nearlyEqual(0, 1.2, epsilon), false)
      assert.strictEqual(number.nearlyEqual(0, 1e30, epsilon), false)
      assert.strictEqual(number.nearlyEqual(0, 1e-30, epsilon), true) // FIXME: why is this true?
    })

    it('should compare with Infinity', function () {
      const epsilon = 1e-3

      assert.strictEqual(number.nearlyEqual(1.2, Infinity, epsilon), false)
      assert.strictEqual(number.nearlyEqual(Infinity, 1.2, epsilon), false)
      assert.strictEqual(number.nearlyEqual(Infinity, Infinity, epsilon), true)
      assert.strictEqual(number.nearlyEqual(Infinity, -Infinity, epsilon), false)
      assert.strictEqual(number.nearlyEqual(-Infinity, Infinity, epsilon), false)
      assert.strictEqual(number.nearlyEqual(-Infinity, -Infinity, epsilon), true)
    })

    it('should compare with NaN', function () {
      const epsilon = 1e-3
      assert.strictEqual(number.nearlyEqual(1.2, NaN, epsilon), false)
      assert.strictEqual(number.nearlyEqual(NaN, 1.2, epsilon), false)
      assert.strictEqual(number.nearlyEqual(NaN, NaN, epsilon), false)
    })

    it('should do exact comparison when epsilon is null or undefined', function () {
      assert.strictEqual(number.nearlyEqual(1.2, 1.2), true)
      assert.strictEqual(number.nearlyEqual(1.2, 1.2, null), true)

      assert.strictEqual(number.nearlyEqual(0.1 + 0.2, 0.3), false)
      assert.strictEqual(number.nearlyEqual(0.1 + 0.2, 0.3, null), false)
    })
  })
})
