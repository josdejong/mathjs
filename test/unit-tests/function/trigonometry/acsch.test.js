/* eslint-disable no-loss-of-precision */

import assert from 'assert'
import math from '../../../../src/defaultInstance.js'
import { approxEqual, approxDeepEqual } from '../../../../tools/approx.js'
import { testEdgeCases } from '../../../../tools/edgeCases.js'
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
    approxEqual(acsch(true), 0.8813735870195430)
    assert.strictEqual(acsch(false), Infinity)
  })

  it('should return the hyperbolic arccsc of a number', function () {
    approxEqual(acsch(-2), -0.48121182505960344749775891342437)
    approxEqual(acsch(-1), -0.88137358701954302523260932497979)
    assert.strictEqual(acsch(0), Infinity)
    approxEqual(acsch(1), 0.88137358701954302523260932497979)
    approxEqual(acsch(2), 0.48121182505960344749775891342437)
    approxEqual(acsch(pi), 0.3131658804508683758718693082657)
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
    approxEqual(acsch(csch(-1)), -1)
    approxEqual(acsch(csch(0)), 0)
    approxEqual(acsch(csch(0.1)), 0.1)
    approxEqual(acsch(csch(0.5)), 0.5)
    approxEqual(acsch(csch(2)), 2)
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
    approxDeepEqual(acsch(complex('2+3i')), complex(0.157355498844985, -0.229962902377208))
    approxDeepEqual(acsch(complex('2-3i')), complex(0.157355498844985, 0.229962902377208))
    approxDeepEqual(acsch(complex('-2+3i')), complex(-0.157355498844985, -0.229962902377208))
    approxDeepEqual(acsch(complex('-2-3i')), complex(-0.157355498844985, 0.229962902377208))
    approxDeepEqual(acsch(complex('1+i')), complex(0.530637530952517826, -0.45227844715119068))
    approxDeepEqual(acsch(complex('i')), complex(0, -pi / 2))
    approxDeepEqual(acsch(complex('1')), complex(0.881373587019543025, 0))
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
    approxDeepEqual(math.map([1, 2, 3], acsch), acsch123)
    approxDeepEqual(math.map(matrix([1, 2, 3]), acsch), matrix(acsch123))
  })

  it('should throw an error in case of invalid number of arguments', function () {
    assert.throws(function () { acsch() }, /TypeError: Too few arguments/)
    assert.throws(function () { acsch(1, 2) }, /TypeError: Too many arguments/)
  })

  it('should LaTeX acsch', function () {
    const expression = math.parse('acsch(2)')
    assert.strictEqual(expression.toTex(), '\\mathrm{csch}^{-1}\\left(2\\right)')
  })

  describe('edge cases (#3754)', function () {
    // expected: correctly rounded value (mpmath, 1000 digits), within 4 ulp.
    // Cases with a third entry are known issues and are skipped until fixed.
    testEdgeCases('acsch', acsch, [
      ['Infinity', 0],
      ['-Infinity', -0, 'result sign of zero (0, correct -0)'],
      ['NaN', NaN],
      ['1e300', 1e-300, 'result underflows to 0 (correct 1e-300)'],
      ['710', 0.0014084502385606538, 'result 13.5 correct digits (rel err 3.3e-14)'],
      ['400', 0.0024999973958406575, 'result 13.3 correct digits (rel err 5.4e-14)'],
      ['-400', -0.0024999973958406575, 'result 13.9 correct digits (rel err 1.1e-14)'],
      ['-710', -0.0014084502385606538, 'result 13.5 correct digits (rel err 3.1e-14)'],
      ['-1e300', -1e-300, 'result underflows to 0 (correct -1e-300)'],
      ['1e-8', 19.11382792451231],
      ['1e-17', 39.837093761458725],
      ['1e-200', 461.2101657793691, 'result overflows to Infinity (correct 461.2101657793691)'],
      ['-1e-8', -19.11382792451231, 'result overflows to -Infinity (correct -19.11382792451231)'],
      ['-1e-17', -39.837093761458725, 'result overflows to -Infinity (correct -39.837093761458725)'],
      ['-1e-200', -461.2101657793691, 'result overflows to Infinity (correct -461.2101657793691)'],
      ['0', Infinity],
      ['-0', -Infinity, 'result NaN instead of -Infinity'],
      ['1', 0.881373587019543],
      ['1-1e-15', 0.8813735870195437],
      ['1-2^-53', 0.8813735870195432],
      ['1+2^-52', 0.8813735870195428],
      ['1+1e-15', 0.8813735870195423],
      ['-1', -0.881373587019543],
      ['-(1-1e-15)', -0.8813735870195437],
      ['-(1-2^-53)', -0.8813735870195432],
      ['-(1+2^-52)', -0.8813735870195428],
      ['-(1+1e-15)', -0.8813735870195423]
    ])
  })
})
