const assert = require('assert')
const math = require('../../../src/main')
const BigNumber = math.type.BigNumber
const Complex = math.type.Complex
const DenseMatrix = math.type.DenseMatrix
const Unit = math.type.Unit
const sum = math.sum

describe('sum', function () {
  it('should return the sum of numbers', function () {
    assert.strictEqual(sum(5), 5)
    assert.strictEqual(sum(3, 1), 4)
    assert.strictEqual(sum(1, 3), 4)
    assert.strictEqual(sum(1, 3, 5, 2), 11)
    assert.strictEqual(sum(0, 0, 0, 0), 0)
  })

  it('should return the sum of big numbers', function () {
    assert.deepStrictEqual(sum(new BigNumber(1), new BigNumber(3), new BigNumber(5), new BigNumber(2)),
      new BigNumber(11))
  })

  it('should return the sum of strings (convert them to numbers)', function () {
    assert.strictEqual(sum('2', '3', '4', '5'), 14)
    assert.strictEqual(sum([['2', '3'], ['4', '5']]), 14)
  })

  it('should return the sum of complex numbers', function () {
    assert.deepStrictEqual(sum(new Complex(2, 3), new Complex(-1, 2)), new Complex(1, 5))
  })

  it('should return the sum of mixed numbers and complex numbers', function () {
    assert.deepStrictEqual(sum(2, new Complex(-1, 3)), new Complex(1, 3))
  })

  it('should return the sum from an array', function () {
    assert.strictEqual(sum([1, 3, 5, 2, -5]), 6)
  })

  it('should return the sum of units', function () {
    assert.deepStrictEqual(sum([new Unit(5, 'mm'), new Unit(10, 'mm'), new Unit(15, 'mm')]), new Unit(30, 'mm'))
  })

  it('should return the sum from an 1d matrix', function () {
    assert.strictEqual(sum(new DenseMatrix([1, 3, 5, 2, -5])), 6)
  })

  it('should return the sum element from a 2d array', function () {
    assert.deepStrictEqual(sum([
      [1, 4, 7],
      [3, 0, 5],
      [-1, 11, 9]
    ]), 39)
  })

  it('should return the sum element from a 2d matrix', function () {
    assert.deepStrictEqual(sum(new DenseMatrix([
      [1, 4, 7],
      [3, 0, 5],
      [-1, 11, 9]
    ])), 39)
  })

  it('should return NaN if any of the inputs contains NaN', function () {
    assert(isNaN(sum([NaN])))
    assert(isNaN(sum([1, NaN])))
    assert(isNaN(sum([NaN, 1])))
    assert(isNaN(sum([1, 3, NaN])))
    assert(isNaN(sum([NaN, NaN, NaN])))
    assert(isNaN(sum(NaN, NaN, NaN)))
  })

  it('should throw an error if called with invalid number of arguments', function () {
    assert.throws(function () { sum() })
  })

  it('should throw an error if called with not yet supported argument dim', function () {
    assert.throws(function () { sum([], 2) }, /not yet supported/)
  })

  it('should return zero if called with an empty array', function () {
    const bigMath = math.create({ number: 'BigNumber' })
    const fracMath = math.create({ number: 'Fraction' })

    const big = bigMath.sum([])
    const frac = fracMath.sum([])

    assert.strictEqual(sum([]), 0)
    assert.strictEqual(big.type, 'BigNumber')
    assert.strictEqual(frac.type, 'Fraction')
    assert.strictEqual(math.equal(bigMath.sum([]), new BigNumber(0)).valueOf(), true)
    assert.strictEqual(math.equal(fracMath.sum([]), new fracMath.type.Fraction(0)), true)
  })

  it('should throw an error if called with invalid type of arguments', function () {
    assert.throws(function () { sum(new Date(), 2) }, /Cannot calculate sum, unexpected type of argument/)
    assert.throws(function () { sum(2, 3, null) }, /Cannot calculate sum, unexpected type of argument/)
    assert.throws(function () { sum([2, 3, null]) }, /Cannot calculate sum, unexpected type of argument/)
  })

  it('should LaTeX sum', function () {
    const expression = math.parse('sum(1,2,3)')
    assert.strictEqual(expression.toTex(), '\\mathrm{sum}\\left(1,2,3\\right)')
  })
})
