import assert from 'assert'
import math from '../../../../src/defaultInstance.js'

const BigNumber = math.BigNumber
const Complex = math.Complex
const DenseMatrix = math.DenseMatrix
const Unit = math.Unit
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
    assert.strictEqual(sum('2'), 2)
    assert.strictEqual(sum([['2', '3'], ['4', '5']]), 14)
  })

  // eslint-disable-next-line mocha/no-skipped-tests
  it.skip('should return the max of strings by their numerical value (with BigNumber config)', function () {
    // TODO: requires math.add to recon with config.number when parsing strings
    const bigmath = math.create({ number: 'BigNumber' })
    assert.deepStrictEqual(bigmath.sum('10', '3', '4', '2'), bigmath.bignumber('19'))
    assert.deepStrictEqual(bigmath.sum('10'), bigmath.bignumber(10))
  })

  // eslint-disable-next-line mocha/no-skipped-tests
  it.skip('should return the max of strings by their numerical value (with bigint config)', function () {
    // TODO: requires math.add to recon with config.number when parsing strings
    const bigmath = math.create({ number: 'bigint' })
    assert.strictEqual(bigmath.sum('10', '3', '4', '2'), 19n)
    assert.strictEqual(bigmath.sum('10'), 10n)
    assert.strictEqual(bigmath.sum('2.5'), 2.5) // fallback to number
    assert.strictEqual(bigmath.sum('2.5', '4'), 6.5) // fallback to number
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

  const inputMatrix = [ // this is a 4x3x2 matrix, full test coverage
    [[10, 20], [30, 40], [50, 60]],
    [[70, 80], [90, 100], [110, 120]],
    [[130, 140], [150, 160], [170, 180]],
    [[190, 200], [210, 220], [230, 240]]
  ]

  it('should return the sum value along a dimension of a matrix', function () {
    assert.deepStrictEqual(sum([
      [2, 6],
      [4, 10]], 1), [8, 14])
    assert.deepStrictEqual(sum([
      [2, 6],
      [4, 10]], 0), [6, 16])
    assert.deepStrictEqual(sum(inputMatrix, 0),
      [[400, 440], [480, 520], [560, 600]])
    assert.deepStrictEqual(sum(inputMatrix, 1),
      [[90, 120], [270, 300], [450, 480], [630, 660]])
    assert.deepStrictEqual(sum(inputMatrix, 2),
      [[30, 70, 110], [150, 190, 230], [270, 310, 350], [390, 430, 470]])
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
    assert.strictEqual(math.equal(fracMath.sum([]), new fracMath.Fraction(0)), true)
  })

  it('should throw an error if called with invalid type of arguments', function () {
    assert.throws(function () { sum(new Date(), 2) }, /Cannot calculate sum, unexpected type of argument/)
    assert.throws(function () { sum(2, 3, null) }, /Cannot calculate sum, unexpected type of argument/)
    assert.throws(function () { sum([2, 3, null]) }, /Cannot calculate sum, unexpected type of argument/)
    assert.throws(function () { sum('a', 'b') }, /Error: Cannot convert "a" to a number/)
    assert.throws(function () { sum('a') }, /SyntaxError: String "a" is not a valid number/)
  })

  it('should LaTeX sum', function () {
    const expression = math.parse('sum(1,2,3)')
    assert.strictEqual(expression.toTex(), '\\mathrm{sum}\\left(1,2,3\\right)')
  })
})
