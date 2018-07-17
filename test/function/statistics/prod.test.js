const assert = require('assert')
const math = require('../../../src/main')
const BigNumber = math.type.BigNumber
const Complex = math.type.Complex
const DenseMatrix = math.type.DenseMatrix
const prod = math.prod

describe('prod', function () {
  it('should return the product of numbers', function () {
    assert.equal(prod(5), 5)
    assert.equal(prod(3, 2), 6)
    assert.equal(prod(1, 3, 5, 2), 30)
    assert.equal(prod(1, 3, 0, 2), 0)
    assert.equal(prod(0, 0, 0, 0), 0)
  })

  it('should return the product of big numbers', function () {
    assert.deepEqual(prod(new BigNumber(1), new BigNumber(3), new BigNumber(5), new BigNumber(2)),
      new BigNumber(30))
  })

  it('should return the product of complex numbers', function () {
    assert.deepEqual(prod(new Complex(2, 3), new Complex(-1, 2)), new Complex(-8, 1))
  })

  it('should return the product of mixed numbers and complex numbers', function () {
    assert.deepEqual(prod(2, new Complex(2, 3)), new Complex(4, 6))
  })

  it('should return the prod from an array', function () {
    assert.equal(prod([1, 3, 5, 2]), 30)
  })

  it('should return the prod from an 1d matrix', function () {
    assert.equal(prod(new DenseMatrix([1, 3, 5, 2])), 30)
  })

  it('should return the prod element from a 2d array', function () {
    assert.deepEqual(prod([
      [1, 7, 2],
      [3, 5, 4]
    ]), 840)
  })

  it('should return the prod element from a 2d matrix', function () {
    assert.deepEqual(prod(new DenseMatrix([
      [1, 7, 2],
      [3, 5, 4]
    ])), 840)
  })

  it('should throw an error if called with invalid number of arguments', function () {
    assert.throws(function () { prod() })
  })

  it('should throw an error if called with not yet supported argument dim', function () {
    assert.throws(function () { prod([], 2) }, /not yet supported/)
  })

  it('should throw an error if called with an empty array', function () {
    assert.throws(function () { prod([]) })
  })

  it('should throw an error if called with invalid type of arguments', function () {
    assert.throws(function () { prod([[2, undefined, 4]]) }, /TypeError: Cannot calculate prod, unexpected type of argument/)
    assert.throws(function () { prod([[2, new Date(), 4]]) }, /TypeError: Cannot calculate prod, unexpected type of argument/)
    assert.throws(function () { prod([2, null, 4]) }, /TypeError: Cannot calculate prod, unexpected type of argument/)
  })

  it('should LaTeX prod', function () {
    const expression = math.parse('prod(1,2,3)')
    assert.equal(expression.toTex(), '\\mathrm{prod}\\left(1,2,3\\right)')
  })
})
