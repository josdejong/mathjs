// test unary minus
import assert from 'assert'

import math from '../../../../src/defaultInstance.js'
const bignumber = math.bignumber
const fraction = math.fraction
const complex = math.complex

describe('unaryMinus', function () {
  it('should return unary minus of a boolean', function () {
    assert.strictEqual(math.unaryMinus(true), -1)
    assert.strictEqual(math.unaryMinus(false), -0)
  })

  // TODO: unary minus should return bignumber on boolean input when configured for bignumber
  // eslint-disable-next-line mocha/no-skipped-tests
  it.skip('should return bignumber unary minus of a boolean', function () {
    const bigmath = math.create({ number: 'BigNumber' })
    assert.deepStrictEqual(bigmath.unaryMinus(true), bigmath.bignumber(-1))
    assert.deepStrictEqual(bigmath.unaryMinus(false), bigmath.bignumber(0))
  })

  it('should perform unary minus of a number', function () {
    assert.deepStrictEqual(math.unaryMinus(2), -2)
    assert.deepStrictEqual(math.unaryMinus(-2), 2)
    assert.deepStrictEqual(math.unaryMinus(0), -0)
  })

  it('should perform unary minus of a bigint', function () {
    assert.deepStrictEqual(math.unaryMinus(2n), -2n)
    assert.deepStrictEqual(math.unaryMinus(-2n), 2n)
    assert.deepStrictEqual(math.unaryMinus(0n), -0n)
  })

  it('should perform unary minus of a big number', function () {
    assert.deepStrictEqual(math.unaryMinus(bignumber(2)), bignumber(-2))
    assert.deepStrictEqual(math.unaryMinus(bignumber(-2)), bignumber(2))
    assert.deepStrictEqual(math.unaryMinus(bignumber(0)).toString(), '0')
  })

  it('should perform unary minus of a fraction', function () {
    const a = fraction(0.5)
    assert(math.unaryMinus(a) instanceof math.Fraction)
    assert.strictEqual(a.toString(), '0.5')

    assert.strictEqual(math.unaryMinus(fraction(0.5)).toString(), '-0.5')
    assert.strictEqual(math.unaryMinus(fraction(-0.5)).toString(), '0.5')
  })

  it('should perform unary minus of a complex number', function () {
    assert.strictEqual(math.unaryMinus(math.complex(3, 2)).toString(), '-3 - 2i')
    assert.strictEqual(math.unaryMinus(math.complex(3, -2)).toString(), '-3 + 2i')
    assert.strictEqual(math.unaryMinus(math.complex(-3, 2)).toString(), '3 - 2i')
    assert.strictEqual(math.unaryMinus(math.complex(-3, -2)).toString(), '3 + 2i')
  })

  it('should perform unary minus of a unit', function () {
    assert.strictEqual(math.unaryMinus(math.unit(5, 'km')).toString(), '-5 km')
    assert.strictEqual(math.unaryMinus(math.unit(fraction(2 / 3), 'km')).toString(), '-2/3 km')
    assert.strictEqual(math.unaryMinus(math.unit(complex(2, -4), 'gal')).toString(), '(-2 + 4i) gal')
  })

  it('should perform element-wise unary minus on a matrix', function () {
    const a2 = math.matrix([[1, 2], [3, 4]])
    const a7 = math.unaryMinus(a2)
    assert.ok(a7 instanceof math.Matrix)
    assert.deepStrictEqual(a7.size(), [2, 2])
    assert.deepStrictEqual(a7.valueOf(), [[-1, -2], [-3, -4]])
    assert.deepStrictEqual(math.unaryMinus([[1, 2], [3, 4]]), [[-1, -2], [-3, -4]])
  })

  it('should throw an error in case of invalid number of arguments', function () {
    assert.throws(function () { math.unaryMinus() }, /TypeError: Too few arguments/)
    assert.throws(function () { math.unaryMinus(1, 2) }, /TypeError: Too many arguments/)
  })

  it('should throw an error in case of invalid type of argument', function () {
    assert.throws(function () { math.unaryMinus(new Date()) }, /TypeError: Unexpected type of argument/)
    assert.throws(function () { math.unaryMinus(null) }, /TypeError: Unexpected type of argument/)
  })

  it('should LaTeX unaryMinus', function () {
    const expression = math.parse('unaryMinus(1)')
    assert.strictEqual(expression.toTex(), '-\\left(1\\right)')
  })
})
