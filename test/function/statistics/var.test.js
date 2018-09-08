const assert = require('assert')
const math = require('../../../src/main')
const BigNumber = math.type.BigNumber
const Complex = math.type.Complex
const DenseMatrix = math.type.DenseMatrix
const Unit = math.type.Unit
const variance = math['var']

describe('variance', function () {
  it('should return the variance of numbers', function () {
    assert.strictEqual(variance(5), 0)
    assert.strictEqual(variance(2, 4, 6), 4)
  })

  it('should return the variance of big numbers', function () {
    assert.deepStrictEqual(variance(new BigNumber(2), new BigNumber(4), new BigNumber(6)),
      new math.type.BigNumber(4))
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

  it('should throw an error if called with invalid number of arguments', function () {
    assert.throws(function () { variance() })
  })

  it('should throw an error if called with invalid type of arguments', function () {
    assert.throws(function () { variance(new Date(), 2) }, /Cannot calculate var, unexpected type of argument/)
    assert.throws(function () { variance(new Unit(5, 'cm'), new Unit(10, 'cm')) }, /Cannot calculate var, unexpected type of argument/)
    assert.throws(function () { variance(2, 3, null) }, /Cannot calculate var, unexpected type of argument/)
    assert.throws(function () { variance([2, 3, null]) }, /Cannot calculate var, unexpected type of argument/)
    assert.throws(function () { variance([2, 3, 4], 5) }, /Unknown normalization "5"/)
  })

  it('should throw an error if called with an empty array', function () {
    assert.throws(function () { variance([]) })
  })

  it('should LaTeX var', function () {
    const expression = math.parse('var(1,2,3)')
    assert.strictEqual(expression.toTex(), '\\mathrm{Var}\\left(1,2,3\\right)')
  })
})
