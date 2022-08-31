/* eslint-disable no-loss-of-precision */

import assert from 'assert'
import math from '../../../../src/defaultInstance.js'
import approx from '../../../../tools/approx.js'
const pi = math.pi
const asinh = math.asinh
const sinh = math.sinh
const complex = math.complex
const matrix = math.matrix
const unit = math.unit
const bigmath = math.create({ number: 'BigNumber', precision: 20 })
const biggermath = math.create({ precision: 21 })
const asinhBig = bigmath.asinh
const Big = bigmath.bignumber

describe('asinh', function () {
  it('should return the hyperbolic arcsin of a boolean', function () {
    approx.equal(asinh(true), 0.8813735870195430)
    assert.strictEqual(asinh(false), 0)
  })

  it('should return the hyperbolic arcsin of a number', function () {
    approx.equal(asinh(-2), -1.44363547517881034249327674027311)
    approx.equal(asinh(-1), -0.88137358701954302523260932497979)
    approx.equal(asinh(0), 0)
    approx.equal(asinh(1), 0.88137358701954302523260932497979)
    approx.equal(asinh(2), 1.44363547517881034249327674027311)
    approx.equal(asinh(pi), 1.8622957433108482198883613251826)
  })

  it('should return the hyperbolic arcsin of a bignumber', function () {
    const arg = Big(-2)
    assert.deepStrictEqual(asinhBig(arg), Big('-1.4436354751788103425'))
    assert.deepStrictEqual(asinhBig(Big(-1)), Big('-0.88137358701954302523'))
    assert.deepStrictEqual(asinhBig(Big(0)), Big(0))
    assert.deepStrictEqual(asinhBig(Big(1)), Big('0.88137358701954302523'))
    assert.deepStrictEqual(asinhBig(Big(2)), Big('1.4436354751788103425'))
    assert.deepStrictEqual(asinhBig(bigmath.pi).toString(), '1.8622957433108482199')

    // Make sure arg was not changed
    assert.deepStrictEqual(arg, Big(-2))
  })

  it('should be the inverse function of hyperbolic sin', function () {
    approx.equal(asinh(sinh(-1)), -1)
    approx.equal(asinh(sinh(0)), 0)
    approx.equal(asinh(sinh(0.1)), 0.1)
    approx.equal(asinh(sinh(0.5)), 0.5)
    approx.equal(asinh(sinh(2)), 2)
  })

  it('should be the inverse function of bignumber sinh', function () {
    assert.deepStrictEqual(asinhBig(bigmath.sinh(Big(-1))), Big(-1))
    assert.deepStrictEqual(asinhBig(bigmath.sinh(Big(0))), Big(0))
    assert.deepStrictEqual(asinhBig(bigmath.sinh(Big(0.5))), Big(0.5))
    assert.deepStrictEqual(asinhBig(bigmath.sinh(Big(2))), Big(2))

    /* Pass in more digits to pi. */
    assert.deepStrictEqual(asinhBig(biggermath.sinh(Big(0.1))), Big('0.099999999999999999996'))
  })

  it('should return the arcsinh of a complex number', function () {
    approx.deepEqual(asinh(complex('2+3i')), complex(1.9686379257931, 0.9646585044076028))
    approx.deepEqual(asinh(complex('2-3i')), complex(1.9686379257931, -0.9646585044076028))
    approx.deepEqual(asinh(complex('-2+3i')), complex(-1.9686379257931, 0.9646585044076028))
    approx.deepEqual(asinh(complex('-2-3i')), complex(-1.9686379257931, -0.9646585044076028))
    approx.deepEqual(asinh(complex('1+i')), complex(1.0612750619050357, 0.6662394324925153))
    approx.deepEqual(asinh(complex('i')), complex(0, pi / 2))
    approx.deepEqual(asinh(complex('1')), complex(0.881373587019543025, 0))
    assert.deepStrictEqual(asinh(complex('0')), complex(0, 0))
  })

  it('should throw an error if called with a unit', function () {
    assert.throws(function () { asinh(unit('45deg')) })
    assert.throws(function () { asinh(unit('5 celsius')) })
  })

  it('should throw an error if called with a string', function () {
    assert.throws(function () { asinh('string') })
  })

  it('should not operate on arrays and matrices', function () {
    assert.throws(() => asinh([1, 2, 3]), TypeError)
    assert.throws(() => asinh(matrix([1, 2, 3])), TypeError)
    const asinh123 = [0.881373587019543025, 1.4436354751788103, 1.8184464592320668]
    approx.deepEqual(math.map([1, 2, 3], asinh), asinh123)
    approx.deepEqual(math.map(matrix([1, 2, 3]), asinh), matrix(asinh123))
  })

  it('should throw an error in case of invalid number of arguments', function () {
    assert.throws(function () { asinh() }, /TypeError: Too few arguments/)
    assert.throws(function () { asinh(1, 2) }, /TypeError: Too many arguments/)
  })

  it('should LaTeX asinh', function () {
    const expression = math.parse('asinh(2)')
    assert.strictEqual(expression.toTex(), '\\sinh^{-1}\\left(2\\right)')
  })
})
