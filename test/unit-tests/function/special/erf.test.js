import assert from 'assert'
import math from '../../../../src/bundleAny'
import actualErfValues from './erf.values.json'
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
