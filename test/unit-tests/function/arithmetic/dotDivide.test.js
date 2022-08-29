// test dotDivide (element-wise divide)
import assert from 'assert'

import math from '../../../../src/defaultInstance.js'
import approx from '../../../../tools/approx.js'
const dotDivide = math.dotDivide
const complex = math.complex

describe('dotDivide', function () {
  it('should divide two numbers', function () {
    assert.strictEqual(dotDivide(4, 2), 2)
    assert.strictEqual(dotDivide(-4, 2), -2)
    assert.strictEqual(dotDivide(4, -2), -2)
    assert.strictEqual(dotDivide(-4, -2), 2)
    assert.strictEqual(dotDivide(4, 0), Infinity)
    assert.strictEqual(dotDivide(0, -5), -0)
    assert.ok(isNaN(dotDivide(0, 0)))
  })

  it('should divide booleans', function () {
    assert.strictEqual(dotDivide(true, true), 1)
    assert.strictEqual(dotDivide(true, false), Infinity)
    assert.strictEqual(dotDivide(false, true), 0)
    assert.ok(isNaN(dotDivide(false, false)))
  })

  it('should add mixed numbers and booleans', function () {
    assert.strictEqual(dotDivide(2, true), 2)
    assert.strictEqual(dotDivide(2, false), Infinity)
    approx.equal(dotDivide(true, 2), 0.5)
    assert.strictEqual(dotDivide(false, 2), 0)
  })

  it('should throw an error if there\'s wrong number of arguments', function () {
    assert.throws(function () { dotDivide(2, 3, 4) })
    assert.throws(function () { dotDivide(2) })
  })

  it('should throw an in case of wrong type of arguments', function () {
    assert.throws(function () { dotDivide(null, 1) }, /TypeError: Unexpected type of argument/)
  })

  it('should divide two complex numbers', function () {
    approx.deepEqual(dotDivide(complex('2+3i'), 2), complex('1+1.5i'))
    approx.deepEqual(dotDivide(complex('2+3i'), complex('4i')), complex('0.75 - 0.5i'))
    approx.deepEqual(dotDivide(complex('2i'), complex('4i')), 0.5)
    approx.deepEqual(dotDivide(4, complex('1+2i')), complex('0.8 - 1.6i'))
  })

  it('should divide a unit by a number', function () {
    assert.strictEqual(dotDivide(math.unit('5 m'), 10).toString(), '0.5 m')
  })

  it('should divide a number by a unit', function () {
    assert.strictEqual(dotDivide(10, math.unit('5 m')).toString(), '2 m^-1')
  })

  /*
  // This is supported not --ericman314
  it('should throw an error if dividing a number by a unit', function() {
    assert.throws(function () {dotDivide(10, math.unit('5 m')).toString()})
  });
  */

  describe('Array', function () {
    it('should divide all the elements of a array by one number', function () {
      assert.deepStrictEqual(dotDivide([2, 4, 6], 2), [1, 2, 3])
      const a = [[1, 2], [3, 4]]
      assert.deepStrictEqual(dotDivide(a, 2), [[0.5, 1], [1.5, 2]])
      assert.deepStrictEqual(dotDivide([], 2), [])
    })

    it('should divide 1 over a array element-wise', function () {
      approx.deepEqual(dotDivide(1, [[1, 4, 7], [3, 0, 5], [-1, 9, 11]]), [[1, 0.25, 1 / 7], [1 / 3, Infinity, 0.2], [-1, 1 / 9, 1 / 11]])
    })

    it('should perform (array ./ array) element-wise matrix division', function () {
      const a = [[1, 2], [3, 4]]
      const b = [[5, 6], [7, 8]]
      assert.deepStrictEqual(dotDivide(a, b), [[1 / 5, 2 / 6], [3 / 7, 4 / 8]])
    })

    it('should perform (array ./ dense matrix) element-wise matrix division', function () {
      const a = [[1, 2], [3, 4]]
      const b = math.matrix([[5, 6], [7, 8]])
      assert.deepStrictEqual(dotDivide(a, b), math.matrix([[1 / 5, 2 / 6], [3 / 7, 4 / 8]]))
    })

    it('should perform (array ./ sparse matrix) element-wise matrix division', function () {
      const a = [[1, 2], [3, 4]]
      const b = math.sparse([[5, 0], [7, 8]])
      assert.deepStrictEqual(dotDivide(a, b), math.matrix([[1 / 5, Infinity], [3 / 7, 4 / 8]]))
    })

    it('should throw an error when dividing element-wise with differing size', function () {
      assert.throws(function () { dotDivide([[1, 2], [3, 4]], [[1]]) })
    })
  })

  describe('DenseMatrix', function () {
    it('should divide all the elements of a dense matrix by one number', function () {
      assert.deepStrictEqual(dotDivide(math.matrix([2, 4, 6]), 2), math.matrix([1, 2, 3]))
      const a = math.matrix([[1, 2], [3, 4]])
      assert.deepStrictEqual(dotDivide(a, 2), math.matrix([[0.5, 1], [1.5, 2]]))
      assert.deepStrictEqual(dotDivide(math.matrix([]), 2), math.matrix([]))
    })

    it('should divide 1 over a dense matrix element-wise', function () {
      approx.deepEqual(dotDivide(1, math.matrix([[1, 4, 7], [3, 0, 5], [-1, 9, 11]])), math.matrix([[1, 0.25, 1 / 7], [1 / 3, Infinity, 0.2], [-1, 1 / 9, 1 / 11]]))
    })

    it('should perform (dense matrix ./ array) element-wise matrix division', function () {
      const a = math.matrix([[1, 2], [3, 4]])
      const b = [[5, 6], [7, 8]]
      assert.deepStrictEqual(dotDivide(a, b), math.matrix([[1 / 5, 2 / 6], [3 / 7, 4 / 8]]))
    })

    it('should perform (dense matrix ./ dense matrix) element-wise matrix division', function () {
      const a = math.matrix([[1, 2], [3, 4]])
      const b = math.matrix([[5, 6], [7, 8]])
      assert.deepStrictEqual(dotDivide(a, b), math.matrix([[1 / 5, 2 / 6], [3 / 7, 4 / 8]]))
    })

    it('should perform (dense matrix ./ sparse matrix) element-wise matrix division', function () {
      const a = math.matrix([[1, 2], [3, 4]])
      const b = math.sparse([[5, 0], [7, 8]])
      assert.deepStrictEqual(dotDivide(a, b), math.matrix([[1 / 5, Infinity], [3 / 7, 4 / 8]]))
    })

    it('should throw an error when dividing element-wise with differing size', function () {
      assert.throws(function () { dotDivide(math.matrix([[1, 2], [3, 4]]), math.matrix([[1]])) })
    })
  })

  describe('SparseMatrix', function () {
    it('should divide all the elements of a sparse matrix by one number', function () {
      assert.deepStrictEqual(dotDivide(math.sparse([[2, 0, 6], [8, 10, 12]]), 2), math.sparse([[1, 0, 3], [4, 5, 6]]))
      const a = math.sparse([[1, 2], [3, 4]])
      assert.deepStrictEqual(dotDivide(a, 2), math.sparse([[0.5, 1], [1.5, 2]]))
      assert.deepStrictEqual(dotDivide(math.sparse(), 2), math.sparse())
    })

    it('should divide 1 over a sparse matrix element-wise', function () {
      approx.deepEqual(dotDivide(1, math.sparse([[1, 4, 7], [3, 0, 5], [-1, 9, 11]])), math.matrix([[1, 0.25, 1 / 7], [1 / 3, Infinity, 0.2], [-1, 1 / 9, 1 / 11]]))
    })

    it('should perform (sparse matrix ./ array) element-wise matrix division', function () {
      const a = math.sparse([[1, 2], [3, 4]])
      const b = [[5, 6], [7, 8]]
      assert.deepStrictEqual(dotDivide(a, b), math.sparse([[1 / 5, 2 / 6], [3 / 7, 4 / 8]]))
    })

    it('should perform (sparse matrix ./ dense matrix) element-wise matrix division', function () {
      const a = math.sparse([[1, 2], [3, 4]])
      const b = math.matrix([[5, 6], [7, 8]])
      assert.deepStrictEqual(dotDivide(a, b), math.sparse([[1 / 5, 2 / 6], [3 / 7, 4 / 8]]))
    })

    it('should perform (sparse matrix ./ sparse matrix) element-wise matrix division', function () {
      const a = math.sparse([[1, 2], [0, 4]])
      const b = math.sparse([[5, 0], [7, 8]])
      assert.deepStrictEqual(dotDivide(a, b), math.matrix([[1 / 5, Infinity], [0, 4 / 8]]))
    })

    it('should throw an error when dividing element-wise with differing size', function () {
      assert.throws(function () { dotDivide(math.sparse([[1, 2], [3, 4]]), math.sparse([[1]])) })
    })
  })

  it('should LaTeX dotDivide', function () {
    const expression = math.parse('dotDivide([1,2],[3,4])')
    assert.strictEqual(expression.toTex(), '\\left(\\begin{bmatrix}1\\\\2\\end{bmatrix}.:\\begin{bmatrix}3\\\\4\\end{bmatrix}\\right)')
  })
})
