/* eslint-disable no-loss-of-precision */

import assert from 'assert'
import math from '../../../../src/defaultInstance.js'
import { approxEqual, approxDeepEqual } from '../../../../tools/approx.js'
const pi = math.pi
const asech = math.asech
const sech = math.sech
const complex = math.complex
const matrix = math.matrix
const unit = math.unit
const bigmath = math.create({ number: 'BigNumber', precision: 20 })
const biggermath = math.create({ precision: 22 })
const predmath = math.create({ predictable: true })
const asechBig = bigmath.asech
const Big = bigmath.bignumber

describe('asech', function () {
  it('should return the hyperbolic arcsec of a boolean', function () {
    assert.strictEqual(asech(true), 0)
    assert.strictEqual(asech(false), Infinity)
  })

  it('should return the hyperbolic arcsec of a number', function () {
    approxDeepEqual(asech(-0.5), complex(1.3169578969, pi))
    approxDeepEqual(asech(2), complex(0, pi / 3))
    // assert.ok(isNaN(asech(-0.5)))
    // assert.ok(isNaN(asech(2)))

    assert.strictEqual(asech(0), Infinity)
    approxEqual(asech(0.25), 2.0634370688955605467272811726201)
    approxEqual(asech(0.5), 1.31695789692481670862504634730797)
    approxEqual(asech(0.75), 0.7953654612239056305278909331478)
    assert.strictEqual(asech(1), 0)
  })

  it('should return the hyperbolic arcsec of a number when predictable:true', function () {
    assert.strictEqual(typeof predmath.asech(2), 'number')
    assert(isNaN(predmath.asech(2)))
  })

  it('should return the hyperbolic arcsec of a bignumber', function () {
    const arg1 = Big(0)
    const arg2 = Big(0.25)
    assert.deepStrictEqual(asechBig(arg1).toString(), 'Infinity')
    assert.deepStrictEqual(asechBig(arg2), Big('2.0634370688955605467'))
    assert.deepStrictEqual(asechBig(Big(0.5)), Big('1.3169578969248167086'))
    assert.deepStrictEqual(asechBig(Big(0.75)), Big('0.79536546122390563049'))
    assert.deepStrictEqual(asechBig(Big(1)), Big(0))

    // Make sure arg was not changed
    assert.deepStrictEqual(arg1, Big(0))
    assert.deepStrictEqual(arg2, Big(0.25))

    /* out of range */
    assert.ok(asech(Big(-1)).isNaN())
    assert.ok(asech(Big(2)).isNaN())
  })

  it('should be the inverse function of hyperbolic sec', function () {
    approxEqual(asech(sech(-1)), 1)
    approxEqual(asech(sech(0)), 0)
    approxEqual(asech(sech(0.1)), 0.1)
    approxEqual(asech(sech(0.5)), 0.5)
    approxEqual(asech(sech(2)), 2)
  })

  it('should be the inverse function of bignumber sech', function () {
    assert.deepStrictEqual(asechBig(bigmath.sech(Big(-1))), Big(1))
    assert.deepStrictEqual(asechBig(bigmath.sech(Big(0))), Big(0))
    assert.deepStrictEqual(asechBig(bigmath.sech(Big(0.5))), Big('0.49999999999999999995'))
    assert.deepStrictEqual(asechBig(bigmath.sech(Big(2))), Big(2))

    /* Pass in more digits to pi. */
    assert.deepStrictEqual(asechBig(biggermath.sech(Big(0.1))), Big('0.10000000000000000012'))
  })

  it('should return the arcsech of a complex number', function () {
    approxDeepEqual(asech(complex('2+3i')), complex(0.23133469857397, -1.420410722467035))
    approxDeepEqual(asech(complex('2-3i')), complex(0.23133469857397, 1.420410722467035))
    approxDeepEqual(asech(complex('-2+3i')), complex(0.23133469857397, -1.72118193112275858))
    approxDeepEqual(asech(complex('-2-3i')), complex(0.23133469857397, 1.72118193112275858))
    approxDeepEqual(asech(complex('1+i')), complex(0.5306375309525178, -1.11851787964370594))
    approxDeepEqual(asech(complex('i')), complex(0.881373587019543, -1.570796326794897))
    approxDeepEqual(asech(complex('2')), complex(0, pi / 3))
    assert.deepStrictEqual(asech(complex('1')), complex(-0, 0))
    approxDeepEqual(asech(complex('0.5')), complex(1.3169578969248, 0))
    assert.deepStrictEqual(asech(complex('0')), complex(Infinity, Infinity))
    approxDeepEqual(asech(complex('-0.5')), complex(1.3169578969248, pi))
    approxDeepEqual(asech(complex('-1')), complex(0, pi))
  })

  it('should throw an error if called with a unit', function () {
    assert.throws(function () { asech(unit('45deg')) })
    assert.throws(function () { asech(unit('5 celsius')) })
  })

  it('should throw an error if called with a string', function () {
    assert.throws(function () { asech('string') })
  })

  it('should not operate on arrays and matrices', function () {
    assert.throws(() => asech([0, 1]), TypeError)
    assert.throws(() => asech(matrix([0, 1])), TypeError)
    const asech01 = [Infinity, 0]
    assert.deepStrictEqual(math.map([0, 1], asech), asech01)
    assert.deepStrictEqual(math.map(matrix([0, 1]), asech), matrix(asech01))
  })

  it('should throw an error in case of invalid number of arguments', function () {
    assert.throws(function () { asech() }, /TypeError: Too few arguments/)
    assert.throws(function () { asech(1, 2) }, /TypeError: Too many arguments/)
  })

  it('should LaTeX asech', function () {
    const expression = math.parse('asech(1)')
    assert.strictEqual(expression.toTex(), '\\mathrm{sech}^{-1}\\left(1\\right)')
  })
})
