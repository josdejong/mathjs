// test unary plus
import assert from 'assert'

import math from '../../../../src/defaultInstance.js'
const bignumber = math.bignumber
const fraction = math.fraction

describe('unaryPlus', function () {
  it('should return unary plus of a boolean', function () {
    assert.strictEqual(math.unaryPlus(true), 1)
    assert.strictEqual(math.unaryPlus(false), 0)
  })

  it('should return bignumber unary plus of a boolean', function () {
    const bigmath = math.create({ number: 'BigNumber' })
    assert.deepStrictEqual(bigmath.unaryPlus(true), bigmath.bignumber(1))
    assert.deepStrictEqual(bigmath.unaryPlus(false), bigmath.bignumber(0))
  })

  it('should return unary plus on a string', function () {
    assert.strictEqual(math.unaryPlus('2'), 2)
    assert.strictEqual(math.unaryPlus('-2'), -2)
  })

  it('should return bignumber unary plus on a string', function () {
    const bigmath = math.create({ number: 'BigNumber' })
    assert.deepStrictEqual(bigmath.unaryPlus('20000000000000000000001'), bigmath.bignumber('20000000000000000000001'))
    assert.deepStrictEqual(bigmath.unaryPlus('-20000000000000000000001'), bigmath.bignumber('-20000000000000000000001'))
  })

  it('should return bigint unary plus on a string', function () {
    const bigmath = math.create({ number: 'bigint' })
    assert.deepStrictEqual(bigmath.unaryPlus('20000000000000000000001'), 20000000000000000000001n)
    assert.deepStrictEqual(bigmath.unaryPlus('-20000000000000000000001'), -20000000000000000000001n)
    assert.deepStrictEqual(bigmath.unaryPlus('2.4'), 2.4) // fallback to number
    assert.deepStrictEqual(bigmath.unaryPlus(true), 1n)
    assert.deepStrictEqual(bigmath.unaryPlus(false), 0n)
  })

  // TODO: this is temporary until the test above works again
  it('should return bignumber unary plus on a string', function () {
    const bigmath = math.create({ number: 'BigNumber' })
    const a = bigmath.unaryPlus('2')
    assert(a instanceof bigmath.BigNumber)
    assert.deepStrictEqual(a.toString(), '2')

    const b = bigmath.unaryPlus('-2')
    assert(b instanceof bigmath.BigNumber)
    assert.deepStrictEqual(b.toString(), '-2')
  })

  it('should perform unary plus of a number', function () {
    assert.deepStrictEqual(math.unaryPlus(2), 2)
    assert.deepStrictEqual(math.unaryPlus(-2), -2)
    assert.deepStrictEqual(math.unaryPlus(0), 0)
  })

  it('should perform unary plus of a bigint', function () {
    assert.deepStrictEqual(math.unaryPlus(2n), 2n)
    assert.deepStrictEqual(math.unaryPlus(-2n), -2n)
    assert.deepStrictEqual(math.unaryPlus(0n), 0n)
  })

  it('should perform unary plus of a big number', function () {
    assert.deepStrictEqual(math.unaryPlus(bignumber(2)), bignumber(2))
    assert.deepStrictEqual(math.unaryPlus(bignumber(-2)), bignumber(-2))
    assert.deepStrictEqual(math.unaryPlus(bignumber(0)).valueOf(), bignumber(0).valueOf())
  })

  it('should perform unary plus of a fraction', function () {
    const a = fraction(0.5)
    assert(math.unaryPlus(a) instanceof math.Fraction)
    assert.strictEqual(a.toString(), '0.5')

    assert.strictEqual(math.unaryPlus(fraction(0.5)).toString(), '0.5')
    assert.strictEqual(math.unaryPlus(fraction(-0.5)).toString(), '-0.5')
  })

  it('should perform unary plus of a complex number', function () {
    assert.strictEqual(math.unaryPlus(math.complex(3, 2)).toString(), '3 + 2i')
    assert.strictEqual(math.unaryPlus(math.complex(3, -2)).toString(), '3 - 2i')
    assert.strictEqual(math.unaryPlus(math.complex(-3, 2)).toString(), '-3 + 2i')
    assert.strictEqual(math.unaryPlus(math.complex(-3, -2)).toString(), '-3 - 2i')
  })

  it('should perform unary plus of a unit', function () {
    assert.strictEqual(math.unaryPlus(math.unit(5, 'km')).toString(), '5 km')
  })

  it('should perform element-wise unary plus on a matrix', function () {
    const a2 = math.matrix([[1, 2], [3, 4]])
    const a7 = math.unaryPlus(a2)
    assert.ok(a7 instanceof math.Matrix)
    assert.deepStrictEqual(a7.size(), [2, 2])
    assert.deepStrictEqual(a7.valueOf(), [[1, 2], [3, 4]])
    assert.deepStrictEqual(math.unaryPlus([[1, 2], [3, 4]]), [[1, 2], [3, 4]])
  })

  it('should throw an error in case of invalid number of arguments', function () {
    assert.throws(function () { math.unaryPlus() }, /TypeError: Too few arguments/)
    assert.throws(function () { math.unaryPlus(1, 2) }, /TypeError: Too many arguments/)
  })

  it('should throw an error in case of invalid type of argument', function () {
    assert.throws(function () { math.unaryPlus(new Date()) }, /TypeError: Unexpected type of argument/)
    assert.throws(function () { math.unaryPlus(null) }, /TypeError: Unexpected type of argument/)
  })

  it('should LaTeX unaryPlus', function () {
    const expression = math.parse('unaryPlus(1)')
    assert.strictEqual(expression.toTex(), '+\\left(1\\right)')
  })
})
