import assert from 'assert'
import math from '../../../../src/defaultInstance.js'

const cumsum = math.expression.transform.cumsum

describe('cumsum.transform', function () {
  it('should return the cumsum along a dimension on a matrix with one based indicies', function () {
    assert.deepStrictEqual(cumsum([[1, 2], [3, 4]]), [[1, 2], [4, 6]])
    assert.deepStrictEqual(cumsum([[1, 2], [3, 4]], 1), [[1, 2], [4, 6]])
    assert.deepStrictEqual(cumsum([[1, 2], [3, 4]], 2), [[1, 3], [3, 7]])

    assert.deepStrictEqual(cumsum(math.matrix([[1, 2], [3, 4]]), 2), math.matrix([[1, 3], [3, 7]]))
  })

  it('should use transform for evaluations', function () {
    assert.deepStrictEqual(math.evaluate('cumsum([[1, 2], [3, 4]], 1)'), math.matrix([[1, 2], [4, 6]]))
    assert.deepStrictEqual(math.evaluate('cumsum([[1, 2], [3, 4]], 2)'), math.matrix([[1, 3], [3, 7]]))
  })

  it('should LaTeX cumsum', function () {
    const expression = math.parse('cumsum(1,2,3)')
    assert.strictEqual(expression.toTex(), '\\mathrm{cumsum}\\left(1,2,3\\right)')
  })
})
