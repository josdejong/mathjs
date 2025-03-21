import assert from 'assert'
import math from '../../../src/defaultInstance.js'
import {
  arraySize,
  flatten,
  generalize,
  identify,
  reshape,
  resize,
  squeeze,
  unsqueeze,
  validate,
  validateIndex,
  isEmptyIndex,
  broadcastSizes,
  broadcastTo,
  concat,
  checkBroadcastingRules,
  stretch,
  broadcastArrays,
  get
} from '../../../src/utils/array.js'

describe('util.array', function () {
  describe('size', function () {
    it('should calculate the size of a scalar', function () {
      assert.deepStrictEqual(arraySize(2), [])
      assert.deepStrictEqual(arraySize('string'), [])
    })

    it('should calculate the size of a 1-dimensional array', function () {
      assert.deepStrictEqual(arraySize([]), [0])
      assert.deepStrictEqual(arraySize([1]), [1])
      assert.deepStrictEqual(arraySize([1, 2, 3]), [3])
    })

    it('should calculate the size of a 2-dimensional array', function () {
      assert.deepStrictEqual(arraySize([[]]), [1, 0])
      assert.deepStrictEqual(arraySize([[], []]), [2, 0])
      assert.deepStrictEqual(arraySize([[1, 2], [3, 4]]), [2, 2])
      assert.deepStrictEqual(arraySize([[1, 2, 3], [4, 5, 6]]), [2, 3])
    })

    it('should calculate the size of a 3-dimensional array', function () {
      assert.deepStrictEqual(arraySize([[[]]]), [1, 1, 0])
      assert.deepStrictEqual(arraySize([[[], []]]), [1, 2, 0])
      assert.deepStrictEqual(arraySize([[[], []], [[], []]]), [2, 2, 0])
      assert.deepStrictEqual(arraySize([[[1], [2]], [[3], [4]]]), [2, 2, 1])
      assert.deepStrictEqual(arraySize([[[1, 2], [3, 4]], [[5, 6], [7, 8]]]), [2, 2, 2])
      assert.deepStrictEqual(arraySize([
        [[1, 2, 3, 4], [5, 6, 7, 8]],
        [[1, 2, 3, 4], [5, 6, 7, 8]],
        [[1, 2, 3, 4], [5, 6, 7, 8]]
      ]), [3, 2, 4])
    })

    it('should not validate whether all dimensions match', function () {
      assert.deepStrictEqual(arraySize([[1, 2], [3, 4, 5]]), [2, 2])
    })
  })

  describe('resize', function () {
    it('should resize a scalar', function () {
      const a = 0
      assert.deepStrictEqual(resize(a, [3]), [0, 0, 0])
    })

    it('should resize a 1 dimensional array', function () {
      let a = []

      // resize with a default value
      a = resize(a, [3], 100)
      assert.deepStrictEqual(a, [100, 100, 100])

      // resize without default value
      a = resize(a, [5])
      assert.deepStrictEqual(a, [100, 100, 100, 0, 0])

      a = resize(a, [2])
      assert.deepStrictEqual(a, [100, 100])
    })

    it('should resize a 1 dimensional array with null as defaultValue', function () {
      let a = []

      // resize with default value undefined
      a = resize(a, [3], null)
      assert.deepStrictEqual(a, [null, null, null])
    })

    it('should resize a 2 dimensional array', function () {
      let a = [
        [0, 1],
        [2, 3]
      ]

      a = resize(a, [2, 4])
      assert.deepStrictEqual(a, [
        [0, 1, 0, 0],
        [2, 3, 0, 0]
      ])

      a = resize(a, [4, 4])
      assert.deepStrictEqual(a, [
        [0, 1, 0, 0],
        [2, 3, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ])

      a = resize(a, [4, 2])
      assert.deepStrictEqual(a, [
        [0, 1],
        [2, 3],
        [0, 0],
        [0, 0]
      ])

      a = resize(a, [2, 2])
      assert.deepStrictEqual(a, [
        [0, 1],
        [2, 3]
      ])

      a = resize(a, [1, 1])
      assert.deepStrictEqual(a, [
        [0]
      ])
    })

    it('should resize a 2 dimensional array with default value', function () {
      let a = [
        [0, 1],
        [2, 3]
      ]

      a = resize(a, [2, 4], 100)
      assert.deepStrictEqual(a, [
        [0, 1, 100, 100],
        [2, 3, 100, 100]
      ])

      a = resize(a, [4, 4], 100)
      assert.deepStrictEqual(a, [
        [0, 1, 100, 100],
        [2, 3, 100, 100],
        [100, 100, 100, 100],
        [100, 100, 100, 100]
      ])

      a = resize(a, [4, 2])
      assert.deepStrictEqual(a, [
        [0, 1],
        [2, 3],
        [100, 100],
        [100, 100]
      ])

      a = resize(a, [2, 2])
      assert.deepStrictEqual(a, [
        [0, 1],
        [2, 3]
      ])

      a = resize(a, [1, 1])
      assert.deepStrictEqual(a, [
        [0]
      ])
    })

    it('should resize a 1 dimensional array to 2 dimensional', function () {
      let a = [1, 2]

      a = resize(a, [4], 3)
      assert.deepStrictEqual(a, [1, 2, 3, 3])

      a = resize(a, [4, 2], 4)
      assert.deepStrictEqual(a, [
        [1, 4],
        [2, 4],
        [3, 4],
        [3, 4]
      ])

      // without default value
      let b = [1, 2]

      b = resize(b, [4])
      assert.deepStrictEqual(b, [1, 2, 0, 0])

      b = resize(b, [4, 2])
      assert.deepStrictEqual(b, [
        [1, 0],
        [2, 0],
        [0, 0],
        [0, 0]
      ])
      // TODO: would be nicer if this returns uninit everywhere and not undefined in some places
    })

    it('should resize a 2 dimensional array to 1 dimensional', function () {
      let a = [[1, 2], [3, 4], [5, 6], [7, 8]]
      a = resize(a, [6])
      assert.deepStrictEqual(a, [1, 3, 5, 7, 0, 0])

      let b = [[], []]
      b = resize(b, [2], 8)
      assert.deepStrictEqual(b, [undefined, undefined])

      let c = []
      c = resize(c, [2], 8)
      assert.deepStrictEqual(c, [8, 8])
    })

    it('should resize a 3 dimensional array', function () {
      let a = []
      a = resize(a, [2, 3], 5)
      assert.deepStrictEqual(a, [[5, 5, 5], [5, 5, 5]])

      a = resize(a, [2, 3, 2], 7)
      assert.deepStrictEqual(a, [[[5, 7], [5, 7], [5, 7]], [[5, 7], [5, 7], [5, 7]]])

      a = resize(a, [3, 2], 9)
      assert.deepStrictEqual(a, [[5, 5], [5, 5], [9, 9]])
    })

    it('should resize to an empty array', function () {
      let a = []
      a = resize(a, [2, 3], 5)
      assert.deepStrictEqual(a, [[5, 5, 5], [5, 5, 5]])

      a = resize(a, [0])
      assert.deepStrictEqual(a, [])
    })

    it('should throw an error when resizing to a scalar', function () {
      let a = []
      assert.throws(function () { a = resize(a, []) }, /Resizing to scalar is not supported/)
    })

    it('should throw an error in case of wrong type of arguments', function () {
      assert.throws(function () { resize([], 2) }, /Array expected/)
      assert.throws(function () { resize(2) }, /Array expected/)
    })
  })

  describe('reshape', function () {
    it('should reshape a 1 dimensional array into a 2 dimensional array', function () {
      const a = [1, 2, 3, 4, 5, 6, 7, 8]

      assert.deepStrictEqual(
        reshape(a, [2, 4]),
        [[1, 2, 3, 4],
          [5, 6, 7, 8]]
      )
      assert.deepStrictEqual(
        reshape(a, [4, 2]),
        [[1, 2],
          [3, 4],
          [5, 6],
          [7, 8]]
      )
      assert.deepStrictEqual(
        reshape(a, [1, 8]),
        [[1, 2, 3, 4, 5, 6, 7, 8]]
      )
      assert.deepStrictEqual(
        reshape(a, [1, 1, 8]),
        [[[1, 2, 3, 4, 5, 6, 7, 8]]]
      )
    })

    it('should reshape a 2 dimensional array into a 1 dimensional array', function () {
      const a = [
        [0, 1],
        [2, 3]
      ]

      assert.deepStrictEqual(
        reshape(a, [4]),
        [0, 1, 2, 3]
      )
    })

    it('should reshape a 3 dimensional array', function () {
      const a = [[[1, 2],
        [3, 4]],

      [[5, 6],
        [7, 8]]]

      assert.deepStrictEqual(
        reshape(a, [8]),
        [1, 2, 3, 4, 5, 6, 7, 8]
      )

      assert.deepStrictEqual(
        reshape(a, [2, 4]),
        [[1, 2, 3, 4],
          [5, 6, 7, 8]]
      )
    })

    it('should throw an error when reshaping to a dimension with length 0', function () {
      assert.throws(function () { reshape([1, 2], [0, 2]) }, /DimensionError/)
      assert.throws(function () { reshape([1, 2], [2, 0]) }, /DimensionError/)
    })

    it('should throw an error when reshaping a non-empty array to an empty array', function () {
      assert.throws(function () { reshape([1], []) }, /DimensionError/)
      assert.throws(function () { reshape([1, 2], []) }, /DimensionError/)
    })

    it('should throw an error when reshaping to a size that differs from the original', function () {
      const a = [1, 2, 3, 4, 5, 6, 7, 8, 9]

      assert.deepStrictEqual(
        reshape(a, [3, 3]),
        [[1, 2, 3],
          [4, 5, 6],
          [7, 8, 9]]
      )
      assert.throws(function () { reshape(a, [3, 2]) }, /DimensionError/)
      assert.throws(function () { reshape(a, [2, 3]) }, /DimensionError/)
      assert.throws(function () { reshape(a, [3, 3, 3]) }, /DimensionError/)
      assert.throws(function () { reshape(a, [3, 4]) }, /DimensionError/)
      assert.throws(function () { reshape(a, [4, 3]) }, /DimensionError/)
    })

    it('should throw an error in case of wrong type of arguments', function () {
      assert.throws(function () { reshape([], 2) }, /Array expected/)
      assert.throws(function () { reshape(2) }, /Array expected/)
    })
  })

  describe('squeeze', function () {
    it('should squeeze a scalar', function () {
      assert.deepStrictEqual(squeeze(2), 2)
      assert.deepStrictEqual(squeeze({}), {})
      assert.deepStrictEqual(squeeze('string'), 'string')
    })

    it('should squeeze an array', function () {
      // leave zero dimensions as is
      assert.deepStrictEqual(squeeze([]), [])
      assert.deepStrictEqual(squeeze([[]]), [])
      assert.deepStrictEqual(squeeze([[[]]]), [])
      assert.deepStrictEqual(squeeze([[[], []]]), [[], []])
      assert.deepStrictEqual(squeeze([[[]], [[]]]), [[[]], [[]]])

      assert.deepStrictEqual(squeeze(2), 2)
      assert.deepStrictEqual(squeeze([[2]]), 2)
      assert.deepStrictEqual(squeeze([[[2]]]), 2)
      assert.deepStrictEqual(squeeze([1, 2, 3]), [1, 2, 3])
      assert.deepStrictEqual(squeeze([[1, 2, 3]]), [1, 2, 3])
      assert.deepStrictEqual(squeeze([[[1, 2, 3]]]), [1, 2, 3])
      assert.deepStrictEqual(squeeze([[1], [2], [3]]), [1, 2, 3])
      assert.deepStrictEqual(squeeze([[1, 2], [3, 4]]), [[1, 2], [3, 4]])
      assert.deepStrictEqual(squeeze([[[1, 2]], [[3, 4]]]), [[[1, 2]], [[3, 4]]])
      assert.deepStrictEqual(squeeze([[[1, 2], [3, 4]]]), [[1, 2], [3, 4]])
      assert.deepStrictEqual(squeeze([[[1], [2]], [[3], [4]]]), [[1, 2], [3, 4]])
      assert.deepStrictEqual(squeeze([[[1]], [[2]], [[3]], [[4]]]), [1, 2, 3, 4])
    })

    it('should adjust size when squeezing an array', function () {
      let a = [[[1], [2]], [[3], [4]]]
      let size = [2, 2, 1]
      a = squeeze(a, size)
      assert.deepStrictEqual(a, [[1, 2], [3, 4]])
      assert.deepStrictEqual(size, [2, 2])

      a = [[1, 2]]
      size = [1, 2]
      a = squeeze(a, size)
      assert.deepStrictEqual(a, [1, 2])
      assert.deepStrictEqual(size, [2])

      a = [[[1]], [[2]], [[3]], [[4]]]
      size = [4, 1, 1]
      a = squeeze(a, size)
      assert.deepStrictEqual(a, [1, 2, 3, 4])
      assert.deepStrictEqual(size, [4])
    })
  })

  describe('unsqueeze', function () {
    it('should unsqueeze a scalar', function () {
      assert.deepStrictEqual(unsqueeze(2, 0), 2)
      assert.deepStrictEqual(unsqueeze(2, 1), [2])
      assert.deepStrictEqual(unsqueeze(2, 2), [[2]])
      assert.deepStrictEqual(unsqueeze('string', 2), [['string']])
    })

    it('should ignore empty arrays in unsqueeze', function () {
      // should do nothing with empty arrays
      assert.deepStrictEqual(unsqueeze([], 0), [])
      assert.deepStrictEqual(unsqueeze([], 1), [])
      assert.deepStrictEqual(unsqueeze([], 2), [])
      assert.deepStrictEqual(unsqueeze([], 3), [])
      assert.deepStrictEqual(unsqueeze([[]], 0), [[]])
      assert.deepStrictEqual(unsqueeze([[]], 1), [[]])
      assert.deepStrictEqual(unsqueeze([[]], 2), [[]])
      assert.deepStrictEqual(unsqueeze([[]], 3), [[]])
    })

    it('should unsqueeze an array', function () {
      assert.deepStrictEqual(unsqueeze([1, 2, 3], 1), [1, 2, 3])
      assert.deepStrictEqual(unsqueeze([1, 2, 3], 2), [[1], [2], [3]])
      assert.deepStrictEqual(unsqueeze([1, 2, 3], 3), [[[1]], [[2]], [[3]]])
      assert.deepStrictEqual(unsqueeze([1, 2, 3], 3, 1), [[[1], [2], [3]]])
      assert.deepStrictEqual(unsqueeze([1, 2, 3], 3, 2), [[[1, 2, 3]]])

      assert.deepStrictEqual(unsqueeze([[1, 2], [3, 4]], 1), [[1, 2], [3, 4]])
      assert.deepStrictEqual(unsqueeze([[1, 2], [3, 4]], 2), [[1, 2], [3, 4]])
      assert.deepStrictEqual(unsqueeze([[1, 2], [3, 4]], 3), [[[1], [2]], [[3], [4]]])
    })

    it('should adjust size when unsqueezing an array', function () {
      let a = [[1, 2], [3, 4]]
      let size = [2, 2]
      unsqueeze(a, 3, 0, size)
      assert.deepStrictEqual(a, [[[1], [2]], [[3], [4]]])
      assert.deepStrictEqual(size, [2, 2, 1])

      a = [1, 2, 3, 4]
      size = [4]
      unsqueeze(a, 3, 0, size)
      assert.deepStrictEqual(a, [[[1]], [[2]], [[3]], [[4]]])
      assert.deepStrictEqual(size, [4, 1, 1])
    })
  })

  describe('validateIndex', function () {
    it('should validate whether an index contains integers', function () {
      assert.strictEqual(validateIndex(2), undefined)
      assert.strictEqual(validateIndex(10), undefined)
      assert.throws(function () { validateIndex(2.3) }, /Index must be an integer/)
      assert.throws(function () { validateIndex('str') }, /Index must be an integer/)
      assert.throws(function () { validateIndex(true) }, /Index must be an integer/)
    })

    it('should validate whether an index doesn\'t exceed the minimum 0', function () {
      assert.strictEqual(validateIndex(2), undefined)
      assert.strictEqual(validateIndex(0), undefined)
      assert.throws(function () { validateIndex(-1) }, /Index out of range/)
      assert.throws(function () { validateIndex(-100) }, /Index out of range/)
    })

    it('should validate whether an index doesn\'t exceed both minimum and maximum', function () {
      assert.strictEqual(validateIndex(0, 10), undefined)
      assert.strictEqual(validateIndex(4, 10), undefined)
      assert.strictEqual(validateIndex(9, 10), undefined)
      assert.throws(function () { validateIndex(-1, 10) }, /Index out of range/)
      assert.throws(function () { validateIndex(10, 10) }, /Index out of range/)
      assert.throws(function () { validateIndex(11, 10) }, /Index out of range/)
      assert.throws(function () { validateIndex(100, 10) }, /Index out of range/)
    })

    it('thrown IndexError should contain the right index, max, and min properties', function () {
      try {
        validateIndex(4, 3)
        assert.ok(false, 'should not reach this point')
      } catch (err) {
        assert.strictEqual(err.toString(), 'IndexError: Index out of range (4 > 2)')
        assert.strictEqual(err.index, 4)
        assert.strictEqual(err.min, 0)
        assert.strictEqual(err.max, 3)
      }

      try {
        validateIndex(-1, 3)
        assert.ok(false, 'should not reach this point')
      } catch (err) {
        assert.strictEqual(err.toString(), 'IndexError: Index out of range (-1 < 0)')
        assert.strictEqual(err.index, -1)
        assert.strictEqual(err.min, 0)
        assert.strictEqual(err.max, 3)
      }

      try {
        validateIndex(-1)
        assert.ok(false, 'should not reach this point')
      } catch (err) {
        assert.strictEqual(err.toString(), 'IndexError: Index out of range (-1 < 0)')
        assert.strictEqual(err.index, -1)
        assert.strictEqual(err.min, 0)
        assert.strictEqual(err.max, undefined)
      }
    })
  })

  describe('validate', function () {
    it('should validate whether all elements in a vector have correct size', function () {
      // valid vector with correct size
      assert.strictEqual(validate([], [0]), undefined)
      assert.strictEqual(validate([1], [1]), undefined)
      assert.strictEqual(validate([1, 2, 3], [3]), undefined)

      // valid matrix but wrong size
      assert.throws(function () { validate([1, 2, 3], [2]) }, /Dimension mismatch/)
      assert.throws(function () { validate([1, 2, 3], [4]) }, /Dimension mismatch/)
      assert.throws(function () { validate([1, 2, 3], []) }, /Dimension mismatch/)
      assert.throws(function () { validate([1, 2, 3], [3, 2]) }, /Dimension mismatch/)

      // invalid vector
      assert.throws(function () { validate([1, [2], 3], [3]) }, /Dimension mismatch/)
    })

    it('should validate whether all elements in a 2d matrix have correct size', function () {
      // valid matrix with correct size
      assert.strictEqual(validate([[1, 2], [3, 4]], [2, 2]), undefined)
      assert.strictEqual(validate([[1, 2, 3], [4, 5, 6]], [2, 3]), undefined)
      assert.strictEqual(validate([[1, 2], [3, 4], [5, 6]], [3, 2]), undefined)

      // valid matrix with wrong size
      assert.throws(function () { validate([[1, 2], [3, 4]], [2, 1]) }, /Dimension mismatch/)
      assert.throws(function () { validate([[1, 2], [3, 4]], [3, 2]) }, /Dimension mismatch/)
      assert.throws(function () { validate([[1, 2, 3], [4, 5, 6]], [2, 4]) }, /Dimension mismatch/)
      assert.throws(function () { validate([[1, 2], [3, 4], [5, 6]], [4, 3]) }, /Dimension mismatch/)

      // invalid matrix
      assert.throws(function () { validate([[1, 2], [3, 4, 5]], [2, 2]) }, /Dimension mismatch/)
      assert.throws(function () { validate([[1, 2], [3]], [2, 2]) }, /Dimension mismatch/)
      assert.throws(function () { validate([[1, 2], 3], [2, 2]) }, /Dimension mismatch/)
      assert.throws(function () { validate([1, 2], [2, 2]) }, /Dimension mismatch/)
      assert.throws(function () { validate([[[1, 2], [3, 4]]], [2, 2]) }, /Dimension mismatch/)
    })

    it('should validate whether all elements in a multi dimensional matrix have correct size', function () {
      // valid matrix with correct size
      assert.strictEqual(validate([[[1, 2], [3, 4]], [[5, 6], [7, 8]]], [2, 2, 2]), undefined)
      assert.strictEqual(validate([[[1, 2, 3], [4, 5, 6]], [[7, 8, 9], [10, 11, 12]]], [2, 2, 3]), undefined)
      assert.strictEqual(validate([[[1, 2], [3, 4], [5, 6]], [[7, 8], [9, 10], [11, 12]]], [2, 3, 2]), undefined)
      assert.strictEqual(validate([[[1, 2], [3, 4]], [[5, 6], [7, 8]], [[9, 10], [11, 12]]], [3, 2, 2]), undefined)

      // valid matrix with wrong size
      assert.throws(function () { validate([[[1, 2], [3, 4]], [[5, 6], [7, 8]]], [2, 2, 3]) }, /Dimension mismatch/)
      assert.throws(function () { validate([[[1, 2], [3, 4]], [[5, 6], [7, 8]]], [2, 2]) }, /Dimension mismatch/)
      assert.throws(function () { validate([[[1, 2], [3, 4]], [[5, 6], [7, 8]]], [2, 2, 2, 2]) }, /Dimension mismatch/)
      assert.throws(function () { validate([[[1, 2], [3, 4]], [[5, 6], [7, 8]]], [3, 2, 2]) }, /Dimension mismatch/)
      assert.throws(function () { validate([[[1, 2], [3, 4]], [[5, 6], [7, 8]]], [2, 3, 2]) }, /Dimension mismatch/)

      // invalid matrix
      assert.throws(function () { validate([[[1, 2], [3, 4]], [[5, 6], [7, 8, 9]]], [2, 2, 2]) }, /Dimension mismatch/)
      assert.throws(function () { validate([[[1, 2], [3, 4]], [[5, 6, 6.5], [7, 8]]], [2, 2, 2]) }, /Dimension mismatch/)
      assert.throws(function () { validate([[[1, 2], [3, 4]], [[5, 6], 7]], [2, 2, 2]) }, /Dimension mismatch/)
      assert.throws(function () { validate([[[1, 2], [3, 4]], [6, [7, 8]]], [2, 2, 2]) }, /Dimension mismatch/)
    })

    it('should validate whether a variable contains a scalar', function () {
      assert.strictEqual(validate(2.3, []), undefined)
      assert.strictEqual(validate(new Date(), []), undefined)
      assert.strictEqual(validate({}, []), undefined)

      assert.throws(function () { validate([], []) }, /Dimension mismatch/)
      assert.throws(function () { validate([1, 2, 3], []) }, /Dimension mismatch/)
      assert.throws(function () { validate([[1, 2], [3, 4]], []) }, /Dimension mismatch/)
    })
  })

  describe('flatten', function () {
    it('should flatten a scalar', function () {
      assert.deepStrictEqual(flatten(1), 1)
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

    it('should return a new array', function () {
      const input = [3, 2, 1]
      const flat = flatten(input)
      flat.sort()
      assert.deepStrictEqual(input, [3, 2, 1])
    })
  })

  describe('identify', function () {
    it('should append a unique identifier to every element of the array', function () {
      assert.deepStrictEqual(identify([]), [])
      assert.deepStrictEqual(identify([1, 1, 2]), [{ value: 1, identifier: 0 }, { value: 1, identifier: 1 }, { value: 2, identifier: 0 }])
    })
  })

  describe('generalize', function () {
    it('should remove the unique identifier from every element of the array', function () {
      assert.deepStrictEqual(generalize([]), [])
      assert.deepStrictEqual(generalize([{ value: 1, identifier: 0 }, { value: 1, identifier: 1 }, { value: 2, identifier: 0 }]), [1, 1, 2])
    })
  })

  describe('broadcastSizes', function () {
    it('should calculate the broadcasted sizes', function () {
      assert.deepStrictEqual(broadcastSizes([1, 2], [2, 2]), [2, 2])
      assert.deepStrictEqual(broadcastSizes([3, 2], [1, 2], [3, 1]), [3, 2])
    })

    it('should throw an error when the broadcasting rules are not followed', function () {
      assert.throws(function () { broadcastSizes([2, 2], [3, 2]) }, /Error: shape mismatch: mismatch is found in arg with shape.*/)
    })
  })

  describe('broadcastTo', function () {
    it('should leave an array as such when broadcasting to the same size', function () {
      const a = [10, 20]
      const b = [[10, 20]]
      assert.deepStrictEqual(broadcastTo(a, [2]), a)
      assert.deepStrictEqual(broadcastTo(b, [1, 2]), b)
    })

    it('should broadcast an array to a certain size', function () {
      assert.deepStrictEqual(broadcastTo([10, 20], [2, 2]), [[10, 20], [10, 20]])
      assert.deepStrictEqual(broadcastTo([[10, 20]], [3, 2]), [[10, 20], [10, 20], [10, 20]])
      assert.deepStrictEqual(broadcastTo([1, 2, 3], [1, 2, 3]), [[[1, 2, 3], [1, 2, 3]]])
    })

    it('should throw an error when not possible to broadcast to', function () {
      assert.throws(function () { broadcastTo([10, 20], [1]) })
    })
  })

  describe('concat', function () {
    it('should concat arrays', function () {
      assert.deepStrictEqual(concat([[1, 2]], [[1, 2]], 0), [[1, 2], [1, 2]])
      assert.deepStrictEqual(concat([[1, 2]], [[1, 2]], 1), [[1, 2, 1, 2]])
    })

    it('should return arrays as such if only one is supplied', function () {
      assert.deepStrictEqual(concat([[1, 2], [3, 4]], 0), [[1, 2], [3, 4]])
      assert.deepStrictEqual(concat([1, 2], 0), [1, 2])
    })

    it('should throw an error when the wrong number of arguments is supplied', function () {
      assert.throws(function () { concat([[1, 2], [3, 4]]) })
      assert.throws(function () { concat(1) })
      assert.throws(function () { concat() })
    })
  })

  describe('stretch', function () {
    it('should stretch arrays in the specified direction', function () {
      assert.deepStrictEqual(stretch([[1, 2]], 3, 0), [[1, 2], [1, 2], [1, 2]])
      assert.deepStrictEqual(stretch([[1, 2]], 3, 1), [[1, 2, 1, 2, 1, 2]])
    })
  })

  describe('get', function () {
    const m = [[0, 1], [2, 3]]

    it('should get a value from the array', function () {
      assert.strictEqual(get(m, [1, 0]), 2)
      assert.strictEqual(get(m, [0, 1]), 1)
    })

    it('should throw an error when getting a value out of range', function () {
      assert.throws(function () { get(m, [3, 0]) })
      assert.throws(function () { get(m, [1, 5]) })
      assert.throws(function () { get(m, [1]) })
      assert.throws(function () { get(m, []) })
    })

    it('should throw an error in case of dimension mismatch', function () {
      assert.throws(function () { get(m, [0, 2, 0, 2, 0, 2]) }, /Dimension mismatch/)
    })

    it('should throw an error when getting a value given a invalid index', function () {
      assert.throws(function () { get(m, [1.2, 2]) })
      assert.throws(function () { get(m, [1, -2]) })
      assert.throws(function () { get(m, 1, 1) })
      assert.throws(function () { get(m, null) })
      assert.throws(function () { get(m, [[1, 1]]) })
    })
  })

  describe('checkBroadcastingRules', function () {
    it('should not throw an error if the broadcasting rules are ok', function () {
      assert.doesNotThrow(function () { checkBroadcastingRules([1, 2], [1, 2]) })
      assert.doesNotThrow(function () { checkBroadcastingRules([1, 2], [2, 2]) })
      assert.doesNotThrow(function () { checkBroadcastingRules([2, 1], [2, 2]) })
    })

    it('should throw an error if the broadcasting rules are not ok', function () {
      assert.throws(function () { checkBroadcastingRules([2, 2], [3, 2]) })
      assert.throws(function () { checkBroadcastingRules([2, 2], [2, 3]) })
      assert.throws(function () { checkBroadcastingRules([2, 2], [1, 2]) })
    })
  })

  describe('broadcastArrays', function () {
    it('should broadcast many arrays', function () {
      assert.deepStrictEqual(broadcastArrays([1, 2], [3, 4]), [[1, 2], [3, 4]])
      assert.deepStrictEqual(broadcastArrays([1, 2], [[3], [4]]), [[[1, 2], [1, 2]], [[3, 3], [4, 4]]])
      assert.deepStrictEqual(broadcastArrays([1, 2], [[3], [4]], [5, 6]), [[[1, 2], [1, 2]], [[3, 3], [4, 4]], [[5, 6], [5, 6]]])
    })

    it('should broadcast leave arrays as such when only one is supplied', function () {
      assert.deepStrictEqual(broadcastArrays([1, 2]), [1, 2], [3, 4])
      assert.deepStrictEqual(broadcastArrays([[3], [4]]), [[3], [4]])
      assert.deepStrictEqual(broadcastArrays([[5, 6]]), [[5, 6]])
    })

    it('should throw an arryor when the broadcasting rules don\'t apply', function () {
      assert.throws(function () { broadcastArrays([1, 2], [1, 2, 3]) })
      assert.throws(function () { broadcastArrays([1, 2], [1, 2, 3], [4, 5]) })
      assert.throws(function () { broadcastArrays([[1, 2], [1, 2]], [[1, 2, 3]]) })
    })

    it('should throw an arryor when not enough arguments are supplied', function () {
      assert.throws(function () { broadcastArrays() })
    })
  })

  describe('isEmptyIndex', function () {
    it('should detect an empty index in arrays', function () {
      assert.deepStrictEqual(isEmptyIndex(math.index([])), true)
      assert.deepStrictEqual(isEmptyIndex(math.index(1)), false)
      assert.deepStrictEqual(isEmptyIndex(math.index([], 1)), true)
      assert.deepStrictEqual(isEmptyIndex(math.index(0, 1)), false)
    })

    it('should detect an empty index in ranges', function () {
      assert.deepStrictEqual(isEmptyIndex(math.index(new math.Range(0, 0))), true)
      assert.deepStrictEqual(isEmptyIndex(math.index(new math.Range(0, 1))), false)
      assert.deepStrictEqual(isEmptyIndex(math.index(new math.Range(0, 0), 1)), true)
      assert.deepStrictEqual(isEmptyIndex(math.index(0, new math.Range(0, 1))), false)
    })

    it('should detect an empty index in text', function () {
      assert.deepStrictEqual(isEmptyIndex(math.index('')), true)
      assert.deepStrictEqual(isEmptyIndex(math.index('someText')), false)
      assert.deepStrictEqual(isEmptyIndex(math.index('', 1)), true)
      assert.deepStrictEqual(isEmptyIndex(math.index(0, 'someText')), false)
    })
  })
})
