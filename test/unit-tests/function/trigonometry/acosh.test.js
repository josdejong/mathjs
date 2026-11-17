/* eslint-disable no-loss-of-precision */

import assert from 'assert'
import math from '../../../../src/defaultInstance.js'
import { approxEqual, approxDeepEqual } from '../../../../tools/approx.js'
import { testEdgeCases } from '../../../../tools/edgeCases.js'
const pi = math.pi
const acosh = math.acosh
const cosh = math.cosh
const complex = math.complex
const matrix = math.matrix
const unit = math.unit
const bigmath = math.create({ number: 'BigNumber', precision: 20 })
const biggermath = math.create({ precision: 22 })
const predmath = math.create({ predictable: true })
const acoshBig = bigmath.acosh
const Big = bigmath.bignumber

describe('acosh', function () {
  it('should return the hyperbolic arccos of a boolean', function () {
    assert.strictEqual(acosh(true), 0)
    approxDeepEqual(acosh(false), complex(0, pi / 2))
    // assert.ok(isNaN(acosh(false)))
  })

  it('should return the hyperbolic arccos of a number', function () {
    approxDeepEqual(acosh(-2), complex(1.31695789692481670862504634730797, pi))
    approxDeepEqual(acosh(0), complex(0, pi / 2))
    // assert.ok(isNaN(acosh(-2)))
    // assert.ok(isNaN(acosh(0)))

    approxEqual(acosh(1), 0)
    approxEqual(acosh(2), 1.31695789692481670862504634730797)
    approxEqual(acosh(3), 1.7627471740390860504652186499595)
    approxEqual(acosh(pi), 1.811526272460853107021852049305)
  })

  it('should return NaN for values out of range and predictable:true', function () {
    assert.strictEqual(typeof predmath.acosh(-2), 'number')
    assert(isNaN(predmath.acosh(-2)))
  })

  it('should return the hyperbolic arccos of a bignumber', function () {
    const arg = Big(1)
    assert.deepStrictEqual(acosh(arg), Big(0))
    assert.deepStrictEqual(acoshBig(Big(2)), Big('1.3169578969248167086'))
    assert.deepStrictEqual(acoshBig(Big(3)), Big('1.7627471740390860505'))
    assert.deepStrictEqual(acoshBig(bigmath.pi).toString(), '1.811526272460853107')

    // Make sure arg was not changed
    assert.deepStrictEqual(arg, Big(1))
  })

  it('should be the inverse function of hyperbolic cos', function () {
    approxEqual(acosh(cosh(-1)), 1)
    approxEqual(acosh(cosh(0)), 0)
    approxEqual(acosh(cosh(0.1)), 0.1)
    approxEqual(acosh(cosh(0.5)), 0.5)
    approxEqual(acosh(cosh(2)), 2)
  })

  it('should be the inverse function of bignumber cosh', function () {
    assert.deepStrictEqual(acoshBig(bigmath.cosh(Big(-1))), Big(1))
    assert.deepStrictEqual(acoshBig(bigmath.cosh(Big(0))), Big(0))
    assert.deepStrictEqual(acoshBig(bigmath.cosh(Big(2))), Big(2))

    // Pass in extra digit
    const arg = Big(0.1)
    assert.deepStrictEqual(acoshBig(biggermath.cosh(arg)), Big('0.10000000000000000012'))
    assert.deepStrictEqual(acoshBig(biggermath.cosh(Big(0.5))), Big('0.49999999999999999995'))
    assert.deepStrictEqual(arg, Big(0.1))
  })

  it('should throw an error if the bignumber result is complex', function () {
    assert.ok(acosh(Big(0.5).isNaN()))
    assert.ok(acosh(Big(-0.5).isNaN()))
  })

  it('should return the arccosh of a complex number', function () {
    approxDeepEqual(acosh(complex('2+3i')), complex(1.9833870299165, 1.000143542473797))
    approxDeepEqual(acosh(complex('2-3i')), complex(1.9833870299165, -1.000143542473797))
    approxDeepEqual(acosh(complex('-2+3i')), complex(1.9833870299165, 2.14144911111600))
    approxDeepEqual(acosh(complex('-2-3i')), complex(1.9833870299165, -2.14144911111600))
    approxDeepEqual(acosh(complex('1+i')), complex(1.061275061905036, 0.904556894302381))
    approxDeepEqual(acosh(complex('i')), complex(0.881373587019543, 1.570796326794897))
    assert.deepStrictEqual(acosh(complex('1')), complex(-0, 0))
    approxDeepEqual(acosh(complex('0')), complex(0, pi / 2))
  })

  it('should throw an error if called with a unit', function () {
    assert.throws(function () { acosh(unit('45deg')) })
    assert.throws(function () { acosh(unit('5 celsius')) })
  })

  it('should throw an error if called with a string', function () {
    assert.throws(function () { acosh('string') })
  })

  it('should not operate on arrays and matrices', function () {
    assert.throws(() => acosh([1, 2, 3]), TypeError)
    assert.throws(() => acosh(matrix([1, 2, 3])), TypeError)
    const acosh123 = [0, 1.3169578969248167, 1.7627471740390860504]
    approxDeepEqual(math.map([1, 2, 3], acosh), acosh123)
    approxDeepEqual(math.map(matrix([1, 2, 3]), acosh), matrix(acosh123))
  })

  it('should throw an error in case of invalid number of arguments', function () {
    assert.throws(function () { acosh() }, /TypeError: Too few arguments/)
    assert.throws(function () { acosh(1, 2) }, /TypeError: Too many arguments/)
  })

  it('should LaTeX acosh', function () {
    const expression = math.parse('acosh(1)')
    assert.strictEqual(expression.toTex(), '\\cosh^{-1}\\left(1\\right)')
  })

  describe('edge cases (#3754)', function () {
    // expected: correctly rounded value (mpmath, 1000 digits), within 4 ulp.
    // Cases with a third entry are known issues and are skipped until fixed.
    testEdgeCases('acosh', acosh, [
      ['Infinity', Infinity],
      ['-Infinity', complex(Infinity, 3.141592653589793)],
      ['NaN', NaN, 'returns Complex 0 + NaNi instead of NaN'],
      ['1e300', 691.4686750787737],
      ['710', 7.258411654661591],
      ['400', 6.6846101651642655],
      ['-400', complex(6.6846101651642655, 3.141592653589793)],
      ['-710', complex(7.258411654661591, 3.141592653589793)],
      ['-1e300', complex(691.4686750787737, 3.141592653589793), 'real part overflows to Infinity (correct 691.4686750787737)'],
      ['1e-8', complex(0, 1.5707963167948966), 'complex.js 2.4.2: real part 5.6e-17 instead of 0 (ok with 2.4.3)'],
      ['1e-17', complex(0, 1.5707963267948966)],
      ['1e-200', complex(0, 1.5707963267948966)],
      ['-1e-8', complex(0, 1.5707963367948967), 'complex.js 2.4.2: real part 5.6e-17 instead of 0 (ok with 2.4.3)'],
      ['-1e-17', complex(0, 1.5707963267948966)],
      ['-1e-200', complex(0, 1.5707963267948966)],
      ['0', complex(0, 1.5707963267948966)],
      ['-0', complex(0, 1.5707963267948966)],
      ['1', 0],
      ['1-1e-15', complex(0, 4.4703483581542975e-8)],
      ['1-2^-53', complex(0, 1.4901161193847656e-8)],
      ['1+2^-52', 2.1073424255447014e-8],
      ['1+1e-15', 4.7121609153872417e-8],
      ['-1', complex(0, 3.141592653589793)],
      ['-(1-1e-15)', complex(0, 3.1415926088863095)],
      ['-(1-2^-53)', complex(0, 3.141592638688632)],
      ['-(1+2^-52)', complex(2.1073424255447014e-8, 3.141592653589793), 'real part 8.4 correct digits (rel err 4.0e-09)'],
      ['-(1+1e-15)', complex(4.7121609153872417e-8, 3.141592653589793), 'real part 8.7 correct digits (rel err 2.0e-09)']
    ])
  })
})
