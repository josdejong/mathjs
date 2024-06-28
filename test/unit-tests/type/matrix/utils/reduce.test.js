import assert from 'assert'
import math from '../../../../../src/defaultInstance.js'
import { reduce } from '../../../../../src/utils/collection.js'

const DenseMatrix = math.DenseMatrix

describe('reduce', function () {
  it('should reduce a 1D array along dimension 0', function () {
    const array = [1, 2, 3, 4]
    const result = reduce(array, 0, (a, b) => a + b)
    assert.strictEqual(result, 10)
  })

  it('should reduce a 2D array along dimension 0', function () {
    const array = [[1, 2, 3], [4, 5, 6]]
    const result = reduce(array, 0, (a, b) => a + b)
    assert.deepStrictEqual(result, [5, 7, 9])
  })

  it('should reduce a 2D array along dimension 1', function () {
    const array = [[1, 2, 3], [4, 5, 6]]
    const result = reduce(array, 1, (a, b) => a + b)
    assert.deepStrictEqual(result, [6, 15])
  })

  it('should reduce a 3D array along dimension 0', function () {
    const array = [[[1, 2], [3, 4]], [[5, 6], [7, 8]]]
    const result = reduce(array, 0, (a, b) => a + b)
    assert.deepStrictEqual(result, [[6, 8], [10, 12]])
  })

  it('should reduce a 3D array along dimension 1', function () {
    const array = [[[1, 2], [3, 4]], [[5, 6], [7, 8]]]
    const result = reduce(array, 1, (a, b) => a + b)
    assert.deepStrictEqual(result, [[4, 6], [12, 14]])
  })

  it('should reduce a 3D array along dimension 2', function () {
    const array = [[[1, 2], [3, 4]], [[5, 6], [7, 8]]]
    const result = reduce(array, 2, (a, b) => a + b)
    assert.deepStrictEqual(result, [[3, 7], [11, 15]])
  })

  it('should reduce a DenseMatrix along dimension 0', function () {
    const matrix = new DenseMatrix([[1, 2, 3], [4, 5, 6]])
    const result = reduce(matrix, 0, (a, b) => a + b)
    assert.deepStrictEqual(result, new DenseMatrix([5, 7, 9]))
  })

  it('should reduce a DenseMatrix along dimension 1', function () {
    const matrix = new DenseMatrix([[1, 2, 3], [4, 5, 6]])
    const result = reduce(matrix, 1, (a, b) => a + b)
    assert.deepStrictEqual(result, new DenseMatrix([6, 15]))
  })

  it('should throw an error for invalid dimension', function () {
    const array = [[1, 2, 3], [4, 5, 6]]
    assert.throws(() => reduce(array, -1, (a, b) => a + b), /IndexError/)
    assert.throws(() => reduce(array, 2, (a, b) => a + b), /IndexError/)
  })
})
