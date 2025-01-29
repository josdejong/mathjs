import assert from 'assert'
import { approxEqual } from '../../../../tools/approx.js'
import math from '../../../../src/defaultInstance.js'

const Unit = math.Unit
const std = math.expression.transform.std

describe('std.transform', function () {
  const inputMatrix = [ // this is a 4x3x2 matrix, full test coverage
    [[10, 200], [30, 40], [50, 60]],
    [[70, 80], [90, 100], [180, 120]],
    [[130, 140], [160, 150], [170, 110]],
    [[190, 20], [210, 220], [230, 240]]
  ]

  it('should return the standard deviation value along a dimension on a matrix with one based indicies', function () {
    assert.deepStrictEqual(std([
      [2, 6],
      [4, 10]], 2), [math.sqrt(8), math.sqrt(18)])
    assert.deepStrictEqual(std([
      [2, 6],
      [4, 10]], 1), [math.sqrt(2), math.sqrt(8)])
    assert.deepStrictEqual(std(inputMatrix, 1),
      [[math.sqrt(6000), math.sqrt(6000)], [math.sqrt(6225), math.sqrt(5825)], [math.sqrt(5825), math.sqrt(5825)]])
    assert.deepStrictEqual(std(inputMatrix, 2),
      [[math.sqrt(400), math.sqrt(7600)], [math.sqrt(3433.3333333333335), math.sqrt(400.0)], [math.sqrt(433.33333333333337), math.sqrt(433.33333333333337)], [math.sqrt(400.0), math.sqrt(14800)]])
    assert.deepStrictEqual(std(inputMatrix, 3),
      [[math.sqrt(18050), math.sqrt(50), math.sqrt(50)], [math.sqrt(50), math.sqrt(50), math.sqrt(1800)], [math.sqrt(50), math.sqrt(50), math.sqrt(1800)], [math.sqrt(14450), math.sqrt(50), math.sqrt(50)]])
  })

  it('should throw an error if called with an invalid one based index', function () {
    assert.throws(function () { std(inputMatrix, 0) }, /Index out of range/)
    assert.throws(function () { std(inputMatrix, 4) }, /Index out of range/)
  })

  it('should throw an error if called with invalid type of arguments', function () {
    assert.throws(function () { std(new Date(), 2) }, /Cannot calculate std, unexpected type of argument/)
    assert.throws(function () { std(2, 3, null) }, /Cannot calculate std, unexpected type of argument/)
    assert.throws(function () { std([2, 3, null]) }, /Cannot calculate std, unexpected type of argument/)
    assert.throws(function () { std([[2, 4, 6], [1, 3, 5]], 'biased', 0) }, /Cannot convert "biased" to a number/)
    assert.throws(function () { std([[2, 4, 6], [1, 3, 5]], 1, new Date()) }, /Cannot calculate std, unexpected type of argument/)
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
