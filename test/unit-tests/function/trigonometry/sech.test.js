import assert from 'assert'
import math from '../../../../src/defaultInstance.js'
import { approxEqual, approxDeepEqual } from '../../../../tools/approx.js'
import { testEdgeCases } from '../../../../tools/edgeCases.js'
const pi = math.pi
const complex = math.complex
const matrix = math.matrix
const unit = math.unit
const sech = math.sech
const bigmath = math.create({ precision: 20 })
const biggermath = math.create({ number: 'BigNumber', precision: 21 })

describe('sech', function () {
  it('should return the sech of a boolean', function () {
    approxEqual(sech(true), 0.64805427366389)
    approxEqual(sech(false), 1)
  })

  it('should return the sech of a number', function () {
    approxEqual(sech(0), 1)
    approxEqual(sech(pi), 0.086266738334054)
    approxEqual(sech(1), 0.64805427366389)
    approxEqual(sech(2), 0.26580222883408)
    approxEqual(sech(3), 0.099327927419433)
  })

  it('should return the sech of a bignumber', function () {
    const sechBig = bigmath.sech
    const Big = bigmath.bignumber

    assert.deepStrictEqual(sechBig(Big(0)), Big(1))
    assert.deepStrictEqual(sechBig(Big(1)), Big('0.64805427366388539957'))
    assert.deepStrictEqual(sechBig(Big(2)), Big('0.26580222883407969212'))
    assert.deepStrictEqual(sechBig(Big(3)), Big('0.099327927419433207829'))

    /* Pass in extra digits to pi. */
    assert.deepStrictEqual(sechBig(biggermath.pi), Big('0.086266738334054414697'))
  })

  it('should return the sech of a complex number', function () {
    approxDeepEqual(sech(complex('1')), complex(0.64805427366389, 0))
    approxDeepEqual(sech(complex('i')), complex(1.8508157176809, 0))
    approxDeepEqual(sech(complex('2 + i')), complex(0.15117629826558, -0.22697367539372))
  })

  it('should throw an error on an angle', function () {
    assert.throws(() => sech(unit('90deg')), TypeError)
  })

  it('should throw an error if called with an invalid unit', function () {
    assert.throws(function () { sech(unit('5 celsius')) })
  })

  it('should throw an error if called with a string', function () {
    assert.throws(function () { sech('string') })
  })

  const sech123 = [0.64805427366389, 0.26580222883408, 0.099327927419433]

  it('should not operate on an array', function () {
    assert.throws(() => sech([1, 2, 3]), TypeError)
    approxDeepEqual(math.map([1, 2, 3], sech), sech123)
  })

  it('should not operate on a matrix', function () {
    assert.throws(() => sech(matrix([1, 2, 3])), TypeError)
    approxDeepEqual(math.map(matrix([1, 2, 3]), sech), matrix(sech123))
  })

  it('should throw an error in case of invalid number of arguments', function () {
    assert.throws(function () { sech() }, /TypeError: Too few arguments/)
    assert.throws(function () { sech(1, 2) }, /TypeError: Too many arguments/)
  })

  it('should LaTeX sech', function () {
    const expression = math.parse('sech(1)')
    assert.strictEqual(expression.toTex(), '\\mathrm{sech}\\left(1\\right)')
  })

  describe('edge cases (#3754)', function () {
    // expected: correctly rounded value (mpmath, 60 digits), within 4 ulp.
    // Cases with a third entry are known issues and are skipped until fixed.
    testEdgeCases('sech', sech, [
      ['Infinity', 0],
      ['-Infinity', 0],
      ['NaN', NaN],
      ['1e300', 0],
      ['710', 8.95257245135026e-309, 'result underflows to 0 (correct 8.95257245135026e-309)'],
      ['400', 3.8303391934280114e-174],
      ['-400', 3.8303391934280114e-174],
      ['-710', 8.95257245135026e-309, 'result underflows to 0 (correct 8.95257245135026e-309)'],
      ['-1e300', 0],
      ['1e-8', 1],
      ['1e-17', 1],
      ['1e-200', 1],
      ['-1e-8', 1],
      ['-1e-17', 1],
      ['-1e-200', 1],
      ['0', 1],
      ['-0', 1],
      ['1', 0.6480542736638853],
      ['1-1e-15', 0.6480542736638859],
      ['1-2^-53', 0.6480542736638855],
      ['1+2^-52', 0.6480542736638852],
      ['1+1e-15', 0.6480542736638849],
      ['-1', 0.6480542736638853],
      ['-(1-1e-15)', 0.6480542736638859],
      ['-(1-2^-53)', 0.6480542736638855],
      ['-(1+2^-52)', 0.6480542736638852],
      ['-(1+1e-15)', 0.6480542736638849]
    ])
  })
})
