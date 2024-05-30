import assert from 'assert'
import math from '../../../../../src/defaultInstance.js'
import { deepForEach } from '../../../../../src/utils/collection.js'

const DenseMatrix = math.DenseMatrix

describe('deepForEach', function () {
  it('should iterate over all elements in a simple array', function () {
    const array = [1, 2, 3]
    const result = []
    deepForEach(array, value => result.push(value))
    assert.deepStrictEqual(result, [1, 2, 3])
  })

  it('should iterate over all elements in a nested array', function () {
    const array = [[1, 2], [3, [4, 5]]]
    const result = []
    deepForEach(array, value => result.push(value))
    assert.deepStrictEqual(result, [1, 2, 3, 4, 5])
  })

  it('should iterate over all elements in a mixed type array', function () {
    const array = [1, 'two', [3, null, undefined, true]]
    const result = []
    deepForEach(array, value => result.push(value))
    assert.deepStrictEqual(result, [1, 'two', 3, null, undefined, true])
  })

  it('should handle an empty array', function () {
    const array = []
    const result = []
    deepForEach(array, value => result.push(value))
    assert.deepStrictEqual(result, [])
  })

  it('should handle an array with empty nested arrays', function () {
    const array = [[], [1, []], [2, [3, []]]]
    const result = []
    deepForEach(array, value => result.push(value))
    assert.deepStrictEqual(result, [1, 2, 3])
  })

  it('should iterate over all elements in a DenseMatrix', function () {
    const matrix = new DenseMatrix([[1, 2], [3, 4]])
    const result = []
    deepForEach(matrix, value => result.push(value))
    assert.deepStrictEqual(result, [1, 2, 3, 4])
  })

  it('should call the callback with each element of a matrix after converting to array', function () {
    const matrix = math.matrix([[1, 2], [3, 4]])
    const result = []
    deepForEach(matrix, value => result.push(value))
    assert.deepStrictEqual(result, [1, 2, 3, 4])
  })

  it('should work with arrays containing complex numbers', function () {
    const array = [math.complex(2, 3), [math.complex(4, 5)]]
    const result = []
    deepForEach(array, value => result.push(value))
    assert.deepStrictEqual(result, [math.complex(2, 3), math.complex(4, 5)])
  })
})
