import assert from 'assert'
import math from '../../../../src/defaultInstance.js'
const index = math.index
const Matrix = math.Matrix
const SparseMatrix = math.SparseMatrix
const DenseMatrix = math.DenseMatrix
const Complex = math.Complex
const Range = math.Range

describe('SparseMatrix', function () {
  describe('constructor', function () {
    it('should create empty matrix if called with no argument', function () {
      const m = new SparseMatrix()
      assert.deepStrictEqual(m._size, [0, 0])
      assert.deepStrictEqual(m._values, [])
      assert.deepStrictEqual(m._index, [])
      assert.deepStrictEqual(m._ptr, [0])
    })

    it('should create a Sparse Matrix from an array', function () {
      const m = new SparseMatrix(
        [
          [10, 0, 0, 0, -2, 0],
          [3, 9, 0, 0, 0, 3],
          [0, 7, 8, 7, 0, 0],
          [3, 0, 8, 7, 5, 0],
          [0, 8, 0, 9, 9, 13],
          [0, 4, 0, 0, 2, -1]
        ])
      assert.deepStrictEqual(m._size, [6, 6])
      assert.deepStrictEqual(m._values, [10, 3, 3, 9, 7, 8, 4, 8, 8, 7, 7, 9, -2, 5, 9, 2, 3, 13, -1])
      assert.deepStrictEqual(m._index, [0, 1, 3, 1, 2, 4, 5, 2, 3, 2, 3, 4, 0, 3, 4, 5, 1, 4, 5])
      assert.deepStrictEqual(m._ptr, [0, 3, 7, 9, 12, 16, 19])
      assert(typeof m._datatype === 'undefined')
    })

    it('should create a Sparse Matrix from an array, number datatype', function () {
      const m = new SparseMatrix(
        [
          [10, 0, 0, 0, -2, 0],
          [3, 9, 0, 0, 0, 3],
          [0, 7, 8, 7, 0, 0],
          [3, 0, 8, 7, 5, 0],
          [0, 8, 0, 9, 9, 13],
          [0, 4, 0, 0, 2, -1]
        ], 'number')
      assert.deepStrictEqual(m._size, [6, 6])
      assert.deepStrictEqual(m._values, [10, 3, 3, 9, 7, 8, 4, 8, 8, 7, 7, 9, -2, 5, 9, 2, 3, 13, -1])
      assert.deepStrictEqual(m._index, [0, 1, 3, 1, 2, 4, 5, 2, 3, 2, 3, 4, 0, 3, 4, 5, 1, 4, 5])
      assert.deepStrictEqual(m._ptr, [0, 3, 7, 9, 12, 16, 19])
      assert(m._datatype === 'number')
    })

    it('should create a Sparse Matrix from an array, empty column', function () {
      const m = new SparseMatrix(
        [
          [1, 0, 0],
          [0, 0, 1]
        ])
      assert.deepStrictEqual(m._size, [2, 3])
      assert.deepStrictEqual(m._values, [1, 1])
      assert.deepStrictEqual(m._index, [0, 1])
      assert.deepStrictEqual(m._ptr, [0, 1, 1, 2])
    })

    it('should create a Sparse Matrix from an array, empty row', function () {
      const m = new SparseMatrix(
        [
          [1, 0],
          [0, 0],
          [0, 1]
        ])
      assert.deepStrictEqual(m._size, [3, 2])
      assert.deepStrictEqual(m._values, [1, 1])
      assert.deepStrictEqual(m._index, [0, 2])
      assert.deepStrictEqual(m._ptr, [0, 1, 2])
    })

    it('should create an empty Sparse Matrix from an array', function () {
      const m = new SparseMatrix([])
      assert.deepStrictEqual(m._size, [0, 0])
      assert.deepStrictEqual(m._values, [])
      assert.deepStrictEqual(m._index, [])
      assert.deepStrictEqual(m._ptr, [0])
    })

    it('should create a Sparse Matrix from a vector', function () {
      const m = new SparseMatrix([1, 2, 3])
      assert.deepStrictEqual(m._size, [3, 1])
      assert.deepStrictEqual(m._values, [1, 2, 3])
      assert.deepStrictEqual(m._index, [0, 1, 2])
      assert.deepStrictEqual(m._ptr, [0, 3])
    })

    it('should create a Sparse Matrix from another Sparse Matrix', function () {
      const m1 = new SparseMatrix(
        [
          [1, 2, 3],
          [4, 5, 6],
          [7, 8, 9],
          [10, 11, 12]
        ])
      const m2 = new SparseMatrix(m1)
      assert.deepStrictEqual(m1._size, m2._size)
      assert.deepStrictEqual(m1._values, m2._values)
      assert.deepStrictEqual(m1._index, m2._index)
      assert.deepStrictEqual(m1._ptr, m2._ptr)
    })

    it('should create a Sparse Matrix from another Sparse Matrix, number datatype', function () {
      const m1 = new SparseMatrix(
        [
          [1, 2, 3],
          [4, 5, 6],
          [7, 8, 9],
          [10, 11, 12]
        ], 'number')
      const m2 = new SparseMatrix(m1)
      assert.deepStrictEqual(m1._size, m2._size)
      assert.deepStrictEqual(m1._values, m2._values)
      assert.deepStrictEqual(m1._index, m2._index)
      assert.deepStrictEqual(m1._ptr, m2._ptr)
      assert.deepStrictEqual(m1._datatype, m2._datatype)
    })

    it('should create a Sparse Matrix from a Dense Matrix', function () {
      const m1 = math.matrix(
        [
          [1, 2, 3],
          [4, 5, 6],
          [7, 8, 9],
          [10, 11, 12]
        ])
      const m2 = new SparseMatrix(m1)
      assert.deepStrictEqual(m1.size(), m2.size())
      assert.deepStrictEqual(m1.toArray(), m2.toArray())
    })

    it('should create a Sparse Matrix from a Dense Matrix, number datatype', function () {
      const m1 = new DenseMatrix(
        [
          [1, 2, 3],
          [4, 5, 6],
          [7, 8, 9],
          [10, 11, 12]
        ], 'number')
      const m2 = new SparseMatrix(m1)
      assert.deepStrictEqual(m1.size(), m2.size())
      assert.deepStrictEqual(m1.toArray(), m2.toArray())
      assert.deepStrictEqual(m1._datatype, m2._datatype)
    })

    it('should have a property isMatrix', function () {
      const a = new SparseMatrix()
      assert.strictEqual(a.isMatrix, true)
    })

    it('should have a property isSparseMatrix', function () {
      const a = new SparseMatrix()
      assert.strictEqual(a.isSparseMatrix, true)
    })

    it('should have a property type', function () {
      const a = new SparseMatrix()
      assert.strictEqual(a.type, 'SparseMatrix')
    })

    // TODO: add some more input validations to SparseMatrix
    // eslint-disable-next-line mocha/no-skipped-tests
    it.skip('should throw an error when input array does not have two dimensions', function () {
      assert.throws(function () { console.log(new SparseMatrix([1, 2, 3])) }, /DimensionError: Two dimensional array expected/)
      assert.throws(function () { console.log(new SparseMatrix([[[1]], [[2]], [[3]]])) }, /DimensionError: Two dimensional array expected/)
    })

    // TODO: add some more input validations to SparseMatrix
    // eslint-disable-next-line mocha/no-skipped-tests
    it.skip('should throw an error when the dimensions of the input array are invalid', function () {
      assert.throws(function () {
        console.log(new SparseMatrix(
          [
            [1, 2],
            [4, 5, 6]
          ]))
      }, /DimensionError: Dimension mismatch \(3 != 2\)/)
    })

    it('should create a SparseMatrix using method create', function () {
      const a = new SparseMatrix([[1, 2, 3]])

      const b = a.create([[4, 5, 6]])
      assert.strictEqual(b.isSparseMatrix, true)
      assert.deepStrictEqual(b, new SparseMatrix([[4, 5, 6]]))

      const c = a.create([[7, 8, 9]], 'number')
      assert.deepStrictEqual(c, new SparseMatrix([[7, 8, 9]], 'number'))
    })

    it('should throw an error when called without new keyword', function () {
      assert.throws(function () { SparseMatrix() }, /Constructor must be called with the new operator/)
    })

    it('should throw an error when called with invalid datatype', function () {
      assert.throws(function () { console.log(new SparseMatrix([], 1)) })
    })
  })

  describe('size', function () {
    it('should return the expected size', function () {
      assert.deepStrictEqual(new SparseMatrix([[23]]).size(), [1, 1])
      assert.deepStrictEqual(new SparseMatrix([[1, 2, 3], [4, 5, 6]]).size(), [2, 3])
      assert.deepStrictEqual(new SparseMatrix([[1], [2], [3]]).size(), [3, 1])
      assert.deepStrictEqual(new SparseMatrix([[]]).size(), [1, 0])
    })
  })

  describe('toString', function () {
    it('should return string representation of matrix', function () {
      assert.strictEqual(new SparseMatrix([[1, 2], [3, 4]]).toString(), '[[1, 2], [3, 4]]')
      assert.strictEqual(new SparseMatrix([[1, 2], [3, 1 / 3]]).toString(), '[[1, 2], [3, 0.3333333333333333]]')
    })
  })

  describe('toJSON', function () {
    it('should serialize Matrix', function () {
      assert.deepStrictEqual(
        new SparseMatrix([[1, 2], [3, 4]]).toJSON(),
        {
          mathjs: 'SparseMatrix',
          values: [1, 3, 2, 4],
          index: [0, 1, 0, 1],
          ptr: [0, 2, 4],
          size: [2, 2],
          datatype: undefined
        })
    })

    it('should serialize Matrix, number datatype', function () {
      assert.deepStrictEqual(
        new SparseMatrix([[1, 2], [3, 4]], 'number').toJSON(),
        {
          mathjs: 'SparseMatrix',
          values: [1, 3, 2, 4],
          index: [0, 1, 0, 1],
          ptr: [0, 2, 4],
          size: [2, 2],
          datatype: 'number'
        })
    })
  })

  describe('fromJSON', function () {
    it('should deserialize Matrix', function () {
      const json = {
        mathjs: 'SparseMatrix',
        values: [1, 3, 2, 4],
        index: [0, 1, 0, 1],
        ptr: [0, 2, 4],
        size: [2, 2]
      }
      const m = SparseMatrix.fromJSON(json)
      assert.ok(m instanceof Matrix)

      assert.deepStrictEqual(m._size, [2, 2])
      assert.deepStrictEqual(
        m.toArray(),
        [
          [1, 2],
          [3, 4]
        ])
    })

    it('should deserialize Matrix, number datatype', function () {
      const json = {
        mathjs: 'SparseMatrix',
        values: [1, 3, 2, 4],
        index: [0, 1, 0, 1],
        ptr: [0, 2, 4],
        size: [2, 2],
        datatype: 'number'
      }
      const m = SparseMatrix.fromJSON(json)
      assert.ok(m instanceof Matrix)

      assert.deepStrictEqual(m._size, [2, 2])
      assert.deepStrictEqual(
        m.toArray(),
        [
          [1, 2],
          [3, 4]
        ])
      assert.strictEqual(m._datatype, 'number')
    })

    it('should deserialize Pattern Matrix', function () {
      const json = {
        mathjs: 'SparseMatrix',
        values: undefined,
        index: [0, 1, 2, 0],
        ptr: [0, 2, 3, 4],
        size: [3, 3]
      }
      const m = SparseMatrix.fromJSON(json)
      assert.ok(m instanceof Matrix)

      assert.deepStrictEqual(m._size, [3, 3])
      assert.deepStrictEqual(
        m.valueOf(),
        [
          [1, 0, 1],
          [1, 0, 0],
          [0, 1, 0]
        ])
    })
  })

  describe('format', function () {
    it('should format matrix', function () {
      let m = new SparseMatrix(
        [
          [0, 0],
          [0, 1 / 3]
        ])
      assert.strictEqual(m.format(), 'Sparse Matrix [2 x 2] density: 0.25\n\n    (1, 1) ==> 0.3333333333333333')

      m = new SparseMatrix(
        [
          [0, 0],
          [0, 1 / 3]
        ])
      assert.strictEqual(m.format(3), 'Sparse Matrix [2 x 2] density: 0.25\n\n    (1, 1) ==> 0.333')

      m = new SparseMatrix(
        [
          [0, 0],
          [0, 1 / 3]
        ])
      assert.strictEqual(m.format(4), 'Sparse Matrix [2 x 2] density: 0.25\n\n    (1, 1) ==> 0.3333')
    })

    it('should format pattern matrix', function () {
      const m = new SparseMatrix({
        values: undefined,
        index: [0, 1, 2, 0],
        ptr: [0, 2, 3, 4],
        size: [3, 3]
      })

      assert.strictEqual(m.format(3), 'Sparse Matrix [3 x 3] density: 0.444\n\n    (0, 0) ==> X\n    (1, 0) ==> X\n    (2, 1) ==> X\n    (0, 2) ==> X')
    })
  })

  describe('resize', function () {
    it('should increase columns as needed, zero value', function () {
      const m = new SparseMatrix(
        [
          [1, 2, 3],
          [4, 5, 6]
        ])
      m.resize([2, 4])
      assert.deepStrictEqual(m._size, [2, 4])
      assert.deepStrictEqual(m._values, [1, 4, 2, 5, 3, 6])
      assert.deepStrictEqual(m._index, [0, 1, 0, 1, 0, 1])
      assert.deepStrictEqual(m._ptr, [0, 2, 4, 6, 6])
      assert.deepStrictEqual(
        m.toArray(),
        [
          [1, 2, 3, 0],
          [4, 5, 6, 0]
        ])
    })

    it('should resize using SparseMatrix input', function () {
      const m = new SparseMatrix(
        [
          [1, 2, 3],
          [4, 5, 6]
        ])
      m.resize(new SparseMatrix([2, 4]))
      assert.deepStrictEqual(m._size, [2, 4])
    })

    it('should resize using DenseMatrix input', function () {
      const m = new SparseMatrix(
        [
          [1, 2, 3],
          [4, 5, 6]
        ])
      m.resize(new DenseMatrix([2, 4]))
      assert.deepStrictEqual(m._size, [2, 4])
    })

    it('should increase columns as needed, non zero value', function () {
      const m = new SparseMatrix(
        [
          [1, 2, 3],
          [4, 5, 6]
        ])
      m.resize([2, 4], 100)
      assert.deepStrictEqual(m._size, [2, 4])
      assert.deepStrictEqual(m._values, [1, 4, 2, 5, 3, 6, 100, 100])
      assert.deepStrictEqual(m._index, [0, 1, 0, 1, 0, 1, 0, 1])
      assert.deepStrictEqual(m._ptr, [0, 2, 4, 6, 8])
      assert.deepStrictEqual(
        m.toArray(),
        [
          [1, 2, 3, 100],
          [4, 5, 6, 100]
        ])
    })

    it('should increase rows as needed, zero value', function () {
      const m = new SparseMatrix(
        [
          [1, 2, 3],
          [4, 5, 6]
        ])
      m.resize([3, 3])
      assert.deepStrictEqual(m._size, [3, 3])
      assert.deepStrictEqual(m._values, [1, 4, 2, 5, 3, 6])
      assert.deepStrictEqual(m._index, [0, 1, 0, 1, 0, 1])
      assert.deepStrictEqual(m._ptr, [0, 2, 4, 6])
      assert.deepStrictEqual(
        m.toArray(),
        [
          [1, 2, 3],
          [4, 5, 6],
          [0, 0, 0]
        ])
    })

    it('should increase rows as needed, non zero value', function () {
      const m = new SparseMatrix(
        [
          [1, 2, 3],
          [4, 5, 6]
        ])
      m.resize([3, 3], 100)
      assert.deepStrictEqual(m._size, [3, 3])
      assert.deepStrictEqual(m._values, [1, 4, 100, 2, 5, 100, 3, 6, 100])
      assert.deepStrictEqual(m._index, [0, 1, 2, 0, 1, 2, 0, 1, 2])
      assert.deepStrictEqual(m._ptr, [0, 3, 6, 9])
      assert.deepStrictEqual(
        m.toArray(),
        [
          [1, 2, 3],
          [4, 5, 6],
          [100, 100, 100]
        ])
    })

    it('should increase rows & columns as needed, zero value, empty Sparse Matrix', function () {
      const m = new SparseMatrix([])
      m.resize([2, 2])
      assert.deepStrictEqual(m._size, [2, 2])
      assert.deepStrictEqual(m._values, [])
      assert.deepStrictEqual(m._index, [])
      assert.deepStrictEqual(m._ptr, [0, 0, 0])
      assert.deepStrictEqual(
        m.toArray(),
        [
          [0, 0],
          [0, 0]
        ])
    })

    it('should increase rows & columns as needed, non zero value, empty Sparse Matrix', function () {
      const m = new SparseMatrix([])
      m.resize([2, 2], 100)
      assert.deepStrictEqual(m._size, [2, 2])
      assert.deepStrictEqual(m._values, [100, 100, 100, 100])
      assert.deepStrictEqual(m._index, [0, 1, 0, 1])
      assert.deepStrictEqual(m._ptr, [0, 2, 4])
      assert.deepStrictEqual(
        m.toArray(),
        [
          [100, 100],
          [100, 100]
        ])
    })

    it('should decrease columns as needed', function () {
      const m = new SparseMatrix(
        [
          [1, 2, 3],
          [4, 5, 6]
        ])
      m.resize([2, 2])
      assert.deepStrictEqual(m._size, [2, 2])
      assert.deepStrictEqual(m._values, [1, 4, 2, 5])
      assert.deepStrictEqual(m._index, [0, 1, 0, 1])
      assert.deepStrictEqual(m._ptr, [0, 2, 4])
      assert.deepStrictEqual(
        m.toArray(),
        [
          [1, 2],
          [4, 5]
        ])
    })

    it('should decrease columns as needed, zero matrix', function () {
      const m = new SparseMatrix(
        [
          [0, 0, 0],
          [0, 0, 0]
        ])
      m.resize([2, 2])
      assert.deepStrictEqual(m._size, [2, 2])
      assert.deepStrictEqual(m._values, [])
      assert.deepStrictEqual(m._index, [])
      assert.deepStrictEqual(m._ptr, [0, 0, 0])
      assert.deepStrictEqual(
        m.toArray(),
        [
          [0, 0],
          [0, 0]
        ])
    })

    it('should decrease rows as needed', function () {
      const m = new SparseMatrix(
        [
          [1, 2],
          [3, 4]
        ])
      m.resize([1, 2])
      assert.deepStrictEqual(m._size, [1, 2])
      assert.deepStrictEqual(m._values, [1, 2])
      assert.deepStrictEqual(m._index, [0, 0])
      assert.deepStrictEqual(m._ptr, [0, 1, 2])
      assert.deepStrictEqual(
        m.toArray(),
        [
          [1, 2]
        ])
    })

    it('should decrease rows as needed, zero Sparse Matrix', function () {
      const m = new SparseMatrix(
        [
          [0, 0],
          [0, 0]
        ])
      m.resize([1, 2])
      assert.deepStrictEqual(m._size, [1, 2])
      assert.deepStrictEqual(m._values, [])
      assert.deepStrictEqual(m._index, [])
      assert.deepStrictEqual(m._ptr, [0, 0, 0])
      assert.deepStrictEqual(
        m.toArray(),
        [
          [0, 0]
        ])
    })

    it('should decrease rows & columns as needed, zero Sparse Matrix', function () {
      const m = new SparseMatrix(
        [
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0]
        ])
      m.resize([2, 2])
      assert.deepStrictEqual(m._size, [2, 2])
      assert.deepStrictEqual(m._values, [])
      assert.deepStrictEqual(m._index, [])
      assert.deepStrictEqual(m._ptr, [0, 0, 0])
      assert.deepStrictEqual(
        m.toArray(),
        [
          [0, 0],
          [0, 0]
        ])
    })

    it('should return a different matrix when copy=true', function () {
      const m1 = new SparseMatrix(
        [
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0]
        ])
      const m2 = m1.resize([2, 2], 0, true)
      assert(m1 !== m2)
      // original matrix cannot be modified
      assert.deepStrictEqual(m1._size, [4, 4])
      assert.deepStrictEqual(m1._values, [])
      assert.deepStrictEqual(m1._index, [])
      assert.deepStrictEqual(m1._ptr, [0, 0, 0, 0, 0])
      assert.deepStrictEqual(
        m1.toArray(),
        [
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0]
        ])
      // new matrix should have correct size
      assert.deepStrictEqual(m2._size, [2, 2])
      assert.deepStrictEqual(m2._values, [])
      assert.deepStrictEqual(m2._index, [])
      assert.deepStrictEqual(m2._ptr, [0, 0, 0])
      assert.deepStrictEqual(
        m2.toArray(),
        [
          [0, 0],
          [0, 0]
        ])
    })
  })

  describe('reshape', function () {
    it('should reshape the matrix properly', function () {
      const m = new SparseMatrix([[1, 2, 3], [4, 5, 6]])
      m.reshape([3, 2])
      assert.deepStrictEqual(m.valueOf(), [[1, 2], [3, 4], [5, 6]])
      m.reshape([6, 1])
      assert.deepStrictEqual(m.valueOf(), [[1], [2], [3], [4], [5], [6]])
    })

    it('should return a copy only when specified', function () {
      const m1 = new SparseMatrix([[1, 2], [3, 4]])
      const m2 = m1.reshape([4, 1])
      const m3 = m2.reshape([1, 4], true)

      assert.strictEqual(m2, m1)
      assert.deepStrictEqual(m2.valueOf(), [[1], [2], [3], [4]])
      assert.deepStrictEqual(m2.valueOf(), m1.valueOf())

      assert.notStrictEqual(m3, m2)
      assert.deepStrictEqual(m3.valueOf(), [[1, 2, 3, 4]])
      assert.notDeepStrictEqual(m3.valueOf(), m2.valueOf())
    })

    it('should update the size of the reshaped matrix', function () {
      const m1 = new SparseMatrix([[1, 2], [3, 4]])
      const m2 = m1.reshape([4, 1], true)

      assert.deepStrictEqual(m1.size(), [2, 2])

      m1.reshape([1, 4])

      assert.deepStrictEqual(m1.size(), [1, 4])
      assert.deepStrictEqual(m2.size(), [4, 1])
    })

    it('should throw on attempting to reshape to != 2 dimensions', function () {
      const m1 = new SparseMatrix([[1, 2], [3, 4]])
      assert.throws(function () { m1.reshape([4]) }, /Sparse matrices can only be reshaped in two dimensions/)
      assert.throws(function () { m1.reshape([2, 2, 1]) }, /Sparse matrices can only be reshaped in two dimensions/)
    })

    it('should throw when reshaping will change the number of elements', function () {
      const m1 = new SparseMatrix([[1, 2], [3, 4]])
      assert.throws(function () { m1.reshape([2, 5]) }, /Reshaping sparse matrix will result in the wrong number of elements/)
    })

    it('should throw for invalid arguments', function () {
      const m1 = new SparseMatrix([[1, 2], [3, 4]])
      assert.throws(function () { m1.reshape() }, /Array expected/)
      assert.throws(function () { m1.reshape(42) }, /Array expected/)
      assert.throws(function () { m1.reshape(['hello', 'world']) }, /Invalid size, must contain positive integers/)
      assert.throws(function () { m1.reshape([-2, -2]) }, /Invalid size, must contain positive integers/)
    })
  })

  describe('get', function () {
    it('should throw on invalid element position', function () {
      const m = new SparseMatrix([
        [10, 0, 0, 0, -2, 0],
        [3, 9, 0, 0, 0, 3],
        [0, 7, 8, 7, 0, 0],
        [3, 0, 8, 7, 5, 0],
        [0, 8, 0, 9, 9, 13],
        [0, 4, 0, 0, 2, -1]
      ])

      assert.throws(function () { m.get([-1, 0]) }, /Index out of range \(-1 < 0\)/)
      assert.throws(function () { m.get([10, 0]) }, /Index out of range \(10 > 5\)/)
      assert.throws(function () { m.get([0, -1]) }, /Index out of range \(-1 < 0\)/)
      assert.throws(function () { m.get([0, 10]) }, /Index out of range \(10 > 5\)/)
    })

    it('should throw an error in case of dimension mismatch', function () {
      const m = new SparseMatrix([[0, 1], [2, 3]])
      assert.throws(function () { m.get([0, 2, 0, 2, 0, 2]) }, /Dimension mismatch/)
    })

    it('should throw an error when invoked on a pattern matrix', function () {
      const m = new SparseMatrix({
        values: undefined,
        index: [0, 1, 2, 0],
        ptr: [0, 2, 3, 4],
        size: [3, 3]
      })
      assert.throws(function () { m.get([0, 1]) }, /Cannot invoke get on a Pattern only matrix/)
    })

    it('should get matrix element', function () {
      const m = new SparseMatrix([
        [10, 0, 0, 0, -2, 0],
        [3, 9, 0, 0, 0, 3],
        [0, 7, 8, 7, 0, 0],
        [3, 0, 8, 7, 5, 0],
        [0, 8, 0, 9, 9, 13],
        [0, 4, 0, 0, 2, -1]
      ])

      assert.strictEqual(m.get([0, 0]), 10)
      assert.strictEqual(m.get([3, 1]), 0)
      assert.strictEqual(m.get([5, 1]), 4)
      assert.strictEqual(m.get([5, 5]), -1)
    })

    it('should get matrix element - Issue #450', function () {
      const m = new SparseMatrix({
        mathjs: 'SparseMatrix',
        values: [3, 10, 3, 9, 7, 4, 8, 8, 8, 7, 7, 9, -2, 5, 9, 2, 3, -1, 13],
        index: [1, 0, 3, 1, 2, 5, 4, 2, 3, 2, 3, 4, 0, 3, 4, 5, 1, 5, 4],
        ptr: [0, 3, 7, 9, 12, 16, 19],
        size: [6, 6],
        datatype: undefined
      })

      assert.strictEqual(m.get([0, 0]), 10)
      assert.strictEqual(m.get([1, 0]), 3)
      assert.strictEqual(m.get([4, 1]), 8)
      assert.strictEqual(m.get([5, 1]), 4)
      assert.strictEqual(m.get([4, 5]), 13)
      assert.strictEqual(m.get([5, 5]), -1)
    })
  })

  describe('set', function () {
    it('should throw on invalid element position', function () {
      const m = new SparseMatrix([
        [10, 0, 0, 0, -2, 0],
        [3, 9, 0, 0, 0, 3],
        [0, 7, 8, 7, 0, 0],
        [3, 0, 8, 7, 5, 0],
        [0, 8, 0, 9, 9, 13],
        [0, 4, 0, 0, 2, -1]
      ])

      assert.throws(function () { m.set([-1, 0]) }, /Index out of range \(-1 < 0\)/)
      assert.throws(function () { m.set([0, -1]) }, /Index out of range \(-1 < 0\)/)
      assert.throws(function () { m.set([0, 1.5]) }, /Index must be an integer \(value: 1\.5\)/)
    })

    it('should remove matrix element', function () {
      const m = new SparseMatrix([
        [10, 0, 0, 0, -2, 0],
        [3, 9, 0, 0, 0, 3],
        [0, 7, 8, 7, 0, 0],
        [3, 0, 8, 7, 5, 0],
        [0, 8, 0, 9, 9, 13],
        [0, 4, 0, 0, 2, -1]
      ])

      m.set([0, 0], 0)
      m.set([0, 4], 0)
      m.set([5, 1], 0)

      assert.deepStrictEqual(
        m.toArray(),
        [
          [0, 0, 0, 0, 0, 0],
          [3, 9, 0, 0, 0, 3],
          [0, 7, 8, 7, 0, 0],
          [3, 0, 8, 7, 5, 0],
          [0, 8, 0, 9, 9, 13],
          [0, 0, 0, 0, 2, -1]
        ])
    })

    it('should not add matrix element (zero)', function () {
      const m = new SparseMatrix([
        [0, 1],
        [0, 0]
      ])

      m.set([0, 0], 0)

      assert.deepStrictEqual(m._values.length, 1)
    })

    it('should update matrix element (non zero)', function () {
      const m = new SparseMatrix([
        [10, 0, 0, 0, -2, 0],
        [3, 9, 0, 0, 0, 3],
        [0, 7, 8, 7, 0, 0],
        [3, 0, 8, 7, 5, 0],
        [0, 8, 0, 9, 9, 13],
        [0, 4, 0, 0, 2, -1]
      ])

      m.set([0, 0], 15)
      m.set([0, 4], 10)
      m.set([5, 1], 20)

      assert.deepStrictEqual(
        m.toArray(),
        [
          [15, 0, 0, 0, 10, 0],
          [3, 9, 0, 0, 0, 3],
          [0, 7, 8, 7, 0, 0],
          [3, 0, 8, 7, 5, 0],
          [0, 8, 0, 9, 9, 13],
          [0, 20, 0, 0, 2, -1]
        ])
    })

    it('should update matrix element (zero)', function () {
      const m = new SparseMatrix([
        [10, 0, 0, 0, -2, 0],
        [3, 9, 0, 0, 0, 3],
        [0, 7, 8, 7, 0, 0],
        [3, 0, 8, 7, 5, 0],
        [0, 8, 0, 9, 9, 13],
        [0, 4, 0, 0, 2, -1]
      ])

      m.set([0, 1], 15)
      m.set([0, 5], 10)
      m.set([5, 0], 20)

      assert.deepStrictEqual(
        m.toArray(),
        [
          [10, 15, 0, 0, -2, 10],
          [3, 9, 0, 0, 0, 3],
          [0, 7, 8, 7, 0, 0],
          [3, 0, 8, 7, 5, 0],
          [0, 8, 0, 9, 9, 13],
          [20, 4, 0, 0, 2, -1]
        ])
    })

    it('should add rows as meeded', function () {
      const m = new SparseMatrix([
        [1, 2],
        [3, 4]
      ])

      m.set([3, 1], 22)
      assert.deepStrictEqual(
        m.toArray(),
        [
          [1, 2],
          [3, 4],
          [0, 0],
          [0, 22]
        ])

      m.set([4, 0], 33)
      assert.deepStrictEqual(
        m.toArray(),
        [
          [1, 2],
          [3, 4],
          [0, 0],
          [0, 22],
          [33, 0]
        ])
    })

    it('should add columns as meeded', function () {
      const m = new SparseMatrix([
        [1, 2],
        [3, 4]
      ])

      m.set([1, 3], 22)
      assert.deepStrictEqual(
        m.toArray(),
        [
          [1, 2, 0, 0],
          [3, 4, 0, 22]
        ])

      m.set([0, 4], 33)
      assert.deepStrictEqual(
        m.toArray(),
        [
          [1, 2, 0, 0, 33],
          [3, 4, 0, 22, 0]
        ])
    })

    it('should add rows & columns as meeded', function () {
      const m = new SparseMatrix([
        [1, 2],
        [3, 4]
      ])

      m.set([3, 3], 22)
      assert.deepStrictEqual(
        m.toArray(),
        [
          [1, 2, 0, 0],
          [3, 4, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 22]
        ])

      m.set([4, 4], 33)
      assert.deepStrictEqual(
        m.toArray(),
        [
          [1, 2, 0, 0, 0],
          [3, 4, 0, 0, 0],
          [0, 0, 0, 0, 0],
          [0, 0, 0, 22, 0],
          [0, 0, 0, 0, 33]
        ])
    })

    it('should add rows as meeded, non zero default', function () {
      const m = new SparseMatrix([
        [1, 2],
        [3, 4]
      ])

      m.set([3, 1], 22, -1)
      assert.deepStrictEqual(
        m.toArray(),
        [
          [1, 2],
          [3, 4],
          [-1, -1],
          [-1, 22]
        ])

      m.set([4, 0], 33, -2)
      assert.deepStrictEqual(
        m.toArray(),
        [
          [1, 2],
          [3, 4],
          [-1, -1],
          [-1, 22],
          [33, -2]
        ])
    })

    it('should add columns as meeded, non zero default', function () {
      const m = new SparseMatrix([
        [1, 2],
        [3, 4]
      ])

      m.set([1, 3], 22, -1)
      assert.deepStrictEqual(
        m.toArray(),
        [
          [1, 2, -1, -1],
          [3, 4, -1, 22]
        ])

      m.set([0, 4], 33, -2)
      assert.deepStrictEqual(
        m.toArray(),
        [
          [1, 2, -1, -1, 33],
          [3, 4, -1, 22, -2]
        ])
    })

    it('should add rows & columns as meeded, non zero default', function () {
      const m = new SparseMatrix([
        [1, 2],
        [3, 4]
      ])

      m.set([3, 3], 22, -1)
      assert.deepStrictEqual(
        m.toArray(),
        [
          [1, 2, -1, -1],
          [3, 4, -1, -1],
          [-1, -1, -1, -1],
          [-1, -1, -1, 22]
        ])

      m.set([4, 4], 33, -2)
      assert.deepStrictEqual(
        m.toArray(),
        [
          [1, 2, -1, -1, -2],
          [3, 4, -1, -1, -2],
          [-1, -1, -1, -1, -2],
          [-1, -1, -1, 22, -2],
          [-2, -2, -2, -2, 33]
        ])
    })

    it('should throw an error when invoked on a pattern matrix', function () {
      const m = new SparseMatrix({
        values: undefined,
        index: [0, 1, 2, 0],
        ptr: [0, 2, 3, 4],
        size: [3, 3]
      })
      assert.throws(function () { m.set([0, 1], 1) }, /Cannot invoke set on a Pattern only matrix/)
    })
  })

  describe('get subset', function () {
    it('should get the right subset of the matrix', function () {
      const m = new SparseMatrix(
        [
          [1, 2, 3],
          [4, 5, 6],
          [7, 8, 9]
        ])
      assert.deepStrictEqual(m.size(), [3, 3])
      assert.deepStrictEqual(m.subset(index(1, 1)), 5)
      assert.deepStrictEqual(m.subset(index(new Range(0, 2), new Range(0, 2))).toArray(), [[1, 2], [4, 5]])
      assert.deepStrictEqual(m.subset(index(1, new Range(1, 3))).toArray(), [[5, 6]])
      assert.deepStrictEqual(m.subset(index(0, new Range(1, 3))).toArray(), [[2, 3]])
      assert.deepStrictEqual(m.subset(index(new Range(1, 3), 1)).toArray(), [[5], [8]])
      assert.deepStrictEqual(m.subset(index(new Range(1, 3), 2)).toArray(), [[6], [9]])
      assert.deepStrictEqual(m.subset(index(new Range(1, 3, 2), 2)).toArray(), [[6]])
      assert.deepStrictEqual(m.subset(index([0, 1], [2, 1])).toArray(), [[3, 2], [6, 5]])
      assert.deepStrictEqual(m.subset(index([0, 1, 2], [2, 1, 0])).toArray(), [[3, 2, 1], [6, 5, 4], [9, 8, 7]])
      assert.deepStrictEqual(m.subset(index([2, 1, 0], [0, 1, 2])).toArray(), [[7, 8, 9], [4, 5, 6], [1, 2, 3]])
      assert.deepStrictEqual(m.subset(index([2, 1, 0], [2, 1, 0])).toArray(), [[9, 8, 7], [6, 5, 4], [3, 2, 1]])
    })

    /* TODO: implement!
    it('should squeeze the output when index contains a scalar', function() {
      let m = new SparseMatrix(math.range(0, 10))
      // assert.deepStrictEqual(m.subset(index(1)), 1)
      assert.deepStrictEqual(m.subset(index([1, 2])), new SparseMatrix([1]))

      m = new SparseMatrix([[1,2], [3, 4]])
      assert.deepStrictEqual(m.subset(index(1, 1)), 4)
      assert.deepStrictEqual(m.subset(index([1, 2], 1)), new SparseMatrix([[4]]))
      assert.deepStrictEqual(m.subset(index(1, [1, 2])), new SparseMatrix([[4]]))
      assert.deepStrictEqual(m.subset(index([1, 2], [1, 2])), new SparseMatrix([[4]]))
    })
    */
    it('should throw an error if the given subset is invalid', function () {
      let m = new SparseMatrix()
      assert.throws(function () { m.subset([-1]) })

      m = new SparseMatrix([[1, 2, 3], [4, 5, 6]])
      assert.throws(function () { m.subset([1, 2, 3]) })
      assert.throws(function () { m.subset([3, 0]) })
      assert.throws(function () { m.subset([1]) })
    })

    /* TODO: implement!
    it('should throw an error in case of wrong number of arguments', function() {
      const m = new SparseMatrix()
      assert.throws(function () { m.subset()}, /Wrong number of arguments/)
      assert.throws(function () { m.subset(1, 2, 3, 4) }, /Wrong number of arguments/)
    })
    */
    it('should throw an error in case of dimension mismatch', function () {
      const m = new SparseMatrix([[1, 2, 3], [4, 5, 6]])
      assert.throws(function () { m.subset(index([0, 2])) }, /Dimension mismatch/)
    })

    it('should throw an error when invoked on a pattern matrix', function () {
      const m = new SparseMatrix({
        values: undefined,
        index: [0, 1, 2, 0],
        ptr: [0, 2, 3, 4],
        size: [3, 3]
      })
      assert.throws(function () { m.subset(index(1, 1)) }, /Cannot invoke subset on a Pattern only matrix/)
    })
  })

  describe('set subset', function () {
    it('should set scalar value', function () {
      const m = new SparseMatrix([
        [0, 0],
        [0, 0]
      ])

      m.subset(index(1, 1), 1)
      assert.deepStrictEqual(
        m.toArray(),
        [
          [0, 0],
          [0, 1]
        ])

      m.subset(index(0, 0), 2)
      assert.deepStrictEqual(
        m.toArray(),
        [
          [2, 0],
          [0, 1]
        ])
    })

    it('should set scalar value growing matrix', function () {
      const m = new SparseMatrix([
        [0, 0],
        [0, 1]
      ])

      m.subset(index(2, 2), 2)
      assert.deepStrictEqual(
        m.toArray(),
        [
          [0, 0, 0],
          [0, 1, 0],
          [0, 0, 2]
        ])
    })

    it('should set scalar value growing matrix, default value', function () {
      const m = new SparseMatrix([
        [0, 0],
        [0, 1]
      ])

      m.subset(index(2, 2), 2, 1)
      assert.deepStrictEqual(
        m.toArray(),
        [
          [0, 0, 1],
          [0, 1, 1],
          [1, 1, 2]
        ])
    })

    it('should set vector value', function () {
      const m = new SparseMatrix([
        [0, 0],
        [0, 0]
      ])

      m.subset(index(0, [0, 1]), [1, 2])
      assert.deepStrictEqual(
        m.toArray(),
        [
          [1, 2],
          [0, 0]
        ])

      m.subset(index(1, [0, 1]), [3, 4])
      assert.deepStrictEqual(
        m.toArray(),
        [
          [1, 2],
          [3, 4]
        ])
    })

    it('should set subset', function () {
      // set 2-dimensional
      const m = new SparseMatrix(
        [
          [0, 0, 0],
          [0, 0, 0],
          [0, 0, 0]
        ])

      m.subset(index(new Range(1, 3), new Range(1, 3)), [[1, 2], [3, 4]])
      assert.deepStrictEqual(
        m.toArray(),
        [
          [0, 0, 0],
          [0, 1, 2],
          [0, 3, 4]
        ])

      m.subset(index(0, new Range(0, 3)), [5, 6, 7])
      assert.deepStrictEqual(
        m.toArray(),
        [
          [5, 6, 7],
          [0, 1, 2],
          [0, 3, 4]
        ])

      m.subset(index(new Range(0, 3), 0), [8, 9, 10])
      assert.deepStrictEqual(
        m.toArray(),
        [
          [8, 6, 7],
          [9, 1, 2],
          [10, 3, 4]
        ])
    })

    it('should set subset growing matrix', function () {
      // set 2-dimensional
      const m = new SparseMatrix(
        [
          [0, 0, 0],
          [0, 0, 0],
          [0, 0, 0]
        ])

      m.subset(index(new Range(2, 4), new Range(2, 4)), [[1, 2], [3, 4]])
      assert.deepStrictEqual(
        m.toArray(),
        [
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 1, 2],
          [0, 0, 3, 4]
        ])

      m.subset(index(4, new Range(0, 3)), [5, 6, 7])
      assert.deepStrictEqual(
        m.toArray(),
        [
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 1, 2],
          [0, 0, 3, 4],
          [5, 6, 7, 0]
        ])

      m.subset(index(new Range(0, 3), 4), [8, 9, 10])
      assert.deepStrictEqual(
        m.toArray(),
        [
          [0, 0, 0, 0, 8],
          [0, 0, 0, 0, 9],
          [0, 0, 1, 2, 10],
          [0, 0, 3, 4, 0],
          [5, 6, 7, 0, 0]
        ])
    })

    it('should set subset growing matrix, default value', function () {
      // set 2-dimensional
      const m = new SparseMatrix(
        [
          [0, 0, 0],
          [0, 0, 0],
          [0, 0, 0]
        ])

      m.subset(index([2, 3], [2, 3]), [[1, 2], [3, 4]], -1)
      assert.deepStrictEqual(
        m.toArray(),
        [
          [0, 0, 0, -1],
          [0, 0, 0, -1],
          [0, 0, 1, 2],
          [-1, -1, 3, 4]
        ])

      m.subset(index(4, new Range(0, 3)), [5, 6, 7], -2)
      assert.deepStrictEqual(
        m.toArray(),
        [
          [0, 0, 0, -1],
          [0, 0, 0, -1],
          [0, 0, 1, 2],
          [-1, -1, 3, 4],
          [5, 6, 7, -2]
        ])

      m.subset(index(new Range(0, 3), 4), [8, 9, 10], -3)
      assert.deepStrictEqual(
        m.toArray(),
        [
          [0, 0, 0, -1, 8],
          [0, 0, 0, -1, 9],
          [0, 0, 1, 2, 10],
          [-1, -1, 3, 4, -3],
          [5, 6, 7, -2, -3]
        ])
    })

    it('should set subset with non consecutive indexes', function () {
      // set 2-dimensional
      let m = new SparseMatrix(
        [
          [0, 0],
          [0, 0]
        ])

      m.subset(index([0, 1], [1, 0]), math.identity(2))
      assert.deepStrictEqual(
        m.toArray(),
        [
          [0, 1],
          [1, 0]
        ])

      m.subset(index([0, 2], [0, 2]), [[1, 2], [3, 4]])
      assert.deepStrictEqual(
        m.toArray(),
        [
          [1, 1, 2],
          [1, 0, 0],
          [3, 0, 4]
        ])

      m = math.sparse([1, 2, 3, 4, 5])

      m.subset(index([2, 0]), [7, 9])
      assert.deepStrictEqual(
        m.toArray(),
        [
          [9],
          [2],
          [7],
          [4],
          [5]
        ])
    })

    it('should get subset with non consecutive indexes', function () {
      const m = new SparseMatrix(
        [
          [0, 1],
          [1, 0]
        ])

      assert.deepStrictEqual(
        m.subset(index([0, 1], [1, 0])).toArray(),
        [
          [1, 0],
          [0, 1]
        ])
    })

    it('should throw an error in case of wrong type of index', function () {
      assert.throws(function () { console.log(new SparseMatrix().subset('no index', 2)) }, /Invalid index/)
    })

    it('should throw an error in case of wrong size of submatrix', function () {
      assert.throws(function () { console.log(new SparseMatrix().subset(index(0), [2, 3])) }, /Scalar expected/)
    })

    it('should throw an error when invoked on a pattern matrix', function () {
      const m = new SparseMatrix({
        values: undefined,
        index: [0, 1, 2, 0],
        ptr: [0, 2, 3, 4],
        size: [3, 3]
      })
      assert.throws(function () { m.subset(index([2, 4], [2, 4]), [[1, 2], [3, 4]], -1) }, /Cannot invoke subset on a Pattern only matrix/)
    })
  })

  describe('map', function () {
    it('should apply the given function to all elements in the matrix', function () {
      let m, m2

      m = new SparseMatrix([
        [1, 2, 3, 4],
        [5, 6, 7, 8],
        [9, 10, 11, 12],
        [13, 14, 15, 16]
      ])
      m2 = m.map(function (value) { return value * 2 })
      assert.deepStrictEqual(m2.toArray(), [
        [2, 4, 6, 8],
        [10, 12, 14, 16],
        [18, 20, 22, 24],
        [26, 28, 30, 32]
      ])

      m = new SparseMatrix([1])
      m2 = m.map(function (value) { return value * 2 })
      assert.deepStrictEqual(m2.toArray(), [[2]])

      m = new SparseMatrix([1, 2, 3])
      m2 = m.map(function (value) { return value * 2 })
      assert.deepStrictEqual(m2.toArray(), [[2], [4], [6]])
    })

    it('should work on empty matrices', function () {
      const m = new SparseMatrix([])
      const m2 = m.map(function (value) { return value * 2 })
      assert.deepStrictEqual(m2.toArray(), [])
    })

    it('should process all values (zero and non-zero)', function () {
      const m = new SparseMatrix(
        [
          [0, 0],
          [0, 0]
        ]
      )
      const m2 = m.map(function (value) { return value + 2 })
      assert.deepStrictEqual(
        m2.toArray(),
        [
          [2, 2],
          [2, 2]
        ])
    })

    it('should process non-zero values only', function () {
      const m = new SparseMatrix(
        [
          [1, 0],
          [0, 0]
        ]
      )
      let counter = 0

      const m2 = m.map(
        function (value) {
          counter++
          return value + 2
        },
        m,
        true)

      assert(counter === 1)
      assert.deepStrictEqual(
        m2.toArray(),
        [
          [3, 0],
          [0, 0]
        ])
    })

    it('should invoke callback with parameters value, index, obj', function () {
      const m = new SparseMatrix([[1, 2, 3], [4, 5, 6]])

      const m2 = m.map(
        function (value, index, obj) {
          return value + index[0] * 100 + index[1] * 10 + (obj === m ? 1000 : 0)
        }
      )

      assert.deepStrictEqual(
        m2.toArray(),
        [
          [1001, 1012, 1023],
          [1104, 1115, 1126]
        ])
    })

    it('should throw an error when invoked on a pattern matrix', function () {
      const m = new SparseMatrix({
        values: undefined,
        index: [0, 1, 2, 0],
        ptr: [0, 2, 3, 4],
        size: [3, 3]
      })
      assert.throws(function () { m.map(function () { return undefined }, m, true) }, /Cannot invoke map on a Pattern only matrix/)
    })
  })

  describe('forEach', function () {
    it('should run on all elements of the matrix', function () {
      let m, output

      m = new SparseMatrix([
        [1, 2, 3, 4],
        [5, 6, 7, 8],
        [9, 10, 11, 12],
        [13, 14, 15, 16]
      ])
      output = []
      m.forEach(function (value) { output.push(value) })
      assert.deepStrictEqual(output, [1, 5, 9, 13, 2, 6, 10, 14, 3, 7, 11, 15, 4, 8, 12, 16])

      m = new SparseMatrix([1])
      output = []
      m.forEach(function (value) { output.push(value) })
      assert.deepStrictEqual(output, [1])

      m = new SparseMatrix([1, 2, 3])
      output = []
      m.forEach(function (value) { output.push(value) })
      assert.deepStrictEqual(output, [1, 2, 3])
    })

    it('should work on empty matrices', function () {
      const m = new SparseMatrix([])
      const output = []
      m.forEach(function (value) { output.push(value) })
      assert.deepStrictEqual(output, [])
    })

    it('should process non-zero values only', function () {
      const m = new SparseMatrix(
        [
          [1, 0],
          [0, 0]
        ]
      )
      let counter = 0

      m.forEach(function () { counter++ }, true)
      assert(counter === 1)
    })

    it('should invoke callback with parameters value, index, obj', function () {
      const m = new SparseMatrix([[1, 2, 3], [4, 5, 6]])
      const output = []
      m.forEach(
        function (value, index, obj) {
          output.push(value + index[0] * 100 + index[1] * 10 + (obj === m ? 1000 : 0))
        }
      )
      assert.deepStrictEqual(output, [1001, 1104, 1012, 1115, 1023, 1126])
    })

    it('should throw an error when invoked on a pattern matrix', function () {
      const m = new SparseMatrix({
        values: undefined,
        index: [0, 1, 2, 0],
        ptr: [0, 2, 3, 4],
        size: [3, 3]
      })
      assert.throws(function () { m.forEach(function () {}) }, /Cannot invoke forEach on a Pattern only matrix/)
    })
  })

  describe('index ordering', function () {
    const orderedSparseMatrix = new SparseMatrix({
      values: [1, 3, 2, 4],
      index: [0, 1, 0, 1],
      ptr: [0, 2, 4],
      size: [2, 2]
    })

    const unorderedSparseMatrix = new SparseMatrix({
      values: [3, 1, 4, 2],
      index: [1, 0, 1, 0],
      ptr: [0, 2, 4],
      size: [2, 2]
    })

    const expectedLogs = [
      { value: 1, index: [0, 0] },
      { value: 3, index: [1, 0] },
      { value: 2, index: [0, 1] },
      { value: 4, index: [1, 1] }
    ]

    it('should have parsed the two test matrices correctly', function () {
      assert.deepStrictEqual(orderedSparseMatrix.toArray(), [[1, 2], [3, 4]])
      assert.deepStrictEqual(unorderedSparseMatrix.toArray(), [[1, 2], [3, 4]])
    })

    it('should run forEach on a sparse matrix with ordered indexes', function () {
      const logs = []
      orderedSparseMatrix.forEach((value, index) => logs.push({ value, index }))

      assert.deepStrictEqual(logs, expectedLogs)
    })

    it('should run map on a sparse matrix with ordered indexes', function () {
      const logs = []
      orderedSparseMatrix.map((value, index) => {
        logs.push({ value, index })
        return value
      })

      assert.deepStrictEqual(logs, expectedLogs)
    })

    it('should run forEach on a sparse matrix with unordered indexes', function () {
      const logs = []
      unorderedSparseMatrix.forEach((value, index) => logs.push({ value, index }))

      assert.deepStrictEqual(logs, expectedLogs)
    })

    it('should run map on a sparse matrix with unordered indexes', function () {
      const logs = []
      unorderedSparseMatrix.map((value, index) => {
        logs.push({ value, index })
        return value
      })

      assert.deepStrictEqual(logs, expectedLogs)
    })
  })

  describe('iterable', function () {
    it('should iterate in the same order as forEach', function () {
      let m, expected

      expected = []
      m = new SparseMatrix({
        values: [1, 3, 2, 4],
        index: [0, 1, 0, 1],
        ptr: [0, 2, 4],
        size: [2, 2]
      })
      m.forEach((value, index) => expected.push({ value, index }), true)
      assert.deepStrictEqual(expected, [...m])

      expected = []
      m = new SparseMatrix({
        values: [3, 1, 4, 2],
        index: [1, 0, 1, 0],
        ptr: [0, 2, 4],
        size: [2, 2]
      })
      m.forEach((value, index) => expected.push({ value, index }), true)
      assert.deepStrictEqual(expected, [...m])

      expected = []
      m = math.matrix([
        [0, 0, 1, 0, 0, 1, 1, 0, 0],
        [0, 1, 0, 0, 1, 0, 0, 0, 1],
        [1, 0, 0, 1, 0, 0, 0, 0, 1],
        [1, 0, 0, 1, 0, 0, 0, 1, 0]
      ], 'sparse')
      m.forEach((value, index) => expected.push({ value, index }), true)
      assert.deepStrictEqual(expected, [...m])
    })
  })

  describe('clone', function () {
    it('should clone the matrix properly', function () {
      const m1 = new SparseMatrix(
        [
          [1, 2, 3],
          [4, 5, 6]
        ])

      const m2 = m1.clone()

      assert.deepStrictEqual(m1.toArray(), m2.toArray())
    })

    it('should clone pattern matrix', function () {
      const m1 = new SparseMatrix({
        values: undefined,
        index: [0, 1, 2, 0],
        ptr: [0, 2, 3, 4],
        size: [3, 3]
      })

      const m2 = m1.clone()

      assert.deepStrictEqual(m1.toArray(), m2.toArray())
    })
  })

  describe('toArray', function () {
    it('should return array', function () {
      const m = new SparseMatrix({
        values: [10, 3, 3, 9, 7, 8, 4, 8, 8, 7, 7, 9, -2, 5, 9, 2, 3, 13, -1],
        index: [0, 1, 3, 1, 2, 4, 5, 2, 3, 2, 3, 4, 0, 3, 4, 5, 1, 4, 5],
        ptr: [0, 3, 7, 9, 12, 16, 19],
        size: [6, 6]
      })

      const a = m.toArray()

      assert.deepStrictEqual(
        a,
        [
          [10, 0, 0, 0, -2, 0],
          [3, 9, 0, 0, 0, 3],
          [0, 7, 8, 7, 0, 0],
          [3, 0, 8, 7, 5, 0],
          [0, 8, 0, 9, 9, 13],
          [0, 4, 0, 0, 2, -1]
        ])
    })

    it('should return array, empty column', function () {
      const m = new SparseMatrix({
        values: [1, 1],
        index: [0, 1],
        ptr: [0, 1, 1, 2],
        size: [2, 3]
      })

      const a = m.toArray()

      assert.deepStrictEqual(
        a,
        [
          [1, 0, 0],
          [0, 0, 1]
        ])
    })

    it('should return array, complex numbers', function () {
      const m = new SparseMatrix({
        values: [new Complex(1, 1), new Complex(4, 4), new Complex(5, 5), new Complex(2, 2), new Complex(3, 3), new Complex(6, 6)],
        index: [0, 2, 2, 0, 1, 2],
        ptr: [0, 2, 3, 6],
        size: [3, 3]
      })

      const a = m.toArray()

      assert.deepStrictEqual(
        a,
        [
          [new Complex(1, 1), 0, new Complex(2, 2)],
          [0, 0, new Complex(3, 3)],
          [new Complex(4, 4), new Complex(5, 5), new Complex(6, 6)]
        ])
    })
  })

  describe('diagonal', function () {
    it('should create Sparse Matrix (n x n)', function () {
      const m = SparseMatrix.diagonal([3, 3], 1)

      assert.deepStrictEqual(m._size, [3, 3])
      assert.deepStrictEqual(m._values, [1, 1, 1])
      assert.deepStrictEqual(m._index, [0, 1, 2])
      assert.deepStrictEqual(m._ptr, [0, 1, 2, 3])

      assert.deepStrictEqual(
        m.toArray(),
        [
          [1, 0, 0],
          [0, 1, 0],
          [0, 0, 1]
        ])
    })

    it('should create Sparse Matrix (n x n), k > 0', function () {
      const m = SparseMatrix.diagonal([3, 3], 1, 1)

      assert.deepStrictEqual(m._size, [3, 3])
      assert.deepStrictEqual(m._values, [1, 1])
      assert.deepStrictEqual(m._index, [0, 1])
      assert.deepStrictEqual(m._ptr, [0, 0, 1, 2])

      assert.deepStrictEqual(
        m.toArray(),
        [
          [0, 1, 0],
          [0, 0, 1],
          [0, 0, 0]
        ])
    })

    it('should create Sparse Matrix (n x n), k < 0', function () {
      const m = SparseMatrix.diagonal([3, 3], 1, -1)

      assert.deepStrictEqual(m._size, [3, 3])
      assert.deepStrictEqual(m._values, [1, 1])
      assert.deepStrictEqual(m._index, [1, 2])
      assert.deepStrictEqual(m._ptr, [0, 1, 2, 2])

      assert.deepStrictEqual(
        m.toArray(),
        [
          [0, 0, 0],
          [1, 0, 0],
          [0, 1, 0]
        ])
    })

    it('should create Sparse Matrix (n x n), vector value', function () {
      const m = SparseMatrix.diagonal([3, 3], [1, 2, 3])

      assert.deepStrictEqual(m._size, [3, 3])
      assert.deepStrictEqual(m._values, [1, 2, 3])
      assert.deepStrictEqual(m._index, [0, 1, 2])
      assert.deepStrictEqual(m._ptr, [0, 1, 2, 3])

      assert.deepStrictEqual(
        m.toArray(),
        [
          [1, 0, 0],
          [0, 2, 0],
          [0, 0, 3]
        ])
    })

    it('should create Sparse Matrix (n x n), vector value, k > 0', function () {
      const m = SparseMatrix.diagonal([3, 3], [1, 2], 1)

      assert.deepStrictEqual(m._size, [3, 3])
      assert.deepStrictEqual(m._values, [1, 2])
      assert.deepStrictEqual(m._index, [0, 1])
      assert.deepStrictEqual(m._ptr, [0, 0, 1, 2])

      assert.deepStrictEqual(
        m.toArray(),
        [
          [0, 1, 0],
          [0, 0, 2],
          [0, 0, 0]
        ])
    })

    it('should create Sparse Matrix (n x n), vector value, k < 0', function () {
      const m = SparseMatrix.diagonal([3, 3], [1, 2], -1)

      assert.deepStrictEqual(m._size, [3, 3])
      assert.deepStrictEqual(m._values, [1, 2])
      assert.deepStrictEqual(m._index, [1, 2])
      assert.deepStrictEqual(m._ptr, [0, 1, 2, 2])

      assert.deepStrictEqual(
        m.toArray(),
        [
          [0, 0, 0],
          [1, 0, 0],
          [0, 2, 0]
        ])
    })

    it('should create Sparse Matrix (n x n), matrix vector value', function () {
      const m = SparseMatrix.diagonal([3, 3], math.matrix([1, 2, 3]))

      assert.deepStrictEqual(m._size, [3, 3])
      assert.deepStrictEqual(m._values, [1, 2, 3])
      assert.deepStrictEqual(m._index, [0, 1, 2])
      assert.deepStrictEqual(m._ptr, [0, 1, 2, 3])

      assert.deepStrictEqual(
        m.toArray(),
        [
          [1, 0, 0],
          [0, 2, 0],
          [0, 0, 3]
        ])
    })

    it('should create Sparse Matrix (n x n), matrix vector value, k > 0', function () {
      const m = SparseMatrix.diagonal([3, 3], math.matrix([1, 2]), 1)

      assert.deepStrictEqual(m._size, [3, 3])
      assert.deepStrictEqual(m._values, [1, 2])
      assert.deepStrictEqual(m._index, [0, 1])
      assert.deepStrictEqual(m._ptr, [0, 0, 1, 2])

      assert.deepStrictEqual(
        m.toArray(),
        [
          [0, 1, 0],
          [0, 0, 2],
          [0, 0, 0]
        ])
    })

    it('should create Sparse Matrix (n x n), matrix vector value, k < 0', function () {
      const m = SparseMatrix.diagonal([3, 3], math.matrix([1, 2]), -1)

      assert.deepStrictEqual(m._size, [3, 3])
      assert.deepStrictEqual(m._values, [1, 2])
      assert.deepStrictEqual(m._index, [1, 2])
      assert.deepStrictEqual(m._ptr, [0, 1, 2, 2])

      assert.deepStrictEqual(
        m.toArray(),
        [
          [0, 0, 0],
          [1, 0, 0],
          [0, 2, 0]
        ])
    })

    it('should create Sparse Matrix (n x n), complex number', function () {
      const m = SparseMatrix.diagonal([3, 3], new Complex(1, 1))

      assert.deepStrictEqual(m._size, [3, 3])
      assert.deepStrictEqual(m._values, [new Complex(1, 1), new Complex(1, 1), new Complex(1, 1)])
      assert.deepStrictEqual(m._index, [0, 1, 2])
      assert.deepStrictEqual(m._ptr, [0, 1, 2, 3])
    })

    it('should create Sparse Matrix (m x n), m > n', function () {
      const m = SparseMatrix.diagonal([4, 3], 1)

      assert.deepStrictEqual(m._size, [4, 3])
      assert.deepStrictEqual(m._values, [1, 1, 1])
      assert.deepStrictEqual(m._index, [0, 1, 2])
      assert.deepStrictEqual(m._ptr, [0, 1, 2, 3])

      assert.deepStrictEqual(
        m.toArray(),
        [
          [1, 0, 0],
          [0, 1, 0],
          [0, 0, 1],
          [0, 0, 0]
        ])
    })

    it('should create Sparse Matrix (m x n), m > n, k > 0', function () {
      const m = SparseMatrix.diagonal([4, 3], 1, 1)

      assert.deepStrictEqual(m._size, [4, 3])
      assert.deepStrictEqual(m._values, [1, 1])
      assert.deepStrictEqual(m._index, [0, 1])
      assert.deepStrictEqual(m._ptr, [0, 0, 1, 2])

      assert.deepStrictEqual(
        m.toArray(),
        [
          [0, 1, 0],
          [0, 0, 1],
          [0, 0, 0],
          [0, 0, 0]
        ])
    })

    it('should create Sparse Matrix (m x n), m > n, k < 0', function () {
      const m = SparseMatrix.diagonal([4, 3], 1, -1)

      assert.deepStrictEqual(m._size, [4, 3])
      assert.deepStrictEqual(m._values, [1, 1, 1])
      assert.deepStrictEqual(m._index, [1, 2, 3])
      assert.deepStrictEqual(m._ptr, [0, 1, 2, 3])

      assert.deepStrictEqual(
        m.toArray(),
        [
          [0, 0, 0],
          [1, 0, 0],
          [0, 1, 0],
          [0, 0, 1]
        ])
    })

    it('should create Sparse Matrix (m x n), m > n, vector value', function () {
      const m = SparseMatrix.diagonal([4, 3], [1, 2, 3])

      assert.deepStrictEqual(m._size, [4, 3])
      assert.deepStrictEqual(m._values, [1, 2, 3])
      assert.deepStrictEqual(m._index, [0, 1, 2])
      assert.deepStrictEqual(m._ptr, [0, 1, 2, 3])

      assert.deepStrictEqual(
        m.toArray(),
        [
          [1, 0, 0],
          [0, 2, 0],
          [0, 0, 3],
          [0, 0, 0]
        ])
    })

    it('should create Sparse Matrix (m x n), m > n, vector value, k > 0', function () {
      const m = SparseMatrix.diagonal([4, 3], [1, 2], 1)

      assert.deepStrictEqual(m._size, [4, 3])
      assert.deepStrictEqual(m._values, [1, 2])
      assert.deepStrictEqual(m._index, [0, 1])
      assert.deepStrictEqual(m._ptr, [0, 0, 1, 2])

      assert.deepStrictEqual(
        m.toArray(),
        [
          [0, 1, 0],
          [0, 0, 2],
          [0, 0, 0],
          [0, 0, 0]
        ])
    })

    it('should create Sparse Matrix (m x n), m > n, vector value, k < 0', function () {
      const m = SparseMatrix.diagonal([4, 3], [1, 2, 3], -1)

      assert.deepStrictEqual(m._size, [4, 3])
      assert.deepStrictEqual(m._values, [1, 2, 3])
      assert.deepStrictEqual(m._index, [1, 2, 3])
      assert.deepStrictEqual(m._ptr, [0, 1, 2, 3])

      assert.deepStrictEqual(
        m.toArray(),
        [
          [0, 0, 0],
          [1, 0, 0],
          [0, 2, 0],
          [0, 0, 3]
        ])
    })

    it('should create Sparse Matrix (m x n), m < n', function () {
      const m = SparseMatrix.diagonal([3, 4], 1)

      assert.deepStrictEqual(m._size, [3, 4])
      assert.deepStrictEqual(m._values, [1, 1, 1])
      assert.deepStrictEqual(m._index, [0, 1, 2])
      assert.deepStrictEqual(m._ptr, [0, 1, 2, 3, 3])

      assert.deepStrictEqual(
        m.toArray(),
        [
          [1, 0, 0, 0],
          [0, 1, 0, 0],
          [0, 0, 1, 0]
        ])
    })

    it('should create Sparse Matrix (m x n), m < n, k > 0', function () {
      const m = SparseMatrix.diagonal([3, 4], 1, 1)

      assert.deepStrictEqual(m._size, [3, 4])
      assert.deepStrictEqual(m._values, [1, 1, 1])
      assert.deepStrictEqual(m._index, [0, 1, 2])
      assert.deepStrictEqual(m._ptr, [0, 0, 1, 2, 3])

      assert.deepStrictEqual(
        m.toArray(),
        [
          [0, 1, 0, 0],
          [0, 0, 1, 0],
          [0, 0, 0, 1]
        ])
    })

    it('should create Sparse Matrix (m x n), m < n, k < 0', function () {
      const m = SparseMatrix.diagonal([3, 4], 1, -1)

      assert.deepStrictEqual(m._size, [3, 4])
      assert.deepStrictEqual(m._values, [1, 1])
      assert.deepStrictEqual(m._index, [1, 2])
      assert.deepStrictEqual(m._ptr, [0, 1, 2, 2, 2])

      assert.deepStrictEqual(
        m.toArray(),
        [
          [0, 0, 0, 0],
          [1, 0, 0, 0],
          [0, 1, 0, 0]
        ])
    })

    it('should create Sparse Matrix (m x n), m < n, vector value', function () {
      const m = SparseMatrix.diagonal([3, 4], [1, 2, 3])

      assert.deepStrictEqual(m._size, [3, 4])
      assert.deepStrictEqual(m._values, [1, 2, 3])
      assert.deepStrictEqual(m._index, [0, 1, 2])
      assert.deepStrictEqual(m._ptr, [0, 1, 2, 3, 3])

      assert.deepStrictEqual(
        m.toArray(),
        [
          [1, 0, 0, 0],
          [0, 2, 0, 0],
          [0, 0, 3, 0]
        ])
    })

    it('should create Sparse Matrix (m x n), m < n, vector value, k > 0', function () {
      const m = SparseMatrix.diagonal([3, 4], [1, 2, 3], 1)

      assert.deepStrictEqual(m._size, [3, 4])
      assert.deepStrictEqual(m._values, [1, 2, 3])
      assert.deepStrictEqual(m._index, [0, 1, 2])
      assert.deepStrictEqual(m._ptr, [0, 0, 1, 2, 3])

      assert.deepStrictEqual(
        m.toArray(),
        [
          [0, 1, 0, 0],
          [0, 0, 2, 0],
          [0, 0, 0, 3]
        ])
    })

    it('should create Sparse Matrix (m x n), m < n, vector value, k < 0', function () {
      const m = SparseMatrix.diagonal([3, 4], [1, 2], -1)

      assert.deepStrictEqual(m._size, [3, 4])
      assert.deepStrictEqual(m._values, [1, 2])
      assert.deepStrictEqual(m._index, [1, 2])
      assert.deepStrictEqual(m._ptr, [0, 1, 2, 2, 2])

      assert.deepStrictEqual(
        m.toArray(),
        [
          [0, 0, 0, 0],
          [1, 0, 0, 0],
          [0, 2, 0, 0]
        ])
    })

    it('should get Sparse Matrix diagonal (n x n)', function () {
      const m = new SparseMatrix(
        [
          [1, 0, 0],
          [0, 1, 0],
          [0, 0, 1]
        ])

      assert.deepStrictEqual(m.diagonal(), new SparseMatrix([1, 1, 1]))
    })

    it('should get Sparse Matrix diagonal (n x n), k > 0', function () {
      const m = new SparseMatrix(
        [
          [1, 2, 0],
          [0, 1, 3],
          [0, 0, 1]
        ])

      assert.deepStrictEqual(m.diagonal(1), new SparseMatrix([2, 3]))
    })

    it('should get Sparse Matrix diagonal (n x n), k < 0', function () {
      const m = new SparseMatrix(
        [
          [1, 0, 0],
          [2, 1, 0],
          [0, 3, 1]
        ])

      assert.deepStrictEqual(m.diagonal(-1), new SparseMatrix([2, 3]))
    })

    it('should get Sparse Matrix diagonal (m x n), m > n', function () {
      const m = new SparseMatrix(
        [
          [1, 0, 0],
          [0, 1, 0],
          [0, 0, 1],
          [0, 0, 0]
        ])

      assert.deepStrictEqual(m.diagonal(), new SparseMatrix([1, 1, 1]))
    })

    it('should get Sparse Matrix diagonal (m x n), m > n, k > 0', function () {
      const m = new SparseMatrix(
        [
          [1, 2, 0],
          [0, 1, 3],
          [0, 0, 1],
          [0, 0, 0]
        ])

      assert.deepStrictEqual(m.diagonal(1), new SparseMatrix([2, 3]))
    })

    it('should get Sparse Matrix diagonal (m x n), m > n, k < 0', function () {
      const m = new SparseMatrix(
        [
          [1, 0, 0],
          [2, 1, 0],
          [0, 3, 1],
          [0, 0, 4]
        ])

      assert.deepStrictEqual(m.diagonal(-1), new SparseMatrix([2, 3, 4]))
    })

    it('should get Sparse Matrix diagonal (m x n), m < n', function () {
      const m = new SparseMatrix(
        [
          [1, 0, 0, 0],
          [0, 1, 0, 0],
          [0, 0, 1, 0]
        ])

      assert.deepStrictEqual(m.diagonal(), new SparseMatrix([1, 1, 1]))
    })

    it('should get Sparse Matrix diagonal (m x n), m < n, k > 0', function () {
      const m = new SparseMatrix(
        [
          [1, 2, 0, 0],
          [0, 1, 3, 0],
          [0, 0, 1, 4]
        ])

      assert.deepStrictEqual(m.diagonal(1), new SparseMatrix([2, 3, 4]))
    })

    it('should get Sparse Matrix diagonal (m x n), m < n, k < 0', function () {
      const m = new SparseMatrix(
        [
          [1, 0, 0, 0],
          [2, 1, 0, 0],
          [4, 3, 1, 0]
        ])

      assert.deepStrictEqual(m.diagonal(-1), new SparseMatrix([2, 3]))

      assert.deepStrictEqual(m.diagonal(-2), new SparseMatrix([4]))
    })
  })

  describe('swapRows', function () {
    it('should swap rows with values', function () {
      const m = new SparseMatrix(
        [
          [1, 2, 3],
          [4, 5, 6],
          [7, 8, 9],
          [10, 11, 12]
        ])
      m.swapRows(1, 2)
      assert.deepStrictEqual(
        m.valueOf(),
        [
          [1, 2, 3],
          [7, 8, 9],
          [4, 5, 6],
          [10, 11, 12]
        ])
    })

    it('should swap row with value and no values', function () {
      const m = new SparseMatrix(
        [
          [1, 2, 3],
          [4, 5, 6],
          [0, 0, 0],
          [10, 11, 12]
        ])
      m.swapRows(1, 2)
      assert.deepStrictEqual(
        m.valueOf(),
        [
          [1, 2, 3],
          [0, 0, 0],
          [4, 5, 6],
          [10, 11, 12]
        ])
    })

    it('should swap row with no value and values', function () {
      const m = new SparseMatrix(
        [
          [1, 2, 3],
          [4, 5, 6],
          [0, 0, 0],
          [10, 11, 12]
        ])
      m.swapRows(2, 1)
      assert.deepStrictEqual(
        m.valueOf(),
        [
          [1, 2, 3],
          [0, 0, 0],
          [4, 5, 6],
          [10, 11, 12]
        ])
    })

    it('should swap rows with missing values', function () {
      const m = new SparseMatrix(
        [
          [1, 2, 3],
          [0, 5, 0],
          [7, 0, 9],
          [10, 11, 12]
        ])
      m.swapRows(2, 1)
      assert.deepStrictEqual(
        m.valueOf(),
        [
          [1, 2, 3],
          [7, 0, 9],
          [0, 5, 0],
          [10, 11, 12]
        ])
    })

    it('should swap last row with another row', function () {
      const m = new SparseMatrix(
        [
          [1, 2, 3],
          [0, 5, 0],
          [7, 0, 9],
          [10, 11, 12]
        ])
      m.swapRows(3, 1)
      assert.deepStrictEqual(
        m.valueOf(),
        [
          [1, 2, 3],
          [10, 11, 12],
          [7, 0, 9],
          [0, 5, 0]
        ])
    })

    it('should swap first row with another row', function () {
      const m = new SparseMatrix(
        [
          [0, 2, 0],
          [0, 5, 0],
          [7, 0, 9],
          [10, 0, 0]
        ])
      m.swapRows(0, 2)
      assert.deepStrictEqual(
        m.valueOf(),
        [
          [7, 0, 9],
          [0, 5, 0],
          [0, 2, 0],
          [10, 0, 0]
        ])
    })

    it('should swap rows on a pattern matrix', function () {
      const m = new SparseMatrix({
        values: undefined,
        index: [0, 1, 2, 0],
        ptr: [0, 2, 3, 4],
        size: [3, 3]
      })

      m.swapRows(0, 2)

      assert.deepStrictEqual(
        m.valueOf(),
        [
          [0, 1, 0],
          [1, 0, 0],
          [1, 0, 1]
        ])
    })
  })
})
