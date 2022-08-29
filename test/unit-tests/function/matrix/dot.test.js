import assert from 'assert'
import math from '../../../../src/defaultInstance.js'

const dot = math.dot
const matrix = math.matrix
const sparse = math.sparse
const complex = math.complex

describe('dot', function () {
  it('should calculate dot product for two 1-dim arrays', function () {
    assert.strictEqual(dot([2, 4, 1], [2, 2, 3]), 15)
    assert.strictEqual(dot([7, 3], [2, 4]), 26)
  })

  it('should calculate dot product for two column arrays', function () {
    assert.strictEqual(dot([[2], [4], [1]], [[2], [2], [3]]), 15)
    assert.strictEqual(dot([[7], [3]], [[2], [4]]), 26)
  })

  it('should calculate dot product for two 1-dim vectors', function () {
    assert.strictEqual(dot(matrix([2, 4, 1]), matrix([2, 2, 3])), 15)
    assert.strictEqual(dot(matrix([7, 3]), matrix([2, 4])), 26)
  })

  it('should calculate dot product for two column vectors', function () {
    assert.strictEqual(dot(matrix([[2], [4], [1]]), matrix([[2], [2], [3]])), 15)
    assert.strictEqual(dot(matrix([[7], [3]]), matrix([[2], [4]])), 26)
  })

  it('should calculate dot product for mixed 1-dim arrays and column arrays', function () {
    assert.strictEqual(dot([2, 4, 1], [[2], [2], [3]]), 15)
    assert.strictEqual(dot([[7], [3]], [2, 4]), 26)
  })

  it('should calculate dot product for mixed 1-dim arrays and 1-dim vectors', function () {
    assert.strictEqual(dot([2, 4, 1], matrix([2, 2, 3])), 15)
    assert.strictEqual(dot(matrix([7, 3]), [2, 4]), 26)
  })

  it('should calculate dot product for mixed 1-dim arrays and column vectors', function () {
    assert.strictEqual(dot([2, 4, 1], matrix([[2], [2], [3]])), 15)
    assert.strictEqual(dot(matrix([[7], [3]]), [2, 4]), 26)
  })

  it('should calculate dot product for mixed column arrays and 1-dim vectors', function () {
    assert.strictEqual(dot([[2], [4], [1]], matrix([2, 2, 3])), 15)
    assert.strictEqual(dot(matrix([7, 3]), [[2], [4]]), 26)
  })

  it('should calculate dot product for mixed column arrays and column vectors', function () {
    assert.strictEqual(dot([[2], [4], [1]], matrix([[2], [2], [3]])), 15)
    assert.strictEqual(dot(matrix([[7], [3]]), [[2], [4]]), 26)
  })

  it('should calculate dot product for mixed 1-dim vectors and column vectors', function () {
    assert.strictEqual(dot(matrix([2, 4, 1]), matrix([[2], [2], [3]])), 15)
    assert.strictEqual(dot(matrix([[7], [3]]), matrix([2, 4])), 26)
  })

  it('should calculate dot product for sparse vectors', function () {
    assert.strictEqual(dot(sparse([0, 0, 2, 4, 4, 1]), sparse([1, 0, 2, 2, 0, 3])), 15)
    assert.strictEqual(dot(sparse([7, 1, 2, 3]), sparse([2, 0, 0, 4])), 26)
  })

  it('should throw an error for unsupported types of arguments', function () {
    assert.throws(function () { dot([2, 4, 1], 2) }, TypeError)
  })

  it('should throw an error for multi dimensional matrix input', function () {
    assert.throws(function () { dot([[1, 2], [3, 4]], [[1, 2], [3, 4]]) }, /Expected a column vector, instead got a matrix of size \(2, 2\)/)
  })

  it('should throw an error in case of vectors with unequal length', function () {
    assert.throws(function () { dot([2, 3], [1, 2, 3]) }, /Vectors must have equal length \(2 != 3\)/)
  })

  it('should throw an error in case of empty vectors', function () {
    assert.throws(function () { dot([], []) }, /Cannot calculate the dot product of empty vectors/)
  })

  it('should LaTeX dot', function () {
    const expression = math.parse('dot([1,2],[3,4])')
    assert.strictEqual(expression.toTex(), '\\left(\\begin{bmatrix}1\\\\2\\end{bmatrix}\\cdot\\begin{bmatrix}3\\\\4\\end{bmatrix}\\right)')
  })

  it('should be antilinear in the first argument', function () {
    const I = complex(0, 1)
    assert.deepStrictEqual(dot([I, 2], [1, I]), I)

    const v = matrix([2, I, 1])
    assert.deepStrictEqual(dot(v, v).sqrt(), complex(math.norm(v)))
  })
})
