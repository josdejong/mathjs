// test bitNot
import assert from 'assert'

import math from '../../../../src/defaultInstance.js'
const bignumber = math.bignumber
const bitNot = math.bitNot

describe('bitNot', function () {
  it('should return bitwise not of a boolean', function () {
    assert.strictEqual(bitNot(true), -2)
    assert.strictEqual(bitNot(false), -1)
  })

  it('should perform bitwise not of a number', function () {
    assert.deepStrictEqual(bitNot(2), -3)
    assert.deepStrictEqual(bitNot(-2), 1)
    assert.deepStrictEqual(bitNot(0), -1)
  })

  it('should perform bitwise not of a bigint', function () {
    assert.deepStrictEqual(bitNot(2n), -3n)
    assert.deepStrictEqual(bitNot(-2n), 1n)
    assert.deepStrictEqual(bitNot(0n), -1n)
  })

  it('should perform bitwise not of a bignumber', function () {
    assert.deepStrictEqual(bitNot(bignumber(2)), bignumber(-3))
    assert.deepStrictEqual(bitNot(bignumber(-2)), bignumber(1))
    assert.deepStrictEqual(bitNot(bignumber('1.2345e30')), bignumber('-1234500000000000000000000000001'))
  })

  it('should throw an error if the parameters are not integers', function () {
    assert.throws(function () {
      bitNot(1.1)
    }, /Integer expected in function bitNot/)
    assert.throws(function () {
      bitNot(bignumber(1.1))
    }, /Integer expected in function bitNot/)
  })

  it('should throw an error if used with a unit', function () {
    assert.throws(function () { bitNot(math.unit('5cm')) }, /TypeError: Unexpected type of argument/)
  })

  it('should perform element-wise bitwise not on a matrix', function () {
    const a2 = math.matrix([[1, 2], [3, 4]])
    const a7 = bitNot(a2)
    assert.ok(a7 instanceof math.Matrix)
    assert.deepStrictEqual(a7.size(), [2, 2])
    assert.deepStrictEqual(a7.valueOf(), [[-2, -3], [-4, -5]])
  })

  it('should perform element-wise bitwise not on an array', function () {
    assert.deepStrictEqual(bitNot([[1, 2], [3, 4]]), [[-2, -3], [-4, -5]])
  })

  it('should throw an error in case of invalid number of arguments', function () {
    assert.throws(function () { bitNot() }, /TypeError: Too few arguments/)
    assert.throws(function () { bitNot(1, 2) }, /TypeError: Too many arguments/)
  })

  it('should throw an error in case of invalid type of argument', function () {
    assert.throws(function () { bitNot(null) }, /TypeError: Unexpected type of argument/)
    assert.throws(function () { bitNot(new Date()) }, /TypeError: Unexpected type of argument/)
    assert.throws(function () { bitNot(undefined) }, /TypeError: Unexpected type of argument/)
  })

  it('should LaTeX bitNot', function () {
    const expression = math.parse('bitNot(4)')
    assert.strictEqual(expression.toTex(), '\\~\\left(4\\right)')
  })
})
