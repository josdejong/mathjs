import assert from 'assert'
import math from '../../../../src/defaultInstance.js'
import { approxEqual, approxDeepEqual } from '../../../../tools/approx.js'
const pi = math.pi
const acos = math.acos
const cos = math.cos
const complex = math.complex
const matrix = math.matrix
const unit = math.unit
const bigmath = math.create({ number: 'BigNumber', precision: 20 })
const mathPredictable = math.create({ predictable: true })
const acosBig = bigmath.acos
const cosBig = bigmath.cos
const Big = bigmath.bignumber

describe('acos', function () {
  it('should return the arccos of a boolean', function () {
    approxEqual(acos(true), 0)
    approxEqual(acos(false), 0.5 * pi)
  })

  it('should return the arccos of a number', function () {
    approxEqual(acos(-1) / pi, 1)
    approxEqual(acos(-0.5) / pi, 2 / 3)
    approxEqual(acos(0) / pi, 0.5)
    approxEqual(acos(0.5) / pi, 1 / 3)
    approxEqual(acos(1) / pi, 0)

    approxDeepEqual(acos(-2), complex('3.14159265358979 - 1.31695789692482i'))
    approxDeepEqual(acos(2), complex('1.316957896924817i'))
  })

  it('should return the arccos of a number when predictable:true', function () {
    assert.strictEqual(typeof mathPredictable.acos(-2), 'number')
    assert(isNaN(mathPredictable.acos(-2)))
  })

  it('should return the arccos of a bignumber', function () {
    const arg = Big(-1)
    assert.deepStrictEqual(acosBig(arg).toString(), bigmath.pi.toString())
    assert.deepStrictEqual(acosBig(Big(-0.5)), Big('2.0943951023931954923'))
    assert.deepStrictEqual(acosBig(Big(0)), Big('1.5707963267948966192'))
    assert.deepStrictEqual(acosBig(Big(0.5)), Big('1.0471975511965977462'))
    assert.deepStrictEqual(acosBig(Big(1)), Big(0))

    // Hit Newton's method case
    const bigmath61 = math.create({ number: 'BigNumber', precision: 61 })
    assert.deepStrictEqual(bigmath61.acos(bigmath61.bignumber(0.00000001)),
      bigmath61.bignumber('1.570796316794896619231321524973084775431910533020886243820359'))
    // Wolfram:            1.5707963167948966192313215249730847754319105330208862438203592009158129650174844596314777278941600852176250962802
    // Make sure arg was not changed
    assert.deepStrictEqual(arg, Big(-1))
  })

  it('should be the inverse function of cos', function () {
    approxEqual(acos(cos(-1)), 1)
    approxEqual(acos(cos(0)), 0)
    approxEqual(acos(cos(0.1)), 0.1)
    approxEqual(acos(cos(0.5)), 0.5)
    approxEqual(acos(cos(2)), 2)
  })

  it('should be the inverse function of bignumber cos', function () {
    bigmath.config({ precision: 20 })
    assert.deepStrictEqual(acosBig(cosBig(Big(-1))), Big(1))
    assert.deepStrictEqual(acosBig(cosBig(Big(0))), Big('0'))
    assert.deepStrictEqual(acosBig(cosBig(Big(0.1))), Big('0.099999999999999999956'))
    assert.deepStrictEqual(acosBig(cosBig(Big(0.5))), Big('0.49999999999999999999'))
    assert.deepStrictEqual(acosBig(cosBig(Big(2))), Big(2))
  })

  it('should return for bignumber cos for x > 1', function () {
    assert.ok(acos(Big(1.1)).isNaN())
    assert.ok(acos(Big(-1.1)).isNaN())
  })

  it('should return the arccos of a complex number', function () {
    approxDeepEqual(acos(complex('2+3i')), complex(1.00014354247380, -1.98338702991654))
    approxDeepEqual(acos(complex('2-3i')), complex(1.00014354247380, 1.98338702991654))
    approxDeepEqual(acos(complex('-2+3i')), complex(2.14144911111600, -1.98338702991654))
    approxDeepEqual(acos(complex('-2-3i')), complex(2.14144911111600, 1.98338702991654))
    approxDeepEqual(acos(complex('i')), complex(1.570796326794897, -0.881373587019543))
    approxDeepEqual(acos(complex('1')), complex(0, 0))
    approxDeepEqual(acos(complex('1+i')), complex(0.904556894302381, -1.061275061905036))
  })

  it('should throw an error if called with a unit', function () {
    assert.throws(function () { acos(unit('45deg')) })
    assert.throws(function () { acos(unit('5 celsius')) })
  })

  it('should throw an error if called with a string', function () {
    assert.throws(function () { acos('string') })
  })

  it('should not operate on arrays and matrices', function () {
    assert.throws(() => acos([1, 2, 3]), TypeError)
    // note: the results of acos(2) and acos(3) differs in octave
    // the next tests are verified with mathematica
    const acos123 = [0, complex(0, 1.316957896924817), complex(0, 1.762747174039086)]
    approxDeepEqual(math.map([1, 2, 3], acos), acos123)
    approxDeepEqual(math.map(matrix([1, 2, 3]), acos), matrix(acos123))
  })

  it('should throw an error in case of invalid number of arguments', function () {
    assert.throws(function () { acos() }, /TypeError: Too few arguments/)
    assert.throws(function () { acos(1, 2) }, /TypeError: Too many arguments/)
  })

  it('should LaTeX acos', function () {
    const expression = math.parse('acos(1)')
    assert.strictEqual(expression.toTex(), '\\cos^{-1}\\left(1\\right)')
  })
})
