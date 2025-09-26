import assert from 'assert'
import math from '../../../../src/defaultInstance.js'
const Matrix = math.Matrix
const DenseMatrix = math.DenseMatrix
const SparseMatrix = math.SparseMatrix
const Complex = math.Complex
const Range = math.Range

const index = math.index

describe('DenseMatrix', function () {
  describe('constructor', function () {
    it('should create empty matrix if called with no argument', function () {
      const m = new DenseMatrix()
      assert.deepStrictEqual(m._size, [0])
      assert.deepStrictEqual(m._data, [])
    })

    it('should create a DenseMatrix from an array', function () {
      const m = new DenseMatrix(
        [
          [1, 2, 3],
          [4, 5, 6],
          [7, 8, 9],
          [10, 11, 12]
        ])
      assert.deepStrictEqual(m._size, [4, 3])
      assert.deepStrictEqual(
        m._data,
        [
          [1, 2, 3],
          [4, 5, 6],
          [7, 8, 9],
          [10, 11, 12]
        ])
    })

    it('should create a DenseMatrix from an array, number datatype', function () {
      const m = new DenseMatrix(
        [
          [1, 2, 3],
          [4, 5, 6],
          [7, 8, 9],
          [10, 11, 12]
        ], 'number')
      assert.deepStrictEqual(m._size, [4, 3])
      assert.deepStrictEqual(
        m._data,
        [
          [1, 2, 3],
          [4, 5, 6],
          [7, 8, 9],
          [10, 11, 12]
        ])
      assert(m._datatype === 'number')
    })

    it('should create a DenseMatrix an array containing matrices', function () {
      const m = new DenseMatrix([new DenseMatrix([1, 2]), new DenseMatrix([3, 4])])

      assert.deepStrictEqual(m, new DenseMatrix([[1, 2], [3, 4]]))
    })

    it('should create a DenseMatrix from another DenseMatrix', function () {
      const m1 = new DenseMatrix(
        [
          [1, 2, 3],
          [4, 5, 6],
          [7, 8, 9],
          [10, 11, 12]
        ])
      const m2 = new DenseMatrix(m1)
      assert.deepStrictEqual(m1._size, m2._size)
      assert.deepStrictEqual(m1._data, m2._data)
    })

    it('should create a DenseMatrix from another DenseMatrix, number datatype', function () {
      const m1 = new DenseMatrix(
        [
          [1, 2, 3],
          [4, 5, 6],
          [7, 8, 9],
          [10, 11, 12]
        ], 'number')
      const m2 = new DenseMatrix(m1)
      assert.deepStrictEqual(m1._size, m2._size)
      assert.deepStrictEqual(m1._data, m2._data)
      assert.deepStrictEqual(m1._datatype, m2._datatype)
    })

    it('should create a DenseMatrix from a SparseMatrix', function () {
      const m1 = new SparseMatrix(
        [
          [1, 2, 3],
          [4, 5, 6],
          [7, 8, 9],
          [10, 11, 12]
        ])
      const m2 = new DenseMatrix(m1)
      assert.deepStrictEqual(m1.size(), m2.size())
      assert.deepStrictEqual(m1.toArray(), m2.toArray())
    })

    it('should create a DenseMatrix from a SparseMatrix, number datatype', function () {
      const m1 = new SparseMatrix(
        [
          [1, 2, 3],
          [4, 5, 6],
          [7, 8, 9],
          [10, 11, 12]
        ], 'number')
      const m2 = new DenseMatrix(m1)
      assert.deepStrictEqual(m1.size(), m2.size())
      assert.deepStrictEqual(m1.toArray(), m2.toArray())
      assert.deepStrictEqual(m1._datatype, m2._datatype)
    })

    it('should create a DenseMatrix using method create', function () {
      const a = new DenseMatrix([1, 2, 3])

      const b = a.create([4, 5, 6])
      assert.strictEqual(b.isDenseMatrix, true)
      assert.deepStrictEqual(b, new DenseMatrix([4, 5, 6]))

      const c = a.create([7, 8, 9], 'number')
      assert.deepStrictEqual(c, new DenseMatrix([7, 8, 9], 'number'))
    })

    it('should have a property isMatrix', function () {
      const a = new DenseMatrix()
      assert.strictEqual(a.isMatrix, true)
    })

    it('should have a property isDenseMatrix', function () {
      const a = new DenseMatrix()
      assert.strictEqual(a.isDenseMatrix, true)
    })

    it('should have a property type', function () {
      const a = new DenseMatrix()
      assert.strictEqual(a.type, 'DenseMatrix')
    })

    it('should throw an error when the dimensions of the input array are invalid', function () {
      assert.throws(function () {
        console.log(new DenseMatrix(
          [
            [1, 2],
            [4, 5, 6]
          ]))
      }, /DimensionError: Dimension mismatch \(3 != 2\)/)
    })

    it('should throw an error when called without new keyword', function () {
      assert.throws(function () { DenseMatrix() }, /Constructor must be called with the new operator/)
    })

    it('should throw an error when called with invalid datatype', function () {
      assert.throws(function () { console.log(new DenseMatrix([], 1)) })
    })

    it('should not mutate the input data when creating a Matrix (1)', function () {
      const data = [[1, 2]]
      Object.freeze(data)

      const matrix = new DenseMatrix(data) // should not throw "TypeError: Cannot assign to read only property '0' of object '[object Array]'"
      assert.deepStrictEqual(matrix.valueOf(), [[1, 2]])
      assert.notStrictEqual(matrix.valueOf(), data)
    })

    it('should not mutate the input data when creating a Matrix (2)', function () {
      const nestedMatrix = new DenseMatrix([1, 2])
      const data = [nestedMatrix]

      const matrix = new DenseMatrix(data)
      assert.deepStrictEqual(matrix._data, [[1, 2]])
      assert.deepStrictEqual(data, [nestedMatrix]) // should not have replaced the nestedMatrix in data itself
    })

    it('should not mutate the input data operating on a Matrix', function () {
      const data = [[1, 2]]

      const matrix = new DenseMatrix(data)
      matrix.set([0, 1], 42)

      assert.deepStrictEqual(matrix, new DenseMatrix([[1, 42]]))
      assert.deepStrictEqual(data, [[1, 2]])
    })
  })

  describe('size', function () {
    it('should return the expected size', function () {
      assert.deepStrictEqual(new DenseMatrix().size(), [0])
      assert.deepStrictEqual(new DenseMatrix([[23]]).size(), [1, 1])
      assert.deepStrictEqual(new DenseMatrix([[1, 2, 3], [4, 5, 6]]).size(), [2, 3])
      assert.deepStrictEqual(new DenseMatrix([1, 2, 3]).size(), [3])
      assert.deepStrictEqual(new DenseMatrix([[1], [2], [3]]).size(), [3, 1])
      assert.deepStrictEqual(new DenseMatrix([[[1], [2], [3]]]).size(), [1, 3, 1])
      assert.deepStrictEqual(new DenseMatrix([[[3]]]).size(), [1, 1, 1])
      assert.deepStrictEqual(new DenseMatrix([[]]).size(), [1, 0])
    })

    it('should return a clone of the size', function () {
      const m = new DenseMatrix([[1, 2, 3], [4, 5, 6]])
      const s = m.size()

      assert.deepStrictEqual(s, [2, 3])

      // change s, should not change the size of m
      s[2] = 4
      assert.deepStrictEqual(s, [2, 3, 4])
      assert.deepStrictEqual(m.size(), [2, 3])
    })
  })

  describe('toString', function () {
    it('should return string representation of matrix', function () {
      assert.strictEqual(new DenseMatrix([[1, 2], [3, 4]]).toString(), '[[1, 2], [3, 4]]')
      assert.strictEqual(new DenseMatrix([[1, 2], [3, 1 / 3]]).toString(), '[[1, 2], [3, 0.3333333333333333]]')
    })
  })

  describe('toJSON', function () {
    it('should serialize Matrix', function () {
      assert.deepStrictEqual(
        new DenseMatrix([[1, 2], [3, 4]]).toJSON(),
        {
          mathjs: 'DenseMatrix',
          data: [[1, 2], [3, 4]],
          size: [2, 2],
          datatype: undefined
        })
    })

    it('should serialize Matrix, number datatype', function () {
      assert.deepStrictEqual(
        new DenseMatrix([[1, 2], [3, 4]], 'number').toJSON(),
        {
          mathjs: 'DenseMatrix',
          data: [[1, 2], [3, 4]],
          size: [2, 2],
          datatype: 'number'
        })
    })
  })

  describe('fromJSON', function () {
    it('should deserialize Matrix', function () {
      const json = {
        mathjs: 'DenseMatrix',
        data: [[1, 2], [3, 4]],
        size: [2, 2]
      }
      const m = DenseMatrix.fromJSON(json)
      assert.ok(m instanceof Matrix)

      assert.deepStrictEqual(m._size, [2, 2])
      assert.strictEqual(m._data[0][0], 1)
      assert.strictEqual(m._data[0][1], 2)
      assert.strictEqual(m._data[1][0], 3)
      assert.strictEqual(m._data[1][1], 4)
    })

    it('should deserialize Matrix, number datatype', function () {
      const json = {
        mathjs: 'DenseMatrix',
        data: [[1, 2], [3, 4]],
        size: [2, 2],
        datatype: 'number'
      }
      const m = DenseMatrix.fromJSON(json)
      assert.ok(m instanceof Matrix)

      assert.deepStrictEqual(m._size, [2, 2])
      assert.strictEqual(m._data[0][0], 1)
      assert.strictEqual(m._data[0][1], 2)
      assert.strictEqual(m._data[1][0], 3)
      assert.strictEqual(m._data[1][1], 4)
      assert.strictEqual(m._datatype, 'number')
    })

    it('should throw an error when size is not correct', function () {
      const json = {
        mathjs: 'DenseMatrix',
        data: [[1, 2], [3, 4]],
        size: [4, 2] // wrong size
      }
      assert.throws(() => {
        DenseMatrix.fromJSON(json)
      }, 'Bla')
    })
  })

  describe('format', function () {
    it('should format matrix', function () {
      assert.strictEqual(new DenseMatrix([[1, 2], [3, 1 / 3]]).format(), '[[1, 2], [3, 0.3333333333333333]]')
      assert.strictEqual(new DenseMatrix([[1, 2], [3, 1 / 3]]).format(3), '[[1, 2], [3, 0.333]]')
      assert.strictEqual(new DenseMatrix([[1, 2], [3, 1 / 3]]).format(4), '[[1, 2], [3, 0.3333]]')
    })
  })

  describe('resize', function () {
    it('should resize the matrix correctly', function () {
      let m = new DenseMatrix([[1, 2, 3], [4, 5, 6]])
      m.resize([2, 4])
      assert.deepStrictEqual(m.valueOf(), [[1, 2, 3, 0], [4, 5, 6, 0]])

      m.resize([1, 2])
      assert.deepStrictEqual(m.valueOf(), [[1, 2]])

      m.resize([1, 2, 2], 8)
      assert.deepStrictEqual(m.valueOf(), [[[1, 8], [2, 8]]])

      m.resize([2, 3], 9)
      assert.deepStrictEqual(m.valueOf(), [[1, 2, 9], [9, 9, 9]])

      m = new DenseMatrix()
      m.resize([3, 3, 3], 6)
      assert.deepStrictEqual(m.valueOf(), [
        [[6, 6, 6], [6, 6, 6], [6, 6, 6]],
        [[6, 6, 6], [6, 6, 6], [6, 6, 6]],
        [[6, 6, 6], [6, 6, 6], [6, 6, 6]]
      ])

      m.resize([2, 2])
      assert.deepStrictEqual(m.valueOf(), [[6, 6], [6, 6]])

      m.resize([0])
      assert.deepStrictEqual(m.valueOf(), [])
    })

    it('should resize the matrix with DenseMatrix as input', function () {
      const m = new DenseMatrix([[1, 2, 3], [4, 5, 6]])
      m.resize(new DenseMatrix([2, 4]))
      assert.deepStrictEqual(m.valueOf(), [[1, 2, 3, 0], [4, 5, 6, 0]])
    })

    it('should resize the matrix with SparseMatrix as input', function () {
      const m = new DenseMatrix([[1, 2, 3], [4, 5, 6]])
      m.resize(new SparseMatrix([2, 4]))
      assert.deepStrictEqual(m.valueOf(), [[1, 2, 3, 0], [4, 5, 6, 0]])
    })

    it('should resize the matrix with null default value', function () {
      const m = new DenseMatrix([])
      m.resize([3], null)
      assert.deepStrictEqual(m.valueOf(), [null, null, null])
    })

    it('should return a different matrix when copy=true', function () {
      const m1 = new DenseMatrix(
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
      assert.deepStrictEqual(
        m1._data,
        [
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0]
        ])
      // new matrix should have correct size
      assert.deepStrictEqual(m2._size, [2, 2])
      assert.deepStrictEqual(
        m2._data,
        [
          [0, 0],
          [0, 0]
        ])
    })
  })

  describe('reshape', function () {
    it('should reshape the matrix properly', function () {
      const m = new DenseMatrix([[1, 2, 3], [4, 5, 6]])
      m.reshape([3, 2])
      assert.deepStrictEqual(m.valueOf(), [[1, 2], [3, 4], [5, 6]])
      m.reshape([6, 1])
      assert.deepStrictEqual(m.valueOf(), [[1], [2], [3], [4], [5], [6]])
    })

    it('should return a copy only when specified', function () {
      const m1 = new DenseMatrix([[1, 2], [3, 4]])
      const m2 = m1.reshape([4])
      const m3 = m2.reshape([1, 4], true)

      assert.strictEqual(m2, m1)
      assert.deepStrictEqual(m2.valueOf(), [1, 2, 3, 4])
      assert.deepStrictEqual(m2.valueOf(), m1.valueOf())

      assert.notStrictEqual(m3, m2)
      assert.deepStrictEqual(m3.valueOf(), [[1, 2, 3, 4]])
      assert.notDeepStrictEqual(m3.valueOf(), m2.valueOf())
    })

    it('should update the size of the reshaped matrix', function () {
      const m1 = new DenseMatrix([[1, 2], [3, 4]])
      const m2 = m1.reshape([4], true)

      assert.deepStrictEqual(m1.size(), [2, 2])

      m1.reshape([1, 1, 4])

      assert.deepStrictEqual(m1.size(), [1, 1, 4])
      assert.deepStrictEqual(m2.size(), [4])
    })
  })

  describe('get', function () {
    const m = new DenseMatrix([[0, 1], [2, 3]])

    it('should get a value from the matrix', function () {
      assert.strictEqual(m.get([1, 0]), 2)
      assert.strictEqual(m.get([0, 1]), 1)
    })

    it('should throw an error when getting a value out of range', function () {
      assert.throws(function () { m.get([3, 0]) })
      assert.throws(function () { m.get([1, 5]) })
      assert.throws(function () { m.get([1]) })
      assert.throws(function () { m.get([]) })
    })

    it('should throw an error in case of dimension mismatch', function () {
      assert.throws(function () { m.get([0, 2, 0, 2, 0, 2]) }, /Dimension mismatch/)
    })

    it('should throw an error when getting a value given a invalid index', function () {
      assert.throws(function () { m.get([1.2, 2]) })
      assert.throws(function () { m.get([1, -2]) })
      assert.throws(function () { m.get(1, 1) })
      assert.throws(function () { m.get(math.index(1, 1)) })
      assert.throws(function () { m.get([[1, 1]]) })
    })
  })

  describe('set', function () {
    it('should set a value in a matrix', function () {
      const m = new DenseMatrix([[0, 0], [0, 0]])
      m.set([1, 0], 5)
      assert.deepStrictEqual(m, new DenseMatrix([
        [0, 0],
        [5, 0]
      ]))

      m.set([0, 2], 4)
      assert.deepStrictEqual(m, new DenseMatrix([
        [0, 0, 4],
        [5, 0, 0]
      ]))

      m.set([0, 0, 1], 3)
      assert.deepStrictEqual(m, new DenseMatrix([
        [[0, 3], [0, 0], [4, 0]],
        [[5, 0], [0, 0], [0, 0]]
      ]))
    })

    it('should set a value in a matrix with defaultValue for new elements', function () {
      const m = new DenseMatrix()
      const defaultValue = 0
      m.set([2], 4, defaultValue)
      assert.deepStrictEqual(m, new DenseMatrix([0, 0, 4]))
    })

    it('should throw an error when setting a value given a invalid index', function () {
      const m = new DenseMatrix([[0, 0], [0, 0]])
      assert.throws(function () { m.set([2.5, 0], 5) })
      assert.throws(function () { m.set([1], 5) })
      assert.throws(function () { m.set([-1, 1], 5) })
      assert.throws(function () { m.set(math.index(new Range(0, 0)), 5) })
    })
  })

  describe('get subset', function () {
    it('should get the right subset of the matrix', function () {
      let m

      // get 1-dimensional
      m = new DenseMatrix(math.range(0, 10))
      assert.deepStrictEqual(m.size(), [10])
      assert.deepStrictEqual(m.subset(index(new Range(2, 5))).valueOf(), [2, 3, 4])

      // get 2-dimensional
      m = new DenseMatrix([[1, 2, 3], [4, 5, 6], [7, 8, 9]])
      assert.deepStrictEqual(m.size(), [3, 3])
      assert.deepStrictEqual(m.subset(index(1, 1)), 5)
      assert.deepStrictEqual(m.subset(index(new Range(0, 2), new Range(0, 2))).valueOf(), [[1, 2], [4, 5]])
      assert.deepStrictEqual(m.subset(index(1, new Range(1, 3))).valueOf(), [5, 6])
      assert.deepStrictEqual(m.subset(index(0, new Range(1, 3))).valueOf(), [2, 3])
      assert.deepStrictEqual(m.subset(index(new Range(1, 3), 1)).valueOf(), [5, 8])
      assert.deepStrictEqual(m.subset(index(new Range(1, 3), 2)).valueOf(), [6, 9])
      assert.deepStrictEqual(m.subset(index([0, 1, 2], [1])).valueOf(), [[2], [5], [8]])

      // get n-dimensional
      m = new DenseMatrix([[[1, 2], [3, 4]], [[5, 6], [7, 8]]])
      assert.deepStrictEqual(m.size(), [2, 2, 2])
      assert.deepStrictEqual(m.subset(index(new Range(0, 2), new Range(0, 2), new Range(0, 2))).valueOf(), m.valueOf())
      assert.deepStrictEqual(m.subset(index(0, 0, 0)), 1)
      assert.deepStrictEqual(m.subset(index(1, 1, 1)).valueOf(), 8)
      assert.deepStrictEqual(m.subset(index(1, 1, new Range(0, 2))).valueOf(), [7, 8])
      assert.deepStrictEqual(m.subset(index(1, new Range(0, 2), 1)).valueOf(), [6, 8])
      assert.deepStrictEqual(m.subset(index(new Range(0, 2), 1, 1)).valueOf(), [4, 8])
    })

    it('should squeeze the output when index contains a scalar', function () {
      let m = new DenseMatrix(math.range(0, 10))
      assert.deepStrictEqual(m.subset(index(1)), 1)
      assert.deepStrictEqual(m.subset(index(new Range(1, 2))), new DenseMatrix([1]))

      m = new DenseMatrix([[1, 2], [3, 4]])
      assert.deepStrictEqual(m.subset(index(1, 1)), 4)
      assert.deepStrictEqual(m.subset(index(new Range(1, 2), 1)), new DenseMatrix([4]))
      assert.deepStrictEqual(m.subset(index(1, new Range(1, 2))), new DenseMatrix([4]))
      assert.deepStrictEqual(m.subset(index(new Range(1, 2), new Range(1, 2))), new DenseMatrix([[4]]))
    })

    it('should throw an error if the given subset is invalid', function () {
      let m = new DenseMatrix()
      assert.throws(function () { m.subset([-1]) })

      m = new DenseMatrix([[1, 2, 3], [4, 5, 6]])
      assert.throws(function () { m.subset([1, 2, 3]) })
      assert.throws(function () { m.subset([3, 0]) })
      assert.throws(function () { m.subset([1]) })
    })

    it('should throw an error in case of wrong number of arguments', function () {
      const m = new DenseMatrix()
      assert.throws(function () { m.subset() }, /Wrong number of arguments/)
      assert.throws(function () { m.subset(1, 2, 3, 4) }, /Wrong number of arguments/)
    })

    it('should throw an error in case of dimension mismatch', function () {
      const m = new DenseMatrix([[1, 2, 3], [4, 5, 6]])
      assert.throws(function () { m.subset(index(new Range(0, 2))) }, /Dimension mismatch/)
    })
  })

  describe('set subset', function () {
    it('should set the given subset', function () {
      // set 1-dimensional
      let m = new DenseMatrix(math.range(0, 7))
      m.subset(index(new Range(2, 4)), [20, 30])
      assert.deepStrictEqual(m, new DenseMatrix([0, 1, 20, 30, 4, 5, 6]))
      m.subset(index(4), 40)
      assert.deepStrictEqual(m, new DenseMatrix([0, 1, 20, 30, 40, 5, 6]))

      // set 2-dimensional
      m = new DenseMatrix()
      m.resize([3, 3])
      assert.deepStrictEqual(m, new DenseMatrix([
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
      ]))
      m.subset(index(new Range(1, 3), new Range(1, 3)), [[1, 2], [3, 4]])
      assert.deepStrictEqual(m, new DenseMatrix([
        [0, 0, 0],
        [0, 1, 2],
        [0, 3, 4]]))
      m.subset(index(0, new Range(0, 3)), [5, 6, 7])
      assert.deepStrictEqual(m, new DenseMatrix([[5, 6, 7], [0, 1, 2], [0, 3, 4]]))
      m.subset(index(new Range(0, 3), 0), [8, 9, 10]) // unsqueezes the submatrix
      assert.deepStrictEqual(m, new DenseMatrix([[8, 6, 7], [9, 1, 2], [10, 3, 4]]))
    })

    it('should set the given subset with defaultValue for new elements', function () {
      // multiple values
      const m = new DenseMatrix()
      let defaultValue = 0
      m.subset(index(new Range(3, 5)), [3, 4], defaultValue)
      assert.deepStrictEqual(m, new DenseMatrix([0, 0, 0, 3, 4]))

      defaultValue = 1
      m.subset(index(new Range(3, 5), 1), [5, 6], defaultValue)
      assert.deepStrictEqual(m, new DenseMatrix([
        [0, 1],
        [0, 1],
        [0, 1],
        [3, 5],
        [4, 6]
      ]))

      defaultValue = 2
      m.subset(index(new Range(3, 5), 2), [7, 8], defaultValue)
      assert.deepStrictEqual(m, new DenseMatrix([
        [0, 1, 2],
        [0, 1, 2],
        [0, 1, 2],
        [3, 5, 7],
        [4, 6, 8]
      ]))

      // a single value
      const i = new DenseMatrix()
      defaultValue = 0
      i.subset(math.index(2, 1), 6, defaultValue)
      assert.deepStrictEqual(i, new DenseMatrix([[0, 0], [0, 0], [0, 6]]))
    })

    it('should unsqueeze the replacement subset if needed', function () {
      let m = new DenseMatrix([[0, 0], [0, 0]]) // 2x2

      m.subset(index(0, new Range(0, 2)), [1, 1]) // 2
      assert.deepStrictEqual(m, new DenseMatrix([[1, 1], [0, 0]]))

      m = new DenseMatrix([[[0], [0], [0]]]) // 1x3x1
      m.subset(index(0, new Range(0, 3), 0), [1, 2, 3]) // 3
      assert.deepStrictEqual(m, new DenseMatrix([[[1], [2], [3]]]))

      m = new DenseMatrix([[[0, 0, 0]]]) // 1x1x3
      m.subset(index(0, 0, new Range(0, 3)), [1, 2, 3]) // 3
      assert.deepStrictEqual(m, new DenseMatrix([[[1, 2, 3]]]))

      m = new DenseMatrix([[[0]], [[0]], [[0]]]) // 3x1x1
      m.subset(index(new Range(0, 3), 0, 0), [1, 2, 3]) // 3
      assert.deepStrictEqual(m, new DenseMatrix([[[1]], [[2]], [[3]]]))

      m = new DenseMatrix([[[0, 0, 0]]]) // 1x1x3
      m.subset(index(0, 0, new Range(0, 3)), [[1, 2, 3]]) // 1x3
      assert.deepStrictEqual(m, new DenseMatrix([[[1, 2, 3]]]))

      m = new DenseMatrix([[[0]], [[0]], [[0]]]) // 3x1x1
      m.subset(index(new Range(0, 3), 0, 0), [[1], [2], [3]]) // 3x1
      assert.deepStrictEqual(m, new DenseMatrix([[[1]], [[2]], [[3]]]))
    })

    it('should leave the subset unchanged when unsqueezing it', function () {
      const m = new DenseMatrix([[0, 0], [0, 0]]) // 2 dimensional
      const r = new DenseMatrix([1, 2]) // 1 dimensional

      m.subset(index(0, new Range(0, 2)), r)

      assert.deepStrictEqual(m, new DenseMatrix([[1, 2], [0, 0]]))
      assert.deepStrictEqual(r, new DenseMatrix([1, 2]))
    })

    it('should resize the matrix if the replacement subset is different size than selected subset', function () {
      // set 2-dimensional with resize
      let m = new DenseMatrix([[123]])
      m.subset(index(new Range(1, 3), new Range(1, 3)), [[1, 2], [3, 4]])
      assert.deepStrictEqual(m, new DenseMatrix([[123, 0, 0], [0, 1, 2], [0, 3, 4]]))

      // set resize dimensions
      m = new DenseMatrix([123])
      assert.deepStrictEqual(m.size(), [1])

      m.subset(index(new Range(1, 3), new Range(1, 3)), [[1, 2], [3, 4]])
      assert.deepStrictEqual(m, new DenseMatrix([[123, 0, 0], [0, 1, 2], [0, 3, 4]]))

      m.subset(index(new Range(0, 2), new Range(0, 2)), [[55, 55], [55, 55]])
      assert.deepStrictEqual(m, new DenseMatrix([[55, 55, 0], [55, 55, 2], [0, 3, 4]]))

      m = new DenseMatrix()
      m.subset(index(new Range(1, 3), new Range(1, 3), new Range(1, 3)), [[[1, 2], [3, 4]], [[5, 6], [7, 8]]])
      const res = new DenseMatrix([
        [
          [0, 0, 0],
          [0, 0, 0],
          [0, 0, 0]
        ],
        [
          [0, 0, 0],
          [0, 1, 2],
          [0, 3, 4]
        ],
        [
          [0, 0, 0],
          [0, 5, 6],
          [0, 7, 8]
        ]
      ])
      assert.deepStrictEqual(m, res)
    })

    it('should throw an error in case of wrong type of index', function () {
      assert.throws(function () { console.log(new DenseMatrix().subset('no index', 2)) }, /Invalid index/)
    })

    it('should throw an error in case of wrong size of submatrix', function () {
      assert.throws(function () { console.log(new DenseMatrix().subset(index(0), [2, 3])) }, /Scalar expected/)
    })

    it('should throw an error in case of dimension mismatch', function () {
      const m = new DenseMatrix([[1, 2, 3], [4, 5, 6]])
      assert.throws(function () { m.subset(index(new Range(0, 2)), [100, 100]) }, /Dimension mismatch/)
      assert.throws(function () { m.subset(index(new Range(0, 2), new Range(0, 2)), [100, 100, 100]) }, /Dimension mismatch/)
    })
  })

  describe('map', function () {
    it('should apply the given function to all elements in the matrix', function () {
      let m = new DenseMatrix([
        [[1, 2], [3, 4]],
        [[5, 6], [7, 8]],
        [[9, 10], [11, 12]],
        [[13, 14], [15, 16]]
      ])
      let m2 = m.map(function (value) { return value * 2 })
      assert.deepStrictEqual(
        m2.valueOf(),
        [
          [[2, 4], [6, 8]],
          [[10, 12], [14, 16]],
          [[18, 20], [22, 24]],
          [[26, 28], [30, 32]]
        ])

      m = new DenseMatrix([1])
      m2 = m.map(function (value) { return value * 2 })
      assert.deepStrictEqual(m2.valueOf(), [2])

      m = new DenseMatrix([1, 2, 3])
      m2 = m.map(function (value) { return value * 2 })
      assert.deepStrictEqual(m2.valueOf(), [2, 4, 6])
    })

    it('should work on empty matrices', function () {
      const m = new DenseMatrix([])
      const m2 = m.map(function (value) { return value * 2 })
      assert.deepStrictEqual(m2.toArray(), [])
    })

    it('should invoke callback with parameters value, index, obj', function () {
      const m = new DenseMatrix([[1, 2, 3], [4, 5, 6]])
      const m2 = m.map(
        function (value, index, obj) {
          return [value, index, obj === m]
        }
      )

      assert.deepStrictEqual(
        m2.toArray(),
        [
          [
            [1, [0, 0], true],
            [2, [0, 1], true],
            [3, [0, 2], true]
          ],
          [
            [4, [1, 0], true],
            [5, [1, 1], true],
            [6, [1, 2], true]
          ]
        ])
    })

    it("should throw an error if it the typed function doesn't accept the type of argument", function () {
      const matrix = new DenseMatrix([1, 'two'])
      const callback = math.typed({ number: function (value) { return value + 1 } })
      assert.throws(() => matrix.map(callback), /TypeError: Function map cannot apply callback arguments/)
    })
  })

  describe('forEach', function () {
    it('should run on all elements of the matrix, last dimension first', function () {
      let m, output

      m = new DenseMatrix([
        [[1, 2], [3, 4]],
        [[5, 6], [7, 8]],
        [[9, 10], [11, 12]],
        [[13, 14], [15, 16]]
      ])
      output = []
      m.forEach(function (value) { output.push(value) })
      assert.deepStrictEqual(output, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16])

      m = new DenseMatrix([1])
      output = []
      m.forEach(function (value) { output.push(value) })
      assert.deepStrictEqual(output, [1])

      m = new DenseMatrix([1, 2, 3])
      output = []
      m.forEach(function (value) { output.push(value) })
      assert.deepStrictEqual(output, [1, 2, 3])
    })

    it('should work on empty matrices', function () {
      const m = new DenseMatrix([])
      const output = []
      m.forEach(function (value) { output.push(value) })
      assert.deepStrictEqual(output, [])
    })

    it('should invoke callback with parameters value, index, obj', function () {
      const m = new DenseMatrix([[1, 2, 3], [4, 5, 6]])
      const output = []
      m.forEach(
        function (value, index, obj) {
          output.push([value, index, obj === m])
        }
      )
      assert.deepStrictEqual(output, [
        [1, [0, 0], true],
        [2, [0, 1], true],
        [3, [0, 2], true],
        [4, [1, 0], true],
        [5, [1, 1], true],
        [6, [1, 2], true]
      ])
    })
  })

  describe('iterable', function () {
    it('should iterate in the same order as forEach', function () {
      let m, expected

      m = new DenseMatrix([
        [[1, 2], [3, 4]],
        [[5, 6], [7, 8]],
        [[9, 10], [11, 12]],
        [[13, 14], [15, 16]]
      ])
      expected = []
      m.forEach((value, index) => { expected.push({ value, index }) })
      assert.deepStrictEqual(expected, [...m])

      m = new DenseMatrix([1])
      expected = []
      m.forEach((value, index) => { expected.push({ value, index }) })
      assert.deepStrictEqual(expected, [...m])

      m = new DenseMatrix([1, 2, 3])
      expected = []
      m.forEach((value, index) => { expected.push({ value, index }) })
      assert.deepStrictEqual(expected, [...m])

      m = new DenseMatrix([])
      expected = []
      m.forEach((value, index) => { expected.push({ value, index }) })
      assert.deepStrictEqual(expected, [...m])
    })
  })

  describe('clone', function () {
    it('should clone the matrix properly', function () {
      const m1 = new DenseMatrix(
        [
          [1, 2, 3],
          [4, 5, 6]
        ])

      const m2 = m1.clone()

      assert.deepStrictEqual(m1._data, m2._data)
    })
  })

  describe('toArray', function () {
    it('should return array', function () {
      const m = new DenseMatrix({
        data:
        [
          [1, 2, 3],
          [4, 5, 6],
          [7, 8, 9],
          [10, 11, 12]
        ],
        size: [4, 3]
      })

      const a = m.toArray()

      assert.deepStrictEqual(
        a,
        [
          [1, 2, 3],
          [4, 5, 6],
          [7, 8, 9],
          [10, 11, 12]
        ])
    })

    it('should return array, complex numbers', function () {
      const m = new DenseMatrix({
        data: [new Complex(1, 1), new Complex(4, 4), new Complex(5, 5), new Complex(2, 2), new Complex(3, 3), new Complex(6, 6)],
        size: [6]
      })

      const a = m.toArray()

      assert.deepStrictEqual(a, [new Complex(1, 1), new Complex(4, 4), new Complex(5, 5), new Complex(2, 2), new Complex(3, 3), new Complex(6, 6)])
    })
  })

  describe('diagonal', function () {
    it('should create matrix (n x n)', function () {
      const m = DenseMatrix.diagonal([3, 3], 1)

      assert.deepStrictEqual(m._size, [3, 3])
      assert.deepStrictEqual(
        m.toArray(),
        [
          [1, 0, 0],
          [0, 1, 0],
          [0, 0, 1]
        ])
    })

    it('should create matrix (n x n), k > 0', function () {
      const m = DenseMatrix.diagonal([3, 3], 1, 1)

      assert.deepStrictEqual(m._size, [3, 3])
      assert.deepStrictEqual(
        m.toArray(),
        [
          [0, 1, 0],
          [0, 0, 1],
          [0, 0, 0]
        ])
    })

    it('should create matrix (n x n), k < 0', function () {
      const m = DenseMatrix.diagonal([3, 3], 1, -1)

      assert.deepStrictEqual(m._size, [3, 3])
      assert.deepStrictEqual(
        m.toArray(),
        [
          [0, 0, 0],
          [1, 0, 0],
          [0, 1, 0]
        ])
    })

    it('should create matrix (n x n), vector value', function () {
      const m = DenseMatrix.diagonal([3, 3], [1, 2, 3])

      assert.deepStrictEqual(m._size, [3, 3])
      assert.deepStrictEqual(
        m.toArray(),
        [
          [1, 0, 0],
          [0, 2, 0],
          [0, 0, 3]
        ])
    })

    it('should create matrix (n x n), vector value, k > 0', function () {
      const m = DenseMatrix.diagonal([3, 3], [1, 2], 1)

      assert.deepStrictEqual(m._size, [3, 3])
      assert.deepStrictEqual(
        m.toArray(),
        [
          [0, 1, 0],
          [0, 0, 2],
          [0, 0, 0]
        ])
    })

    it('should create matrix (n x n), vector value, k < 0', function () {
      const m = DenseMatrix.diagonal([3, 3], [1, 2], -1)

      assert.deepStrictEqual(m._size, [3, 3])
      assert.deepStrictEqual(
        m.toArray(),
        [
          [0, 0, 0],
          [1, 0, 0],
          [0, 2, 0]
        ])
    })

    it('should create matrix (n x n), matrix vector value', function () {
      const m = DenseMatrix.diagonal([3, 3], math.matrix([1, 2, 3]))

      assert.deepStrictEqual(m._size, [3, 3])
      assert.deepStrictEqual(
        m.toArray(),
        [
          [1, 0, 0],
          [0, 2, 0],
          [0, 0, 3]
        ])
    })

    it('should create matrix (n x n), matrix vector value, k > 0', function () {
      const m = DenseMatrix.diagonal([3, 3], math.matrix([1, 2]), 1)

      assert.deepStrictEqual(m._size, [3, 3])
      assert.deepStrictEqual(
        m.toArray(),
        [
          [0, 1, 0],
          [0, 0, 2],
          [0, 0, 0]
        ])
    })

    it('should create matrix (n x n), matrix vector value, k < 0', function () {
      const m = DenseMatrix.diagonal([3, 3], math.matrix([1, 2]), -1)

      assert.deepStrictEqual(m._size, [3, 3])
      assert.deepStrictEqual(
        m.toArray(),
        [
          [0, 0, 0],
          [1, 0, 0],
          [0, 2, 0]
        ])
    })

    it('should create matrix (m x n), m > n', function () {
      const m = DenseMatrix.diagonal([4, 3], 1)

      assert.deepStrictEqual(m._size, [4, 3])
      assert.deepStrictEqual(
        m.toArray(),
        [
          [1, 0, 0],
          [0, 1, 0],
          [0, 0, 1],
          [0, 0, 0]
        ])
    })

    it('should create matrix (m x n), m > n, k > 0', function () {
      const m = DenseMatrix.diagonal([4, 3], 1, 1)

      assert.deepStrictEqual(m._size, [4, 3])
      assert.deepStrictEqual(
        m.toArray(),
        [
          [0, 1, 0],
          [0, 0, 1],
          [0, 0, 0],
          [0, 0, 0]
        ])
    })

    it('should create matrix (m x n), m > n, k < 0', function () {
      const m = DenseMatrix.diagonal([4, 3], 1, -1)

      assert.deepStrictEqual(m._size, [4, 3])
      assert.deepStrictEqual(
        m.toArray(),
        [
          [0, 0, 0],
          [1, 0, 0],
          [0, 1, 0],
          [0, 0, 1]
        ])
    })

    it('should create matrix (m x n), m > n, vector value', function () {
      const m = DenseMatrix.diagonal([4, 3], [1, 2, 3])

      assert.deepStrictEqual(m._size, [4, 3])
      assert.deepStrictEqual(
        m.toArray(),
        [
          [1, 0, 0],
          [0, 2, 0],
          [0, 0, 3],
          [0, 0, 0]
        ])
    })

    it('should create matrix (m x n), m > n, vector value, k > 0', function () {
      const m = DenseMatrix.diagonal([4, 3], [1, 2], 1)

      assert.deepStrictEqual(m._size, [4, 3])
      assert.deepStrictEqual(
        m.toArray(),
        [
          [0, 1, 0],
          [0, 0, 2],
          [0, 0, 0],
          [0, 0, 0]
        ])
    })

    it('should create matrix (m x n), m > n, vector value, k < 0', function () {
      const m = DenseMatrix.diagonal([4, 3], [1, 2, 3], -1)

      assert.deepStrictEqual(m._size, [4, 3])
      assert.deepStrictEqual(
        m.toArray(),
        [
          [0, 0, 0],
          [1, 0, 0],
          [0, 2, 0],
          [0, 0, 3]
        ])
    })

    it('should create matrix (m x n), m < n', function () {
      const m = DenseMatrix.diagonal([3, 4], 1)

      assert.deepStrictEqual(m._size, [3, 4])
      assert.deepStrictEqual(
        m.toArray(),
        [
          [1, 0, 0, 0],
          [0, 1, 0, 0],
          [0, 0, 1, 0]
        ])
    })

    it('should create matrix (m x n), m < n, k > 0', function () {
      const m = DenseMatrix.diagonal([3, 4], 1, 1)

      assert.deepStrictEqual(m._size, [3, 4])
      assert.deepStrictEqual(
        m.toArray(),
        [
          [0, 1, 0, 0],
          [0, 0, 1, 0],
          [0, 0, 0, 1]
        ])
    })

    it('should create matrix (m x n), m < n, k < 0', function () {
      const m = DenseMatrix.diagonal([3, 4], 1, -1)

      assert.deepStrictEqual(m._size, [3, 4])
      assert.deepStrictEqual(
        m.toArray(),
        [
          [0, 0, 0, 0],
          [1, 0, 0, 0],
          [0, 1, 0, 0]
        ])
    })

    it('should create matrix (m x n), m < n, vector value', function () {
      const m = DenseMatrix.diagonal([3, 4], [1, 2, 3])

      assert.deepStrictEqual(m._size, [3, 4])
      assert.deepStrictEqual(
        m.toArray(),
        [
          [1, 0, 0, 0],
          [0, 2, 0, 0],
          [0, 0, 3, 0]
        ])
    })

    it('should create matrix (m x n), m < n, vector value, k > 0', function () {
      const m = DenseMatrix.diagonal([3, 4], [1, 2, 3], 1)

      assert.deepStrictEqual(m._size, [3, 4])
      assert.deepStrictEqual(
        m.toArray(),
        [
          [0, 1, 0, 0],
          [0, 0, 2, 0],
          [0, 0, 0, 3]
        ])
    })

    it('should create matrix (m x n), m < n, vector value, k < 0', function () {
      const m = DenseMatrix.diagonal([3, 4], [1, 2], -1)

      assert.deepStrictEqual(m._size, [3, 4])
      assert.deepStrictEqual(
        m.toArray(),
        [
          [0, 0, 0, 0],
          [1, 0, 0, 0],
          [0, 2, 0, 0]
        ])
    })

    it('should get matrix diagonal (n x n)', function () {
      const m = new DenseMatrix(
        [
          [1, 0, 0],
          [0, 1, 0],
          [0, 0, 1]
        ])

      assert.deepStrictEqual(m.diagonal(), new DenseMatrix([1, 1, 1]))
    })

    it('should get matrix diagonal (n x n), k > 0', function () {
      const m = new DenseMatrix(
        [
          [1, 2, 0],
          [0, 1, 3],
          [0, 0, 1]
        ])

      assert.deepStrictEqual(m.diagonal(1), new DenseMatrix([2, 3]))
    })

    it('should get matrix diagonal (n x n), k < 0', function () {
      const m = new DenseMatrix(
        [
          [1, 0, 0],
          [2, 1, 0],
          [0, 3, 1]
        ])

      assert.deepStrictEqual(m.diagonal(-1), new DenseMatrix([2, 3]))
    })

    it('should get matrix diagonal (m x n), m > n', function () {
      const m = new DenseMatrix(
        [
          [1, 0, 0],
          [0, 1, 0],
          [0, 0, 1],
          [0, 0, 0]
        ])

      assert.deepStrictEqual(m.diagonal(), new DenseMatrix([1, 1, 1]))
    })

    it('should get matrix diagonal (m x n), m > n, k > 0', function () {
      const m = new DenseMatrix(
        [
          [1, 2, 0],
          [0, 1, 3],
          [0, 0, 1],
          [0, 0, 0]
        ])

      assert.deepStrictEqual(m.diagonal(1), new DenseMatrix([2, 3]))
    })

    it('should get matrix diagonal (m x n), m > n, k < 0', function () {
      const m = new DenseMatrix(
        [
          [1, 0, 0],
          [2, 1, 0],
          [0, 3, 1],
          [0, 0, 4]
        ])

      assert.deepStrictEqual(m.diagonal(-1), new DenseMatrix([2, 3, 4]))
    })

    it('should get matrix diagonal (m x n), m < n', function () {
      const m = new DenseMatrix(
        [
          [1, 0, 0, 0],
          [0, 1, 0, 0],
          [0, 0, 1, 0]
        ])

      assert.deepStrictEqual(m.diagonal(), new DenseMatrix([1, 1, 1]))
    })

    it('should get matrix diagonal (m x n), m < n, k > 0', function () {
      const m = new DenseMatrix(
        [
          [1, 2, 0, 0],
          [0, 1, 3, 0],
          [0, 0, 1, 4]
        ])

      assert.deepStrictEqual(m.diagonal(1), new DenseMatrix([2, 3, 4]))
    })

    it('should get matrix diagonal (m x n), m < n, k < 0', function () {
      const m = new DenseMatrix(
        [
          [1, 0, 0, 0],
          [2, 1, 0, 0],
          [4, 3, 1, 0]
        ])

      assert.deepStrictEqual(m.diagonal(-1), new DenseMatrix([2, 3]))

      assert.deepStrictEqual(m.diagonal(-2), new DenseMatrix([4]))
    })
  })

  describe('swapRows', function () {
    it('should swap rows with values', function () {
      const m = new DenseMatrix(
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
      const m = new DenseMatrix(
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
      const m = new DenseMatrix(
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
      const m = new DenseMatrix(
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
      const m = new DenseMatrix(
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
      const m = new DenseMatrix(
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
  })
})
