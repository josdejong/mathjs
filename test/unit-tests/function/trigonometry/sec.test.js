import assert from 'assert'
import math from '../../../../src/defaultInstance.js'
import { approxEqual, approxDeepEqual } from '../../../../tools/approx.js'
const pi = math.pi
const complex = math.complex
const matrix = math.matrix
const unit = math.unit
const sec = math.sec
const bigmath = math.create({ number: 'BigNumber', precision: 20 })
const biggermath = math.create({ number: 'BigNumber', precision: 21 })

describe('sec', function () {
  it('should return the secant of a boolean', function () {
    approxEqual(sec(true), 1.85081571768093)
    assert.strictEqual(sec(false), 1)
  })

  it('should return the secant of a number', function () {
    approxEqual(1 / sec(0), 1)
    approxEqual(1 / sec(pi * 1 / 4), 0.707106781186548)
    approxEqual(1 / sec(pi * 1 / 8), 0.923879532511287)
    approxEqual(1 / sec(pi * 2 / 4), 0)
    approxEqual(1 / sec(pi * 3 / 4), -0.707106781186548)
    approxEqual(1 / sec(pi * 4 / 4), -1)
    approxEqual(1 / sec(pi * 5 / 4), -0.707106781186548)
    approxEqual(1 / sec(pi * 6 / 4), 0)
    approxEqual(1 / sec(pi * 7 / 4), 0.707106781186548)
    approxEqual(1 / sec(pi * 8 / 4), 1)
    approxEqual(1 / sec(pi / 4), math.sqrt(2) / 2)

    approxEqual(math.pow(sec(pi / 4), 2), 2)
    approxEqual(sec(0), 1)
    approxEqual(sec(pi), -1)
    approxEqual(sec(-pi), -1)
    approxEqual(math.pow(sec(-pi / 4), 2), 2)
    approxEqual(sec(2 * pi), 1)
    approxEqual(sec(-2 * pi), 1)
  })

  it('should return the secant of a bignumber', function () {
    const Big = bigmath.bignumber
    let bigPi = bigmath.pi
    const sqrt2 = bigmath.SQRT2.toString()

    assert.deepStrictEqual(bigmath.sec(Big(0)), Big(1))
    assert.deepStrictEqual(bigmath.sec(bigPi.div(8)).toString(), '1.0823922002923939688')
    assert.deepStrictEqual(bigmath.sec(bigPi.div(4)).toString(), sqrt2)
    assert.deepStrictEqual(bigmath.sec(bigPi).toString(), '-1')
    assert.deepStrictEqual(bigmath.sec(bigPi.times(2)).toString(), '1')
    assert.deepStrictEqual(bigmath.sec(bigmath.tau).toString(), '1')
    assert.deepStrictEqual(bigmath.sec(bigmath.tau.times(-2)).toString(), '1')

    /* Pass in one more digit of pi. */
    bigPi = biggermath.pi
    assert.deepStrictEqual(bigmath.sec(bigPi.div(2)), Big('756606132568153667460')) // (large number, about infinity)
    assert.deepStrictEqual(bigmath.sec(bigPi.times(3).div(4)).toString(), '-' + sqrt2)
    assert.deepStrictEqual(bigmath.sec(bigPi.times(5).div(4)).toString(), '-' + sqrt2)
  })

  it('should return the secant of a complex number', function () {
    const re = 0.0416749644111443
    const im = 0.0906111371962376
    approxDeepEqual(sec(complex('2+3i')), complex(-re, im))
    approxDeepEqual(sec(complex('2-3i')), complex(-re, -im))
    approxDeepEqual(sec(complex('-2+3i')), complex(-re, -im))
    approxDeepEqual(sec(complex('-2-3i')), complex(-re, im))
    approxDeepEqual(sec(complex('i')), complex(0.648054273663885, 0))
    approxDeepEqual(sec(complex('1')), complex(1.85081571768093, 0))
    approxDeepEqual(sec(complex('1+i')), complex(0.498337030555187, 0.591083841721045))
  })

  it('should return the secant of an angle', function () {
    approxEqual(sec(unit('45deg')), 1.41421356237310)
    approxEqual(sec(unit('-45deg')), 1.41421356237310)

    assert(math.isBigNumber(sec(unit(math.bignumber(45), 'deg'))))
    approxEqual(sec(unit(math.bignumber(45), 'deg')).toNumber(), 1.41421356237310)

    approxDeepEqual(sec(unit(complex('1+i'), 'rad')), complex(0.498337030555187, 0.591083841721045))
  })

  it('should throw an error if called with an invalid unit', function () {
    assert.throws(function () { sec(unit('5 celsius')) })
  })

  it('should throw an error if called with a string', function () {
    assert.throws(function () { sec('string') })
  })

  const sec123 = [1.85081571768093, -2.40299796172238, -1.01010866590799]

  it('should not operate on an array', function () {
    assert.throws(() => sec([1, 2, 3]), TypeError)
    approxDeepEqual(math.map([1, 2, 3], sec), sec123)
  })

  it('should not operate on a matrix', function () {
    assert.throws(() => sec(matrix([1, 2, 3])), TypeError)
    approxDeepEqual(math.map(matrix([1, 2, 3]), sec), matrix(sec123))
  })

  it('should throw an error in case of invalid number of arguments', function () {
    assert.throws(function () { sec() }, /TypeError: Too few arguments/)
    assert.throws(function () { sec(1, 2) }, /TypeError: Too many arguments/)
  })

  it('should LaTeX sec', function () {
    const expression = math.parse('sec(1)')
    assert.strictEqual(expression.toTex(), '\\sec\\left(1\\right)')
  })
})
