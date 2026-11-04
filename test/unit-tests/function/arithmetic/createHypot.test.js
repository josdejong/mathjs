// test hypot
import assert from 'assert'

import { approxEqual } from '../../../../tools/approx.js'
import math from '../../../../src/defaultInstance.js'
const hypot = math.hypot
const bignumber = math.bignumber

describe('hypot', function () {
  it('should return the hypot of numbers', function () {
    assert.strictEqual(hypot(3, 4), 5)
    assert.strictEqual(hypot(3, -4), 5)
    approxEqual(hypot(3, 4, 5), 7.0710678118654755)
    assert.strictEqual(hypot(-2), 2)
    assert.strictEqual(hypot(0), 0)
    assert.strictEqual(hypot(Infinity), Infinity)
  })

  it('should return the hypot of BigNumbers', function () {
    assert.deepStrictEqual(hypot(bignumber(3), bignumber(4)), bignumber(5))
    assert.deepStrictEqual(hypot(bignumber(3), bignumber(-4)), bignumber(5))
    assert.deepStrictEqual(hypot(bignumber(3), bignumber(4), bignumber(5)),
      bignumber('7.07106781186547524400844362104849039284835937688474036588339869'))
    assert.deepStrictEqual(hypot(bignumber(-2)), bignumber(2))
  })

  it('should return the hypot of numbers smaller than config.absTol', function () {
    // values smaller than the configured absTol must not be treated as zero
    assert.strictEqual(hypot(3e-16, 4e-16), 5e-16)
    assert.strictEqual(hypot(1e-16), 1e-16)
    assert.strictEqual(hypot(0, 1e-16), 1e-16)
    assert.strictEqual(hypot(1e-16, 0), 1e-16)
    approxEqual(hypot(1e-200, 1e-200), Math.SQRT2 * 1e-200)
    approxEqual(hypot(1e-16, 1e-16, 1e-16), Math.sqrt(3) * 1e-16)
  })

  it('should return the hypot of BigNumbers smaller than config.absTol', function () {
    assert.deepStrictEqual(hypot(bignumber('3e-16'), bignumber('4e-16')), bignumber('5e-16'))
    assert.deepStrictEqual(hypot(bignumber('3e-200'), bignumber('4e-200')), bignumber('5e-200'))
    assert.deepStrictEqual(hypot(bignumber('1e-16')), bignumber('1e-16'))
    assert.deepStrictEqual(hypot(bignumber(0), bignumber('1e-16')), bignumber('1e-16'))
  })

  it('should return NaN when one of the values is NaN', function () {
    assert.ok(isNaN(hypot(NaN)))
    assert.ok(isNaN(hypot(NaN, 3)))
    assert.ok(isNaN(hypot(3, NaN)))
    assert.ok(hypot(bignumber(NaN), bignumber(3)).isNaN())
  })

  it('should return the hypot of an Array with numbers', function () {
    assert.strictEqual(hypot([3, 4]), 5)
  })

  it('should return the hypot of an Matrix with numbers', function () {
    assert.strictEqual(hypot(math.matrix([3, 4])), 5)
  })

  it('should return the hypot of an Array with mixed numbers and BigNumbers', function () {
    assert.deepStrictEqual(hypot([3, bignumber(4)]), bignumber(5))
  })

  it('should throw an error in case of invalid number of arguments', function () {
    assert.throws(function () { hypot() }, /TypeError: Too few arguments/)
    assert.throws(function () { hypot([], 2) }, /TypeError: Too many arguments/)
  })

  it('should throw an error in case of unsupported types', function () {
    assert.throws(function () { hypot(new Date()) }, /TypeError: Unexpected type of argument/)
    assert.throws(function () { hypot([new Date()]) }, /TypeError: Unexpected type of argument/)
    assert.throws(function () { hypot([2, 3, math.complex()]) }, /TypeError: Unexpected type of argument/)
    assert.throws(function () { hypot(undefined) }, /TypeError: Unexpected type of argument/)
  })

  it('should LaTeX hypot', function () {
    const expression = math.parse('hypot(3,4)')
    assert.strictEqual(expression.toTex(), '\\hypot\\left(3,4\\right)')
  })
})
