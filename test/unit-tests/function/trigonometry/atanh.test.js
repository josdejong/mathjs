/* eslint-disable no-loss-of-precision */

import assert from 'assert'
import math from '../../../../src/defaultInstance.js'
import { approxEqual, approxDeepEqual } from '../../../../tools/approx.js'
import { testEdgeCases } from '../../../../tools/edgeCases.js'
const pi = math.pi
const atanh = math.atanh
const tanh = math.tanh
const complex = math.complex
const matrix = math.matrix
const unit = math.unit
const bigmath = math.create({ number: 'BigNumber', precision: 20 })
const biggermath = math.create({ precision: 21 })
const predmath = math.create({ predictable: true })
const atanhBig = bigmath.atanh
const Big = bigmath.bignumber

describe('atanh', function () {
  it('should return the hyperbolic arctan of a boolean', function () {
    assert.strictEqual(atanh(true), Infinity)
    assert.strictEqual(atanh(false), 0)
  })

  it('should return the hyperbolic arctan of a number', function () {
    approxDeepEqual(atanh(-2), complex(-0.54930614433405485, pi / 2))
    approxDeepEqual(atanh(2), complex(0.54930614433405485, -pi / 2))
    // assert.ok(isNaN(atanh(-2)))
    // assert.ok(isNaN(atanh(2)))

    approxEqual(atanh(-1), -Infinity)
    approxEqual(atanh(-0.5), -0.54930614433405484569762261846)
    approxEqual(atanh(0), 0)
    approxEqual(atanh(0.5), 0.54930614433405484569762261846)
    approxEqual(atanh(1), Infinity)
  })

  it('should return the hyperbolic arctan of a number when predictable:true', function () {
    assert.strictEqual(typeof predmath.atanh(-2), 'number')
    assert(isNaN(predmath.atanh(-2)))
  })

  it('should return the hyperbolic arctan of a bignumber', function () {
    const arg1 = Big(-1)
    const arg2 = Big(-0.5)
    assert.deepStrictEqual(atanhBig(arg1).toString(), '-Infinity')
    assert.deepStrictEqual(atanhBig(arg2), Big('-0.5493061443340548457'))
    assert.deepStrictEqual(atanhBig(Big(0)), Big(0))
    assert.deepStrictEqual(atanhBig(Big(0.5)), Big('0.5493061443340548457'))
    assert.deepStrictEqual(atanhBig(Big(1)).toString(), 'Infinity')

    // Make sure arg was not changed
    assert.deepStrictEqual(arg1, Big(-1))
    assert.deepStrictEqual(arg2, Big(-0.5))
  })

  it('should be the inverse function of hyperbolic tan', function () {
    approxEqual(atanh(tanh(-1)), -1)
    approxEqual(atanh(tanh(0)), 0)
    approxEqual(atanh(tanh(0.1)), 0.1)
    approxEqual(atanh(tanh(0.5)), 0.5)
  })

  it('should be the inverse function of bignumber tanh', function () {
    assert.deepStrictEqual(atanhBig(bigmath.tanh(Big(-0.5))), Big(-0.5))
    assert.deepStrictEqual(atanhBig(bigmath.tanh(Big(0))), Big(0))
    assert.deepStrictEqual(atanhBig(bigmath.tanh(Big(0.5))), Big(0.5))

    /* Pass in more digits to pi. */
    const arg = Big(-1)
    assert.deepStrictEqual(atanhBig(biggermath.tanh(arg)), Big(-1))
    assert.deepStrictEqual(atanhBig(biggermath.tanh(Big(0.1))), Big(0.1))
    assert.deepStrictEqual(arg, Big(-1))

    assert.ok(atanh(Big(1.1)).isNaN())
  })

  it('should return the arctanh of a complex number', function () {
    approxDeepEqual(atanh(complex('2+3i')), complex(0.1469466662255, 1.33897252229449))
    approxDeepEqual(atanh(complex('2-3i')), complex(0.1469466662255, -1.33897252229449))
    approxDeepEqual(atanh(complex('-2+3i')), complex(-0.1469466662255, 1.33897252229449))
    approxDeepEqual(atanh(complex('-2-3i')), complex(-0.1469466662255, -1.33897252229449))
    approxDeepEqual(atanh(complex('1+i')), complex(0.402359478108525, 1.01722196789785137))
    approxDeepEqual(atanh(complex('i')), complex(0, pi / 4))

    approxDeepEqual(atanh(complex('2')), complex(0.54930614433405485, -pi / 2))
    assert.deepStrictEqual(atanh(complex('1')), complex(Infinity, 0))
    assert.deepStrictEqual(atanh(complex('0')), complex(0, 0))
    approxDeepEqual(atanh(complex('-2')), complex(-0.54930614433405485, pi / 2))
  })

  it('should throw an error if called with a unit', function () {
    assert.throws(function () { atanh(unit('45deg')) })
    assert.throws(function () { atanh(unit('5 celsius')) })
  })

  it('should throw an error if called with a string', function () {
    assert.throws(function () { atanh('string') })
  })

  it('should not operate on arrays and matrices', function () {
    assert.throws(() => atanh([-1, 0, 1]), TypeError)
    assert.throws(() => atanh(matrix([-1, 0, 1])), TypeError)
    const atanh101 = [-Infinity, 0, Infinity]
    assert.deepStrictEqual(math.map([-1, 0, 1], atanh), atanh101)
    assert.deepStrictEqual(math.map(matrix([-1, 0, 1]), atanh), matrix(atanh101))
  })

  it('should throw an error in case of invalid number of arguments', function () {
    assert.throws(function () { atanh() }, /TypeError: Too few arguments/)
    assert.throws(function () { atanh(1, 2) }, /TypeError: Too many arguments/)
  })

  it('should LaTeX atanh', function () {
    const expression = math.parse('atanh(0.5)')
    assert.strictEqual(expression.toTex(), '\\tanh^{-1}\\left(0.5\\right)')
  })

  describe('edge cases (#3754)', function () {
    // expected: correctly rounded value (mpmath, 1000 digits), within 4 ulp.
    // Cases with a third entry are known issues and are skipped until fixed.
    testEdgeCases('atanh', atanh, [
      ['Infinity', complex(0, -1.5707963267948966), 'real part NaN instead of 0'],
      ['-Infinity', complex(0, 1.5707963267948966), 'real part NaN instead of 0'],
      ['NaN', NaN, 'returns Complex NaN + 1.5707963267948966i instead of NaN'],
      // mpmath at 60 digits cancels the real part to 0; requires higher precision.
      ['1e300', complex(1e-300, -1.5707963267948966), 'real part underflows to 0 (correct 1e-300)'],
      ['710', complex(0.0014084516355566889, -1.5707963267948966), 'real part 14.8 correct digits (rel err 1.5e-15)'],
      ['400', complex(0.0025000052083528645, -1.5707963267948966), 'real part 13.7 correct digits (rel err 2.2e-14)'],
      ['-400', complex(-0.0025000052083528645, 1.5707963267948966), 'real part 14.4 correct digits (rel err 4.4e-15)'],
      ['-710', complex(-0.0014084516355566889, 1.5707963267948966), 'real part 15.0 correct digits (rel err 9.2e-16)'],
      // mpmath at 60 digits cancels the real part to 0; requires higher precision.
      ['-1e300', complex(-1e-300, 1.5707963267948966), 'real part underflows to 0 (correct -1e-300)'],
      ['1e-8', 1e-8],
      ['1e-17', 1e-17],
      ['1e-200', 1e-200],
      ['-1e-8', -1e-8],
      ['-1e-17', -1e-17],
      ['-1e-200', -1e-200],
      ['0', 0],
      ['-0', -0],
      ['1', Infinity],
      ['1-1e-15', 17.616361586450413],
      ['1-2^-53', 18.714973875118524],
      ['1+2^-52', complex(18.36840028483855, -1.5707963267948966)],
      ['1+1e-15', complex(17.563681328621502, -1.5707963267948966)],
      ['-1', -Infinity],
      ['-(1-1e-15)', -17.616361586450413],
      ['-(1-2^-53)', -18.714973875118524],
      ['-(1+2^-52)', complex(-18.36840028483855, 1.5707963267948966)],
      ['-(1+1e-15)', complex(-17.563681328621502, 1.5707963267948966)]
    ])
  })
})
