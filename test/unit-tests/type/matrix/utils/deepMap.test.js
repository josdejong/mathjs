import assert from 'assert'
import math from '../../../../../src/defaultInstance.js'
import { deepMap } from '../../../../../src/utils/collection.js'

const DenseMatrix = math.DenseMatrix

describe('deepMap', function () {
  it('should map all elements in a simple array', function () {
    const array = [1, 2, 3]
    const result = deepMap(array, value => value * 2)
    assert.deepStrictEqual(result, [2, 4, 6])
  })

  it('should map all elements in a nested array', function () {
    const array = [[1, 2], [3, [4, 5]]]
    const result = deepMap(array, value => value * 2)
    assert.deepStrictEqual(result, [[2, 4], [6, [8, 10]]])
  })

  it('should map all elements in a mixed type array', function () {
    const array = [1, 'two', [3, null, undefined, true]]
    const result = deepMap(array, value => (typeof value === 'number' ? value * 2 : value))
    assert.deepStrictEqual(result, [2, 'two', [6, null, undefined, true]])
  })

  it('should handle an empty array', function () {
    const array = []
    const result = deepMap(array, value => value * 2)
    assert.deepStrictEqual(result, [])
  })

  it('should handle an array with empty nested arrays', function () {
    const array = [[], [1, []], [2, [3, []]]]
    const result = deepMap(array, value => value * 2)
    assert.deepStrictEqual(result, [[], [2, []], [4, [6, []]]])
  })

  it('should map all elements in a DenseMatrix', function () {
    const matrix = new DenseMatrix([[1, 2], [3, 4]])
    const result = deepMap(matrix, value => value * 2)
    assert.deepStrictEqual(result, new DenseMatrix([[2, 4], [6, 8]]))
  })

  it('should call the callback with each element of a matrix after converting to array', function () {
    const matrix = math.matrix([[1, 2], [3, 4]])
    const result = deepMap(matrix, value => value * 2)
    assert.deepStrictEqual(result, math.matrix([[2, 4], [6, 8]]))
  })

  it('should work with arrays containing complex numbers', function () {
    const array = [math.complex(2, 3), [math.complex(4, 5)]]
    const result = deepMap(array, value => value.mul(2))
    assert.deepStrictEqual(result, [math.complex(4, 6), [math.complex(8, 10)]])
  })

  it("should throw an error if it the typed function doesn't accept the type of argument", function () {
    const array = [1, 'two']
    const callback = math.typed('callback', {
      number: function (value) { return value + 1 }
    })
    assert.throws(() => deepMap(array, callback), /Error: Cannot convert "two" to a number/)
  })

  // TODO: either deprecate the skipZeros option, or implement it for real
  // eslint-disable-next-line mocha/no-skipped-tests
  it.skip('should skip zero values if skipZeros is true', function () {
    const array = [0, 1, [2, 0, [3, 0]]]
    const log = []
    const result = deepMap(array, value => {
      log.push(value)
      return value * 2
    }, true)
    assert.deepStrictEqual(result, [0, 2, [4, 0, [6, 0]]])
    assert.deepStrictEqual(log, [1, 2, 3])
  })
})
