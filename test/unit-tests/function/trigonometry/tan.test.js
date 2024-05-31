import assert from 'assert'
import math from '../../../../src/defaultInstance.js'
import { approxEqual, approxDeepEqual } from '../../../../tools/approx.js'
const pi = math.pi
const complex = math.complex
const matrix = math.matrix
const unit = math.unit
const tan = math.tan
const piBigmath = math.create({ number: 'BigNumber', precision: 21 })
const bigmath = math.create({ precision: 20 })
const Big = bigmath.bignumber
const bigTan = bigmath.tan

describe('tan', function () {
  it('should return the tangent of a boolean', function () {
    approxEqual(tan(true), 1.55740772465490)
    approxEqual(tan(false), 0)
  })

  it('should return the tangent of a number', function () {
    approxEqual(tan(0), 0)
    approxEqual(tan(pi * 1 / 4), 1)
    approxEqual(tan(pi * 1 / 8), 0.414213562373095)
    assert.ok(tan(pi * 2 / 4) > 1e10)
    approxEqual(tan(pi * 3 / 4), -1)
    approxEqual(tan(pi * 4 / 4), 0)
    approxEqual(tan(pi * 5 / 4), 1)
    assert.ok(tan(pi * 6 / 4) > 1e10)
    approxEqual(tan(pi * 7 / 4), -1)
    approxEqual(tan(pi * 8 / 4), 0)
  })

  it('should return the tangent of a bignumber', function () {
    const bigPi = piBigmath.pi

    assert.deepStrictEqual(bigTan(Big(0)), Big(0))
    assert.deepStrictEqual(bigTan(Big(-1)), Big('-1.5574077246549022305'))

    assert.deepStrictEqual(bigTan(bigPi.div(8)).toString(), '0.414213562373095048802')
    // Wolfram:                                        0.414213562373095048801688724209698078569671875376948073176
    assert.deepStrictEqual(bigTan(bigPi.div(4)).toString(), '0.999999999999999999999')
  })

  it('should return the tangent of a complex number', function () {
    const re = 0.00376402564150425
    const im = 1.00323862735360980
    approxDeepEqual(tan(complex('2+3i')), complex(-re, im))
    approxDeepEqual(tan(complex('2-3i')), complex(-re, -im))
    approxDeepEqual(tan(complex('-2+3i')), complex(re, im))
    approxDeepEqual(tan(complex('-2-3i')), complex(re, -im))
    approxDeepEqual(tan(complex('i')), complex(0, 0.761594155955765))
    approxDeepEqual(tan(complex('1')), complex(1.55740772465490, 0))
    approxDeepEqual(tan(complex('1+i')), complex(0.271752585319512, 1.083923327338695))
  })

  it('should return the tangent of an angle', function () {
    approxEqual(tan(unit(' 60deg')), math.sqrt(3))
    approxEqual(tan(unit('-135deg')), 1)

    assert(math.isBigNumber(tan(unit(math.bignumber(60), 'deg'))))
    approxEqual(tan(unit(math.bignumber(60), 'deg')).toNumber(), math.sqrt(3))

    approxDeepEqual(tan(unit(complex('1+i'), 'rad')), complex(0.271752585319512, 1.083923327338695))
  })

  it('should throw an error if called with an invalid unit', function () {
    assert.throws(function () { tan(unit('5 celsius')) })
  })

  it('should throw an error if called with a string', function () {
    assert.throws(function () { tan('string') })
  })

  const tan123 = [1.557407724654902, -2.185039863261519, -0.142546543074278]

  it('should not operate on an array', function () {
    assert.throws(() => tan([1, 2, 3]), TypeError)
    approxDeepEqual(math.map([1, 2, 3], tan), tan123)
  })

  it('should not operate on a matrix', function () {
    assert.throws(() => tan(matrix([1, 2, 3])), TypeError)
    approxDeepEqual(math.map(matrix([1, 2, 3]), tan), matrix(tan123))
  })

  it('should throw an error in case of invalid number of arguments', function () {
    assert.throws(function () { tan() }, /TypeError: Too few arguments/)
    assert.throws(function () { tan(1, 2) }, /TypeError: Too many arguments/)
  })

  it('should LaTeX tan', function () {
    const expression = math.parse('tan(1)')
    assert.strictEqual(expression.toTex(), '\\tan\\left(1\\right)')
  })
})
