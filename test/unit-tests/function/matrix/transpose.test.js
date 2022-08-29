// test transpose
import assert from 'assert'

import math from '../../../../src/defaultInstance.js'
const transpose = math.transpose

describe('transpose', function () {
  it('should transpose a scalar', function () {
    assert.deepStrictEqual(transpose(3), 3)
  })

  it('should transpose a vector', function () {
    assert.deepStrictEqual(transpose([1, 2, 3]), [1, 2, 3])
    assert.deepStrictEqual(transpose(math.matrix([1, 2, 3]).toArray()), [1, 2, 3])
  })

  it('should transpose a 2d matrix', function () {
    assert.deepStrictEqual(transpose([[1, 2, 3], [4, 5, 6]]), [[1, 4], [2, 5], [3, 6]])
    assert.deepStrictEqual(transpose(math.matrix([[1, 2, 3], [4, 5, 6]]).toArray()), [[1, 4], [2, 5], [3, 6]])
    assert.deepStrictEqual(transpose([[1, 2], [3, 4]]), [[1, 3], [2, 4]])
    assert.deepStrictEqual(transpose([[1, 2, 3, 4]]), [[1], [2], [3], [4]])
  })

  it('should throw an error for invalid matrix transpose', function () {
    assert.throws(function () {
      assert.deepStrictEqual(transpose([[]]), [[]]) // size [2,0]
    })
    assert.throws(function () {
      transpose([[[1], [2]], [[3], [4]]]) // size [2,2,1]
    }, /RangeError: Matrix.*2, 2, 1/)
  })

  it('should throw an error if called with an invalid number of arguments', function () {
    assert.throws(function () { transpose() }, /TypeError: Too few arguments/)
    assert.throws(function () { transpose([1, 2], 2) }, /TypeError: Too many arguments/)
  })

  describe('DenseMatrix', function () {
    it('should transpose a 2d matrix', function () {
      let m = math.matrix([[1, 2, 3], [4, 5, 6]])
      let t = transpose(m)
      assert.deepStrictEqual(t.valueOf(), [[1, 4], [2, 5], [3, 6]])

      m = math.matrix([[1, 4], [2, 5], [3, 6]])
      t = transpose(m)
      assert.deepStrictEqual(t.toArray(), [[1, 2, 3], [4, 5, 6]])

      m = math.matrix([[1, 2], [3, 4]])
      t = transpose(m)
      assert.deepStrictEqual(t.valueOf(), [[1, 3], [2, 4]])

      m = math.matrix([[1, 2, 3, 4]])
      t = transpose(m)
      assert.deepStrictEqual(t.valueOf(), [[1], [2], [3], [4]])

      m = math.matrix([[1, 2, 3, 4]], 'dense', 'number')
      t = transpose(m)
      assert.deepStrictEqual(t.valueOf(), [[1], [2], [3], [4]])
      assert.ok(t.datatype() === 'number')
    })

    it('should throw an error for invalid matrix transpose', function () {
      let m = math.matrix([[]])
      assert.throws(function () { transpose(m) })

      m = math.matrix([[[1], [2]], [[3], [4]]])
      assert.throws(function () { transpose(m) })
    })
  })

  describe('SparseMatrix', function () {
    it('should transpose a 2d matrix', function () {
      let m = math.sparse([[1, 2, 3], [4, 5, 6]])
      let t = transpose(m)
      assert.deepStrictEqual(t.valueOf(), [[1, 4], [2, 5], [3, 6]])

      m = math.sparse([[1, 4], [2, 5], [3, 6]])
      t = transpose(m)
      assert.deepStrictEqual(t.toArray(), [[1, 2, 3], [4, 5, 6]])

      m = math.sparse([[1, 2], [3, 4]])
      t = transpose(m)
      assert.deepStrictEqual(t.valueOf(), [[1, 3], [2, 4]])

      m = math.sparse([[1, 2, 3, 4]], 'number')
      t = transpose(m)
      assert.deepStrictEqual(t.valueOf(), [[1], [2], [3], [4]])
      assert.ok(t.datatype() === 'number')
    })

    it('should throw an error for invalid matrix transpose', function () {
      const m = math.matrix([[]], 'sparse')
      assert.throws(function () { transpose(m) })
    })
  })

  it('should LaTeX transpose', function () {
    const expression = math.parse('transpose([[1,2],[3,4]])')
    assert.strictEqual(expression.toTex(), '\\left(\\begin{bmatrix}1&2\\\\3&4\\end{bmatrix}\\right)^\\top')
  })
})
