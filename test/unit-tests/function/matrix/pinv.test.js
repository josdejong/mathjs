// test pinv
import assert from 'assert'

import approx from '../../../../tools/approx.js'
import math from '../../../../src/defaultInstance.js'
const pinv = math.pinv

/**
 * Tests whether `A_` is Moore–Penrose inverse of `A`.
 *
 * @param {Matrix | Array} A     A two dimensional matrix or array.
 * @param {Matrix | Array} A_    A two dimensional matrix or array.
 *
 * @return {Boolean} Returns true if `A_` is a valid Moore–Penrose inverse of `A`
 */
function assertValidPinv (A, A_) {
  const Asize = math.size(A).valueOf()

  const rows = Asize[0]
  const cols = Asize[1]

  // sizes match
  assert.deepStrictEqual(math.size(A_).valueOf(), [cols, rows])

  // A A_ A = A
  approx.deepEqual(math.multiply(A, math.multiply(A_, A)).valueOf(), A.valueOf())
  // A_ A A_ = A_
  approx.deepEqual(math.multiply(A_, math.multiply(A, A_)).valueOf(), A_.valueOf())
  // (A A_)* = A A_
  approx.deepEqual(math.ctranspose(math.multiply(A, A_)).valueOf(), math.multiply(A, A_).valueOf())
  // (A_ A)* = A_ A
  approx.deepEqual(math.ctranspose(math.multiply(A_, A)).valueOf(), math.multiply(A_, A).valueOf())
}

describe('pinv', function () {
  function test (A, A_, strict = false) {
    const pinvA = pinv(A)
    if (A_) {
      if (strict) assert.deepStrictEqual(pinvA, A_)
      else approx.deepEqual(pinvA, A_)
    } else {
      switch (math.size(A).valueOf().length) {
        case 0:
          assertValidPinv([[A]], [[pinvA]])
          break
        case 1:
          assertValidPinv(math.reshape(A, [1, -1]), math.reshape(pinvA, [-1, 1]))
          break
        case 2:
          assertValidPinv(A, pinvA)
          break
        default:
          assert.ok(math.size(A).valueOf().length < 3)
          break
      }
    }
  }
  it('should return the inverse of a number', function () {
    test(4, 1 / 4, true)
    test(math.bignumber(4), math.bignumber(1 / 4), true)
  })

  it('should return the inverse of a matrix with just one value', function () {
    test([4], [1 / 4], true)
    test([[4]], [[1 / 4]], true)
  })

  it('should return the inverse for each element in an array', function () {
    test([4], [1 / 4], true)
    test([[4]], [[1 / 4]], true)

    test([
      [1, 4, 7],
      [3, 0, 5],
      [-1, 9, 11]
    ], [
      [5.625, -2.375, -2.5],
      [4.75, -2.25, -2],
      [-3.375, 1.625, 1.5]
    ])

    test([
      [2, -1, 0],
      [-1, 2, -1],
      [0, -1, 2]
    ], [
      [3 / 4, 1 / 2, 1 / 4],
      [1 / 2, 1, 1 / 2],
      [1 / 4, 1 / 2, 3 / 4]
    ])

    test([
      [1, 0, 0],
      [0, 0, 1],
      [0, 1, 0]
    ], [
      [1, 0, 0],
      [0, 0, 1],
      [0, 1, 0]
    ])

    test([
      [1, 0, 0],
      [0, -1, 1],
      [0, 0, 1]
    ], [
      [1, 0, 0],
      [0, -1, 1],
      [0, 0, 1]
    ])
  })

  it('should return the inverse for each element in a matrix', function () {
    test(math.matrix([4]), math.matrix([1 / 4]), true)
    test(math.matrix([[4]]), math.matrix([[1 / 4]]), true)
    test(math.matrix([[4]], 'sparse'), math.matrix([[1 / 4]], 'sparse'), true)
    test(math.matrix([[1, 2], [3, 4]], 'sparse'), math.matrix([[-2, 1], [1.5, -0.5]], 'sparse'), true)
  })

  it('should return the Moore–Penrose inverse of non-square matrices', function () {
    test([1, 2, 3], [1 / 14, 2 / 14, 3 / 14])
    test([[1, 2, 3], [4, 5, 6]], [[-17 / 18, 8 / 18], [-2 / 18, 2 / 18], [13 / 18, -4 / 18]])
    test([[1, 4], [2, 5], [3, 6]], [[-17 / 18, -2 / 18, 13 / 18], [8 / 18, 2 / 18, -4 / 18]])
  })

  it('should throw an error in case of multi dimensional matrices', function () {
    assert.throws(function () { pinv([[[1, 2, 3], [4, 5, 6]]]) }, /Matrix must be two dimensional/)
  })

  it('should return the Moore–Penrose inverse of non-invertable matrices', function () {
    test([[0]], [[0]], true)
    test([[1, 0], [0, 0]], [[1, 0], [0, 0]])
    test([[1, 1, 1], [1, 0, 0], [0, 0, 0]], [[0, 1, 0], [0.5, -0.5, 0], [0.5, -0.5, 0]])
  })

  it('should throw an error in case of wrong number of arguments', function () {
    assert.throws(function () { pinv() }, /TypeError: Too few arguments/)
    assert.throws(function () { pinv([], []) }, /TypeError: Too many arguments/)
  })

  it('should throw an error in case of invalid type of arguments', function () {
    assert.throws(function () { math.concat(pinv(new Date())) }, /TypeError: Unexpected type of argument/)
  })

  it('should  LaTeX pinv', function () {
    const expression = math.parse('pinv([[1,2],[3,4]])')
    assert.strictEqual(expression.toTex(), '\\left(\\begin{bmatrix}1&2\\\\3&4\\end{bmatrix}\\right)^{+}')
  })
})
