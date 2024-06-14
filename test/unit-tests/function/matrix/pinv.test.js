// test pinv
import assert from 'assert'
import { approxDeepEqual } from '../../../../tools/approx.js'
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
  approxDeepEqual(math.add(math.multiply(A, math.multiply(A_, A)), math.Complex(1, 1)).valueOf(), math.add(A, math.Complex(1, 1)).valueOf())
  // A_ A A_ = A_
  approxDeepEqual(math.add(math.multiply(A_, math.multiply(A, A_)), math.Complex(1, 1)).valueOf(), math.add(A_, math.Complex(1, 1)).valueOf())
  // (A A_)* = A A_
  approxDeepEqual(math.add(math.ctranspose(math.multiply(A, A_)), math.Complex(1, 1)).valueOf(), math.add(math.multiply(A, A_), math.Complex(1, 1)).valueOf())
  // (A_ A)* = A_ A
  approxDeepEqual(math.add(math.ctranspose(math.multiply(A_, A)), math.Complex(1, 1)).valueOf(), math.add(math.multiply(A_, A), math.Complex(1, 1)).valueOf())
}

describe('pinv', function () {
  function check (A, A_, strict = false) {
    const pinvA = pinv(A)
    if (A_) {
      if (strict) assert.deepStrictEqual(pinvA, A_)
      else approxDeepEqual(pinvA, A_)
    }
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

  it('should return the inverse of a number', function () {
    check(4, 1 / 4, true)
    check(math.bignumber(4), math.bignumber(1 / 4), true)
  })

  it('should return the inverse of a matrix with just one value', function () {
    check([4], [1 / 4], true)
    check([[4]], [[1 / 4]], true)
  })

  it('should return the inverse for each element in an array', function () {
    check([4], [1 / 4], true)
    check([[4]], [[1 / 4]], true)

    check([
      [1, 4, 7],
      [3, 0, 5],
      [-1, 9, 11]
    ], [
      [5.625, -2.375, -2.5],
      [4.75, -2.25, -2],
      [-3.375, 1.625, 1.5]
    ])

    check([
      [2, -1, 0],
      [-1, 2, -1],
      [0, -1, 2]
    ], [
      [3 / 4, 1 / 2, 1 / 4],
      [1 / 2, 1, 1 / 2],
      [1 / 4, 1 / 2, 3 / 4]
    ])

    check([
      [1, 0, 0],
      [0, 0, 1],
      [0, 1, 0]
    ], [
      [1, 0, 0],
      [0, 0, 1],
      [0, 1, 0]
    ])

    check([
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
    check(math.matrix([4]), math.matrix([1 / 4]), true)
    check(math.matrix([[4]]), math.matrix([[1 / 4]]), true)
    check(math.matrix([[4]], 'sparse'), math.matrix([[1 / 4]], 'sparse'), true)
    check(math.matrix([[1, 2], [3, 4]], 'sparse'), math.matrix([[-2, 1], [1.5, -0.5]], 'sparse'), true)
  })

  it('should return the Moore–Penrose inverse of complex matrices', function () {
    check(
      math.evaluate(`[
          [0.4032 + 0.0876i,   0.1678 + 0.0390i,   0.5425 + 0.5118i],
          [0.3174 + 0.3352i,   0.9784 + 0.4514i,  -0.4416 - 1.3188i],
          [0.4008 - 0.0504i,   0.0979 - 0.2558i,   0.2983 + 0.7800i]
      ]`)
      // , math.evaluate(`[
      //     [0.4318 - 0.1398i,   0.2869 - 0.1360i,   0.3897 - 0.0370i],
      //     [0.3507 - 0.0725i,   0.4354 - 0.1329i,   0.2877 + 0.0565i],
      //     [0.3116 - 0.2626i,   0.0042 + 0.2584i,   0.2388 - 0.2806i]
      // ]`)
    )
  })

  it('should return the Moore–Penrose inverse of non-square matrices', function () {
    check([[0, 0]], [[0], [0]], true)

    check([1, 2, 3], [1 / 14, 2 / 14, 3 / 14])

    check([[1, 2, 3], [4, 5, 6]], [[-17 / 18, 8 / 18], [-2 / 18, 2 / 18], [13 / 18, -4 / 18]])
    check([[1, 4], [2, 5], [3, 6]], [[-17 / 18, -2 / 18, 13 / 18], [8 / 18, 2 / 18, -4 / 18]])

    check([
      [64, 2, 3, 61, 60, 6],
      [9, 55, 54, 12, 13, 51],
      [17, 47, 46, 20, 21, 43],
      [40, 26, 27, 37, 36, 30],
      [32, 34, 35, 29, 28, 38],
      [41, 23, 22, 44, 45, 19],
      [49, 15, 14, 52, 53, 11],
      [8, 58, 59, 5, 4, 62]
    ])
  })

  it('should throw an error in case of multi dimensional matrices', function () {
    assert.throws(function () { pinv([[[1, 2, 3], [4, 5, 6]]]) }, /Matrix must be two dimensional/)
  })

  it('should return the Moore–Penrose inverse of non-invertable matrices', function () {
    check([[0]], [[0]], true)
    check([[1, 0], [0, 0]], [[1, 0], [0, 0]])
    check([[1, 1, 1], [1, 0, 0], [0, 0, 0]], [[0, 1, 0], [0.5, -0.5, 0], [0.5, -0.5, 0]])
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
