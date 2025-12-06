import assert from 'assert'
import math from '../../../../src/defaultInstance.js'

describe('den', function () {
  it('should return the denominator of a fraction', function () {
    assert.strictEqual(math.den(math.fraction(2, 3)), 3n)
    assert.strictEqual(math.den(math.fraction(4, 8)), 2n) // simplified to 1/2n
    assert.strictEqual(math.den(math.fraction(5, 1)), 1n)
  })

  it('should return the denominator of a negative fraction', function () {
    assert.strictEqual(math.den(math.fraction(-2, 3)), 3n)
    assert.strictEqual(math.den(math.fraction(2, -3)), 3n)
    assert.strictEqual(math.den(math.fraction(-2, -3)), 3n)
  })

  it('should return the denominator of a fraction string', function () {
    assert.strictEqual(math.den(math.fraction('2/3')), 3n)
    assert.strictEqual(math.den(math.fraction('5/8')), 8n)
    assert.strictEqual(math.den(math.fraction('-5/8')), 8n)
  })

  it('should return the denominator for each element in a matrix', function () {
    assert.deepStrictEqual(
      math.den([math.fraction('2/3'), math.fraction('5/8')]),
      [3n, 8n]
    )
    assert.deepStrictEqual(
      math
        .den(math.matrix([math.fraction('2/3'), math.fraction('5/8')]))
        .valueOf(),
      [3n, 8n]
    )
  })

  it('should return the denominator of a BigNumber by converting to fraction', function () {
    assert.strictEqual(math.den(math.bignumber('1')), 1n)
    assert.strictEqual(math.den(math.bignumber('0.5')), 2n) // 0.5 = 1/2
    assert.strictEqual(math.den(math.bignumber('0.25')), 4n) // 0.25 = 1/4
    assert.strictEqual(math.den(math.bignumber('0.125')), 8n) // 0.125 = 1/8
    assert.strictEqual(math.den(math.bignumber('-0.5')), 2n) // -0.5 = -1/2
    assert.strictEqual(math.den(math.bignumber('0.75')), 4n) // 0.75 = 3/4
    assert.strictEqual(math.den(math.bignumber('0.2')), 5n) // 0.2 = 1/5
    assert.strictEqual(math.den(math.bignumber('-0.2')), 5n) // -0.2 = -1/5
  })

  it('should throw an error when called with an unsupported type of argument', function () {
    assert.throws(function () {
      math.den(new Date())
    }, /TypeError: Unexpected type of argument/)
    assert.throws(function () {
      math.den(math.complex(2, 3))
    }, /TypeError: Unexpected type of argument/)
  })

  it('should throw an error in case of invalid number of arguments', function () {
    assert.throws(function () {
      math.den()
    }, /TypeError: Too few arguments/)
    assert.throws(function () {
      math.den(math.fraction(1, 2), 2)
    }, /TypeError: Too many arguments/)
  })

  it('should LaTeX denominator', function () {
    const expression = math.parse('den(fraction(1,2))')
    assert.strictEqual(
      expression.toTex(),
      '\\mathrm{den}\\left(\\frac{1}{2}\\right)'
    )
  })
})
