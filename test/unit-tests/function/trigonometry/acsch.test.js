/* eslint-disable no-loss-of-precision */

import assert from 'assert'
import math from '../../../../src/defaultInstance.js'
import approx from '../../../../tools/approx.js'
const pi = math.pi
const acsch = math.acsch
const csch = math.csch
const complex = math.complex
const matrix = math.matrix
const unit = math.unit
const bigmath = math.create({ number: 'BigNumber', precision: 20 })
const acschBig = bigmath.acsch
const Big = bigmath.bignumber

describe('acsch', function () {
  it('should return the hyperbolic arccsc of a boolean', function () {
    approx.equal(acsch(true), 0.8813735870195430)
    assert.strictEqual(acsch(false), Infinity)
  })

  it('should return the hyperbolic arccsc of a number', function () {
    approx.equal(acsch(-2), -0.48121182505960344749775891342437)
    approx.equal(acsch(-1), -0.88137358701954302523260932497979)
    assert.strictEqual(acsch(0), Infinity)
    approx.equal(acsch(1), 0.88137358701954302523260932497979)
    approx.equal(acsch(2), 0.48121182505960344749775891342437)
    approx.equal(acsch(pi), 0.3131658804508683758718693082657)
  })

  it('should return the hyperbolic arccsc of a bignumber', function () {
    const arg = Big(-2)
    assert.deepStrictEqual(acschBig(arg), Big('-0.4812118250596034475'))
    assert.deepStrictEqual(acschBig(Big(-1)), Big('-0.88137358701954302523'))
    assert.deepStrictEqual(acschBig(Big(0)).toString(), 'Infinity')
    assert.deepStrictEqual(acschBig(Big(1)), Big('0.88137358701954302523'))
    assert.deepStrictEqual(acschBig(Big(2)), Big('0.4812118250596034475'))
    assert.deepStrictEqual(acschBig(bigmath.pi).toString(), '0.31316588045086837586')

    // Make sure arg was not changed
    assert.deepStrictEqual(arg, Big(-2))
  })

  it('should be the inverse function of hyperbolic csc', function () {
    approx.equal(acsch(csch(-1)), -1)
    approx.equal(acsch(csch(0)), 0)
    approx.equal(acsch(csch(0.1)), 0.1)
    approx.equal(acsch(csch(0.5)), 0.5)
    approx.equal(acsch(csch(2)), 2)
  })

  it('should be the inverse function of bignumber csch', function () {
    assert.deepStrictEqual(acschBig(bigmath.csch(Big(-2))), Big(-2))
    assert.deepStrictEqual(acschBig(bigmath.csch(Big(-0.5))), Big(-0.5))
    assert.deepStrictEqual(acschBig(bigmath.csch(Big(-0.1))), Big('-0.099999999999999999996'))
    assert.deepStrictEqual(acschBig(bigmath.csch(Big(0))), Big(0))
    assert.deepStrictEqual(acschBig(bigmath.csch(Big(0.1))), Big('0.099999999999999999996'))
    assert.deepStrictEqual(acschBig(bigmath.csch(Big(0.5))), Big(0.5))
    assert.deepStrictEqual(acschBig(bigmath.csch(Big(2))), Big(2))
  })

  it('should return the arccsch of a complex number', function () {
    approx.deepEqual(acsch(complex('2+3i')), complex(0.157355498844985, -0.229962902377208))
    approx.deepEqual(acsch(complex('2-3i')), complex(0.157355498844985, 0.229962902377208))
    approx.deepEqual(acsch(complex('-2+3i')), complex(-0.157355498844985, -0.229962902377208))
    approx.deepEqual(acsch(complex('-2-3i')), complex(-0.157355498844985, 0.229962902377208))
    approx.deepEqual(acsch(complex('1+i')), complex(0.530637530952517826, -0.45227844715119068))
    approx.deepEqual(acsch(complex('i')), complex(0, -pi / 2))
    approx.deepEqual(acsch(complex('1')), complex(0.881373587019543025, 0))
    assert.deepStrictEqual(acsch(complex('0')), complex(Infinity, 0))
  })

  it('should throw an error if called with a unit', function () {
    assert.throws(function () { acsch(unit('45deg')) })
    assert.throws(function () { acsch(unit('5 celsius')) })
  })

  it('should throw an error if called with a string', function () {
    assert.throws(function () { acsch('string') })
  })

  it('should not operate on arrays and matrices', function () {
    assert.throws(() => acsch([1, 2, 3]), TypeError)
    assert.throws(() => acsch(matrix([1, 2, 3])), TypeError)
    const acsch123 = [0.881373587019543025, 0.481211825059603447, 0.32745015023725844]
    approx.deepEqual(math.map([1, 2, 3], acsch), acsch123)
    approx.deepEqual(math.map(matrix([1, 2, 3]), acsch), matrix(acsch123))
  })

  it('should throw an error in case of invalid number of arguments', function () {
    assert.throws(function () { acsch() }, /TypeError: Too few arguments/)
    assert.throws(function () { acsch(1, 2) }, /TypeError: Too many arguments/)
  })

  it('should LaTeX acsch', function () {
    const expression = math.parse('acsch(2)')
    assert.strictEqual(expression.toTex(), '\\mathrm{csch}^{-1}\\left(2\\right)')
  })
})
