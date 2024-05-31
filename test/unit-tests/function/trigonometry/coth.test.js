import assert from 'assert'
import math from '../../../../src/defaultInstance.js'
import { approxEqual, approxDeepEqual } from '../../../../tools/approx.js'
const pi = math.pi
const complex = math.complex
const matrix = math.matrix
const unit = math.unit
const coth = math.coth
const bigmath = math.create({ precision: 20 })
const biggermath = math.create({ number: 'BigNumber', precision: 21 })

describe('coth', function () {
  it('should return the coth of a boolean', function () {
    approxEqual(coth(true), 1.3130352854993)
    approxEqual(coth(false), Number.POSITIVE_INFINITY)
  })

  it('should return the coth of a number', function () {
    approxEqual(coth(0), Number.POSITIVE_INFINITY)
    approxEqual(coth(pi), 1.0037418731973)
    approxEqual(coth(1), 1.3130352854993)
    approxEqual(coth(2), 1.0373147207275)
    approxEqual(coth(3), 1.0049698233137)
  })

  it('should return the coth of a bignumber', function () {
    const cothBig = bigmath.coth
    const Big = bigmath.bignumber
    assert.deepStrictEqual(cothBig(Big(0)).toString(), 'Infinity')
    assert.deepStrictEqual(cothBig(Big(1)), Big('1.3130352854993313036'))
    assert.deepStrictEqual(cothBig(Big(2)), Big('1.0373147207275480959'))
    assert.deepStrictEqual(cothBig(Big(3)), Big('1.0049698233136891711'))

    /* Pass in extra digits to pi. */
    assert.deepStrictEqual(cothBig(biggermath.pi), Big('1.0037418731973212882'))
  })

  it('should return the coth of a complex number', function () {
    approxDeepEqual(coth(complex('1')), complex(1.3130352854993, 0))
    approxDeepEqual(coth(complex('i')), complex(0, -0.64209261593433))
    approxDeepEqual(coth(complex('2 + i')), complex(0.98432922645819, -0.032797755533753))
  })

  it('should throw an error on an angle', function () {
    assert.throws(() => coth(unit('90deg')), TypeError)
  })

  it('should throw an error if called with an invalid unit', function () {
    assert.throws(function () { coth(unit('5 celsius')) })
  })

  it('should throw an error if called with a string', function () {
    assert.throws(function () { coth('string') })
  })

  const coth123 = [1.3130352854993, 1.0373147207275, 1.0049698233137]

  it('should not operate on an array', function () {
    assert.throws(() => coth([1, 2, 3]), TypeError)
    approxDeepEqual(math.map([1, 2, 3], coth), coth123)
  })

  it('should not operate on a matrix', function () {
    assert.throws(() => coth(matrix([1, 2, 3])), TypeError)
    approxDeepEqual(math.map(matrix([1, 2, 3]), coth), matrix(coth123))
  })

  it('should throw an error in case of invalid number of arguments', function () {
    assert.throws(function () { coth() }, /TypeError: Too few arguments/)
    assert.throws(function () { coth(1, 2) }, /TypeError: Too many arguments/)
  })

  it('should LaTeX coth', function () {
    const expression = math.parse('coth(1)')
    assert.strictEqual(expression.toTex(), '\\coth\\left(1\\right)')
  })
})
