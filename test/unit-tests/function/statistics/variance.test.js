import assert from 'assert'
import { approxEqual } from '../../../../tools/approx.js'
import math from '../../../../src/defaultInstance.js'
const BigNumber = math.BigNumber
const Complex = math.Complex
const DenseMatrix = math.DenseMatrix
const variance = math.variance

describe('variance', function () {
  it('should return the variance of numbers', function () {
    assert.strictEqual(variance(5), 0)
    assert.strictEqual(variance(2, 4, 6), 4)
  })

  it('should return the variance of strings by their numerical values', function () {
    assert.strictEqual(variance('2', '4', '6'), 4)
    assert.strictEqual(variance('5'), 0)
  })

  it('should return the variance of big numbers', function () {
    assert.deepStrictEqual(variance(new BigNumber(2), new BigNumber(4), new BigNumber(6)),
      new math.BigNumber(4))
  })

  it('should return the variance of complex numbers', function () {
    assert.deepStrictEqual(variance(new Complex(2, 3), new Complex(-1, 2)), new Complex(4, 3))
  })

  it('should return the variance of mixed numbers and complex numbers', function () {
    assert.deepStrictEqual(variance(2, new Complex(-1, 3)), new Complex(0, -9))
  })

  it('should return the variance from an array', function () {
    assert.strictEqual(variance([2, 4, 6]), 4)
    assert.strictEqual(variance([5]), 0)
  })

  it('should return the uncorrected variance from an array', function () {
    assert.strictEqual(variance([2, 4], 'uncorrected'), 1)
    assert.strictEqual(variance([2, 4, 6, 8], 'uncorrected'), 5)
  })

  it('should return the biased variance from an array', function () {
    assert.strictEqual(variance([2, 8], 'biased'), 6)
    assert.strictEqual(variance([2, 4, 6, 8], 'biased'), 4)
  })

  it('should return NaN if any of the inputs contains NaN', function () {
    assert(isNaN(variance([NaN])))
    assert(isNaN(variance([1, NaN])))
    assert(isNaN(variance([NaN, 1])))
    assert(isNaN(variance([1, 3, NaN])))
    assert(isNaN(variance([NaN, NaN, NaN])))
    assert(isNaN(variance(NaN, NaN, NaN)))
  })

  it('should throw an error in case of unknown type of normalization', function () {
    assert.throws(function () { variance([2, 8], 'foo') }, /Unknown normalization/)
  })

  it('should throw an error in case the dimension exceeds the matrix dimension', function () {
    assert.throws(function () { variance([[2, 4, 6], [1, 3, 5]], 5) }, /Index out of range/)
  })

  it('should return the variance from an 1d matrix', function () {
    assert.strictEqual(variance(new DenseMatrix([2, 4, 6])), 4)
    assert.strictEqual(variance(new DenseMatrix([5])), 0)
  })

  it('should return the variance element from a 2d array', function () {
    assert.deepStrictEqual(variance([
      [2, 4, 6],
      [1, 3, 5]
    ]), 3.5)
  })

  it('should return the variance element from a 2d matrix', function () {
    assert.deepStrictEqual(variance(new DenseMatrix([
      [2, 4, 6],
      [1, 3, 5]
    ])), 3.5)
  })

  const inputMatrix = [ // this is a 4x3x2 matrix, full test coverage
    [[10, 200], [30, 40], [50, 60]],
    [[70, 80], [90, 100], [180, 120]],
    [[130, 140], [160, 150], [170, 110]],
    [[190, 20], [210, 220], [230, 240]]
  ]

  it('should return the variance value along a dimension on a matrix', function () {
    assert.deepStrictEqual(variance([
      [2, 6],
      [4, 10]], 1), [8, 18])
    assert.deepStrictEqual(variance([
      [2, 6],
      [4, 10]], 0), [2, 8])
    assert.deepStrictEqual(variance(inputMatrix, 0),
      [[6000, 6000], [6225, 5825], [5825, 5825]])
    assert.deepStrictEqual(variance(inputMatrix, 1),
      [[400, 7600], [3433.3333333333335, 400], [433.33333333333337, 433.33333333333337], [400, 14800]])
    assert.deepStrictEqual(variance(inputMatrix, 2),
      [[18050, 50, 50], [50, 50, 1800], [50, 50, 1800], [14450, 50, 50]])
  })

  it('should throw an error if called with invalid number of arguments', function () {
    assert.throws(function () { variance() })
  })

  it('should throw an error if called with invalid type of arguments', function () {
    assert.throws(function () { variance(new Date(), 2) }, /Cannot calculate variance, unexpected type of argument/)
    assert.throws(function () { variance(2, 3, null) }, /Cannot calculate variance, unexpected type of argument/)
    assert.throws(function () { variance([2, 3, null]) }, /Cannot calculate variance, unexpected type of argument/)
    assert.throws(function () { variance([[2, 4, 6], [1, 3, 5]], 'biased', 0) }, /Cannot convert "biased" to a number/)
    assert.throws(function () { variance([[2, 4, 6], [1, 3, 5]], 0, new Date()) }, /Cannot calculate variance, unexpected type of argument/)
    assert.throws(function () { variance('a', 'b') }, /Error: Cannot convert "a" to a number/)
    assert.throws(function () { variance('a') }, /Error: Cannot convert "a" to a number/)
  })

  it('should throw an error if the axis exceeds the dimension of the matrix', function () {
    // TODO
  })

  it('should throw an error if called with an empty array', function () {
    assert.throws(function () { variance([]) })
  })

  it('should LaTeX var', function () {
    const expression = math.parse('variance(1,2,3)')
    assert.strictEqual(expression.toTex(), '\\mathrm{Var}\\left(1,2,3\\right)')
  })

  it('should compute the variance of quantities with units', function () {
    const a = math.unit(10, 'cm')
    const b = math.unit(20, 'cm')
    const c = math.unit(50, 'cm^2')
    approxEqual(variance([a, b]).toNumber('cm^2'), c.toNumber('cm^2'))
  })

  it('should compute the variance of quantities with compatible units', function () {
    const a = math.unit(1, 'm')
    const b = math.unit(50, 'cm')
    const c = math.unit(1250, 'cm^2')
    approxEqual(variance([a, b]).toNumber('cm^2'), c.toNumber('cm^2'))
  })

  it('should not compute the variance of quantities with incompatible units', function () {
    const a = math.unit(1, 'm')
    const b = math.unit(50, 'kg')
    assert.throws(function () { variance([a, b]) }, /Units do not match/)
  })
})
