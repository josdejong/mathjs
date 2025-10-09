// test ones
import assert from 'assert'

import math from '../../../../src/defaultInstance.js'
const ones = math.ones
const matrix = math.matrix
const size = math.size

describe('ones', function () {
  it('should create an empty matrix', function () {
    assert.deepStrictEqual(ones(), matrix())
    assert.deepStrictEqual(ones([]), [])
    assert.deepStrictEqual(ones(matrix([])), matrix())
  })

  it('should create an empty matrix, sparse', function () {
    assert.deepStrictEqual(ones('sparse'), matrix('sparse'))
    assert.deepStrictEqual(ones([], 'sparse'), matrix([], 'sparse'))
    assert.deepStrictEqual(ones(matrix([]), 'sparse'), matrix('sparse'))
  })

  it('should create a vector with ones', function () {
    assert.deepStrictEqual(ones(3), matrix([1, 1, 1]))
    assert.deepStrictEqual(ones(matrix([4])), matrix([1, 1, 1, 1]))
    assert.deepStrictEqual(ones([4]), [1, 1, 1, 1])
    assert.deepStrictEqual(ones(0), matrix([]))
  })

  it('should create a 2D matrix with ones', function () {
    assert.deepStrictEqual(ones(2, 3), matrix([[1, 1, 1], [1, 1, 1]]))
    assert.deepStrictEqual(ones(3, 2), matrix([[1, 1], [1, 1], [1, 1]]))
    assert.deepStrictEqual(ones([3, 2]), [[1, 1], [1, 1], [1, 1]])
  })

  it('should create a matrix with ones from a matrix', function () {
    assert.deepStrictEqual(ones(matrix([3])), matrix([1, 1, 1]))
    assert.deepStrictEqual(ones(matrix([3, 2])), matrix([[1, 1], [1, 1], [1, 1]]))
  })

  it('should create a matrix with bignumber ones', function () {
    const one = math.bignumber(1)
    const three = math.bignumber(3)
    assert.deepStrictEqual(ones(three), matrix([one, one, one]))
    assert.deepStrictEqual(ones([three]), [one, one, one])
  })

  it('should create a 3D matrix with ones', function () {
    const res = [
      [
        [1, 1, 1, 1],
        [1, 1, 1, 1],
        [1, 1, 1, 1]
      ],
      [
        [1, 1, 1, 1],
        [1, 1, 1, 1],
        [1, 1, 1, 1]
      ]
    ]
    assert.deepStrictEqual(ones(2, 3, 4), matrix(res))
    assert.deepStrictEqual(ones(matrix([2, 3, 4])), matrix(res))
    assert.deepStrictEqual(ones([2, 3, 4]), res)
  })

  // TODO: test setting `matrix`

  it('should create a matrix with ones with the same size as original matrix', function () {
    const a = matrix([[1, 2, 3], [4, 5, 6]])
    assert.deepStrictEqual(ones(size(a)), [[1, 1, 1], [1, 1, 1]])
    assert.deepStrictEqual(ones(matrix(size(a))), matrix([[1, 1, 1], [1, 1, 1]]))
    assert.deepStrictEqual(ones(size(a), 'dense'), matrix([[1, 1, 1], [1, 1, 1]]))
  })

  // TODO: test with invalid inputs

  it('should LaTeX ones', function () {
    const expression = math.parse('ones(2)')
    assert.strictEqual(expression.toTex(), '\\mathrm{ones}\\left(2\\right)')
  })
})
