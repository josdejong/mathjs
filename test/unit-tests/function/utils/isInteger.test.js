import assert from 'assert'
import math from '../../../../src/defaultInstance.js'
const isInteger = math.isInteger
const bignumber = math.bignumber
const fraction = math.fraction

describe('isInteger', function () {
  it('should test whether a number is an integer', function () {
    assert.strictEqual(isInteger(2), true)
    assert.strictEqual(isInteger(0), true)
    assert.strictEqual(isInteger(-3), true)
    assert.strictEqual(isInteger(-0.5), false)
    assert.strictEqual(isInteger(0.5), false)
    assert.strictEqual(isInteger(Infinity), false)
    assert.strictEqual(isInteger(-Infinity), false)
    assert.strictEqual(isInteger(NaN), false)
    assert.strictEqual(isInteger(0.1 + 0.2), false)
    assert.strictEqual(isInteger((0.1 + 0.2) * 10), true)
    assert.strictEqual(isInteger((0.1 + 0.2) * 10 - 3), true)
  })

  it('should test whether a bigint is an integer', function () {
    assert.strictEqual(isInteger(2n), true)
    assert.strictEqual(isInteger(0n), true)
    assert.strictEqual(isInteger(-3n), true)
  })

  it('should test whether a boolean is an integer', function () {
    assert.strictEqual(isInteger(true), true)
    assert.strictEqual(isInteger(false), true)
  })

  it('should test whether a BigNumber is an integer', function () {
    assert.strictEqual(isInteger(bignumber(2)), true)
    assert.strictEqual(isInteger(bignumber(0)), true)
    assert.strictEqual(isInteger(bignumber(-3)), true)
    assert.strictEqual(isInteger(bignumber(-0.5)), false)
    assert.strictEqual(isInteger(bignumber(0.5)), false)
    assert.strictEqual(isInteger(bignumber(Infinity)), false)
    assert.strictEqual(isInteger(bignumber(-Infinity)), false)
    assert.strictEqual(isInteger(bignumber(NaN)), false)
    assert.strictEqual(isInteger(bignumber((0.1 + 0.2) * 10)), true)
    assert.strictEqual(isInteger(bignumber((0.1 + 0.2) * 10 - 3)), true)
  })

  it('should test whether a Fraction is an integer', function () {
    assert.strictEqual(isInteger(fraction(2)), true)
    assert.strictEqual(isInteger(fraction(0)), true)
    assert.strictEqual(isInteger(fraction(-3)), true)
    assert.strictEqual(isInteger(fraction(-0.5)), false)
    assert.strictEqual(isInteger(fraction(0.5)), false)
  })

  it('should test whether a string contains an integer', function () {
    assert.strictEqual(isInteger('2'), true)
    assert.strictEqual(isInteger('0'), true)
    assert.strictEqual(isInteger('-3'), true)
    assert.strictEqual(isInteger('-0.5'), false)
    assert.strictEqual(isInteger('0.5'), false)
  })

  it('should test isInteger element wise on an Array', function () {
    assert.deepStrictEqual(isInteger([2, 5, 0.5, 3]), [true, true, false, true])
  })

  it('should test isInteger element wise on a Matrix', function () {
    assert.deepStrictEqual(isInteger(math.matrix([2, 5, 0.5, 3])), math.matrix([true, true, false, true]))
  })

  it('should throw an error in case of unsupported data types', function () {
    assert.throws(function () { isInteger(math.complex(2, 3)) }, /TypeError: Unexpected type of argument/)
    assert.throws(function () { isInteger(math.unit('5 cm')) }, /TypeError: Unexpected type of argument/)
    assert.throws(function () { isInteger(new Date()) }, /TypeError: Unexpected type of argument/)
    assert.throws(function () { isInteger({}) }, /TypeError: Unexpected type of argument/)
  })
})
