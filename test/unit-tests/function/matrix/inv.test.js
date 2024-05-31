// test inv
import assert from 'assert'

import { approxDeepEqual } from '../../../../tools/approx.js'
import math from '../../../../src/defaultInstance.js'
const inv = math.inv

describe('inv', function () {
  it('should return the inverse of a number', function () {
    assert.deepStrictEqual(inv(4), 1 / 4)
    assert.deepStrictEqual(inv(math.bignumber(4)), math.bignumber(1 / 4))
  })

  it('should return the inverse of a matrix with just one value', function () {
    assert.deepStrictEqual(inv([4]), [1 / 4])
    assert.deepStrictEqual(inv([[4]]), [[1 / 4]])
  })

  it('should return the inverse for each element in an array', function () {
    assert.deepStrictEqual(inv([4]), [1 / 4])
    assert.deepStrictEqual(inv([[4]]), [[1 / 4]])

    approxDeepEqual(inv([
      [1, 4, 7],
      [3, 0, 5],
      [-1, 9, 11]
    ]), [
      [5.625, -2.375, -2.5],
      [4.75, -2.25, -2],
      [-3.375, 1.625, 1.5]
    ])

    approxDeepEqual(inv([
      [2, -1, 0],
      [-1, 2, -1],
      [0, -1, 2]
    ]), [
      [3 / 4, 1 / 2, 1 / 4],
      [1 / 2, 1, 1 / 2],
      [1 / 4, 1 / 2, 3 / 4]
    ])

    // the following will force swapping of empty rows in the middle of the matrix
    approxDeepEqual(inv([
      [1, 0, 0],
      [0, 0, 1],
      [0, 1, 0]
    ]), [
      [1, 0, 0],
      [0, 0, 1],
      [0, 1, 0]
    ])

    approxDeepEqual(inv([
      [1, 0, 0],
      [0, -1, 1],
      [0, 0, 1]
    ]), [
      [1, 0, 0],
      [0, -1, 1],
      [0, 0, 1]
    ])
  })

  it('should return the inverse for each element in a matrix', function () {
    assert.deepStrictEqual(inv(math.matrix([4])), math.matrix([1 / 4]))
    assert.deepStrictEqual(inv(math.matrix([[4]])), math.matrix([[1 / 4]]))
    assert.deepStrictEqual(inv(math.matrix([[4]], 'sparse')), math.matrix([[1 / 4]], 'sparse'))
    assert.deepStrictEqual(inv(math.matrix([[1, 2], [3, 4]], 'sparse')), math.matrix([[-2, 1], [1.5, -0.5]], 'sparse'))
  })

  it('should throw an error in case of non-square matrices', function () {
    assert.throws(function () { inv([1, 2, 3]) }, /Matrix must be square/)
    assert.throws(function () { inv([[1, 2, 3], [4, 5, 6]]) }, /Matrix must be square/)
  })

  it('should throw an error in case of multi dimensional matrices', function () {
    assert.throws(function () { inv([[[1, 2, 3], [4, 5, 6]]]) }, /Matrix must be two dimensional/)
  })

  it('should throw an error in case of non-invertable matrices', function () {
    assert.throws(function () { inv([[0]]) }, /Cannot calculate inverse, determinant is zero/)
    assert.throws(function () { inv([[1, 0], [0, 0]]) }, /Cannot calculate inverse, determinant is zero/)
    assert.throws(function () { inv([[1, 1, 1], [1, 0, 0], [0, 0, 0]]) }, /Cannot calculate inverse, determinant is zero/)
  })

  it('should throw an error in case of wrong number of arguments', function () {
    assert.throws(function () { inv() }, /TypeError: Too few arguments/)
    assert.throws(function () { inv([], []) }, /TypeError: Too many arguments/)
  })

  it('should throw an error in case of invalid type of arguments', function () {
    assert.throws(function () { math.concat(inv(new Date())) }, /TypeError: Unexpected type of argument/)
  })

  it('should avoid issues with elements that are almost zero', function () {
    approxDeepEqual(inv([
      [0, 1, 0, 788],
      [-1, 0, 0, 692],
      [0, 0, 1, 0],
      [0, 0, 0, 1]
    ]), [
      [0, -1, 0, 692],
      [1, 0, 0, -788],
      [0, 0, 1, 0],
      [0, 0, 0, 1]
    ])

    approxDeepEqual(inv([
      [6.123233995736766e-17, 1, 0, 788],
      [-1, 6.123233995736766e-17, 0, 692],
      [0, 0, 1, 0],
      [0, 0, 0, 1]
    ]), [
      [6.123233995736766e-17, -1, 0, 692],
      [1, 6.123233995736766e-17, 0, -788],
      [0, 0, 1, 0],
      [0, 0, 0, 1]
    ])
  })

  it('should  LaTeX inv', function () {
    const expression = math.parse('inv([[1,2],[3,4]])')
    assert.strictEqual(expression.toTex(), '\\left(\\begin{bmatrix}1&2\\\\3&4\\end{bmatrix}\\right)^{-1}')
  })
})
