import assert from 'assert'
import { approxEqual } from '../../../../tools/approx.js'
import math from '../../../../src/defaultInstance.js'
const BigNumber = math.BigNumber
const Complex = math.Complex
const DenseMatrix = math.DenseMatrix
const mean = math.mean

describe('mean', function () {
  it('should return the mean value of some numbers', function () {
    assert.strictEqual(mean(5), 5)
    assert.strictEqual(mean(3, 1), 2)
    assert.strictEqual(mean(0, 3), 1.5)
    assert.strictEqual(mean(1, 3, 5, 2, -5), 1.2)
    assert.strictEqual(mean(0, 0, 0, 0), 0)
  })

  it('should return the mean value of strings by their numerical value', function () {
    assert.strictEqual(mean('1', '3', '5', '2', '-5'), 1.2)
    assert.strictEqual(mean('5'), 5)
  })

  it('should return the mean of big numbers', function () {
    assert.deepStrictEqual(mean(new BigNumber(1), new BigNumber(3), new BigNumber(5), new BigNumber(2), new BigNumber(-5)),
      new BigNumber(1.2))
  })

  it('should return the mean value for complex values', function () {
    assert.deepStrictEqual(mean(new Complex(2, 3), new Complex(2, 1)), new Complex(2, 2))
    assert.deepStrictEqual(mean(new Complex(2, 3), new Complex(2, 5)), new Complex(2, 4))
  })

  it('should return the mean value for mixed real and complex values', function () {
    assert.deepStrictEqual(mean(new Complex(2, 4), 4), new Complex(3, 2))
    assert.deepStrictEqual(mean(4, new Complex(2, 4)), new Complex(3, 2))
  })

  it('should return the mean value from an array', function () {
    assert.strictEqual(mean([5]), 5)
    assert.strictEqual(mean([1, 3, 5, 2, -5]), 1.2)
  })

  it('should return the mean value from a 1d matrix', function () {
    assert.strictEqual(mean(new DenseMatrix([5])), 5)
    assert.strictEqual(mean(new DenseMatrix([1, 3, 5, 2, -5])), 1.2)
  })

  it('should return the mean for each vector on the last dimension', function () {
    assert.deepStrictEqual(mean([
      [2, 4],
      [6, 8]
    ]), 5)
    assert.deepStrictEqual(mean(new DenseMatrix([
      [2, 4],
      [6, 8]
    ])), 5)
  })

  it('should compute the mean of quantities with units', function () {
    const a = math.unit(10, 'cm')
    const b = math.unit(20, 'cm')
    const c = math.unit(15, 'cm')
    approxEqual(mean(a, b).toNumber('cm'), c.toNumber('cm'))
  })

  it('should compute the mean of quantities with compatible units', function () {
    const a = math.unit(1, 'm')
    const b = math.unit(50, 'cm')
    const c = math.unit(0.75, 'm')
    approxEqual(mean(a, b).toNumber('cm'), c.toNumber('cm'))
  })

  it('should not compute the mean of quantities with incompatible units', function () {
    const a = math.unit(1, 'm')
    const b = math.unit(50, 'kg')
    assert.throws(function () { mean(a, b) }, /Units do not match/)
  })

  const inputMatrix = [ // this is a 4x3x2 matrix, full test coverage
    [[10, 20], [30, 40], [50, 60]],
    [[70, 80], [90, 100], [110, 120]],
    [[130, 140], [150, 160], [170, 180]],
    [[190, 200], [210, 220], [230, 240]]
  ]

  it('should return the mean value along a dimension on a matrix', function () {
    assert.deepStrictEqual(mean([
      [2, 6],
      [4, 10]], 1), [4, 7])
    assert.deepStrictEqual(mean([
      [2, 6],
      [4, 10]], 0), [3, 8])
    assert.deepStrictEqual(mean(inputMatrix, 0),
      [[100, 110], [120, 130], [140, 150]])
    assert.deepStrictEqual(mean(inputMatrix, 1),
      [[30, 40], [90, 100], [150, 160], [210, 220]])
    assert.deepStrictEqual(mean(inputMatrix, 2),
      [[15, 35, 55], [75, 95, 115], [135, 155, 175], [195, 215, 235]])
  })

  it('should return NaN if any of the inputs contains NaN', function () {
    assert(isNaN(mean([NaN])))
    assert(isNaN(mean([1, NaN])))
    assert(isNaN(mean([NaN, 1])))
    assert(isNaN(mean([1, 3, NaN])))
    assert(isNaN(mean([NaN, NaN, NaN])))
    assert(isNaN(mean(NaN, NaN)))
  })

  it('should throw an error if called with invalid number of arguments', function () {
    assert.throws(function () { mean() })
    assert.throws(function () { mean([], 2, 3) })
  })

  it('should throw an error when called multiple arrays or matrices', function () {
    assert.throws(function () { mean([1, 2], [3, 4]) }, /Scalar values expected/)
    assert.throws(function () { mean(math.matrix([1, 2]), math.matrix([3, 4])) }, /Scalar values expected/)
  })

  it('should throw an error if called a dimension out of range', function () {
    assert.throws(function () { mean([1, 2, 3], -1) }, /IndexError: Index out of range \(-1 < 0\)/)
    assert.throws(function () { mean([1, 2, 3], 1) }, /IndexError: Index out of range \(1 > 0\)/)
  })

  it('should throw an error if called with an empty array', function () {
    assert.throws(function () { mean([]) })
  })

  it('should throw an error if called with invalid type of arguments', function () {
    assert.throws(function () { mean([[2, undefined, 4]]) }, /TypeError: Cannot calculate mean, unexpected type of argument/)
    assert.throws(function () { mean([[2, new Date(), 4]]) }, /TypeError: Cannot calculate mean, unexpected type of argument/)
    assert.throws(function () { mean([2, null, 4]) }, /TypeError: Cannot calculate mean, unexpected type of argument/)
    assert.throws(function () { mean([[2, 5], [4, null], [1, 7]], 0) }, /TypeError: Cannot calculate mean, unexpected type of argument/)
    assert.throws(function () { mean('a', 'b') }, /Error: Cannot convert "a" to a number/)
    assert.throws(function () { mean('a') }, /Error: Cannot convert "a" to a number/)
  })

  it('should LaTeX mean', function () {
    const expression = math.parse('mean(1,2,3,4)')
    assert.strictEqual(expression.toTex(), '\\mathrm{mean}\\left(1,2,3,4\\right)')
  })
})
