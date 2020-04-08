import assert from 'assert'
import math from '../../../../src/bundleAny'

const matrix = math.matrix

describe('crush', function () {
  it('should return original array/matrix for less than 2 elements', function () {
    assert.deepStrictEqual(math.diff([]), [])
    assert.deepStrictEqual(math.diff(matrix([])), matrix([]))
    assert.deepStrictEqual(math.diff([2]), [2])
    assert.deepStrictEqual(math.diff(matrix([2])), matrix([2]))
  })

  it('should return difference between elements of an array', function () {
    assert.deepStrictEqual(math.diff([1, 2, 4, 7, 0]), [1, 2, 3, -7])
  })

  it('should return difference between elements of a matrix', function () {
    assert.deepStrictEqual(math.diff(matrix([1, 2, 4, 7, 0])), matrix([1, 2, 3, -7]))
  })
})
