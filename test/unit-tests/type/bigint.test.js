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
    const bigString = '123456789012345678901234567890'
    const bigi = BigInt(bigString)
    assert.strictEqual(bigint(math.bignumber(bigString)), bigi)
  })

  it('should convert a number to a bigint', function () {
    assert.strictEqual(bigint(123), 123n)
    assert.strictEqual(bigint(2.3), 2n)
  })

  it('should convert a Fraction to a bigint', function () {
    assert.strictEqual(bigint(math.fraction(7, 3)), 2n)
    assert.strictEqual(bigint(math.fraction(27.5)), 28n)
    assert.strictEqual(
      bigint(math.fraction('123456789012345678901234567890123456789/2')),
      61728394506172839450617283945061728395n
    )
    assert.strictEqual(
      bigint(math.fraction('1234567890123456789012345678901234567890/2')),
      617283945061728394506172839450617283945n
    )
  })

  it('should accept a bigint as argument', function () {
    assert.strictEqual(bigint(3n), 3n)
    assert.strictEqual(bigint(-3n), -3n)
    const big = 12345678901234567890n
    assert.strictEqual(bigint(big), big)
  })

  it('should parse the string if called with a valid string', function () {
    assert.strictEqual(bigint('2100'), 2100n)
    assert.strictEqual(bigint(' -2100 '), -2100n)
    assert.strictEqual(bigint(''), 0n)
    assert.strictEqual(bigint(' '), 0n)
    assert.strictEqual(bigint('2.3'), 2n)
    assert.strictEqual(bigint('-237503.6437e3'), -237503644n)
  })

  it('should throw an error if called with an invalid string', function () {
    assert.throws(
      function () { bigint('2.3', { round: 'throw' }) },
      RangeError
    )
    assert.throws(function () { bigint('2.3.4') }, SyntaxError)
    assert.throws(function () { bigint('23a') }, SyntaxError)
  })

  it('should respect the safe option', function () {
    const bigsafe = val => bigint(val, { safe: true })
    assert.throws(() => bigsafe(3 ** 50), RangeError)
    assert.throws(() => bigsafe((-5) ** 49), RangeError)
    assert.throws(() => bigsafe(math.bignumber(11).pow(64)), RangeError)
    assert.throws(() => bigsafe(math.bignumber(-12).pow(63)), RangeError)
    assert.strictEqual(
      bigsafe(Number.MAX_SAFE_INTEGER - 1),
      BigInt(Number.MAX_SAFE_INTEGER) - 1n)
    assert.strictEqual(
      bigsafe(Number.MIN_SAFE_INTEGER + 1),
      BigInt(Number.MIN_SAFE_INTEGER) + 1n)
    const bigPosString = '9'.repeat(63)
    assert.strictEqual(
      bigsafe(math.bignumber(bigPosString)), BigInt(bigPosString))
    const bigNegString = '-' + bigPosString
    assert.strictEqual(
      bigsafe(math.bignumber(bigNegString)), BigInt(bigNegString))
  })

  it('should respect round: throw', function () {
    const bigthrow = val => bigint(val, { round: 'throw' })
    assert.throws(() => bigthrow(27.5), RangeError)
    assert.throws(
      () => bigthrow(math.bignumber(3).pow(32).dividedBy(2)), RangeError)
    assert.throws(() => {
      return bigthrow(
        math.fraction('123456789012345678901234567890123456789/2'))
    }, RangeError)
    assert.strictEqual(bigthrow(2 ** 60), 2n ** 60n)
    assert.strictEqual(bigthrow(math.bignumber('1e70')), 10n ** 70n)
    assert.strictEqual(
      bigthrow(math.fraction('1234567890123456789012345678901234567890/2')),
      617283945061728394506172839450617283945n
    )
  })

  it('should allow different rounding modes', function () {
    assert.strictEqual(bigint(math.fraction(37, 2), { round: 'floor' }), 18n)
    assert.strictEqual(bigint(-27.5, { round: 'ceil' }), -27n)
    assert.strictEqual(
      bigint(math.bignumber('-12345678901234567890.5'), { round: 'fix' }),
      -12345678901234567890n)
    assert.strictEqual(bigint(math.fraction(-37, 2), { round: 'round' }), -18n)
  })

  it('should convert the elements of a matrix to numbers', function () {
    assert.deepStrictEqual(bigint(math.matrix(['123', true])), math.matrix([123n, 1n]))
  })

  it('should convert the elements of an array to numbers', function () {
    assert.deepStrictEqual(bigint(['123', true]), [123n, 1n])
  })

  it('should throw an error if called with a wrong number of arguments', function () {
    assert.throws(function () { bigint(1, 2, 3) }, TypeError)
    assert.throws(function () { bigint(1, {}, 3) }, /TypeError: Too many arguments/)
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
