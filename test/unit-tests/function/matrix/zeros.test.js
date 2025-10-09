// test zeros
import assert from 'assert'

import math from '../../../../src/defaultInstance.js'
const zeros = math.zeros
const matrix = math.matrix
const size = math.size

describe('zeros', function () {
  it('should create an empty matrix', function () {
    assert.deepStrictEqual(zeros(), matrix())
    assert.deepStrictEqual(zeros([]), [])
    assert.deepStrictEqual(zeros(matrix([])), matrix())
  })

  it('should create an empty matrix, sparse', function () {
    assert.deepStrictEqual(zeros('sparse'), matrix('sparse'))
    assert.deepStrictEqual(zeros([], 'sparse'), matrix([], 'sparse'))
    assert.deepStrictEqual(zeros(matrix([]), 'sparse'), matrix('sparse'))
  })

  it('should create a vector with zeros', function () {
    assert.deepStrictEqual(zeros(3), matrix([0, 0, 0]))
    assert.deepStrictEqual(zeros(matrix([4])), matrix([0, 0, 0, 0]))
    assert.deepStrictEqual(zeros([4]), [0, 0, 0, 0])
    assert.deepStrictEqual(zeros(0), matrix([]))
  })

  it('should create a matrix with bignumber zeros', function () {
    const zero = math.bignumber(0)
    const three = math.bignumber(3)
    assert.deepStrictEqual(zeros(three), matrix([zero, zero, zero]))
    assert.deepStrictEqual(zeros([three]), [zero, zero, zero])
  })

  it('should create a 2D matrix with zeros from an array', function () {
    assert.deepStrictEqual(zeros(2, 3), matrix([[0, 0, 0], [0, 0, 0]]))
    assert.deepStrictEqual(zeros(3, 2), matrix([[0, 0], [0, 0], [0, 0]]))
    assert.deepStrictEqual(zeros([3, 2]), [[0, 0], [0, 0], [0, 0]])
  })

  it('should create a matrix with zeros from a matrix', function () {
    assert.deepStrictEqual(zeros(matrix([3])), matrix([0, 0, 0]))
    assert.deepStrictEqual(zeros(matrix([3, 2])), matrix([[0, 0], [0, 0], [0, 0]]))
  })

  it('should create a 3D matrix with zeros', function () {
    const res = [
      [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ],
      [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ]
    ]

    assert.deepStrictEqual(zeros(2, 3, 4), matrix(res))
    assert.deepStrictEqual(zeros(matrix([2, 3, 4])), matrix(res))
    assert.deepStrictEqual(zeros([2, 3, 4]), res)
  })

  // TODO: test setting `matrix`

  it('should create a matrix with zeros with the same size as original matrix', function () {
    const a = matrix([[1, 2, 3], [4, 5, 6]])
    assert.deepStrictEqual(zeros(size(a)), [[0, 0, 0], [0, 0, 0]])
    assert.deepStrictEqual(zeros(matrix(size(a))), matrix([[0, 0, 0], [0, 0, 0]]))
    assert.deepStrictEqual(zeros(size(a), 'dense'), matrix([[0, 0, 0], [0, 0, 0]]))
  })

  // TODO: test with invalid input

  it('should LaTeX zeros', function () {
    const expression = math.parse('zeros(2,3)')
    assert.strictEqual(expression.toTex(), '\\mathrm{zeros}\\left(2,3\\right)')
  })
})
