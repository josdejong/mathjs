import assert from 'assert'
import math from '../../../../src/defaultInstance.js'
import { approxEqual, approxDeepEqual } from '../../../../tools/approx.js'
const pi = math.pi
const complex = math.complex
const matrix = math.matrix
const unit = math.unit
const cosh = math.cosh
const bigmath = math.create({ number: 'BigNumber', precision: 20 })

describe('cosh', function () {
  it('should return the cosh of a boolean', function () {
    approxEqual(cosh(true), 1.5430806348152)
    approxEqual(cosh(false), 1)
  })

  it('should return the cosh of a number', function () {
    approxEqual(cosh(0), 1)
    approxEqual(cosh(pi), 11.591953275522)
    approxEqual(cosh(1), 1.5430806348152)
    approxEqual(cosh(2), 3.7621956910836)
    approxEqual(cosh(3), 10.067661995778)
  })

  it('should return the cosh of a bignumber', function () {
    const coshBig = bigmath.cosh
    const Big = bigmath.bignumber

    const arg1 = Big(-3)
    const arg9 = Big(Infinity)
    const arg10 = Big(-Infinity)
    assert.deepStrictEqual(coshBig(arg1), Big('10.067661995777765842'))
    assert.deepStrictEqual(coshBig(Big(-2)), Big('3.7621956910836314596'))
    assert.deepStrictEqual(coshBig(Big(-1)), Big('1.5430806348152437785'))
    assert.deepStrictEqual(coshBig(Big(0)), Big(1))
    assert.deepStrictEqual(coshBig(Big(1)), Big('1.5430806348152437785'))
    assert.deepStrictEqual(coshBig(Big(2)), Big('3.7621956910836314596'))
    assert.deepStrictEqual(coshBig(Big(3)), Big('10.067661995777765842'))
    assert.deepStrictEqual(coshBig(bigmath.pi).toString(), '11.591953275521520628')
    assert.deepStrictEqual(coshBig(arg9).toString(), 'Infinity')
    assert.deepStrictEqual(coshBig(arg10).toString(), 'Infinity')

    // Ensure args were not changed
    assert.deepStrictEqual(arg1, Big(-3))
    assert.deepStrictEqual(arg9.toString(), 'Infinity')
    assert.deepStrictEqual(arg10.toString(), '-Infinity')
  })

  it('should return the cosh of a complex number', function () {
    approxDeepEqual(cosh(complex('1')), complex(1.5430806348152, 0))
    approxDeepEqual(cosh(complex('i')), complex(0.54030230586814, 0))
    approxDeepEqual(cosh(complex('2 + i')), complex(2.0327230070197, 3.0518977991518))
  })

  it('should throw an error on an angle', function () {
    assert.throws(() => cosh(unit('90deg')), TypeError)
  })

  it('should throw an error if called with an invalid unit', function () {
    assert.throws(function () { cosh(unit('5 celsius')) })
  })

  it('should throw an error if called with a string', function () {
    assert.throws(function () { cosh('string') })
  })

  const cosh123 = [1.5430806348152, 3.7621956910836, 10.067661995778]

  it('should not operate on an array', function () {
    assert.throws(() => cosh([1, 2, 3]), TypeError)
    approxDeepEqual(math.map([1, 2, 3], cosh), cosh123)
  })

  it('should not operate on a matrix', function () {
    assert.throws(() => cosh(matrix([1, 2, 3])), TypeError)
    approxDeepEqual(math.map(matrix([1, 2, 3]), cosh), matrix(cosh123))
  })

  it('should throw an error in case of invalid number of arguments', function () {
    assert.throws(function () { cosh() }, /TypeError: Too few arguments/)
    assert.throws(function () { cosh(1, 2) }, /TypeError: Too many arguments/)
  })

  it('should LaTeX cosh', function () {
    const expression = math.parse('cosh(1)')
    assert.strictEqual(expression.toTex(), '\\cosh\\left(1\\right)')
  })
})
