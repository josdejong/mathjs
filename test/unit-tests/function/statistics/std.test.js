import assert from 'assert'
import { approxEqual, approxDeepEqual } from '../../../../tools/approx.js'
import math from '../../../../src/defaultInstance.js'
const BigNumber = math.BigNumber
const Complex = math.Complex
const DenseMatrix = math.DenseMatrix
const Unit = math.Unit
const std = math.std

describe('std', function () {
  it('should return the standard deviation of numbers', function () {
    assert.strictEqual(std(5), 0)
    assert.strictEqual(std(2, 4, 6), 2)
  })

  it('should return the standard deviation of big numbers', function () {
    assert.deepStrictEqual(std(new BigNumber(2), new BigNumber(4), new BigNumber(6)),
      new math.BigNumber(2))
  })

  it('should return the standard deviation of complex numbers', function () {
    //
    approxDeepEqual(std(new Complex(2, 4), new Complex(4, 2)), new Complex(1.41421, -1.41421))
  })

  it('should return the standard deviation of mixed numbers and complex numbers', function () {
    approxDeepEqual(std(2, new Complex(6, 4)), new Complex(2.82842, 2.82842))
  })

  it('should return the standard deviation from an array', function () {
    assert.strictEqual(std([2, 4, 6]), 2)
    assert.strictEqual(std([5]), 0)
  })

  it('should return the uncorrected standard deviation from an array', function () {
    assert.strictEqual(std([2, 4], 'uncorrected'), 1)
    assert.strictEqual(std([2, 4, 6, 8], 'uncorrected'), Math.sqrt(5))
  })

  it('should return the biased standard deviation from an array', function () {
    assert.strictEqual(std([2, 8], 'biased'), Math.sqrt(6))
    assert.strictEqual(std([2, 4, 6, 8], 'biased'), 2)
  })

  it('should return NaN if any of the inputs contains NaN', function () {
    assert(isNaN(std([NaN])))
    assert(isNaN(std([1, NaN])))
    assert(isNaN(std([NaN, 1])))
    assert(isNaN(std([1, 3, NaN])))
    assert(isNaN(std([NaN, NaN, NaN])))
    assert(isNaN(std(NaN, NaN, NaN)))
  })

  it('should throw an error in case of unknown type of normalization', function () {
    assert.throws(function () { std([2, 8], 'foo') }, /Unknown normalization/)
  })

  it('should throw an error in case the dimension exceeds the matrix dimension', function () {
    assert.throws(function () { std([[2, 4, 6], [1, 3, 5]], 5) }, /Index out of range/)
  })

  it('should return the standard deviation from an 1d matrix', function () {
    assert.strictEqual(std(new DenseMatrix([2, 4, 6])), 2)
    assert.strictEqual(std(new DenseMatrix([5])), 0)
  })

  it('should return the standard deviation element from a 2d array', function () {
    assert.deepStrictEqual(std([
      [2, 4, 6],
      [1, 3, 5]
    ]), Math.sqrt(3.5))
  })

  it('should return the standard deviation element from a 2d matrix', function () {
    assert.deepStrictEqual(std(new DenseMatrix([
      [2, 4, 6],
      [1, 3, 5]
    ])), Math.sqrt(3.5))
  })

  const inputMatrix = [ // this is a 4x3x2 matrix, full test coverage
    [[10, 200], [30, 40], [50, 60]],
    [[70, 80], [90, 100], [180, 120]],
    [[130, 140], [160, 150], [170, 110]],
    [[190, 20], [210, 220], [230, 240]]
  ]

  it('should return the standard deviation value along a dimension on a matrix', function () {
    assert.deepStrictEqual(std([
      [2, 6],
      [4, 10]], 1), [math.sqrt(8), math.sqrt(18)])
    assert.deepStrictEqual(std([
      [2, 6],
      [4, 10]], 0), [math.sqrt(2), math.sqrt(8)])
    assert.deepStrictEqual(std(inputMatrix, 0),
      [[math.sqrt(6000), math.sqrt(6000)], [math.sqrt(6225), math.sqrt(5825)], [math.sqrt(5825), math.sqrt(5825)]])
    assert.deepStrictEqual(std(inputMatrix, 1),
      [[math.sqrt(400), math.sqrt(7600)], [math.sqrt(3433.3333333333335), math.sqrt(400.0)], [math.sqrt(433.33333333333337), math.sqrt(433.33333333333337)], [math.sqrt(400.0), math.sqrt(14800)]])
    assert.deepStrictEqual(std(inputMatrix, 2),
      [[math.sqrt(18050), math.sqrt(50), math.sqrt(50)], [math.sqrt(50), math.sqrt(50), math.sqrt(1800)], [math.sqrt(50), math.sqrt(50), math.sqrt(1800)], [math.sqrt(14450), math.sqrt(50), math.sqrt(50)]])
  })

  it('should throw an error if called with invalid number of arguments', function () {
    assert.throws(function () { std() })
  })

  it('should throw an error if called with invalid type of arguments', function () {
    assert.throws(function () { std(new Date(), 2) }, /Cannot calculate std, unexpected type of argument/)
    assert.throws(function () { std(2, 3, null) }, /Cannot calculate std, unexpected type of argument/)
    assert.throws(function () { std([2, 3, null]) }, /Cannot calculate std, unexpected type of argument/)
    assert.throws(function () { std([[2, 4, 6], [1, 3, 5]], 'biased', 0) }, /Cannot convert "biased" to a number/)
    assert.throws(function () { std([[2, 4, 6], [1, 3, 5]], 0, new Date()) }, /Cannot calculate std, unexpected type of argument/)
  })

  it('should throw an error if called with an empty array', function () {
    assert.throws(function () { std([]) })
  })

  it('should LaTeX std', function () {
    const expression = math.parse('std(1,2,3)')
    assert.strictEqual(expression.toTex(), '\\mathrm{std}\\left(1,2,3\\right)')
  })

  it('should compute the standard deviation value of quantities with units', function () {
    const a = new Unit(2, 'cm')
    const b = new Unit(5, 'cm')
    const c = new Unit(8, 'cm')
    const res = math.unit(3, 'cm')
    approxEqual(std([a, b, c]).toNumber('cm'), res.toNumber('cm'))
  })

  it('should compute the standard deviation value of quantities with compatible units', function () {
    const a = math.unit(1, 'm')
    const b = math.unit(50, 'cm')
    const c = math.unit(math.sqrt(1250), 'cm')
    approxEqual(std([a, b]).toNumber('cm'), c.toNumber('cm'))
  })

  it('should not compute the standard deviation value of quantities with incompatible units', function () {
    const a = math.unit(1, 'm')
    const b = math.unit(50, 'kg')
    assert.throws(function () { std([a, b]) }, /Units do not match/)
  })
})
