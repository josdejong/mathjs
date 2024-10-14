import assert from 'assert'
import math from '../../../../src/defaultInstance.js'
const BigNumber = math.BigNumber
const Complex = math.Complex
const DenseMatrix = math.DenseMatrix
const SparseMatrix = math.SparseMatrix
const det = math.det
const diag = math.diag
const identity = math.identity

describe('det', function () {
  it('should calculate correctly the determinant of a NxN matrix', function () {
    assert.strictEqual(det([5]), 5)
    assert.strictEqual(det([[1, 2], [3, 4]]), -2)
    assert.strictEqual(det(new DenseMatrix([[1, 2], [3, 4]])), -2)
    assert.strictEqual(det([
      [-2, 2, 3],
      [-1, 1, 3],
      [2, 0, -1]
    ]), 6)
    assert.strictEqual(det([
      [1, 4, 7],
      [3, 0, 5],
      [-1, 9, 11]
    ]), -8)
    assert.strictEqual(det([
      [1, 7, 4, 3, 7],
      [0, 7, 0, 3, 7],
      [0, 7, 4, 3, 0],
      [1, 7, 5, 9, 7],
      [2, 7, 4, 3, 7]
    ]), -1176)
    assert.strictEqual(det([
      [0, 7, 0, 3, 7],
      [1, 7, 4, 3, 7],
      [0, 7, 4, 3, 0],
      [1, 7, 5, 9, 7],
      [2, 7, 4, 3, 7]
    ]), 1176)
    assert.strictEqual(det(diag([4, -5, 6])), -120)
    assert.strictEqual(
      det([
        [6.123234262925839e-17, -1, 1],
        [-0.8660253882408142, 0.5, 1],
        [-0.6495190262794495, -0.3749999701976776, 1]
      ]), 0.4330126459590976)
  })

  it('should return the determinant of a sparse matrix', function () {
    assert.strictEqual(det(new SparseMatrix([
      [1, 7, 4, 3, 7],
      [0, 7, 0, 3, 7],
      [0, 7, 4, 3, 0],
      [1, 7, 5, 9, 7],
      [2, 7, 4, 3, 7]
    ])), -1176)
  })

  it('should return 1 for the identity matrix', function () {
    assert.strictEqual(det(identity(7)), 1)
    assert.strictEqual(det(identity(2)), 1)
    assert.strictEqual(det(identity(1)), 1)
  })

  it('should return 0 for a singular matrix', function () {
    assert.strictEqual(det([
      [1, 0],
      [0, 0]
    ]), 0)
    assert.strictEqual(det([
      [1, 0],
      [1, 0]
    ]), 0)
    assert.strictEqual(det([
      [2, 6],
      [1, 3]
    ]), 0)
    assert.strictEqual(det([
      [1, 0, 0],
      [0, 0, 0],
      [1, 0, 0]
    ]), 0)
  })

  it('should calculate the determinant for a scalar', function () {
    assert.strictEqual(det(7), 7)

    const c1 = new Complex(2, 3)
    const c2 = det(c1)
    assert.deepStrictEqual(c1, c2)

    // c2 should be a clone
    c1.re = 0
    assert.strictEqual(c1.re, 0)
    assert.strictEqual(c2.re, 2)
  })

  it('should calculate the determinant for a 1x1 matrix', function () {
    const c1 = new Complex(2, 3)
    const c2 = det([[c1]])
    assert.deepStrictEqual(c1, c2)

    // c2 should be a clone
    c1.re = 0
    assert.strictEqual(c1.re, 0)
    assert.strictEqual(c2.re, 2)
  })

  it('should calculate correctly the determinant of a matrix with bignumbers', function () {
    // 1x1
    assert.deepStrictEqual(det([new BigNumber(5)]), new BigNumber(5))

    // 2x2
    assert.deepStrictEqual(det([
      [new BigNumber(1), new BigNumber(2)],
      [new BigNumber(3), new BigNumber(4)]
    ]), new BigNumber(-2))

    // 3x3
    assert.deepStrictEqual(det([
      [new BigNumber(-2), new BigNumber(2), new BigNumber(3)],
      [new BigNumber(-1), new BigNumber(1), new BigNumber(3)],
      [new BigNumber(2), new BigNumber(0), new BigNumber(-1)]
    ]), new math.BigNumber(6))

    // the following would fail with regular Numbers due to a precision overflow
    assert.deepStrictEqual(det([
      [new BigNumber(1e10 + 1), new BigNumber(1e10)],
      [new BigNumber(1e10), new BigNumber(1e10 - 1)]
    ]), new BigNumber(-1))
  })

  it('should calculate the determinant of a matrix with mixed numbers and bignumbers', function () {
    assert.deepStrictEqual(det([
      [1, new BigNumber(2)],
      [new BigNumber(3), 4]
    ]), new math.BigNumber(-2))
  })

  it('should return 1 for an empty array or matrix', function () {
    assert.deepStrictEqual(det([]), 1)
    assert.deepStrictEqual(det([[]]), 1)
    assert.deepStrictEqual(det([[], []]), 1)

    assert.deepStrictEqual(det(math.matrix([])), 1)
    assert.deepStrictEqual(det(math.matrix([[]])), 1)
    assert.deepStrictEqual(det(math.matrix([[], []])), 1)
  })

  it('should not change the value of the initial matrix', function () {
    const m = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
    det(m)
    assert.deepStrictEqual(m, [[1, 2, 3], [4, 5, 6], [7, 8, 9]])
  })

  it('should not accept a non-square matrix', function () {
    assert.throws(function () { det([1, 2]) })
    assert.throws(function () { det([[1, 2, 3], [1, 2, 3]]) })
    assert.throws(function () { det([0, 1], [0, 1], [0, 1]) })
  })

  it('should not accept arrays with dimensions higher than 2', function () {
    assert.throws(function () { det([[[1]]]) }, RangeError)
    assert.throws(function () { det(new DenseMatrix([[[1]]])) }, RangeError)
  })

  it('should LaTeX det', function () {
    const expression = math.parse('det([1])')
    assert.strictEqual(expression.toTex(), '\\det\\left(\\begin{bmatrix}1\\end{bmatrix}\\right)')
  })
})
