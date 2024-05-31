import assert from 'assert'
import math from '../../../../src/defaultInstance.js'
import { approxEqual, approxDeepEqual } from '../../../../tools/approx.js'
const pi = math.pi
const complex = math.complex
const matrix = math.matrix
const unit = math.unit
const asin = math.asin
const sin = math.sin
const bigmath = math.create({ number: 'BigNumber', precision: 20 })
const biggermath = math.create({ precision: 21 })
const predmath = math.create({ predictable: true })
const asinBig = bigmath.asin
const Big = bigmath.bignumber

describe('asin', function () {
  it('should return the arcsin of a boolean', function () {
    approxEqual(asin(true), 0.5 * pi)
    assert.strictEqual(asin(false), 0)
  })

  it('should return the arcsin of a number', function () {
    approxEqual(asin(-1) / pi, -0.5)
    approxEqual(asin(-0.5) / pi, -1 / 6)
    approxEqual(asin(0) / pi, 0)
    approxEqual(asin(0.5) / pi, 1 / 6)
    approxEqual(asin(1) / pi, 0.5)

    approxDeepEqual(asin(-2), complex('-1.57079632679490 + 1.31695789692482i'))
    approxDeepEqual(asin(2), complex('1.57079632679490 - 1.31695789692482i'))
  })

  it('should return the arccos of a number when predictable:true', function () {
    assert.strictEqual(typeof predmath.asin(-2), 'number')
    assert(isNaN(predmath.asin(-2)))
  })

  it('should return the arcsin of a bignumber', function () {
    const arg1 = Big(-1)
    const arg2 = Big(-0.581)
    const arg3 = Big(-0.5)

    assert.deepStrictEqual(asinBig(arg1), Big('-1.5707963267948966192'))
    assert.deepStrictEqual(asinBig(arg2), Big('-0.61995679945225370036'))
    assert.deepStrictEqual(asinBig(arg3), Big('-0.52359877559829887308'))
    assert.deepStrictEqual(asinBig(Big(0)), Big(0))
    assert.deepStrictEqual(asinBig(Big(0.5)), Big('0.52359877559829887308'))
    assert.deepStrictEqual(asinBig(Big(0.581)), Big('0.61995679945225370036'))
    assert.deepStrictEqual(asinBig(Big(1)), Big('1.5707963267948966192'))

    // Make sure args were not changed
    assert.deepStrictEqual(arg1, Big(-1))
    assert.deepStrictEqual(arg2, Big(-0.581))
    assert.deepStrictEqual(arg3, Big(-0.5))

    // Hit Newton's method case
    const bigmath61 = bigmath.create({ number: 'BigNumber', precision: 61 })

    const arg4 = bigmath61.bignumber(0.00000001)
    assert.deepStrictEqual(bigmath61.asin(arg4),
      bigmath61.bignumber('1.00000000000000001666666666666666741666666666666671130952381e-8'))
    assert.deepStrictEqual(arg4, bigmath61.bignumber(0.00000001))
  })

  it('should be the inverse function of sin', function () {
    approxEqual(asin(sin(-1)), -1)
    approxEqual(asin(sin(0)), 0)
    approxEqual(asin(sin(0.1)), 0.1)
    approxEqual(asin(sin(0.5)), 0.5)
    approxEqual(asin(sin(2)), 1.14159265358979)
  })

  it('should be the inverse function of bignumber sin', function () {
    // More Newton's method test cases
    const bigmath61 = bigmath.create({ number: 'BigNumber', precision: 61 })
    assert.deepStrictEqual(asinBig(bigmath61.sin(bigmath61.bignumber(-2))),
      bigmath61.bignumber('-1.141592653589793238462643383279502884197169399375105820974945'))
    // Wolfram:            -1.1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679821480865132
    assert.deepStrictEqual(asinBig(bigmath61.sin(bigmath61.bignumber(-0.5))), bigmath61.bignumber('-0.5'))
    assert.deepStrictEqual(asinBig(bigmath61.sin(bigmath61.bignumber(-0.1))), bigmath61.bignumber('-0.1'))
    assert.deepStrictEqual(asinBig(bigmath61.sin(bigmath61.bignumber(0.1))), bigmath61.bignumber('0.1'))
    assert.deepStrictEqual(asinBig(bigmath61.sin(bigmath61.bignumber(0.5))), bigmath61.bignumber('0.5'))
    assert.deepStrictEqual(asinBig(bigmath61.sin(bigmath61.bignumber(2))),
      bigmath61.bignumber('1.141592653589793238462643383279502884197169399375105820974945'))

    // Full decimal Taylor test cases
    assert.deepStrictEqual(asinBig(bigmath.sin(Big(0))), Big(0))
    assert.deepStrictEqual(asinBig(bigmath.sin(Big(0.1))), Big(0.1))
    assert.deepStrictEqual(asinBig(bigmath.sin(Big(0.5))), Big(0.5))
    assert.deepStrictEqual(asinBig(bigmath.sin(Big(2))), Big('1.1415926535897932385'))

    assert.deepStrictEqual(asinBig(biggermath.sin(Big(-1))), Big('-1'))

    // outside of real range
    assert.ok(asin(Big(1.1)).isNaN())
  })

  it('should return the arcsin of a complex number', function () {
    const re = 0.570652784321099
    const im = 1.983387029916536
    approxDeepEqual(asin(complex('2+3i')), complex(re, im))
    approxDeepEqual(asin(complex('2-3i')), complex(re, -im))
    approxDeepEqual(asin(complex('-2+3i')), complex(-re, im))
    approxDeepEqual(asin(complex('-2-3i')), complex(-re, -im))
    approxDeepEqual(asin(complex('i')), complex(0, 0.881373587019543))
    approxDeepEqual(asin(complex('1')), complex(1.57079632679490, 0))
    approxDeepEqual(asin(complex('1+i')), complex(0.666239432492515, 1.061275061905036))
  })

  it('should throw an error if called with a unit', function () {
    assert.throws(function () { asin(unit('45deg')) })
    assert.throws(function () { asin(unit('5 celsius')) })
  })

  it('should throw an error if called with a string', function () {
    assert.throws(function () { asin('string') })
  })

  it('should not operate on arrays and matrices', function () {
    assert.throws(() => asin([1, 2, 3]), TypeError)
    assert.throws(() => asin(matrix([1, 2, 3])), TypeError)
    // note: the results of asin(2) and asin(3) differs in octave
    // the next tests are verified with mathematica
    const asin123 = [
      1.57079632679490,
      complex(1.57079632679490, -1.31695789692482),
      complex(1.57079632679490, -1.76274717403909)]
    approxDeepEqual(math.map([1, 2, 3], asin), asin123)
    approxDeepEqual(math.map(matrix([1, 2, 3]), asin), matrix(asin123))
  })

  it('should throw an error in case of invalid number of arguments', function () {
    assert.throws(function () { asin() }, /TypeError: Too few arguments/)
    assert.throws(function () { asin(1, 2) }, /TypeError: Too many arguments/)
  })

  it('should LaTeX asin', function () {
    const expression = math.parse('asin(0.5)')
    assert.strictEqual(expression.toTex(), '\\sin^{-1}\\left(0.5\\right)')
  })
})
