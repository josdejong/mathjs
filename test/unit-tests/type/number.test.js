import assert from 'assert'
import math from '../../../src/defaultInstance.js'
import { approxEqual } from '../../../tools/approx.js'

const number = math.number

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
    approxEqual(number(math.bignumber(0.1)), 0.1)
    approxEqual(number(math.bignumber('1.3e500')), Infinity)
  })

  it('should convert a bigint to a number', function () {
    assert.strictEqual(number(123n), 123)
    assert.strictEqual(number(12345678901234567890n).toString(), '12345678901234567000') // note: we've lost digits here
  })

  it('should convert a Fraction to a number', function () {
    approxEqual(number(math.fraction(2, 5)), 0.4)
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

  it('should parse the string if called with a valid string', function () {
    approxEqual(number('2.1e3'), 2100)
    approxEqual(number(' 2.1e-3 '), 0.0021)
    approxEqual(number(''), 0)
    approxEqual(number(' '), 0)
  })

  it('should throw an error if called with an invalid string', function () {
    assert.throws(function () { number('2.3.4') }, SyntaxError)
    assert.throws(function () { number('23a') }, SyntaxError)
  })

  it('should convert the elements of a matrix to numbers', function () {
    assert.deepStrictEqual(number(math.matrix(['123', true])), math.matrix([123, 1]))
  })

  it('should convert the elements of an array to numbers', function () {
    assert.deepStrictEqual(number(['123', true]), [123, 1])
  })

  it('should throw an error if called with a wrong number of arguments', function () {
    assert.throws(function () { number(1, 2, 3) }, /TypeError: Too many arguments/)
  })

  it('should throw an error if called with a complex number', function () {
    assert.throws(function () { number(math.complex(2, 3)) }, TypeError)
  })

  it('should throw an error with wrong type of arguments', function () {
    // assert.throws(function () {number(math.unit('5cm'), 2)}, TypeError); // FIXME: this should also throw an error
    assert.throws(function () { number(math.unit('5cm'), new Date()) }, TypeError)
    assert.throws(function () { number('23', 2) }, TypeError)
  })

  it('should LaTeX number', function () {
    const expr1 = math.parse('number()')
    const expr2 = math.parse('number(1)')
    const expr3 = math.parse('number(1,cm)')

    assert.strictEqual(expr1.toTex(), '0')
    assert.strictEqual(expr2.toTex(), '\\left(1\\right)')
    assert.strictEqual(expr3.toTex(), '\\left(\\left(1\\right)\\mathrm{cm}\\right)')
  })
})
