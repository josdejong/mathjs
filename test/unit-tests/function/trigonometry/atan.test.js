import assert from 'assert'
import math from '../../../../src/defaultInstance.js'
import { approxEqual, approxDeepEqual } from '../../../../tools/approx.js'
const pi = math.pi
const complex = math.complex
const matrix = math.matrix
const unit = math.unit
const atan = math.atan
const tan = math.tan
const bigmath = math.create({ number: 'BigNumber', precision: 20 })
const atanBig = bigmath.atan
const Big = bigmath.bignumber

describe('atan', function () {
  it('should return the arctan of a boolean', function () {
    approxEqual(atan(true), 0.25 * pi)
    approxEqual(atan(false), 0)
  })

  it('should return the arctan of a number', function () {
    approxEqual(atan(-1) / pi, -0.25)
    approxEqual(atan(-0.5) / pi, -0.147583617650433)
    approxEqual(atan(0) / pi, 0)
    approxEqual(atan(0.5) / pi, 0.147583617650433)
    approxEqual(atan(1) / pi, 0.25)
  })

  it('should return the arctan of a bignumber', function () {
    const arg1 = Big(-1)
    const arg2 = Big(-0.5)
    const arg3 = Big(0)
    const arg6 = Big(2)
    const arg7 = Big(Infinity)
    assert.deepStrictEqual(atanBig(arg1), Big('-0.78539816339744830962'))
    assert.deepStrictEqual(atanBig(arg2), Big('-0.46364760900080611621'))
    assert.deepStrictEqual(atanBig(arg3), Big(0))
    assert.deepStrictEqual(atanBig(Big(0.5)), Big('0.46364760900080611621'))
    assert.deepStrictEqual(atanBig(Big(1)), Big('0.78539816339744830962'))
    assert.deepStrictEqual(atanBig(arg6), Big('1.107148717794090503'))
    assert.deepStrictEqual(atanBig(arg7).toString(), '1.5707963267948966192')

    // Ensure the arguments where not changed
    assert.deepStrictEqual(arg1, Big(-1))
    assert.deepStrictEqual(arg2, Big(-0.5))
    assert.deepStrictEqual(arg3, Big(0))
    assert.deepStrictEqual(arg6, Big(2))
    assert.deepStrictEqual(arg7.toString(), 'Infinity')

    // Hit Newton's method case
    const bigmath61 = bigmath.create({ number: 'BigNumber', precision: 61 })
    assert.deepStrictEqual(bigmath61.atan(bigmath61.bignumber(0.9)),
      bigmath61.bignumber('0.7328151017865065916407920727342802519857556793582560863105069'))
  })

  it('should be the inverse function of tan', function () {
    approxEqual(atan(tan(-1)), -1)
    approxEqual(atan(tan(0)), 0)
    approxEqual(atan(tan(0.1)), 0.1)
    approxEqual(atan(tan(0.5)), 0.5)
    approxEqual(atan(tan(2)), -1.14159265358979)
  })

  it('should be the inverse function of bignumber tan', function () {
    bigmath.config({ precision: 20 })
    assert.deepStrictEqual(atanBig(bigmath.tan(Big(-1))), Big(-1))
    assert.deepStrictEqual(atanBig(bigmath.tan(Big(0))), Big(0))
    assert.deepStrictEqual(atanBig(bigmath.tan(Big(0.1))), Big(0.1))
    assert.deepStrictEqual(atanBig(bigmath.tan(Big(0.5))), Big(0.5))
    assert.deepStrictEqual(atanBig(bigmath.tan(Big(2))), Big('-1.1415926535897932385'))
    assert.deepStrictEqual(atanBig(bigmath.tan(bigmath.pi.div(2))).toString(), '-1.570796326794895205')
  })

  it('should return the arctan of a complex number', function () {
    const re = 1.409921049596575
    const im = 0.229072682968539
    approxDeepEqual(atan(complex('2+3i')), complex(re, im))
    approxDeepEqual(atan(complex('2-3i')), complex(re, -im))
    approxDeepEqual(atan(complex('-2+3i')), complex(-re, im))
    approxDeepEqual(atan(complex('-2-3i')), complex(-re, -im))
    approxDeepEqual(atan(complex('i')), complex(0, Infinity))
    approxDeepEqual(atan(complex('-i')), complex(0, -Infinity))
    approxDeepEqual(atan(complex('1')), complex(0.785398163397448, 0))
    approxDeepEqual(atan(complex('1+i')), complex(1.017221967897851, 0.402359478108525))
  })

  it('should throw an error if called with a unit', function () {
    assert.throws(function () { atan(unit('45deg')) })
    assert.throws(function () { atan(unit('5 celsius')) })
  })

  it('should throw an error if called with a string', function () {
    assert.throws(function () { atan('string') })
  })

  it('should not operate on arrays and matrices', function () {
    assert.throws(() => atan([1, 2, 3]), TypeError)
    assert.throws(() => atan(matrix([1, 2, 3])), TypeError)
    // matrix, array, range
    const atan123 = [0.785398163397448, 1.107148717794090, 1.249045772398254]
    approxDeepEqual(math.map([1, 2, 3], atan), atan123)
    approxDeepEqual(math.map(matrix([1, 2, 3]), atan), matrix(atan123))
  })

  it('should throw an error in case of invalid number of arguments', function () {
    assert.throws(function () { atan() }, /TypeError: Too few arguments/)
    assert.throws(function () { atan(1, 2) }, /TypeError: Too many arguments/)
  })

  it('should LaTeX atan', function () {
    const expression = math.parse('atan(10)')
    assert.strictEqual(expression.toTex(), '\\tan^{-1}\\left(10\\right)')
  })
})
