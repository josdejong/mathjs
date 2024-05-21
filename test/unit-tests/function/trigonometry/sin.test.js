import assert from 'assert'
import math from '../../../../src/defaultInstance.js'
import { approxEqual, approxDeepEqual } from '../../../../tools/approx.js'
const EPSILON = 1e-13
const pi = math.pi
const complex = math.complex
const matrix = math.matrix
const unit = math.unit
const sin = math.sin
const bigmath = math.create({ precision: 242 })

describe('sin', function () {
  it('should return the sine of a boolean', function () {
    approxEqual(sin(true), 0.841470984807897)
    approxEqual(sin(false), 0)
  })

  it('should return the sine of a number', function () {
    approxEqual(sin(0), 0, EPSILON)
    approxEqual(sin(pi / 8), 0.382683432365090, EPSILON)
    approxEqual(sin(pi / 4), Math.SQRT1_2, EPSILON)
    approxEqual(sin(pi / 2), 1, EPSILON)
    approxEqual(sin(pi * 3 / 4), 0.707106781186548, EPSILON)
    approxEqual(sin(pi), 0, EPSILON)
    approxEqual(sin(pi * 5 / 4), -0.707106781186548, EPSILON)
    approxEqual(sin(pi * 3 / 2), -1, EPSILON)
    approxEqual(sin(pi * 7 / 4), -0.707106781186548, EPSILON)
    approxEqual(sin(pi * 2), 0, EPSILON)
  })

  it('should return the sine of a bignumber', function () {
    const Big = bigmath.bignumber
    assert.deepStrictEqual(bigmath.sin(Big(0)), Big(0))

    // 103.64 % tau = 3.109... <- pretty close to the pi boundary
    let resultVal = bigmath.sin(Big(103.64))
    assert.deepStrictEqual(resultVal, Big('0.0325518169566161584427313159942672130512044591216893328934710' +
                                        '307148043832988055013958395123418887322610809247793661058554' +
                                        '935758353628919004205593985094895305777198408601067175226892' +
                                        '4960612126026291341865833521451170868744460464214033460336158'))

    const arg = Big(-103.64)
    resultVal = bigmath.sin(arg)
    assert.deepStrictEqual(arg, Big(-103.64)) // Make sure arg wasn't changed
    assert.deepStrictEqual(resultVal, Big('-0.0325518169566161584427313159942672130512044591216893328934710' +
                                        '3071480438329880550139583951234188873226108092477936610585549' +
                                        '3575835362891900420559398509489530577719840860106717522689249' +
                                        '60612126026291341865833521451170868744460464214033460336158'))
    const bigmath2 = bigmath.create({ number: 'BigNumber', precision: 15 })

    // we've had a bug in reducing the period, affecting integer values around multiples of tau (like 6, 7)
    for (let x = -20; x < 20; x += 1) {
      approxEqual(bigmath2.sin(bigmath2.bignumber(x)).toNumber(), Math.sin(x), EPSILON)
    }

    const bigPi = bigmath2.pi
    assert.deepStrictEqual(bigmath2.sin(bigPi.div(8)).toString(), '0.38268343236509')
    assert.deepStrictEqual(bigmath2.sin(bigPi.div(4)).toString(), '0.707106781186547')
    assert.deepStrictEqual(bigmath2.sin(bigPi.div(2)).toString(), '1')
    assert.deepStrictEqual(bigmath2.sin(bigPi.times(3).div(4)).toString(), '0.707106781186551')
    assert.ok(bigmath2.sin(bigPi).lt(1e-14))
    assert.deepStrictEqual(bigmath2.sin(bigPi.times(5).div(4)).toString(), '-0.707106781186554')
    assert.deepStrictEqual(bigmath2.sin(bigPi.times(3).div(2)).toString(), '-1')
    assert.deepStrictEqual(bigmath2.sin(bigPi.times(7).div(4)).toString(), '-0.707106781186553')
    assert.ok(bigmath2.sin(bigPi.times(2)).lt(1e-13))
    assert.ok(bigmath2.sin(bigmath2.tau).lt(1e-14))
    assert.ok(bigmath2.sin(bigmath2.tau.times(2)).lt(1e-13))

    const bigmath61 = bigmath.create({ number: 'BigNumber', precision: 61 })

    assert.deepStrictEqual(bigmath61.sin(bigmath61.bignumber(-2)).toString(), '-0.909297426825681695396019865911744842702254971447890268378973')
  })

  it('should return the sine of a complex number', function () {
    const re = 9.15449914691143
    const im = 4.16890695996656
    approxDeepEqual(sin(complex('2+3i')), complex(re, -im), EPSILON)
    approxDeepEqual(sin(complex('2-3i')), complex(re, im), EPSILON)
    approxDeepEqual(sin(complex('-2+3i')), complex(-re, -im), EPSILON)
    approxDeepEqual(sin(complex('-2-3i')), complex(-re, im), EPSILON)
    approxDeepEqual(sin(complex('i')), complex(0, 1.175201193643801), EPSILON)
    approxDeepEqual(sin(complex('1')), complex(0.841470984807897, 0), EPSILON)
    approxDeepEqual(sin(complex('1+i')), complex(1.298457581415977, 0.634963914784736), EPSILON)
    approxDeepEqual(sin(complex('1e-10i')), complex('1e-10i'), EPSILON)
  })

  it('should return the sine of an angle', function () {
    approxEqual(sin(unit('45deg')), 0.707106781186548, EPSILON)
    approxEqual(sin(unit('-45deg')), -0.707106781186548, EPSILON)

    assert(math.isBigNumber(sin(unit(math.bignumber(45), 'deg'))))
    approxEqual(sin(unit(math.bignumber(45), 'deg')).toNumber(), 0.707106781186548, EPSILON)

    approxDeepEqual(sin(unit(complex('1+i'), 'rad')), complex(1.298457581415977, 0.634963914784736), EPSILON)
  })

  it('should throw an error if called with an invalid unit', function () {
    assert.throws(function () { sin(unit('5 celsius')) })
  })

  it('should throw an error if called with a string', function () {
    assert.throws(function () { sin('string') })
  })

  const sin123 = [0.84147098480789, 0.909297426825682, 0.141120008059867]

  it('should not operate on an array', function () {
    assert.throws(() => sin([1, 2, 3]), TypeError)
    approxDeepEqual(math.map([1, 2, 3], sin), sin123, EPSILON)
  })

  it('should not operate on a matrix', function () {
    assert.throws(() => sin(matrix([1, 2, 3])), TypeError)
    approxDeepEqual(math.map(matrix([1, 2, 3]), sin), matrix(sin123), EPSILON)
  })

  it('should throw an error in case of invalid number of arguments', function () {
    assert.throws(function () { sin() }, /TypeError: Too few arguments/)
    assert.throws(function () { sin(1, 2) }, /TypeError: Too many arguments/)
  })

  it('should LaTeX sin', function () {
    const expression = math.parse('sin(0.5)')
    assert.strictEqual(expression.toTex(), '\\sin\\left(0.5\\right)')
  })
})
