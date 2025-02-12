// test exp
import assert from 'assert'

import { approxDeepEqual } from '../../../../tools/approx.js'
import math from '../../../../src/defaultInstance.js'
const mathPredictable = math.create({ predictable: true })
const complex = math.complex
const matrix = math.matrix
const unit = math.unit
const log10 = math.log10

describe('log10', function () {
  it('should return the log base 10 of a boolean', function () {
    assert.strictEqual(log10(true), 0)
    assert.strictEqual(log10(false), -Infinity)
  })

  it('should return the log base 10 of positive numbers', function () {
    approxDeepEqual(log10(1), 0)
    approxDeepEqual(log10(2), 0.301029995663981)
    approxDeepEqual(log10(3), 0.477121254719662)

    approxDeepEqual(log10(0.01), -2)
    approxDeepEqual(log10(0.1), -1)
    approxDeepEqual(log10(1), 0)
    approxDeepEqual(log10(10), 1)
    approxDeepEqual(log10(100), 2)
    approxDeepEqual(log10(1000), 3)
  })

  it('should return the log base 10 of negative numbers', function () {
    approxDeepEqual(log10(-1), complex('0.000000000000000 + 1.364376353841841i'))
    approxDeepEqual(log10(-2), complex('0.301029995663981 + 1.364376353841841i'))
    approxDeepEqual(log10(-3), complex('0.477121254719662 + 1.364376353841841i'))
  })

  it('should return the log base 10 of negative numbers with predicable:true', function () {
    assert.strictEqual(typeof mathPredictable.log10(-1), 'number')
    assert(isNaN(mathPredictable.log10(-1)))
  })

  it('should return the log base 10 of zero', function () {
    approxDeepEqual(log10(0), -Infinity)
  })

  it('should return the log of positive bignumbers', function () {
    const bigmath = math.create({ precision: 100 })

    assert.deepStrictEqual(bigmath.log10(bigmath.bignumber(1)), bigmath.bignumber(0))
    assert.deepStrictEqual(bigmath.log10(bigmath.bignumber(10)), bigmath.bignumber(1))
    assert.deepStrictEqual(bigmath.log10(bigmath.bignumber(100)), bigmath.bignumber(2))
    assert.deepStrictEqual(bigmath.log10(bigmath.bignumber(1000)), bigmath.bignumber(3)) // note: this gives a round-off error with regular numbers
    assert.deepStrictEqual(bigmath.log10(bigmath.bignumber(10000)), bigmath.bignumber(4))
    assert.deepStrictEqual(bigmath.log10(bigmath.bignumber('1e500')), bigmath.bignumber(500))
  })

  it('should return the log of negative bignumbers', function () {
    const bigmath = math.create({ precision: 100 })

    approxDeepEqual(bigmath.log10(bigmath.bignumber(-1)), bigmath.complex('0.000000000000000 + 1.364376353841841i'))
    approxDeepEqual(bigmath.log10(bigmath.bignumber(-2)), bigmath.complex('0.301029995663981 + 1.364376353841841i'))
    approxDeepEqual(bigmath.log10(bigmath.bignumber(-3)), bigmath.complex('0.477121254719662 + 1.364376353841841i'))
  })

  it('should return the log of a bignumber with value zero', function () {
    const bigmath = math.create({ precision: 100 })

    assert.deepStrictEqual(bigmath.log10(bigmath.bignumber(0)).toString(), '-Infinity')
  })

  it('should throw an error if used with a wrong number of arguments', function () {
    assert.throws(function () { log10() }, /TypeError: Too few arguments/)
    assert.throws(function () { log10(1, 2) }, /TypeError: Too many arguments/)
  })

  it('should throw an in case of wrong type of arguments', function () {
    assert.throws(function () { log10(null) }, /TypeError: Unexpected type of argument/)
  })

  it('should return the log base 10 of a complex number', function () {
    approxDeepEqual(log10(complex(0, 1)), complex('0.000000000000000 + 0.682188176920921i'))
    approxDeepEqual(log10(complex(0, -1)), complex('0.000000000000000 - 0.682188176920921i'))
    approxDeepEqual(log10(complex(1, 1)), complex('0.150514997831991 + 0.341094088460460i'))
    approxDeepEqual(log10(complex(1, -1)), complex('0.150514997831991 - 0.341094088460460i'))
    approxDeepEqual(log10(complex(-1, -1)), complex('0.150514997831991 - 1.023282265381381i'))
    approxDeepEqual(log10(complex(-1, 1)), complex('0.150514997831991 + 1.023282265381381i'))
    approxDeepEqual(log10(complex(1, 0)), complex(0, 0))
  })

  it('should return the log base 10 of a large bigint', function () {
    const ten16 = 10000000000000000n
    assert.strictEqual(log10(ten16), 16)
  })

  it('should throw an error when used on a unit', function () {
    assert.throws(function () { log10(unit('5cm')) })
  })

  it('should throw an error when used on a string', function () {
    assert.throws(function () { log10('text') })
  })

  it('should return the log base 10 of each element of a matrix', function () {
    const res = [0, 0.301029995663981, 0.477121254719662, 0.602059991327962]
    approxDeepEqual(log10([1, 2, 3, 4]), res)
    approxDeepEqual(log10(matrix([1, 2, 3, 4])), matrix(res))
    approxDeepEqual(math.divide(log10(matrix([1, 2, 3, 4])), math.LOG10E),
      matrix([0, 0.693147180559945, 1.098612288668110, 1.386294361119891]))
    approxDeepEqual(log10(matrix([[1, 2], [3, 4]])),
      matrix([[0, 0.301029995663981], [0.477121254719662, 0.602059991327962]]))
  })

  it('should LaTeX log10', function () {
    const expression = math.parse('log10(10)')
    assert.strictEqual(expression.toTex(), '\\log_{10}\\left(10\\right)')
  })
})
