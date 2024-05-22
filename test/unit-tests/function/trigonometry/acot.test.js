import assert from 'assert'
import math from '../../../../src/defaultInstance.js'
import { approxEqual, approxDeepEqual } from '../../../../tools/approx.js'
const pi = math.pi
const complex = math.complex
const matrix = math.matrix
const unit = math.unit
const acot = math.acot
const cot = math.cot
const bigmath = math.create({ number: 'BigNumber', precision: 20 })
const acotBig = bigmath.acot
const cotBig = bigmath.cot
const Big = bigmath.bignumber

describe('acot', function () {
  it('should return the arccot of a boolean', function () {
    approxEqual(acot(true), pi / 4)
    assert.strictEqual(acot(false), pi / 2)
  })

  it('should return the arccot of a number', function () {
    approxEqual(acot(-1) / pi, -0.25)
    approxEqual(acot(-0.5), -1.107148717794)
    assert.strictEqual(acot(0), pi / 2)
    approxEqual(acot(0.5), 1.107148717794)
    approxEqual(acot(1) / pi, 0.25)

    assert.strictEqual(acot(-Infinity), -0)
    assert.strictEqual(acot(Infinity), 0)
  })

  it('should return the arccot of a bignumber', function () {
    const arg2 = Big(-1)
    const arg3 = Big(-0.5)
    const arg4 = Big(0)
    const arg7 = Big(2)
    const arg8 = Big(Infinity)

    assert.deepStrictEqual(acotBig(Big(-2)), Big('-0.46364760900080611621'))
    assert.deepStrictEqual(acotBig(arg2), Big('-0.78539816339744830962'))
    assert.deepStrictEqual(acotBig(arg3), Big('-1.107148717794090503'))
    assert.deepStrictEqual(acotBig(arg4).toString(), '1.5707963267948966192')
    assert.deepStrictEqual(acotBig(Big(1)), Big('0.78539816339744830962'))
    assert.deepStrictEqual(acotBig(arg7), Big('0.46364760900080611621'))
    assert.deepStrictEqual(acotBig(arg8), Big(0))

    // Ensure the arguments where not changed
    assert.deepStrictEqual(arg2, Big(-1))
    assert.deepStrictEqual(arg3, Big(-0.5))
    assert.deepStrictEqual(arg4, Big(0))
    assert.deepStrictEqual(arg7, Big(2))
    assert.deepStrictEqual(arg8.toString(), 'Infinity')

    // Hit Newton's method case
    const bigmath61 = bigmath.create({ number: 'BigNumber', precision: 61 })
    assert.deepStrictEqual(bigmath61.acot(bigmath61.bignumber(1.1)),
      bigmath61.bignumber('0.7378150601204649138136281298033902035827333552504444896340492'))
  })

  it('should be the inverse function of cot', function () {
    approxEqual(acot(cot(-1)), -1)
    approxEqual(acot(cot(0)), 0)
    approxEqual(acot(cot(0.1)), 0.1)
    approxEqual(acot(cot(0.5)), 0.5)
    approxEqual(acot(cot(2)), -1.14159265358979)
  })

  it('should be the inverse function of bignumber cot', function () {
    bigmath.config({ precision: 20 })
    assert.deepStrictEqual(acotBig(cotBig(Big(-1))), Big(-1))
    assert.deepStrictEqual(acotBig(cotBig(Big(0))), Big(0))
    assert.deepStrictEqual(acotBig(cotBig(Big(0.1))), Big(0.1))
    assert.deepStrictEqual(acotBig(cotBig(Big(0.5))), Big(0.5))
    assert.deepStrictEqual(acotBig(cotBig(Big(2))), Big('-1.1415926535897932385'))
    assert.deepStrictEqual(acotBig(cotBig(bigmath.pi.div(2).minus(1e-10))).toString(), '1.5707963266948966193')
    assert.deepStrictEqual(acotBig(cotBig(bigmath.pi.div(2))).toString(), '-1.570796326794895205')
  })

  it('should return the arccot of a complex number', function () {
    const re = 0.160875277198321
    const im = 0.229072682968539
    approxDeepEqual(acot(complex('2+3i')), complex(re, -im))
    approxDeepEqual(acot(complex('2-3i')), complex(re, im))
    approxDeepEqual(acot(complex('-2+3i')), complex(-re, -im))
    approxDeepEqual(acot(complex('-2-3i')), complex(-re, im))
    assert.deepStrictEqual(acot(complex('i')), complex(0, -Infinity))
    approxDeepEqual(acot(complex('1')), complex(pi / 4, 0))
    approxDeepEqual(acot(complex('1+i')), complex(0.553574358897, -0.4023594781085))
  })

  it('should throw an error if called with a unit', function () {
    assert.throws(function () { acot(unit('45deg')) })
    assert.throws(function () { acot(unit('5 celsius')) })
  })

  it('should throw an error if called with a string', function () {
    assert.throws(function () { acot('string') })
  })

  it('should not operate on arrays and matrices', function () {
    assert.throws(() => acot([1, 2, 3]), TypeError)
    assert.throws(() => acot(matrix([1, 2, 3])), TypeError)
    // matrix, array, range
    const acot123 = [pi / 4, 0.4636476090008, 0.3217505543966]
    approxDeepEqual(math.map([1, 2, 3], acot), acot123)
    approxDeepEqual(math.map(matrix([1, 2, 3]), acot), matrix(acot123))
  })

  it('should throw an error in case of invalid number of arguments', function () {
    assert.throws(function () { acot() }, /TypeError: Too few arguments/)
    assert.throws(function () { acot(1, 2) }, /TypeError: Too many arguments/)
  })

  it('should LaTeX acot', function () {
    const expression = math.parse('acot(2)')
    assert.strictEqual(expression.toTex(), '\\cot^{-1}\\left(2\\right)')
  })
})
