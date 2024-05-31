import assert from 'assert'
import math from '../../../../src/defaultInstance.js'
import { approxEqual, approxDeepEqual } from '../../../../tools/approx.js'
const pi = math.pi
const complex = math.complex
const matrix = math.matrix
const unit = math.unit
const csc = math.csc
const bigmath = math.create({ number: 'BigNumber', precision: 20 })

describe('csc', function () {
  it('should return the cosecant of a boolean', function () {
    approxEqual(csc(true), 1.18839510577812)
    approxEqual(csc(false), Infinity)
  })

  it('should return the cosecant of a number', function () {
    approxEqual(1 / csc(0), 0)
    approxEqual(1 / csc(pi * 1 / 4), 0.707106781186548)
    approxEqual(1 / csc(pi * 1 / 8), 0.382683432365090)
    approxEqual(1 / csc(pi * 2 / 4), 1)
    approxEqual(1 / csc(pi * 3 / 4), 0.707106781186548)
    approxEqual(1 / csc(pi * 4 / 4), 0)
    approxEqual(1 / csc(pi * 5 / 4), -0.707106781186548)
    approxEqual(1 / csc(pi * 6 / 4), -1)
    approxEqual(1 / csc(pi * 7 / 4), -0.707106781186548)
    approxEqual(1 / csc(pi * 8 / 4), 0)
    approxEqual(1 / csc(pi / 4), math.sqrt(2) / 2)
  })

  it('should return the cosecant of a bignumber', function () {
    const Big = bigmath.bignumber
    const bigPi = bigmath.pi
    const sqrt2 = bigmath.SQRT2.toString()

    assert.deepStrictEqual(bigmath.csc(Big(0)).toString(), 'Infinity')
    assert.deepStrictEqual(bigmath.csc(bigPi.div(8)).toString(), '2.6131259297527530557')
    assert.deepStrictEqual(bigmath.csc(bigPi.div(4)).toString(), sqrt2)
    assert.deepStrictEqual(bigmath.csc(bigPi.div(2)).toString(), '1')
    assert.deepStrictEqual(bigmath.csc(bigPi), Big('-26769019461318409709')) // large number (about infinity)
    assert.deepStrictEqual(bigmath.csc(bigPi.times(3).div(2)).toString(), '-1')
  })

  it('should return the cosecant of a complex number', function () {
    const re = 0.0904732097532074
    const im = 0.0412009862885741
    approxDeepEqual(csc(complex('2+3i')), complex(re, im))
    approxDeepEqual(csc(complex('2-3i')), complex(re, -im))
    approxDeepEqual(csc(complex('-2+3i')), complex(-re, im))
    approxDeepEqual(csc(complex('-2-3i')), complex(-re, -im))
    approxDeepEqual(csc(complex('i')), complex(0, -0.850918128239322))
    approxDeepEqual(csc(complex('1')), complex(1.18839510577812, 0))
    approxDeepEqual(csc(complex('1+i')), complex(0.621518017170428, -0.303931001628426))
  })

  it('should return the cosecant of an angle', function () {
    approxEqual(csc(unit('45deg')), 1.41421356237310)
    approxEqual(csc(unit('-45deg')), -1.41421356237310)

    assert(math.isBigNumber(csc(unit(math.bignumber(45), 'deg'))))
    approxEqual(csc(unit(math.bignumber(45), 'deg')).toNumber(), 1.41421356237310)

    approxDeepEqual(csc(unit(complex('1+i'), 'rad')), complex(0.621518017170428, -0.303931001628426))
  })

  it('should throw an error if called with an invalid unit', function () {
    assert.throws(function () { csc(unit('5 celsius')) })
  })

  it('should throw an error if called with a string', function () {
    assert.throws(function () { csc('string') })
  })

  const csc123 = [1.18839510577812, 1.09975017029462, 7.08616739573719]

  it('should not operate on an array', function () {
    assert.throws(() => csc([1, 2, 3]), TypeError)
    approxDeepEqual(math.map([1, 2, 3], csc), csc123)
  })

  it('should not operate on a matrix', function () {
    assert.throws(() => csc(matrix([1, 2, 3])), TypeError)
    approxDeepEqual(math.map(matrix([1, 2, 3]), csc), matrix(csc123))
  })

  it('should throw an error in case of invalid number of arguments', function () {
    assert.throws(function () { csc() }, /TypeError: Too few arguments/)
    assert.throws(function () { csc(1, 2) }, /TypeError: Too many arguments/)
  })

  it('should LaTeX csc', function () {
    const expression = math.parse('csc(1)')
    assert.strictEqual(expression.toTex(), '\\csc\\left(1\\right)')
  })
})
