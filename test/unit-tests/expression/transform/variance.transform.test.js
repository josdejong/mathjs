import assert from 'assert'
import { approxEqual } from '../../../../tools/approx.js'
import math from '../../../../src/defaultInstance.js'

const variance = math.expression.transform.variance

describe('variance.transform', function () {
  const inputMatrix = [ // this is a 4x3x2 matrix, full test coverage
    [[10, 200], [30, 40], [50, 60]],
    [[70, 80], [90, 100], [180, 120]],
    [[130, 140], [160, 150], [170, 110]],
    [[190, 20], [210, 220], [230, 240]]
  ]

  it('should return the variance value along a dimension on a matrix with one based indicies', function () {
    assert.deepStrictEqual(variance([
      [2, 6],
      [4, 10]], 2), [8, 18])
    assert.deepStrictEqual(variance([
      [2, 6],
      [4, 10]], 1), [2, 8])
    assert.deepStrictEqual(variance(inputMatrix, 1),
      [[6000, 6000], [6225, 5825], [5825, 5825]])
    assert.deepStrictEqual(variance(inputMatrix, 2),
      [[400, 7600], [3433.3333333333335, 400], [433.33333333333337, 433.33333333333337], [400, 14800]])
    assert.deepStrictEqual(variance(inputMatrix, 3),
      [[18050, 50, 50], [50, 50, 1800], [50, 50, 1800], [14450, 50, 50]])
  })

  it('should throw an error if called with an invalid one based index', function () {
    assert.throws(function () { variance(inputMatrix, 0) }, /Index out of range/)
    assert.throws(function () { variance(inputMatrix, 4) }, /Index out of range/)
  })

  it('should throw an error if called with invalid type of arguments', function () {
    assert.throws(function () { variance(new Date(), 2) }, /Cannot calculate variance, unexpected type of argument/)
    assert.throws(function () { variance(2, 3, null) }, /Cannot calculate variance, unexpected type of argument/)
    assert.throws(function () { variance([2, 3, null]) }, /Cannot calculate variance, unexpected type of argument/)
    assert.throws(function () { variance([[2, 4, 6], [1, 3, 5]], 'biased', 0) }, /Cannot convert "biased" to a number/)
    assert.throws(function () { variance([[2, 4, 6], [1, 3, 5]], 0, new Date()) }, /Cannot calculate variance, unexpected type of argument/)
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
