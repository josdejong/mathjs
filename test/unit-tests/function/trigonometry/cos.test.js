import assert from 'assert'
import math from '../../../../src/defaultInstance.js'
import { approxEqual, approxDeepEqual } from '../../../../tools/approx.js'
const pi = math.pi
const complex = math.complex
const matrix = math.matrix
const unit = math.unit
const cos = math.cos
const bigmath = math.create({ number: 'BigNumber', precision: 15 })
const biggermath = math.create({ number: 'BigNumber', precision: 238 })

describe('cos', function () {
  it('should return the cosine of a boolean', function () {
    approxEqual(cos(true), 0.54030230586814)
    approxEqual(cos(false), 1)
  })

  it('should return the cosine of a number', function () {
    approxEqual(cos(0), 1)
    approxEqual(cos(pi * 1 / 4), 0.707106781186548)
    approxEqual(cos(pi * 1 / 8), 0.923879532511287)
    approxEqual(cos(pi * 2 / 4), 0)
    approxEqual(cos(pi * 3 / 4), -0.707106781186548)
    approxEqual(cos(pi * 4 / 4), -1)
    approxEqual(cos(pi * 5 / 4), -0.707106781186548)
    approxEqual(cos(pi * 6 / 4), 0)
    approxEqual(cos(pi * 7 / 4), 0.707106781186548)
    approxEqual(cos(pi * 8 / 4), 1)
    approxEqual(cos(pi / 4), Math.SQRT1_2)
  })

  it('should return the cosine of a bignumber', function () {
    assert.deepStrictEqual(bigmath.cos(biggermath.bignumber(0)).toString(), '1')

    // 103.64 % tau = 3.109... <- pretty close to the pi boundary
    const resultVal = '-0.99947004918247698171247470962484532559534008595265991588' +
                        '25959085696348870383952892132851183764863885182646678036' +
                        '80857263937361947475191126604630777331941809888320749410' +
                        '59494006339537812110786663367929884637840572887762249921' +
                        '8425619255481'
    let cosVal = biggermath.cos(biggermath.bignumber(103.64))
    assert.strictEqual(biggermath.bignumber(103.64).constructor.precision, 238)
    assert.strictEqual(cosVal.constructor.precision, 238)
    assert.deepStrictEqual(cosVal.toString(), resultVal)

    cosVal = biggermath.cos(biggermath.bignumber(-103.64))
    assert.strictEqual(cosVal.constructor.precision, 238)
    assert.deepStrictEqual(cosVal.toString(), resultVal)

    const biggermath2 = math.create({ number: 'BigNumber', precision: 16 })
    const bigPi = biggermath2.pi

    // we've had a bug in reducing the period, affecting integer values around multiples of tau
    assert.deepStrictEqual(bigmath.cos(bigmath.bignumber(6)).toString(), '0.960170286650366')
    assert.deepStrictEqual(bigmath.cos(bigmath.bignumber(7)).toString(), '0.753902254343305')

    // we've had a bug in reducing the period, affecting integer values around multiples of tau (like 6, 7)
    for (let x = -20; x < 20; x += 1) {
      approxEqual(bigmath.cos(bigmath.bignumber(x)).toNumber(), Math.cos(x))
    }

    assert.deepStrictEqual(bigmath.cos(bigPi.div(4)).toString(), '0.7071067811865475')
    assert.ok(bigmath.cos(bigPi.div(2)).lt(1e-15))
    assert.deepStrictEqual(bigmath.cos(bigPi).toString(), '-1')
    assert.ok(bigmath.cos(bigPi.times(3).div(2)).lt(1e-15))
    assert.deepStrictEqual(bigmath.cos(bigPi.times(2)).toString(), '1')
    assert.deepStrictEqual(bigmath.cos(bigmath.tau).toString(), '1')
    assert.deepStrictEqual(bigmath.cos(bigmath.tau.times(2)).toString(), '1')
  })

  it('should return the cosine of a complex number', function () {
    const re = 4.18962569096881
    const im = 9.10922789375534
    approxDeepEqual(cos(complex('2+3i')), complex(-re, -im))
    approxDeepEqual(cos(complex('2-3i')), complex(-re, im))
    approxDeepEqual(cos(complex('-2+3i')), complex(-re, im))
    approxDeepEqual(cos(complex('-2-3i')), complex(-re, -im))
    approxDeepEqual(cos(complex('i')), complex(1.54308063481524, 0))
    approxDeepEqual(cos(complex('1')), complex(0.540302305868140, 0))
    approxDeepEqual(cos(complex('1+i')), complex(0.833730025131149, -0.988897705762865))
    approxDeepEqual(cos(complex('1e-10+1e-10i')), complex('1-1e-20i'))
  })

  it('should return the cosine of an angle', function () {
    approxEqual(cos(unit('45deg')), 0.707106781186548)
    approxEqual(cos(unit('-135deg')), -0.707106781186548)

    assert(math.isBigNumber(cos(unit(math.bignumber(45), 'deg'))))
    approxEqual(cos(unit(math.bignumber(45), 'deg')).toNumber(), 0.707106781186548)

    approxDeepEqual(cos(unit(complex(1, 1), 'rad')), complex(0.833730025131149, -0.988897705762865))
  })

  it('should throw an error if called with an invalid unit', function () {
    assert.throws(function () { cos(unit('5 celsius')) })
  })

  it('should throw an error if called with a string', function () {
    assert.throws(function () { cos('string') })
  })

  const cos123 = [0.540302305868140, -0.41614683654714, -0.989992496600445]

  it('should not operate on a matrix', function () {
    assert.throws(() => cos(matrix([1, 2, 3])), TypeError)
    approxDeepEqual(math.map(matrix([1, 2, 3]), cos), matrix(cos123))
  })

  it('should not operate on an array', function () {
    assert.throws(() => cos([1, 2, 3]), TypeError)
    approxDeepEqual(math.map([1, 2, 3], cos), cos123)
  })

  it('should throw an error in case of invalid number of arguments', function () {
    assert.throws(function () { cos() }, /TypeError: Too few arguments/)
    assert.throws(function () { cos(1, 2) }, /TypeError: Too many arguments/)
  })

  it('should LaTeX cos', function () {
    const expression = math.parse('cos(1)')
    assert.strictEqual(expression.toTex(), '\\cos\\left(1\\right)')
  })
})
