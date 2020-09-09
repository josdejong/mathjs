import assert from 'assert'
import math from '../../../../src/defaultInstance.js'

const erf = math.erf

const DIFF_THRESH = 5e-16

describe('erf', function () {
  it('should calculate erf(x), |x| < 0.46875', function () {
    let i, diff, actual, expected
    for (i = -4; i <= 4; i += 1) {
      actual = erf(i / 10)
      expected = actualErfValues[(i / 10).toFixed(1)]
      diff = Math.abs(actual - expected)
      assert.ok(diff < DIFF_THRESH, [i, actual, expected, diff])
    }
  })

  it('should calculate erf(x), 0.46875 <= |x| <= 4', function () {
    let i, diff, actual, expected
    for (i = -40; i < -4; i += 1) {
      actual = erf(i / 10)
      expected = actualErfValues[(i / 10).toFixed(1)]
      diff = Math.abs(actual - expected)
      assert.ok(diff < DIFF_THRESH, [i, actual, expected, diff])
    }
    for (i = 5; i <= 40; i += 1) {
      actual = erf(i / 10)
      expected = actualErfValues[(i / 10).toFixed(1)]
      diff = Math.abs(actual - expected)
      assert.ok(diff < DIFF_THRESH, [i, actual, expected, diff])
    }
  })

  it('should calculate erf(x), |x| > 4', function () {
    let i, diff, actual, expected
    for (i = -70; i < -40; i += 1) {
      actual = erf(i / 10)
      expected = actualErfValues[(i / 10).toFixed(1)]
      diff = Math.abs(actual - expected)
      assert.ok(diff < DIFF_THRESH, [i, actual, expected, diff])
    }
    for (i = 41; i < 70; i += 1) {
      actual = erf(i / 10)
      expected = actualErfValues[(i / 10).toFixed(1)]
      diff = Math.abs(actual - expected)
      assert.ok(diff < DIFF_THRESH, [i, actual, expected, diff])
    }
  })

  it('should calculate the erf of a nonpositive integer', function () {
    assert.ok(Math.abs(erf(-1) - actualErfValues['-1.0']) < DIFF_THRESH)
    assert.ok(Math.abs(erf(-2) - actualErfValues['-2.0']) < DIFF_THRESH)
    assert.ok(Math.abs(erf(-3) - actualErfValues['-3.0']) < DIFF_THRESH)
  })

  it('should calculate the erf of a boolean (true = 1, false = 0)', function () {
    assert.ok(Math.abs(erf(true) - actualErfValues['1.0']) < DIFF_THRESH)
    assert.ok(Math.abs(erf(false) - actualErfValues['0.0']) < DIFF_THRESH)
  })

  it('should calculate the erf of each element in a matrix', function () {
    math.subtract(
      erf(math.matrix([0, 1, 2, 3, 4, 5])),
      math.matrix([0, 1, 2, 3, 4, 5].map(function (x) {
        return actualErfValues[x.toFixed(1)]
      }))
    ).forEach(function (diff) {
      assert.ok(diff < DIFF_THRESH)
    })
  })

  it('should calculate the erf of each element in an array', function () {
    math.subtract(
      erf(math.matrix([0, 1, 2, 3, 4, 5])),
      math.matrix([0, 1, 2, 3, 4, 5].map(function (x) {
        return actualErfValues[x.toFixed(1)]
      }))
    ).forEach(function (diff) {
      assert.ok(diff < DIFF_THRESH)
    })
  })

  it('should throw en error if called with invalid number of arguments', function () {
    assert.throws(function () { erf() })
    assert.throws(function () { erf(1, 3) })
  })

  it('should throw en error if called with invalid type of argument', function () {
    assert.throws(function () { erf(new Date()) })
    assert.throws(function () { erf('a string') })
  })

  it('should LaTeX erf', function () {
    const expression = math.parse('erf(2.5)')
    assert.strictEqual(expression.toTex(), 'erf\\left(2.5\\right)')
  })

  it('should return 1 for numbers greater than 2**53 (including Infinity)', function () {
    assert.strictEqual(erf(Math.pow(2, 53)), 1)
    assert.strictEqual(erf(Infinity), 1)
  })

  it('should return -1 for numbers less than -2**53 (including -Infinity)', function () {
    assert.strictEqual(erf(-Math.pow(2, 53)), -1)
    assert.strictEqual(erf(-Infinity), -1)
  })

  // TODO: Test with nums really close to 0
  // TODO: Once this works for complex numbers and imaginary units, test
})

const actualErfValues = {
  '-7.0': -1.0,
  '-6.9': -1.0,
  '-6.8': -1.0,
  '-6.7': -1.0,
  '-6.6': -1.0,
  '-6.5': -1.0,
  '-6.4': -1.0,
  '-6.3': -1.0,
  '-6.2': -1.0,
  '-6.1': -1.0,
  '-6.0': -1.0,
  '-5.9': -0.9999999999999999,
  '-5.8': -0.9999999999999998,
  '-5.7': -0.9999999999999992,
  '-5.6': -0.9999999999999977,
  '-5.5': -0.9999999999999927,
  '-5.4': -0.9999999999999777,
  '-5.3': -0.9999999999999338,
  '-5.2': -0.9999999999998075,
  '-5.1': -0.9999999999994507,
  '-5.0': -0.9999999999984626,
  '-4.9': -0.999999999995781,
  '-4.8': -0.9999999999886479,
  '-4.7': -0.9999999999700474,
  '-4.6': -0.999999999922504,
  '-4.5': -0.9999999998033839,
  '-4.4': -0.999999999510829,
  '-4.3': -0.9999999988065282,
  '-4.2': -0.9999999971445058,
  '-4.1': -0.9999999932999724,
  '-4.0': -0.9999999845827421,
  '-3.9': -0.9999999652077514,
  '-3.8': -0.9999999229960725,
  '-3.7': -0.9999998328489421,
  '-3.6': -0.999999644137007,
  '-3.5': -0.9999992569016276,
  '-3.4': -0.9999984780066371,
  '-3.3': -0.9999969422902035,
  '-3.2': -0.9999939742388483,
  '-3.1': -0.9999883513426328,
  '-3.0': -0.9999779095030014,
  '-2.9': -0.9999589021219005,
  '-2.8': -0.9999249868053346,
  '-2.7': -0.9998656672600594,
  '-2.6': -0.9997639655834707,
  '-2.5': -0.999593047982555,
  '-2.4': -0.999311486103355,
  '-2.3': -0.9988568234026434,
  '-2.2': -0.9981371537020182,
  '-2.1': -0.997020533343667,
  '-2.0': -0.9953222650189527,
  '-1.9': -0.9927904292352574,
  '-1.8': -0.9890905016357308,
  '-1.7': -0.9837904585907746,
  '-1.6': -0.976348383344644,
  '-1.5': -0.9661051464753108,
  '-1.4': -0.9522851197626488,
  '-1.3': -0.9340079449406524,
  '-1.2': -0.9103139782296352,
  '-1.1': -0.8802050695740816,
  '-1.0': -0.842700792949715,
  '-0.9': -0.796908212422832,
  '-0.8': -0.7421009647076606,
  '-0.7': -0.6778011938374184,
  '-0.6': -0.6038560908479259,
  '-0.5': -0.5204998778130465,
  '-0.4': -0.42839235504666845,
  '-0.3': -0.3286267594591274,
  '-0.2': -0.22270258921047842,
  '-0.1': -0.11246291601828488,
  '0.0': 0.0,
  0.1: 0.11246291601828488,
  0.2: 0.22270258921047842,
  0.3: 0.3286267594591274,
  0.4: 0.42839235504666845,
  0.5: 0.5204998778130465,
  0.6: 0.6038560908479259,
  0.7: 0.6778011938374184,
  0.8: 0.7421009647076606,
  0.9: 0.796908212422832,
  '1.0': 0.842700792949715,
  1.1: 0.8802050695740816,
  1.2: 0.9103139782296352,
  1.3: 0.9340079449406524,
  1.4: 0.9522851197626488,
  1.5: 0.9661051464753108,
  1.6: 0.976348383344644,
  1.7: 0.9837904585907746,
  1.8: 0.9890905016357308,
  1.9: 0.9927904292352574,
  '2.0': 0.9953222650189527,
  2.1: 0.997020533343667,
  2.2: 0.9981371537020182,
  2.3: 0.9988568234026434,
  2.4: 0.999311486103355,
  2.5: 0.999593047982555,
  2.6: 0.9997639655834707,
  2.7: 0.9998656672600594,
  2.8: 0.9999249868053346,
  2.9: 0.9999589021219005,
  '3.0': 0.9999779095030014,
  3.1: 0.9999883513426328,
  3.2: 0.9999939742388483,
  3.3: 0.9999969422902035,
  3.4: 0.9999984780066371,
  3.5: 0.9999992569016276,
  3.6: 0.999999644137007,
  3.7: 0.9999998328489421,
  3.8: 0.9999999229960725,
  3.9: 0.9999999652077514,
  '4.0': 0.9999999845827421,
  4.1: 0.9999999932999724,
  4.2: 0.9999999971445058,
  4.3: 0.9999999988065282,
  4.4: 0.999999999510829,
  4.5: 0.9999999998033839,
  4.6: 0.999999999922504,
  4.7: 0.9999999999700474,
  4.8: 0.9999999999886479,
  4.9: 0.999999999995781,
  '5.0': 0.9999999999984626,
  5.1: 0.9999999999994507,
  5.2: 0.9999999999998075,
  5.3: 0.9999999999999338,
  5.4: 0.9999999999999777,
  5.5: 0.9999999999999927,
  5.6: 0.9999999999999977,
  5.7: 0.9999999999999992,
  5.8: 0.9999999999999998,
  5.9: 0.9999999999999999,
  '6.0': 1.0,
  6.1: 1.0,
  6.2: 1.0,
  6.3: 1.0,
  6.4: 1.0,
  6.5: 1.0,
  6.6: 1.0,
  6.7: 1.0,
  6.8: 1.0,
  6.9: 1.0
}
