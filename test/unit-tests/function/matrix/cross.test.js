import assert from 'assert'
import math from '../../../../src/defaultInstance.js'

describe('cross', function () {
  it('should calculate cross product for two arrays', function () {
    assert.deepStrictEqual(math.cross([1, 1, 0], [0, 1, 1]), [1, -1, 1])
    assert.deepStrictEqual(math.cross([3, -3, 1], [4, 9, 2]), [-15, -2, 39])
    assert.deepStrictEqual(math.cross([2, 3, 4], [5, 6, 7]), [-3, 6, -3])
  })

  it('should calculate cross product for two matrices', function () {
    assert.deepStrictEqual(math.cross(math.matrix([1, 1, 0]), math.matrix([0, 1, 1])),
      math.matrix([1, -1, 1]))
  })

  it('should calculate cross product for mixed arrays and matrices', function () {
    assert.deepStrictEqual(math.cross([1, 1, 0], math.matrix([0, 1, 1])),
      math.matrix([1, -1, 1]))
    assert.deepStrictEqual(math.cross(math.matrix([1, 1, 0]), [0, 1, 1]),
      math.matrix([1, -1, 1]))
  })

  it('should calculate cross product for n-d arrays and matrices', function () {
    assert.deepStrictEqual(math.cross([[1, 2, 3]], [[4, 5, 6]]), [[-3, 6, -3]])
    assert.deepStrictEqual(math.cross([[1], [2], [3]], [4, 5, 6]), [[-3, 6, -3]])
    assert.deepStrictEqual(math.cross([[[[1, 2, 3]]]], [[4, 5, 6]]), [[-3, 6, -3]])
  })

  it('should throw an error for unsupported types of arguments', function () {
    assert.throws(function () { math.cross([2, 4, 1], 2) }, TypeError)
  })

  it('should throw an error for multi dimensional matrix input', function () {
    assert.throws(function () { math.cross([[1, 2], [3, 4]], [[1, 2], [3, 4]]) }, /Vectors with length 3 expected/)
  })

  it('should throw an error in case of vectors with unequal length', function () {
    assert.throws(function () { math.cross([2, 3], [1, 2, 3]) }, /Vectors with length 3 expected/)
  })

  it('should throw an error in case of empty vectors', function () {
    assert.throws(function () { math.cross([], []) }, /Vectors with length 3 expected/)
  })

  it('should LaTeX cross', function () {
    const expression = math.parse('cross([1],[2])')
    assert.strictEqual(expression.toTex(), '\\left(\\begin{bmatrix}1\\end{bmatrix}\\right)\\times\\left(\\begin{bmatrix}2\\end{bmatrix}\\right)')
  })
})
