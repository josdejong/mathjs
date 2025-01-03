// test exp
import assert from 'assert'

import { approxDeepEqual } from '../../../../tools/approx.js'
import math from '../../../../src/defaultInstance.js'
const mathPredictable = math.create({ predictable: true })
const complex = math.complex
const matrix = math.matrix
const unit = math.unit
const log2 = math.log2

describe('log2', function () {
  it('should return the log base 2 of a boolean', function () {
    assert.strictEqual(log2(true), 0)
    assert.strictEqual(log2(false), -Infinity)
  })

  it('should return the log base 2 of positive numbers', function () {
    assert.strictEqual(log2(1), 0)
    assert.strictEqual(log2(2), 1)
    approxDeepEqual(log2(3), 1.584962500721156)

    assert.strictEqual(log2(0.25), -2)
    assert.strictEqual(log2(0.5), -1)
    assert.strictEqual(log2(4), 2)
    assert.strictEqual(log2(8), 3)
  })

  it('should return the log base 2 of negative numbers', function () {
    approxDeepEqual(log2(-1), complex('0.000000000000000 + 4.532360141827194i'))
    approxDeepEqual(log2(-2), complex('1 + 4.532360141827194i'))
    approxDeepEqual(log2(-3), complex('1.584962500721156 + 4.532360141827194i'))
  })

  it('should return the log base 2 of negative numbers with predicable:true', function () {
    assert.strictEqual(typeof mathPredictable.log2(-1), 'number')
    assert(isNaN(mathPredictable.log2(-1)))
  })

  it('should return the log base 2 of zero', function () {
    approxDeepEqual(log2(0), -Infinity)
  })

  it('should return the log of positive bignumbers', function () {
    const bigmath = math.create({ precision: 100 })

    assert.deepStrictEqual(bigmath.log2(bigmath.bignumber(1)), bigmath.bignumber(0))
    assert.deepStrictEqual(bigmath.log2(bigmath.bignumber(2)), bigmath.bignumber(1))
    assert.deepStrictEqual(bigmath.log2(bigmath.bignumber(4)), bigmath.bignumber(2))
    assert.deepStrictEqual(bigmath.log2(bigmath.bignumber(8)), bigmath.bignumber(3))
    assert.deepStrictEqual(bigmath.log2(bigmath.bignumber(16)), bigmath.bignumber(4))
    assert.deepStrictEqual(bigmath.log2(bigmath.bignumber(2).pow(500)), bigmath.bignumber(500))
  })

  it('should return the log of negative bignumbers', function () {
    const bigmath = math.create({ precision: 100 })

    approxDeepEqual(bigmath.log2(bigmath.bignumber(-1)), bigmath.complex('0.000000000000000 + 4.532360141827194i'))
    approxDeepEqual(bigmath.log2(bigmath.bignumber(-2)), bigmath.complex('1 + 4.532360141827194i'))
    approxDeepEqual(bigmath.log2(bigmath.bignumber(-3)), bigmath.complex('1.584962500721156 + 4.532360141827194i'))
  })

  it('should return the log of a bignumber with value zero', function () {
    const bigmath = math.create({ precision: 100 })

    assert.deepStrictEqual(bigmath.log2(bigmath.bignumber(0)).toString(), '-Infinity')
  })

  it('should throw an error if used with a wrong number of arguments', function () {
    assert.throws(function () { log2() }, /TypeError: Too few arguments/)
    assert.throws(function () { log2(1, 2) }, /TypeError: Too many arguments/)
  })

  it('should return the log base 2 of a complex number', function () {
    approxDeepEqual(log2(complex(0, 1)), complex('2.2661800709135i'))
    approxDeepEqual(log2(complex(0, -1)), complex('-2.2661800709135i'))
    approxDeepEqual(log2(complex(1, 1)), complex('0.500000000000000 + 1.1330900354567985i'))
    approxDeepEqual(log2(complex(1, -1)), complex('0.500000000000000 - 1.1330900354567985i'))
    approxDeepEqual(log2(complex(-1, -1)), complex('0.500000000000000 - 3.399270106370395i'))
    approxDeepEqual(log2(complex(-1, 1)), complex('0.500000000000000 + 3.399270106370395i'))
    approxDeepEqual(log2(complex(1, 0)), complex(0, 0))
  })

  it('should return the log base two of a large bigint', function () {
    const two70 = 2n ** 70n
    assert.strictEqual(log2(two70), 70)
  })

  it('should throw an error when used on a unit', function () {
    assert.throws(function () { log2(unit('5cm')) })
  })

  it('should throw an error when used on a string', function () {
    assert.throws(function () { log2('text') })
  })

  it('should return the log base 2 of each element of a matrix', function () {
    const res = [0, 1, 1.584962500721156, 2]
    approxDeepEqual(log2([1, 2, 3, 4]), res)
    approxDeepEqual(log2(matrix([1, 2, 3, 4])), matrix(res))
    approxDeepEqual(math.divide(log2(matrix([1, 2, 3, 4])), math.LOG2E),
      matrix([0, 0.693147180559945, 1.098612288668110, 1.386294361119891]))
    approxDeepEqual(log2(matrix([[1, 2], [3, 4]])),
      matrix([[0, 1], [1.584962500721156, 2]]))
  })

  it('should LaTeX log2', function () {
    const expression = math.parse('log2(10)')
    assert.strictEqual(expression.toTex(), '\\log_{2}\\left(10\\right)')
  })
})
