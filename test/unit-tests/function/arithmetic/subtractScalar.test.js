// test subtractScalar
import assert from 'assert'

import { approxDeepEqual } from '../../../../tools/approx.js'
import math from '../../../../src/defaultInstance.js'
import Decimal from 'decimal.js'
const { subtractScalar, BigNumber } = math

describe('subtractScalar', function () {
  it('should subtractScalar two numbers correctly', function () {
    assert.deepStrictEqual(subtractScalar(4, 2), 2)
    assert.deepStrictEqual(subtractScalar(4, -4), 8)
    assert.deepStrictEqual(subtractScalar(-4, -4), 0)
    assert.deepStrictEqual(subtractScalar(-4, 4), -8)
    assert.deepStrictEqual(subtractScalar(2, 4), -2)
    assert.deepStrictEqual(subtractScalar(3, 0), 3)
    assert.deepStrictEqual(subtractScalar(0, 3), -3)
    assert.deepStrictEqual(subtractScalar(0, 3), -3)
    assert.deepStrictEqual(subtractScalar(0, 3), -3)
  })

  it('should subtractScalar bigint', function () {
    assert.strictEqual(subtractScalar(7n, 3n), 4n)
  })

  it('should subtractScalar booleans', function () {
    assert.strictEqual(subtractScalar(true, true), 0)
    assert.strictEqual(subtractScalar(true, false), 1)
    assert.strictEqual(subtractScalar(false, true), -1)
    assert.strictEqual(subtractScalar(false, false), 0)
  })

  it('should subtractScalar mixed numbers and booleans', function () {
    assert.strictEqual(subtractScalar(2, true), 1)
    assert.strictEqual(subtractScalar(2, false), 2)
    assert.strictEqual(subtractScalar(true, 2), -1)
    assert.strictEqual(subtractScalar(false, 2), -2)
  })

  it('should subtractScalar mixed numbers and bigint', function () {
    assert.strictEqual(subtractScalar(7, 3n), 4)
    assert.strictEqual(subtractScalar(7n, 3), 4)

    assert.throws(function () { subtractScalar(123123123123123123123n, 1) }, /Cannot implicitly convert bigint to number: value exceeds the max safe integer value/)
    assert.throws(function () { subtractScalar(1, 123123123123123123123n) }, /Cannot implicitly convert bigint to number: value exceeds the max safe integer value/)
  })

  it('should subtractScalar new BigNumbers', function () {
    assert.deepStrictEqual(subtractScalar(new BigNumber(0.3), new BigNumber(0.2)), new BigNumber(0.1))
    assert.deepStrictEqual(subtractScalar(new BigNumber('2.3e5001'), new BigNumber('3e5000')), new BigNumber('2e5001'))
    assert.deepStrictEqual(subtractScalar(new BigNumber('1e19'), new BigNumber('1')), new BigNumber('9999999999999999999'))
  })

  it('should subtractScalar mixed numbers and new BigNumbers', function () {
    assert.deepStrictEqual(subtractScalar(new BigNumber(0.3), 0.2), new BigNumber(0.1))
    assert.deepStrictEqual(subtractScalar(0.3, new BigNumber(0.2)), new BigNumber(0.1))

    assert.throws(function () { subtractScalar(1 / 3, new BigNumber(1).div(3)) }, /Cannot implicitly convert a number with >15 significant digits to BigNumber/)
    assert.throws(function () { subtractScalar(new BigNumber(1).div(3), 1 / 3) }, /Cannot implicitly convert a number with >15 significant digits to BigNumber/)
  })

  it('should subtractScalar mixed bigints and BigNumbers', function () {
    assert.deepStrictEqual(subtractScalar(new BigNumber(7), 3n), new BigNumber(4))
    assert.deepStrictEqual(subtractScalar(7n, new BigNumber(3)), new BigNumber(4))
  })

  it('should add Decimals', function () {
    assert.deepStrictEqual(subtractScalar(Decimal(0.2), Decimal(0.1)), Decimal(0.1))
    assert.deepStrictEqual(subtractScalar(Decimal(0.3), 0.2), Decimal(0.1))
    assert.deepStrictEqual(subtractScalar(Decimal(0.1), new BigNumber(0.2)).toString(), '-0.1')
    assert.deepStrictEqual(subtractScalar(new BigNumber(0.2), Decimal(0.1)).toString(), '0.1')
  })

  it('should subtractScalar mixed booleans and new BigNumbers', function () {
    assert.deepStrictEqual(subtractScalar(new BigNumber(1.1), true), new BigNumber(0.1))
    assert.deepStrictEqual(subtractScalar(new BigNumber(1.1), false), new BigNumber(1.1))
    assert.deepStrictEqual(subtractScalar(false, new BigNumber(0.2)), new BigNumber(-0.2))
    assert.deepStrictEqual(subtractScalar(true, new BigNumber(0.2)), new BigNumber(0.8))
  })

  it('should subtractScalar two complex numbers correctly', function () {
    assert.deepStrictEqual(subtractScalar(math.complex(3, 2), math.complex(8, 4)), math.complex('-5 - 2i'))
    assert.deepStrictEqual(subtractScalar(math.complex(6, 3), math.complex(-2, -2)), math.complex('8 + 5i'))
    assert.deepStrictEqual(subtractScalar(math.complex(3, 4), 10), math.complex('-7 + 4i'))
    assert.deepStrictEqual(subtractScalar(math.complex(3, 4), -2), math.complex('5 + 4i'))
    assert.deepStrictEqual(subtractScalar(math.complex(-3, -4), 10), math.complex('-13 - 4i'))
    assert.deepStrictEqual(subtractScalar(10, math.complex(3, 4)), math.complex('7 - 4i'))
    assert.deepStrictEqual(subtractScalar(10, math.i), math.complex('10 - i'))
    assert.deepStrictEqual(subtractScalar(0, math.i), math.complex('-i'))
    assert.deepStrictEqual(subtractScalar(10, math.complex(0, 1)), math.complex('10 - i'))
  })

  it('should throw an error for mixed complex numbers and big numbers', function () {
    assert.deepStrictEqual(subtractScalar(math.complex(3, 4), new BigNumber(10)), math.complex(-7, 4))
    assert.deepStrictEqual(subtractScalar(new BigNumber(10), math.complex(3, 4)), math.complex(7, -4))
  })

  it('should subtractScalar two fractions', function () {
    const a = math.fraction(1, 3)
    assert.strictEqual(subtractScalar(a, math.fraction(1, 6)).toString(), '0.1(6)')
    assert.strictEqual(a.toString(), '0.(3)')

    assert.strictEqual(subtractScalar(math.fraction(3, 5), math.fraction(1, 5)).toString(), '0.4')
    assert.strictEqual(subtractScalar(math.fraction(1), math.fraction(1, 3)).toString(), '0.(6)')
  })

  it('should subtractScalar mixed fractions and numbers', function () {
    assert.deepStrictEqual(subtractScalar(1, math.fraction(1, 3)), math.fraction(2, 3))
    assert.deepStrictEqual(subtractScalar(math.fraction(1, 3), 1), math.fraction(-2, 3))
  })

  it('should subtractScalar mixed fractions and numbers', function () {
    assert.deepStrictEqual(subtractScalar(1n, math.fraction(1, 3)), math.fraction(2, 3))
    assert.deepStrictEqual(subtractScalar(math.fraction(1, 3), 1n), math.fraction(-2, 3))
  })

  it('should subtractScalar two quantities of the same unit', function () {
    approxDeepEqual(subtractScalar(math.unit(5, 'km'), math.unit(100, 'mile')), math.unit(-155.93, 'km'))

    assert.deepStrictEqual(subtractScalar(math.unit(new BigNumber(5), 'km'), math.unit(new BigNumber(2), 'km')), math.unit(new BigNumber(3), 'km'))

    assert.deepStrictEqual(subtractScalar(math.unit(math.complex(10, 10), 'K'), math.unit(math.complex(3, 4), 'K')), math.unit(math.complex(7, 6), 'K'))
    assert.deepStrictEqual(subtractScalar(math.unit(math.complex(10, 10), 'K'), math.unit(3, 'K')), math.unit(math.complex(7, 10), 'K'))
  })

  it('should subtractScalar units even when they have offsets', function () {
    let t = math.unit(20, 'degC')
    assert.deepStrictEqual(subtractScalar(t, math.unit(1, 'degC')), math.unit(19, 'degC'))
    t = math.unit(68, 'degF')
    approxDeepEqual(subtractScalar(t, math.unit(2, 'degF')), math.unit(66, 'degF'))
    approxDeepEqual(subtractScalar(t, math.unit(1, 'degC')), math.unit(66.2, 'degF'))
  })

  it('should throw an error if subtracting two quantities of different units', function () {
    assert.throws(function () {
      subtractScalar(math.unit(5, 'km'), math.unit(100, 'gram'))
    })
  })

  it('should throw an error when one of the two units has undefined value', function () {
    assert.throws(function () {
      subtractScalar(math.unit('km'), math.unit('5gram'))
    }, /Parameter x contains a unit with undefined value/)
    assert.throws(function () {
      subtractScalar(math.unit('5 km'), math.unit('gram'))
    }, /Parameter y contains a unit with undefined value/)
  })

  it('should throw an error if subtracting numbers from units', function () {
    assert.throws(function () { subtractScalar(math.unit(5, 'km'), 2) }, TypeError)
    assert.throws(function () { subtractScalar(2, math.unit(5, 'km')) }, TypeError)
  })

  it('should throw an error if subtracting numbers from units', function () {
    assert.throws(function () { subtractScalar(math.unit(5, 'km'), new BigNumber(2)) }, TypeError)
    assert.throws(function () { subtractScalar(new BigNumber(2), math.unit(5, 'km')) }, TypeError)
  })

  it('should throw an error when used with a string', function () {
    assert.throws(function () { subtractScalar('hello ', 'world') })
    assert.throws(function () { subtractScalar('str', 123) })
    assert.throws(function () { subtractScalar(123, 'str') })
  })

  it('should throw an error in case of invalid number of arguments', function () {
    assert.throws(function () { subtractScalar(1) }, /TypeError: Too few arguments/)
    assert.throws(function () { subtractScalar(1, 2, 3) }, /TypeError: Too many arguments/)
  })

  it('should throw an in case of wrong type of arguments', function () {
    assert.throws(function () { subtractScalar(null, 2) }, /TypeError: Unexpected type of argument/)
  })

  it('should LaTeX subtractScalar', function () {
    const expression = math.parse('subtractScalar(2,1)')
    assert.strictEqual(expression.toTex(), '\\mathrm{subtractScalar}\\left(2,1\\right)')
  })
})
