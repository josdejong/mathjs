import assert from 'assert'
import math from '../../../../src/defaultInstance.js'

describe('num', function () {
  it('should return the numerator of a fraction', function () {
    assert.strictEqual(math.num(math.fraction(2, 3)), 2n)
    assert.strictEqual(math.num(math.fraction(4, 8)), 1n) // simplified to 1/2
    assert.strictEqual(math.num(math.fraction(5, 1)), 5n)
  })

  it('should return the numerator of a negative fraction', function () {
    assert.strictEqual(math.num(math.fraction(-2, 3)), -2n)
    assert.strictEqual(math.num(math.fraction(2, -3)), -2n)
    assert.strictEqual(math.num(math.fraction(-2, -3)), 2n)
  })

  it('should return the numerator of a fraction string', function () {
    assert.strictEqual(math.num(math.fraction('2/3')), 2n)
    assert.strictEqual(math.num(math.fraction('5/8')), 5n)
    assert.strictEqual(math.num(math.fraction('-5/8')), -5n)
  })

  it('should return the numerator for each element in a matrix', function () {
    assert.deepStrictEqual(
      math.num([math.fraction('2/3'), math.fraction('5/8')]),
      [2n, 5n]
    )
    assert.deepStrictEqual(
      math
        .num(math.matrix([math.fraction('2/3'), math.fraction('5/8')]))
        .valueOf(),
      [2n, 5n]
    )
  })

  it('should return the numerator of a BigNumber by converting to fraction', function () {
    assert.strictEqual(math.num(math.bignumber('1')), 1n)
    assert.strictEqual(math.num(math.bignumber('0.5')), 1n) // 0.5 = 1/2
    assert.strictEqual(math.num(math.bignumber('0.25')), 1n) // 0.25 = 1/4
    assert.strictEqual(math.num(math.bignumber('0.125')), 1n) // 0.125 = 1/8
    assert.strictEqual(math.num(math.bignumber('-0.5')), -1n) // -0.5 = -1/2
    assert.strictEqual(math.num(math.bignumber('0.75')), 3n) // 0.75 = 3/4
    assert.strictEqual(math.num(math.bignumber('0.2')), 1n) // 0.2 = 1/5
    assert.strictEqual(math.num(math.bignumber('-0.2')), -1n) // -0.2 = -1/5
  })

  it('should throw an error when called with an unsupported type of argument', function () {
    assert.throws(function () {
      math.num(new Date())
    }, /TypeError: Unexpected type of argument/)
    assert.throws(function () {
      math.num(math.complex(2, 3))
    }, /TypeError: Unexpected type of argument/)
  })

  it('should throw an error in case of invalid number of arguments', function () {
    assert.throws(function () {
      math.num()
    }, /TypeError: Too few arguments/)
    assert.throws(function () {
      math.num(math.fraction(1, 2), 2)
    }, /TypeError: Too many arguments/)
  })

  it('should LaTeX num', function () {
    const expression = math.parse('num(fraction(1,2))')
    assert.strictEqual(
      expression.toTex(),
      '\\mathrm{num}\\left(\\frac{1}{2}\\right)'
    )
  })
})
