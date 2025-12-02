import assert from 'assert'
import math from '../../../../src/defaultInstance.js'

describe('den', function () {
  it('should return the denominator of a fraction', function () {
    assert.strictEqual(math.den(math.fraction(2, 3)), 3)
    assert.strictEqual(math.den(math.fraction(4, 8)), 2) // simplified to 1/2
    assert.strictEqual(math.den(math.fraction(5, 1)), 1)
  })

  it('should return the denominator of a negative fraction', function () {
    assert.strictEqual(math.den(math.fraction(-2, 3)), 3)
    assert.strictEqual(math.den(math.fraction(2, -3)), 3)
    assert.strictEqual(math.den(math.fraction(-2, -3)), 3)
  })

  it('should return the denominator of a fraction string', function () {
    assert.strictEqual(math.den(math.fraction('2/3')), 3)
    assert.strictEqual(math.den(math.fraction('5/8')), 8)
    assert.strictEqual(math.den(math.fraction('-5/8')), 8)
  })

  it('should return the denominator for each element in a matrix', function () {
    assert.deepStrictEqual(
      math.den([math.fraction('2/3'), math.fraction('5/8')]),
      [3, 8]
    )
    assert.deepStrictEqual(
      math.den(math.matrix([math.fraction('2/3'), math.fraction('5/8')]))
        .valueOf(),
      [3, 8]
    )
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
