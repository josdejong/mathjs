const assert = require('assert')
const approx = require('../../../tools/approx')
const math = require('../../../src/main')
const BigNumber = math.type.BigNumber
const Complex = math.type.Complex
const DenseMatrix = math.type.DenseMatrix
const Unit = math.type.Unit
const median = math.median

describe('median', function () {
  it('should return the median of an even number of numbers', function () {
    assert.equal(median(3, 1), 2)
    assert.equal(median(1, 3), 2)
    approx.equal(median(1, 3, 5, 2), 2.5)
    assert.equal(median(0, 0, 0, 0), 0)
  })

  it('should return the median of an odd number of numbers', function () {
    assert.equal(median(0), 0)
    assert.equal(median(5), 5)
    approx.equal(median(1, 3, 5, 2, -1), 2)
    assert.equal(median(0, 0, 0), 0)
  })

  it('should return the median of an even number of new BigNumbers', function () {
    assert.deepEqual(median(new BigNumber(1), new BigNumber(4), new BigNumber(5), new BigNumber(2)),
      new BigNumber(3))
  })

  it('should return the median of an odd number of new BigNumbers', function () {
    assert.deepEqual(median(new BigNumber(1), new BigNumber(4), new BigNumber(2)),
      new BigNumber(2))
  })

  it('should return the median of an even number of booleans', function () {
    assert.strictEqual(median(true, true, false, false), 0.5)
  })

  it('should return the median of an odd number of booleans', function () {
    assert.strictEqual(median(true, true, false), 1)
  })

  it('should return the median from an array', function () {
    assert.equal(median([1, 3, 5, 2, -5]), 2)
  })

  it('should return the median of units', function () {
    assert.deepEqual(median([new Unit(5, 'mm'), new Unit(15, 'mm'), new Unit(10, 'mm')]), new Unit(10, 'mm'))
    assert.deepEqual(median([new Unit(5, 'mm'), new Unit(30, 'mm'), new Unit(20, 'mm'), new Unit(10, 'mm')]), new Unit(15, 'mm'))
  })

  it('should return the median from an 1d matrix', function () {
    assert.equal(median(new DenseMatrix([1, 3, 5, 2, -5])), 2)
  })

  it('should return the median from a 2d array', function () {
    approx.equal(median([
      [1, 4, 7],
      [3, 0, 5]
    ]), 3.5)
  })

  it('should return the median from a 2d matrix', function () {
    approx.equal(median(new DenseMatrix([
      [1, 4, 7],
      [3, 0, 5]
    ])), 3.5)
  })

  it('should throw an error if called with invalid number of arguments', function () {
    assert.throws(function () { median() })
    assert.throws(function () { median([], 2, 3) })
  })

  it('should throw an error when called multiple arrays or matrices', function () {
    assert.throws(function () { median([1, 2], [3, 4]) }, /Scalar values expected/)
    assert.throws(function () { median(math.matrix([1, 2]), math.matrix([3, 4])) }, /Scalar values expected/)
  })

  it('should throw an error if called with not yet supported argument dim', function () {
    assert.throws(function () { median([], 2) }, /not yet supported/)
  })

  it('should throw an error if called with invalid type of arguments', function () {
    assert.throws(function () { median(2, new Complex(2, 5)) }, /TypeError: Cannot calculate median, no ordering relation is defined for complex numbers/)
    assert.throws(function () { median(new Complex(2, 3), new Complex(2, 1)) }, /TypeError: Cannot calculate median, no ordering relation is defined for complex numbers/)

    assert.throws(function () { median([[2, undefined, 4]]) }, /TypeError: Cannot calculate median, unexpected type of argument/)
    assert.throws(function () { median([[2, new Date(), 4]]) }, /TypeError: Cannot calculate median, unexpected type of argument/)
    assert.throws(function () { median([2, null, 4]) }, /TypeError: Cannot calculate median, unexpected type of argument/)
  })

  it('should throw an error if called with an empty array', function () {
    assert.throws(function () { median([]) })
  })

  it('should not mutate the input', function () {
    const a = [3, 2, 1]
    const b = median(a)
    assert.deepEqual(a, [3, 2, 1])
    assert.deepEqual(b, 2)
  })

  it('should LaTeX median', function () {
    const expression = math.parse('median(1,2,3,4)')
    assert.equal(expression.toTex(), '\\mathrm{median}\\left(1,2,3,4\\right)')
  })
})
