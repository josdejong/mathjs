// test invmod
import assert from 'assert'

import math from '../../../../src/defaultInstance.js'
const { invmod, complex, bignumber } = math

describe('invmod', function () {
  it('should find the multiplicative inverse for basic cases', function () {
    assert.strictEqual(invmod(2, 7), 4)
    assert.strictEqual(invmod(3, 11), 4)
    assert.strictEqual(invmod(10, 17), 12)
  })

  it('should return NaN when there is no multiplicative inverse', function () {
    assert(isNaN(invmod(3, 15)))
    assert(isNaN(invmod(14, 7)))
    assert(isNaN(invmod(42, 1200)))
  })

  it('should work when a≥b', function () {
    assert.strictEqual(invmod(4, 3), 1)
    assert(isNaN(invmod(7, 7)))
  })

  it('should work for negative values', function () {
    assert.strictEqual(invmod(-2, 7), 3)
    assert.strictEqual(invmod(-2000000, 21), 10)
  })

  it('should calculate invmod for BigNumbers', function () {
    assert.deepStrictEqual(invmod(bignumber(13), bignumber(25)), bignumber(2))
    assert.deepStrictEqual(invmod(bignumber(-7), bignumber(48)), bignumber(41))
  })

  it('should calculate invmod for mixed BigNumbers and Numbers', function () {
    assert.deepStrictEqual(invmod(bignumber(44), 7), bignumber(4))
    assert.deepStrictEqual(invmod(4, math.bignumber(15)), bignumber(4))
  })

  it('should throw an error if b is zero', function () {
    assert.throws(function () { invmod(1, 0) }, /Divisor must be non zero/)
  })

  it('should throw an error if only one argument', function () {
    assert.throws(function () { invmod(1) }, /TypeError: Too few arguments/)
  })

  it('should throw an error for non-integer numbers', function () {
    assert.throws(function () { invmod(2, 4.1) }, /Parameters in function invmod must be integer numbers/)
    assert.throws(function () { invmod(2.3, 4) }, /Parameters in function invmod must be integer numbers/)
  })

  it('should throw an error with complex numbers', function () {
    assert.throws(function () { invmod(complex(1, 3), 2) }, /TypeError: Unexpected type of argument/)
  })

  it('should convert strings to numbers', function () {
    assert.strictEqual(invmod('7', '15'), 13)
    assert.strictEqual(invmod(7, '15'), 13)
    assert.strictEqual(invmod('7', 15), 13)

    assert.throws(function () { invmod('a', 8) }, /Cannot convert "a" to a number/)
  })

  it('should throw an error with units', function () {
    assert.throws(function () { invmod(math.unit('5cm'), 2) }, /TypeError: Unexpected type of argument/)
  })

  it('should LaTeX invmod', function () {
    const expression = math.parse('invmod(2,3)')
    assert.strictEqual(expression.toTex(), '\\mathrm{invmod}\\left(2,3\\right)')
  })
})
