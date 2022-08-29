// test zeros
import assert from 'assert'

import math from '../../../../src/defaultInstance.js'
const matrix = math.matrix

describe('matrixFrom...', function () {
  it('...Function', function () {
    let expected, actual

    // an antisymmetric matrix (array)
    expected = [[0, -1, -2], [1, 0, -1], [2, 1, 0]]
    actual = math.matrixFromFunction([3, 3], i => i[0] - i[1])
    assert.deepStrictEqual(actual, expected)

    // an antisymmetric matrix (an actual Matrix)
    expected = matrix([[0, -1, -2], [1, 0, -1], [2, 1, 0]])
    actual = math.matrixFromFunction(matrix([3, 3]), i => i[0] - i[1])
    assert.deepStrictEqual(actual, expected)

    // a sparse subdiagonal matrix
    expected = matrix([[0, 0, 0, 0, 0], [4, 0, 0, 0, 0], [0, 4, 0, 0, 0], [0, 0, 4, 0, 0], [0, 0, 0, 4, 0]], 'sparse')
    actual = math.matrixFromFunction([5, 5], 'sparse', i => i[0] - i[1] === 1 ? 4 : 0)
    assert.deepStrictEqual(actual, expected)

    // a random vector
    actual = math.matrixFromFunction([5], 'dense', i => math.random())
    assert.deepStrictEqual(actual.size(), [5])
    let counter = 0
    for (const { value } of actual) {
      assert.ok(value >= 0)
      assert.ok(value <= 1)
      counter++
    }
    assert.strictEqual(counter, 5)

    // TODO test all overloads
    // TODO test datatype
  })

  it('...Rows', function () {
    const expected = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
    let actual

    // from simple arrays
    actual = math.matrixFromRows([1, 2, 3], [4, 5, 6], [7, 8, 9])
    assert.deepStrictEqual(actual, expected)

    // from multi-dimensional arrays
    actual = math.matrixFromRows([1, 2, 3], [[4], [5], [6]], [[7, 8, 9]])
    assert.deepStrictEqual(actual, expected)

    // from one-dimensional vectors
    actual = math.matrixFromRows(matrix([1, 2, 3]), matrix([4, 5, 6]), matrix([7, 8, 9]))
    assert.deepStrictEqual(actual, matrix(expected))

    // from multi-dimensional vectors
    actual = math.matrixFromRows(matrix([1, 2, 3]), matrix([[4], [5], [6]]), matrix([[7, 8, 9]]))
    assert.deepStrictEqual(actual, matrix(expected))

    // from sparse vectors
    actual = math.matrixFromRows(matrix([[1, 2, 3]], 'sparse'), matrix([[4], [5], [6]], 'sparse'), matrix([[7, 8, 9]], 'sparse'))
    assert.deepStrictEqual(actual, matrix(expected))

    // for a mixed type, returns an array
    actual = math.matrixFromRows([1, 2, 3], [4, 5, 6], matrix([7, 8, 9]))
    assert.deepStrictEqual(actual, expected)
  })

  it('...Columns', function () {
    const expected = [[1, 4, 7], [2, 5, 8], [3, 6, 9]]
    let actual

    // from simple arrays
    actual = math.matrixFromColumns([1, 2, 3], [4, 5, 6], [7, 8, 9])
    assert.deepStrictEqual(actual, expected)

    // from multi-dimensional arrays
    actual = math.matrixFromColumns([1, 2, 3], [[4], [5], [6]], [[7, 8, 9]])
    assert.deepStrictEqual(actual, expected)

    // from one-dimensional vectors
    actual = math.matrixFromColumns(matrix([1, 2, 3]), matrix([4, 5, 6]), matrix([7, 8, 9]))
    assert.deepStrictEqual(actual, matrix(expected))

    // from multi-dimensional vectors
    actual = math.matrixFromColumns(matrix([1, 2, 3]), matrix([[4], [5], [6]]), matrix([[7, 8, 9]]))
    assert.deepStrictEqual(actual, matrix(expected))

    // from sparse vectors
    actual = math.matrixFromColumns(matrix([[1, 2, 3]], 'sparse'), matrix([[4], [5], [6]], 'sparse'), matrix([[7, 8, 9]], 'sparse'))
    assert.deepStrictEqual(actual, matrix(expected))

    // for a mixed type, returns an array
    actual = math.matrixFromColumns([1, 2, 3], [4, 5, 6], matrix([7, 8, 9]))
    assert.deepStrictEqual(actual, expected)
  })
})
