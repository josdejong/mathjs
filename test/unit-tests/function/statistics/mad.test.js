import assert from 'assert'
import math from '../../../../src/defaultInstance.js'
const BigNumber = math.BigNumber
const DenseMatrix = math.DenseMatrix
const Complex = math.Complex
const mad = math.mad

describe('mad', function () {
  it('should return the median absolute deviation of numbers', function () {
    assert.strictEqual(mad(10), 0)
    assert.strictEqual(mad(4, 6, 8), 2)
    assert.strictEqual(mad(1, 10, 20, 30), 9.5)
  })

  it('should return the median absolute deviation of big numbers', function () {
    assert.deepStrictEqual(mad(new BigNumber(4), new BigNumber(6), new BigNumber(8)),
      new BigNumber(2))
  })

  it('should return the median absolute deviation from an array', function () {
    assert.strictEqual(mad([10]), 0)
    assert.strictEqual(mad([4, 6, 8]), 2)
    assert.strictEqual(mad([1, 10, 20, 30]), 9.5)
  })

  it('should return the median absolute deviation from an 1d matrix', function () {
    assert.strictEqual(mad(new DenseMatrix([10])), 0)
    assert.strictEqual(mad(new DenseMatrix([4, 6, 8])), 2)
    assert.strictEqual(mad(new DenseMatrix([1, 10, 20, 30])), 9.5)
  })

  it('should return the median absolute deviation element from a 2d array', function () {
    assert.deepStrictEqual(mad([
      [2, 4, 6],
      [1, 3, 5]
    ]), 1.5)
  })

  it('should return the median absolute deviation element from a 2d matrix', function () {
    assert.deepStrictEqual(mad(new DenseMatrix([
      [2, 4, 6],
      [1, 3, 5]
    ])), 1.5)
  })

  it('should return NaN if any of the inputs contains NaN', function () {
    assert(isNaN(mad([NaN])))
    assert(isNaN(mad([1, NaN])))
    assert(isNaN(mad([NaN, 1])))
    assert(isNaN(mad([1, 3, NaN])))
    assert(isNaN(mad([NaN, NaN, NaN])))
    assert(isNaN(mad(NaN, NaN)))
  })

  it('should throw an error if called with invalid number of arguments', function () {
    assert.throws(function () { mad() })
  })

  it('should throw an error if called with an empty array', function () {
    assert.throws(function () { mad([]) })
  })

  it('should throw an error if called with invalid type of arguments', function () {
    assert.throws(function () { mad(2, new Complex(2, 5)) }, /TypeError: Cannot calculate mad, no ordering relation is defined for complex numbers/)
    assert.throws(function () { mad(new Complex(2, 3), new Complex(2, 1)) }, /TypeError: Cannot calculate mad, no ordering relation is defined for complex numbers/)

    assert.throws(function () { mad([2, new Date(), 4]) }, /TypeError: Cannot calculate mad, unexpected type of argument/)
    assert.throws(function () { mad([2, null, 4]) }, /TypeError: Cannot calculate mad, unexpected type of argument/)
    assert.throws(function () { mad([[2, 5], [4, null], [1, 7]], 0) }, /TypeError: Cannot calculate mad, unexpected type of argument/)
  })

  it('should LaTeX mad', function () {
    const expression = math.parse('mad(1,2,3)')
    assert.strictEqual(expression.toTex(), '\\mathrm{mad}\\left(1,2,3\\right)')
  })
})
