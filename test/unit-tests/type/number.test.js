import assert from 'assert'
import math from '../../../src/defaultInstance.js'
import { approxEqual } from '../../../tools/approx.js'

const number = math.number
const safely = { safe: true }

describe('number', function () {
  it('should be 0 if called with no argument', function () {
    approxEqual(number(), 0)
  })

  it('should convert a boolean to a number', function () {
    approxEqual(number(true), 1)
    approxEqual(number(false), 0)
  })

  it('should convert null to a number', function () {
    approxEqual(number(null), 0)
  })

  it('should convert a BigNumber to a number', function () {
    assert.strictEqual(number(math.bignumber(0.1)), 0.1)
    assert.strictEqual(number(math.bignumber('1.3e500')), Infinity)
    assert.strictEqual(number(math.bignumber('12345678901234567890')),
      12345678901234567000)
  })

  it('should allow safety in BigNumber->number conversion', function () {
    assert.strictEqual(number(math.bignumber(0.1), safely), 0.1)
    assert.throws(() => number(math.bignumber('1.3e500'), safely),
      /flow convert/)
    assert.strictEqual(number(math.bignumber('123456.78901'), safely),
      123456.78901)
    assert.throws(
      () => number(math.bignumber('1234567890.123456789'), safely),
      /loss of precision/)
    assert.throws(
      () => number(math.bignumber('12345678901234567890'), safely),
      /loss of precision/)
  })

  it('should convert a bigint to a number', function () {
    assert.strictEqual(number(123n), 123)
    assert.strictEqual(number(12345678901234567890n).toString(), '12345678901234567000') // note: we've lost digits here
  })

  it('should allow safety in bigint->number conversion', function () {
    assert.strictEqual(number(123n, safely), 123)
    assert.throws(() => number(12345678901234567890n, safely),
      /exceeds.*max.*safe/)
  })

  it('should convert a Fraction to a number', function () {
    assert.strictEqual(number(math.fraction(2, 5)), 0.4)
    assert.strictEqual(number(math.fraction(1, 3)), 1 / 3)
    approxEqual(
      number(math.fraction('123456789012345678901/98765432109876543210')),
      1.25)
  })

  it('should convert a Fraction to a number safely', function () {
    assert.strictEqual(number(math.fraction(2, 5), safely), 0.4)
    assert.strictEqual(number(math.fraction(1, 3), safely), 1 / 3)
    assert.throws(() => {
      return number(
        math.fraction('123456789012345678901/98765432109876543210'),
        safely)
    }, /loss of precision/)
  })

  it('should accept a number as argument', function () {
    approxEqual(number(3), 3)
    approxEqual(number(-3), -3)
  })

  it('should convert a unit to a number', function () {
    approxEqual(number(math.unit('52cm'), 'm'), 0.52)
  })

  it('should convert the value of a unit to a number', function () {
    const value = number(math.unit(math.bignumber(52), 'cm'))
    assert.strictEqual(value.toNumeric('cm'), 52)
  })

  it('should restrict to number outputs when requested', function () {
    assert.strictEqual(number(math.unit('1 in/cm'), { uniformType: true }), 2.54)
    assert.throws(() => number(math.unit('1 hour'), { uniformType: true }),
      /dimension.*convert/)
    assert.strictEqual(number([[[3]]], { uniformType: true }), 3)
    assert.throws(() => number([1, 0], { uniformType: true }),
      /convert.*multiple/)
  })

  it('should parse the string if called with a valid string', function () {
    assert.strictEqual(number('2.1e3'), 2100)
    assert.strictEqual(number(' 2.1e-3 '), 0.0021)
    assert.strictEqual(number(''), 0)
    assert.strictEqual(number(' '), 0)
    assert.strictEqual(number('12345678901234567890'), 12345678901234567000)
  })

  it('should throw an error if called with an invalid string', function () {
    assert.throws(function () { number('foo') }, SyntaxError)
    assert.throws(function () { number('foo', safely) }, SyntaxError)
    assert.throws(function () { number('3.14foo') }, SyntaxError)
    assert.throws(function () { number('Happy 0x3.243F Day!') }, SyntaxError)
    assert.throws(function () { number('Happy 0x3.243F Day!', safely) },
      SyntaxError)
    assert.throws(function () { number('3.14foo', safely) }, SyntaxError)
    assert.throws(function () { number('2.3.4') }, SyntaxError)
    assert.throws(function () { number('23a') }, SyntaxError)
  })

  it('should allow safety when converting string', function () {
    assert.throws(() => number('12345678901234567890', safely),
      /too many digits/)
    assert.throws(() => number('1234567890123.4567', safely),
      /too many digits/)
    assert.throws(() => number('-1.234e+421', safely),
      /flow convert/)
  })

  it('should convert the elements of a matrix to numbers', function () {
    assert.deepStrictEqual(number(math.matrix(['123', true])), math.matrix([123, 1]))
  })

  it('should convert the elements of an array to numbers', function () {
    assert.deepStrictEqual(number(['123', true]), [123, 1])
  })

  it('should throw an error if called with a wrong number of arguments', function () {
    assert.throws(function () { number(1, 2, 3) }, TypeError)
  })

  it('should throw an error if called with a complex number', function () {
    assert.throws(function () { number(math.complex(2, 3)) }, TypeError)
  })

  it('unless it happens to correspond to a real number', function () {
    assert.strictEqual(number(math.complex(-4.25, 0)), -4.25)
  })

  it('should throw an error with wrong type of arguments', function () {
    assert.throws(function () { number(math.unit('5cm'), 2) }, TypeError)
    assert.throws(function () { number(math.unit('5cm'), new Date()) }, TypeError)
    assert.throws(function () { number('23', 2) }, TypeError)
  })

  it('should LaTeX number', function () {
    const expr1 = math.parse('number()')
    const expr2 = math.parse('number(1)')
    const expr3 = math.parse('number(1,cm)') // Odd example, since
    // that expression throws a TypeError

    assert.strictEqual(expr1.toTex(), '0')
    assert.strictEqual(expr2.toTex(), '\\left(1\\right)')
    assert.strictEqual(expr3.toTex(), '\\left(\\left(1\\right)\\mathrm{cm}\\right)')
  })
})
