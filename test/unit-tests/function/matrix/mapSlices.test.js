import assert from 'assert'
import math from '../../../../src/defaultInstance.js'

const sum = math.sum

describe('mapSlices', function () {
  const mapSlices = math.mapSlices

  it('should apply a function to the rows of a matrix', function () {
    assert.deepStrictEqual(mapSlices([[1, 2], [3, 4]], 0, sum), [4, 6])
  })

  it('should temporarily be accessible via synonym `apply`', function () {
    assert.deepStrictEqual(math.apply([[1, 2], [3, 4]], 0, sum), [4, 6])
  })

  it('should apply a function to the columns of a matrix', function () {
    assert.deepStrictEqual(mapSlices([[1, 2], [3, 4]], 1, sum), [3, 7])
  })

  const inputMatrix = [ // this is a 4x3x2 matrix, full test coverage
    [[1, 2], [3, 4], [5, 6]],
    [[7, 8], [9, 10], [11, 12]],
    [[13, 14], [15, 16], [17, 18]],
    [[19, 20], [21, 22], [23, 24]]
  ]

  it('should apply to the rows of a tensor', function () {
    assert.deepStrictEqual(mapSlices(inputMatrix, 2, sum), [[3, 7, 11], [15, 19, 23], [27, 31, 35], [39, 43, 47]])
  })

  it('should throw an error if the dimension is out of range', function () {
    assert.throws(function () { mapSlices([[1, 2], [3, 4]], 3, sum) }, /Index out of range/)
  })

  it('should throw an error if the dimension is not an integer', function () {
    assert.throws(function () { mapSlices([[1, 2], [3, 4]], [1, 2], sum) }, /Unexpected type of argument in function mapSlices/)
  })

  it('should throw an error if the matrix, is not a matrix or array', function () {
    assert.throws(function () { mapSlices('[[1, 2], [3, 4]]', 0, sum) }, /Unexpected type of argument in function mapSlices/)
  })
})
