import assert from 'assert'
import math from '../../../../src/defaultInstance.js'
import { approxEqual, approxDeepEqual } from '../../../../tools/approx.js'
const pi = math.pi
const complex = math.complex
const matrix = math.matrix
const unit = math.unit
const csch = math.csch
const bigmath = math.create({ precision: 20 })
const biggermath = math.create({ number: 'BigNumber', precision: 22 })

describe('csch', function () {
  it('should return the csch of a boolean', function () {
    approxEqual(csch(true), 0.85091812823932)
    approxEqual(csch(false), Number.POSITIVE_INFINITY)
  })

  it('should return the csch of a number', function () {
    approxEqual(csch(0), Number.POSITIVE_INFINITY)
    approxEqual(csch(pi), 0.086589537530047)
    approxEqual(csch(1), 0.85091812823932)
    approxEqual(csch(2), 0.27572056477178)
    approxEqual(csch(3), 0.099821569668823)
    approxEqual(csch(1e-22), Number.POSITIVE_INFINITY)
    approxEqual(csch(-1e-22), Number.NEGATIVE_INFINITY)
  })

  it('should return the csch of a bignumber', function () {
    const cschBig = bigmath.csch
    const Big = bigmath.bignumber

    assert.deepStrictEqual(cschBig(Big(0)).toString(), 'Infinity')
    assert.deepStrictEqual(cschBig(Big(1)), Big('0.85091812823932154512'))
    assert.deepStrictEqual(cschBig(Big(2)), Big('0.27572056477178320776'))
    assert.deepStrictEqual(cschBig(Big(3)), Big('0.099821569668822732851'))

    /* Pass in extra digits to pi. */
    assert.deepStrictEqual(cschBig(biggermath.pi).toString(), '0.086589537530046941828')
  })

  it('should return the csch of a complex number', function () {
    approxDeepEqual(csch(complex('1')), complex(0.85091812823932, 0))
    approxDeepEqual(csch(complex('i')), complex(0, -1.1883951057781))
    approxDeepEqual(csch(complex('2 + i')), complex(0.14136302161241, -0.22837506559969))
  })

  it('should throw an error on an angle', function () {
    assert.throws(() => csch(unit('90deg')), TypeError)
  })

  it('should throw an error if called with an invalid unit', function () {
    assert.throws(function () { csch(unit('5 celsius')) })
  })

  it('should throw an error if called with a string', function () {
    assert.throws(function () { csch('string') })
  })

  const csch123 = [0.85091812823932, 0.27572056477178, 0.099821569668823]

  it('should not operate on an array', function () {
    assert.throws(() => csch([1, 2, 3]), TypeError)
    approxDeepEqual(math.map([1, 2, 3], csch), csch123)
  })

  it('should not operate on a matrix', function () {
    assert.throws(() => csch(matrix([1, 2, 3])), TypeError)
    approxDeepEqual(math.map(matrix([1, 2, 3]), csch), matrix(csch123))
  })

  it('should throw an error in case of invalid number of arguments', function () {
    assert.throws(function () { csch() }, /TypeError: Too few arguments/)
    assert.throws(function () { csch(1, 2) }, /TypeError: Too many arguments/)
  })

  it('should LaTeX csch', function () {
    const expression = math.parse('csch(1)')
    assert.strictEqual(expression.toTex(), '\\mathrm{csch}\\left(1\\right)')
  })
})
