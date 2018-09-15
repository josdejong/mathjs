const assert = require('assert')
const approx = require('../../../tools/approx')
const math = require('../../../src/main')
const BigNumber = math.type.BigNumber
const Complex = math.type.Complex
const DenseMatrix = math.type.DenseMatrix
const Unit = math.type.Unit
const std = math.std

describe('std', function () {
  it('should return the standard deviation of numbers', function () {
    assert.strictEqual(std(5), 0)
    assert.strictEqual(std(2, 4, 6), 2)
  })

  it('should return the standard deviation of big numbers', function () {
    assert.deepStrictEqual(std(new BigNumber(2), new BigNumber(4), new BigNumber(6)),
      new math.type.BigNumber(2))
  })

  it('should return the standard deviation of complex numbers', function () {
    //
    approx.deepEqual(std(new Complex(2, 4), new Complex(4, 2)), new Complex(1.41421, -1.41421))
  })

  it('should return the standard deviation of mixed numbers and complex numbers', function () {
    approx.deepEqual(std(2, new Complex(6, 4)), new Complex(2.82842, 2.82842))
  })

  it('should return the standard deviation from an array', function () {
    assert.strictEqual(std([2, 4, 6]), 2)
    assert.strictEqual(std([5]), 0)
  })

  it('should return the uncorrected variance from an array', function () {
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

  it('should throw an error if called with invalid number of arguments', function () {
    assert.throws(function () { std() })
  })

  it('should throw an error if called with invalid type of arguments', function () {
    assert.throws(function () { std(new Date(), 2) }, /Cannot calculate std, unexpected type of argument/)
    assert.throws(function () { std(new Unit(5, 'cm'), new Unit(10, 'cm')) }, /Cannot calculate std, unexpected type of argument/)
    assert.throws(function () { std(2, 3, null) }, /Cannot calculate std, unexpected type of argument/)
    assert.throws(function () { std([2, 3, null]) }, /Cannot calculate std, unexpected type of argument/)
    assert.throws(function () { std([2, 3, 4], 5) }, /Unknown normalization "5"/)
  })

  it('should throw an error if called with an empty array', function () {
    assert.throws(function () { std([]) })
  })

  it('should LaTeX std', function () {
    const expression = math.parse('std(1,2,3)')
    assert.strictEqual(expression.toTex(), '\\mathrm{std}\\left(1,2,3\\right)')
  })
})
