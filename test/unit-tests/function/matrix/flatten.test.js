import assert from 'assert'
import math from '../../../../src/defaultInstance.js'
const matrix = math.matrix
const flatten = math.flatten
const sparse = math.sparse

describe('flatten', function () {
  it('should flatten an empty array', function () {
    assert.deepStrictEqual(flatten([]), [])
  })

  it('should not clone the flattened array', function () {
    const c = math.complex()
    const flat = flatten([c])
    assert.deepStrictEqual(flat, [c])
    assert(c === flat[0])
  })

  it('should flatten a 1 dimensional array', function () {
    assert.deepStrictEqual(flatten([1, 2, 3]), [1, 2, 3])
  })

  it('should flatten a 2 dimensional array', function () {
    assert.deepStrictEqual(flatten([[1, 2], [3, 4]]), [1, 2, 3, 4])
  })

  it('should flatten a 3 dimensional array', function () {
    assert.deepStrictEqual(flatten([[[1, 2], [3, 4]], [[5, 6], [7, 8]]]), [1, 2, 3, 4, 5, 6, 7, 8])
  })

  it('should flatten a 1 dimensional matrix', function () {
    assert.deepStrictEqual(flatten(matrix([1, 2, 3])), matrix([1, 2, 3]))
  })

  it('should flatten a 2 dimensional matrix', function () {
    assert.deepStrictEqual(flatten(matrix([[1, 2], [3, 4]])), matrix([1, 2, 3, 4]))
  })

  it('should flatten a 3 dimensional matrix', function () {
    assert.deepStrictEqual(flatten(matrix([[[1, 2], [3, 4]], [[5, 6], [7, 8]]])), matrix([1, 2, 3, 4, 5, 6, 7, 8]))
  })

  it('should throw an error in case of SparseMatrix input', function () {
    assert.throws(function () { flatten(sparse([1, 2])) }, /TypeError: SparseMatrix is not supported/)
  })

  it('should throw an error on invalid arguments', function () {
    assert.throws(function () { flatten() }, /TypeError: Too few arguments/)
    assert.throws(function () { flatten([], 2) }, /TypeError: Too many arguments/)
    assert.throws(function () { flatten('str') }, /TypeError: Unexpected type of argument/)
  })

  it('should LaTeX flatten', function () {
    const expression = math.parse('flatten([[1,2],[3,4]])')
    assert.strictEqual(expression.toTex(), '\\mathrm{flatten}\\left(\\begin{bmatrix}1&2\\\\3&4\\end{bmatrix}\\right)')
  })
})
