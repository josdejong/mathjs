// test add
import assert from 'assert'

import { approxDeepEqual } from '../../../../tools/approx.js'
import math from '../../../../src/defaultInstance.js'
import Decimal from 'decimal.js'
const { add, BigNumber } = math

// TODO: make unit tests independent of math
describe('addScalar', function () {
  it('should add two numbers', function () {
    assert.strictEqual(add(2, 3), 5)
    assert.strictEqual(add(-2, 3), 1)
    assert.strictEqual(add(2, -3), -1)
    assert.strictEqual(add(-5, -3), -8)
  })

  it('should add bigint', function () {
    assert.strictEqual(add(2n, 3n), 5n)
  })

  it('should add booleans', function () {
    assert.strictEqual(add(true, true), 2)
    assert.strictEqual(add(true, false), 1)
    assert.strictEqual(add(false, true), 1)
    assert.strictEqual(add(false, false), 0)
  })

  it('does not support null', function () {
    assert.throws(function () { add(null, 0) }, /Unexpected type of argument/)
  })

  it('should add mixed numbers and booleans', function () {
    assert.strictEqual(add(2, true), 3)
    assert.strictEqual(add(2, false), 2)
    assert.strictEqual(add(true, 2), 3)
    assert.strictEqual(add(false, 2), 2)
  })

  it('should add mixed numbers and bigint', function () {
    assert.strictEqual(add(2, 3n), 5)
    assert.strictEqual(add(2n, 3), 5)

    assert.throws(function () { add(123123123123123123123n, 1) }, /Cannot implicitly convert bigint to number: value exceeds the max safe integer value/)
    assert.throws(function () { add(1, 123123123123123123123n) }, /Cannot implicitly convert bigint to number: value exceeds the max safe integer value/)
  })

  it('should add BigNumbers', function () {
    assert.deepStrictEqual(add(new BigNumber(0.1), new BigNumber(0.2)), new BigNumber(0.3))
    assert.deepStrictEqual(add(new BigNumber('2e5001'), new BigNumber('3e5000')), new BigNumber('2.3e5001'))
    assert.deepStrictEqual(add(new BigNumber('9999999999999999999'), new BigNumber('1')), new BigNumber('1e19'))
  })

  it('should add mixed numbers and BigNumbers', function () {
    assert.deepStrictEqual(add(new BigNumber(0.1), 0.2), new BigNumber(0.3))
    assert.deepStrictEqual(add(0.1, new BigNumber(0.2)), new math.BigNumber(0.3))

    assert.throws(function () { add(1 / 3, new BigNumber(1)) }, /Cannot implicitly convert a number with >15 significant digits to BigNumber/)
    assert.throws(function () { add(new BigNumber(1), 1 / 3) }, /Cannot implicitly convert a number with >15 significant digits to BigNumber/)
  })

  it('should add mixed bigints and BigNumbers', function () {
    assert.deepStrictEqual(add(new BigNumber(2), 3n), new BigNumber(5))
    assert.deepStrictEqual(add(2n, new BigNumber(3)), new BigNumber(5))
  })

  it('should add mixed booleans and BigNumbers', function () {
    assert.deepStrictEqual(add(new BigNumber(0.1), true), new BigNumber(1.1))
    assert.deepStrictEqual(add(new BigNumber(0.1), false), new BigNumber(0.1))
    assert.deepStrictEqual(add(false, new BigNumber(0.2)), new math.BigNumber(0.2))
    assert.deepStrictEqual(add(true, new BigNumber(0.2)), new math.BigNumber(1.2))
  })

  it('should add mixed booleans and bigint', function () {
    assert.deepStrictEqual(add(2n, true), 3n)
    assert.deepStrictEqual(add(2n, false), 2n)
    assert.deepStrictEqual(add(true, 2n), 3n)
    assert.deepStrictEqual(add(false, 2n), 2n)
  })

  it('should add mixed complex numbers and BigNumbers', function () {
    assert.deepStrictEqual(add(math.complex(3, -4), new BigNumber(2)), math.complex(5, -4))
    assert.deepStrictEqual(add(new BigNumber(2), math.complex(3, -4)), math.complex(5, -4))
  })

  it('should add Decimals', function () {
    assert.deepStrictEqual(add(Decimal(0.1), Decimal(0.2)), Decimal(0.3))
    assert.deepStrictEqual(add(Decimal(0.1), 0.2), Decimal(0.3))
    assert.deepStrictEqual(add(Decimal(0.1), new BigNumber(0.2)).toString(), '0.3')
    assert.deepStrictEqual(add(new BigNumber(0.1), Decimal(0.2)).toString(), '0.3')
  })

  it('should add two complex numbers', function () {
    assert.deepStrictEqual(add(math.complex(3, -4), math.complex(8, 2)), math.complex('11 - 2i'))
    assert.deepStrictEqual(add(math.complex(3, -4), 10), math.complex('13 - 4i'))
    assert.deepStrictEqual(add(10, math.complex(3, -4)), math.complex('13 - 4i'))
  })

  it('should add two fractions', function () {
    const a = math.fraction(1, 3)
    assert.strictEqual(add(a, math.fraction(1, 6)).toString(), '0.5')
    assert.strictEqual(a.toString(), '0.(3)')
    assert.strictEqual(add(math.fraction(1, 5), math.fraction(2, 5)).toString(), '0.6')
    assert.strictEqual(add(math.fraction(1), math.fraction(1, 3)).toString(), '1.(3)')
  })

  it('should add mixed fractions and numbers', function () {
    assert.deepStrictEqual(add(1, math.fraction(1, 3)), math.fraction(4, 3))
    assert.deepStrictEqual(add(math.fraction(1, 3), 1), math.fraction(4, 3))
  })

  it('should add mixed fractions and bigints', function () {
    assert.deepStrictEqual(add(1n, math.fraction(1, 3)), math.fraction(4, 3))
    assert.deepStrictEqual(add(math.fraction(1, 3), 1n), math.fraction(4, 3))
  })

  it('should throw an error when converting a number to a fraction that is not an exact representation', function () {
    assert.throws(function () {
      add(math.pi, math.fraction(1, 3))
    }, /Cannot implicitly convert a number to a Fraction when there will be a loss of precision/)
  })

  it('should add strings to numbers', function () {
    assert.strictEqual(add('2', '3'), 5)
    assert.strictEqual(add(2, '3'), 5)
    assert.strictEqual(add('2', 3), 5)
  })

  it('should add strings to BigNumbers', function () {
    assert.deepStrictEqual(add('2', math.bignumber(3)), math.bignumber(5))
    assert.deepStrictEqual(add(math.bignumber(3), '2'), math.bignumber(5))
    assert.throws(function () { add('foo', math.bignumber(3)) }, /Error: Cannot convert "foo" to BigNumber/)
  })

  it('should add strings to Fractions', function () {
    assert.deepStrictEqual(add('2', math.fraction(3)), math.fraction(5))
    assert.deepStrictEqual(add(math.fraction(3), '2'), math.fraction(5))
    assert.throws(function () { add('foo', math.fraction(3)) }, /Error: Cannot convert "foo" to Fraction/)
  })

  it('should add strings to Complex numbers', function () {
    assert.deepStrictEqual(add('2', math.complex(0, 3)), math.complex(2, 3))
    assert.deepStrictEqual(add(math.complex(0, 3), '2'), math.complex(2, 3))
    assert.throws(function () { add('foo', math.complex(0, 3)) }, /Error: Cannot convert "foo" to Complex/)
  })

  it('should add two measures of the same unit', function () {
    approxDeepEqual(add(math.unit(5, 'km'), math.unit(100, 'mile')), math.unit(165.93, 'km'))

    approxDeepEqual(add(math.unit(math.fraction(1, 3), 'm'), math.unit(math.fraction(1, 3), 'm')).toString(), '2/3 m')

    approxDeepEqual(add(math.unit(math.complex(-3, 2), 'g'), math.unit(math.complex(5, -6), 'g')).toString(), '(2 - 4i) g')
  })

  it('should add units properly even when they have offsets', function () {
    let t = math.unit(20, 'degC')
    assert.deepStrictEqual(add(t, math.unit(1, 'degC')), math.unit(21, 'degC'))
    t = math.unit(68, 'degF')
    assert.deepStrictEqual(add(t, math.unit(2, 'degF')), math.unit(70, 'degF'))
    approxDeepEqual(add(t, math.unit(1, 'degC')), math.unit(69.8, 'degF'))
  })

  it('should throw an error for two measures of different units', function () {
    assert.throws(function () {
      add(math.unit(5, 'km'), math.unit(100, 'gram'))
    })
  })

  it('should throw an error when one of the two units has undefined value', function () {
    assert.throws(function () {
      add(math.unit('km'), math.unit('5gram'))
    }, /Parameter x contains a unit with undefined value/)
    assert.throws(function () {
      add(math.unit('5 km'), math.unit('gram'))
    }, /Parameter y contains a unit with undefined value/)
  })

  it('should throw an error in case of a unit and non-unit argument', function () {
    assert.throws(function () { add(math.unit('5cm'), 2) }, /TypeError: Unexpected type of argument in function add/)
    assert.throws(function () { add(math.unit('5cm'), new Date()) }, /TypeError: Unexpected type of argument in function add/)
    assert.throws(function () { add(new Date(), math.unit('5cm')) }, /TypeError: Unexpected type of argument in function add/)
  })

  it('should throw an error in case of invalid number of arguments', function () {
    assert.throws(function () { add(1) }, /TypeError: Too few arguments/)
  })

  it('should throw an error in case of invalid type of arguments', function () {
    assert.throws(function () { add(null, 1) }, /TypeError: Unexpected type of argument/)
  })

  it('should LaTeX add', function () {
    const expression = math.parse('add(1,2)')
    assert.strictEqual(expression.toTex(), '\\left(1+2\\right)')
  })
})
