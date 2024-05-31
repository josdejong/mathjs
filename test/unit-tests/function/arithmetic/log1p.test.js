// test log1p
import assert from 'assert'

import { approxEqual, approxDeepEqual } from '../../../../tools/approx.js'
import math from '../../../../src/defaultInstance.js'
const mathPredictable = math.create({ predictable: true })
const complex = math.complex
const matrix = math.matrix
const unit = math.unit
const log1p = math.log1p

describe('log1p', function () {
  it('should return the log1p of a boolean value', function () {
    approxEqual(log1p(true), 0.6931471805599)
    assert.strictEqual(log1p(false), 0)
    assert.strictEqual(log1p(1, false), -0)
  })

  it('should return the log1p of positive numbers', function () {
    assert.strictEqual(log1p(-1), -Infinity)
    assert.strictEqual(log1p(-0), -0)
    assert.strictEqual(log1p(+0), +0)
    approxDeepEqual(log1p(1), 0.693147180559945)
    approxDeepEqual(log1p(2), 1.098612288668110)
    approxDeepEqual(math.exp(log1p(99)), 100)
  })

  it('should return the log1p of negative numbers', function () {
    approxDeepEqual(log1p(-2), complex('0.000000000000000 + 3.141592653589793i'))
    approxDeepEqual(log1p(-3), complex('0.693147180559945 + 3.141592653589793i'))
    approxDeepEqual(log1p(-4), complex('1.098612288668110 + 3.141592653589793i'))
  })

  it('should return the log1p of negative numbers with predictable: true', function () {
    assert.strictEqual(typeof mathPredictable.log1p(-2), 'number')
    assert(isNaN(mathPredictable.log1p(-2)))
  })

  it('should return the log1p base N of a number', function () {
    approxDeepEqual(log1p(99, 10), 2)
    approxDeepEqual(log1p(999, 10), 3)
    approxDeepEqual(log1p(7, 2), 3)
    approxDeepEqual(log1p(15, 2), 4)
  })

  it('should throw an error if invalid number of arguments', function () {
    assert.throws(function () { log1p() }, /TypeError: Too few arguments in function log1p \(expected: any, index: 0\)/)
    assert.throws(function () { log1p(1, 2, 3) }, /TypeError: Too many arguments in function log1p \(expected: 2, actual: 3\)/)
  })

  it('should return the log1p of positive bignumbers', function () {
    const bigmath = math.create({ precision: 100 })

    assert.deepStrictEqual(bigmath.log1p(bigmath.bignumber(-1)).toString(), '-Infinity')
    assert.deepStrictEqual(bigmath.log1p(bigmath.bignumber(0)), bigmath.bignumber('0'))
    assert.deepStrictEqual(bigmath.log1p(bigmath.bignumber(1)), bigmath.bignumber('0.6931471805599453094172321214581765680755001343602552541206800094933936219696947156058633269964186875'))
    assert.deepStrictEqual(bigmath.log1p(bigmath.bignumber(2)), bigmath.bignumber('1.098612288668109691395245236922525704647490557822749451734694333637494293218608966873615754813732089'))

    // note: the following gives a round-off error with regular numbers
    assert.deepStrictEqual(bigmath.log1p(bigmath.bignumber(999), bigmath.bignumber(10)), bigmath.bignumber(3))
  })

  it('should return the log1p of negative bignumbers', function () {
    const bigmath = math.create({ precision: 100 })

    approxDeepEqual(bigmath.log1p(bigmath.bignumber(-2)), complex('0.000000000000000 + 3.141592653589793i'))
    approxDeepEqual(bigmath.log1p(bigmath.bignumber(-3)), complex('0.693147180559945 + 3.141592653589793i'))
    approxDeepEqual(bigmath.log1p(bigmath.bignumber(-4)), complex('1.098612288668110 + 3.141592653589793i'))
  })

  it('should return the log1p of negative bignumbers with predictable:true', function () {
    assert(mathPredictable.log1p(math.bignumber(-2)).isNaN(), 'should be NaN')
  })

  it('should return the log1p of a complex number', function () {
    approxDeepEqual(log1p(math.i), complex('0.346573590279973 + 0.785398163397448i'))
    approxDeepEqual(log1p(complex(0, -1)), complex('0.346573590279973 - 0.785398163397448i'))
    approxDeepEqual(log1p(complex(1, 1)), complex('0.80471895621705 + 0.463647609000806i'))
    approxDeepEqual(log1p(complex(1, -1)), complex('0.80471895621705 - 0.463647609000806i'))
    approxDeepEqual(log1p(complex(-1, -1)), complex('-1.570796326794897i'))
    approxDeepEqual(log1p(complex(-1, 1)), complex('1.570796326794897i'))
    approxDeepEqual(log1p(complex(1, 0)), complex('0.693147180559945'))
  })

  it('should throw an error when used on a unit', function () {
    assert.throws(function () { log1p(unit('5cm')) })
  })

  it('should throw an error when used on a string', function () {
    assert.throws(function () { log1p('text') })
  })

  it('should return the log1p of each element of a matrix', function () {
    const res = [0, 0.693147180559945, 1.098612288668110, 1.386294361119891]
    approxDeepEqual(log1p([0, 1, 2, 3]), res)
    approxDeepEqual(log1p(matrix([0, 1, 2, 3])), matrix(res))
    approxDeepEqual(log1p(matrix([[0, 1], [2, 3]])),
      matrix([[0, 0.693147180559945], [1.098612288668110, 1.386294361119891]]))
  })

  it('should LaTeX log1p', function () {
    const expr1 = math.parse('log1p(e)')
    const expr2 = math.parse('log1p(32,2)')

    assert.strictEqual(expr1.toTex(), '\\ln\\left( e+1\\right)')
    assert.strictEqual(expr2.toTex(), '\\log_{2}\\left(32+1\\right)')
  })
})
