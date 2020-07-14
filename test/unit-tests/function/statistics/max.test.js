import assert from 'assert'
import math from '../../../../src/bundleAny'
const BigNumber = math.BigNumber
const Complex = math.Complex
const DenseMatrix = math.DenseMatrix
const max = math.max

describe('max', function () {
  it('should return the max of numbers', function () {
    assert.strictEqual(max(5), 5)
    assert.strictEqual(max(3, 1), 3)
    assert.strictEqual(max(1, 3), 3)
    assert.strictEqual(max(1, 3, 5, 2, -5), 5)
    assert.strictEqual(max(0, 0, 0, 0), 0)
  })

  it('should return the max of big numbers', function () {
    assert.deepStrictEqual(max(new BigNumber(1), new BigNumber(3), new BigNumber(5), new BigNumber(2), new BigNumber(-5)),
      new BigNumber(5))
  })

  it('should return the max of strings by their numerical value', function () {
    assert.strictEqual(max('10', '3', '4', '2'), 10)
    assert.strictEqual(max('10'), 10)
  })

  it('should return the max element from a vector', function () {
    assert.strictEqual(max(new DenseMatrix([1, 3, 5, 2, -5])), 5)
  })

  it('should return the max element from a 2d matrix', function () {
    assert.deepStrictEqual(max([
      [1, 4, 7],
      [3, 0, 5],
      [-1, 11, 9]
    ]), 11)
    assert.deepStrictEqual(max(new DenseMatrix([
      [1, 4, 7],
      [3, 0, 5],
      [-1, 11, 9]
    ])), 11)
  })

  it('should return a reduced n-1 matrix from a n matrix', function () {
    assert.deepStrictEqual(max([
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9]
    ], 0), [7, 8, 9])

    assert.deepStrictEqual(max([
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9]
    ], 1), [3, 6, 9])

    assert.deepStrictEqual(max([
      [1, 2, 3],
      [6, 5, 4],
      [8, 7, 9]
    ], 1), [3, 6, 9])

    assert.deepStrictEqual(max([
      [[1, 2], [3, 4], [5, 6]],
      [[6, 7], [8, 9], [10, 11]]
    ], 2),
    [[2, 4, 6], [7, 9, 11]])
  })

  it('should return NaN if any of the inputs contains NaN', function () {
    assert(isNaN(max([NaN])))
    assert(isNaN(max([1, NaN])))
    assert(isNaN(max([NaN, 1])))
    assert(isNaN(max([1, 3, NaN])))
    assert(isNaN(max([NaN, NaN, NaN])))
    assert(isNaN(max(NaN, NaN)))
  })

  it('should throw an error when called multiple arrays or matrices', function () {
    assert.throws(function () { max([1, 2], [3, 4]) }, /Scalar values expected/)
    assert.throws(function () { max(math.matrix([1, 2]), math.matrix([3, 4])) }, /Scalar values expected/)
  })

  it('should throw an error if called a dimension out of range', function () {
    assert.throws(function () { max([1, 2, 3], -1) }, /IndexError: Index out of range \(-1 < 0\)/)
    assert.throws(function () { max([1, 2, 3], 1) }, /IndexError: Index out of range \(1 > 0\)/)
  })

  it('should throw an error if called with invalid number of arguments', function () {
    assert.throws(function () { max() })
    assert.throws(function () { max([], 2, 3) })
  })

  it('should throw an error if called with invalid type of arguments', function () {
    assert.throws(function () { max(2, new Complex(2, 5)) }, /TypeError: Cannot calculate max, no ordering relation is defined for complex numbers/)
    assert.throws(function () { max(new Complex(2, 3), new Complex(2, 1)) }, /TypeError: Cannot calculate max, no ordering relation is defined for complex numbers/)

    assert.throws(function () { max([[2, undefined, 4]]) }, /TypeError: Cannot calculate max, unexpected type of argument/)
    assert.throws(function () { max([[2, new Date(), 4]]) }, /TypeError: Cannot calculate max, unexpected type of argument/)
    assert.throws(function () { max([2, null, 4]) }, /TypeError: Cannot calculate max, unexpected type of argument/)
    assert.throws(function () { max([[2, 5], [4, null], [1, 7]], 0) }, /TypeError: Cannot calculate max, unexpected type of argument/)
    assert.throws(function () { max('a', 'b') }, /Error: Cannot convert "b" to a number/)
    assert.throws(function () { max('a') }, /SyntaxError: String "a" is no valid number/)
  })

  it('should return undefined if called with an empty array', function () {
    assert.throws(function () { max([]) })
  })

  it('should LaTeX max', function () {
    const expression = math.parse('max(1,2,3)')
    assert.strictEqual(expression.toTex(), '\\max\\left(1,2,3\\right)')
  })
})
