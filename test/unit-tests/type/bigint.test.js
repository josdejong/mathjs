import assert from 'assert'
import math from '../../../src/defaultInstance.js'

const bigint = math.bigint

describe('bigint', function () {
  it('should be 0 if called with no argument', function () {
    assert.strictEqual(bigint(), 0n)
  })

  it('should convert a boolean to a bigint', function () {
    assert.strictEqual(bigint(true), 1n)
    assert.strictEqual(bigint(false), 0n)
  })

  it('should convert null to a bigint', function () {
    assert.strictEqual(bigint(null), 0n)
  })

  it('should convert a BigNumber to a bigint', function () {
    assert.strictEqual(bigint(math.bignumber('123')), 123n)
    assert.strictEqual(bigint(math.bignumber('2.3')), 2n)
  })

  it('should convert a number to a bigint', function () {
    assert.strictEqual(bigint(123), 123n)
    assert.strictEqual(bigint(2.3), 2n)
  })

  it('should convert a Fraction to a bigint', function () {
    assert.strictEqual(bigint(math.fraction(7, 3)), 2n)
  })

  it('should accept a bigint as argument', function () {
    assert.strictEqual(bigint(3n), 3n)
    assert.strictEqual(bigint(-3n), -3n)
  })

  it('should parse the string if called with a valid string', function () {
    assert.strictEqual(bigint('2100'), 2100n)
    assert.strictEqual(bigint(' -2100 '), -2100n)
    assert.strictEqual(bigint(''), 0n)
    assert.strictEqual(bigint(' '), 0n)
  })

  it('should throw an error if called with an invalid string', function () {
    assert.throws(function () { bigint('2.3') }, SyntaxError)
    assert.throws(function () { bigint('2.3.4') }, SyntaxError)
    assert.throws(function () { bigint('23a') }, SyntaxError)
  })

  it('should convert the elements of a matrix to numbers', function () {
    assert.deepStrictEqual(bigint(math.matrix(['123', true])), math.matrix([123n, 1n]))
  })

  it('should convert the elements of an array to numbers', function () {
    assert.deepStrictEqual(bigint(['123', true]), [123n, 1n])
  })

  it('should throw an error if called with a wrong number of arguments', function () {
    assert.throws(function () { bigint(1, 2, 3) }, /TypeError: Too many arguments/)
  })

  it('should throw an error if called with a complex number', function () {
    assert.throws(function () { bigint(math.complex(2, 3)) }, TypeError)
  })

  it('should throw an error with wrong type of arguments', function () {
    assert.throws(function () { bigint(math.unit('5cm'), 2) }, TypeError)
    assert.throws(function () { bigint(math.unit('5cm'), new Date()) }, TypeError)
    assert.throws(function () { bigint('23', 2) }, TypeError)
  })

  it('should LaTeX bigint', function () {
    const expr1 = math.parse('bigint()')
    const expr2 = math.parse('bigint(1)')

    assert.strictEqual(expr1.toTex(), '0')
    assert.strictEqual(expr2.toTex(), '\\left(1\\right)')
  })
})
