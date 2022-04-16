import { isMatrix } from '../../utils/is.js'
import { arraySize } from '../../utils/array.js'
import { factory } from '../../utils/factory.js'
import { format } from '../../utils/string.js'
import { clone } from '../../utils/object.js'

const name = 'pinv'
const dependencies = [
  'typed',
  'matrix',
  'inv',
  'deepEqual',
  'equal',
  'dotDivide',
  'dot',
  'ctranspose',
  'divideScalar',
  'multiply',
  'add',
  'Complex'
]

export const createPinv = /* #__PURE__ */ factory(name, dependencies, ({
  typed,
  matrix,
  inv,
  deepEqual,
  equal,
  dotDivide,
  dot,
  ctranspose,
  divideScalar,
  multiply,
  add,
  Complex
}) => {
  /**
   * Calculate the Moore–Penrose inverse of a matrix.
   *
   * Syntax:
   *
   *     math.pinv(x)
   *
   * Examples:
   *
   *     math.pinv([[1, 2], [3, 4]])          // returns [[-2, 1], [1.5, -0.5]]
   *     math.pinv([[1, 0], [0, 1], [0, 1]])  // returns [[1, 0, 0], [0, 0.5, 0.5]]
   *     math.pinv(4)                         // returns 0.25
   *
   * See also:
   *
   *     inv
   *
   * @param {number | Complex | Array | Matrix} x     Matrix to be inversed
   * @return {number | Complex | Array | Matrix} The inverse of `x`.
   */
  return typed(name, {
    'Array | Matrix': function (x) {
      const size = isMatrix(x) ? x.size() : arraySize(x)
      switch (size.length) {
        case 1:
          // vector
          if (_isZeros(x)) return ctranspose(x) // null vector
          if (size[0] === 1) {
            return inv(x) // invertible matrix
          } else {
            return dotDivide(ctranspose(x), dot(x, x))
          }

        case 2:
        // two dimensional array
        {
          if (_isZeros(x)) return ctranspose(x) // zero matrixx
          const rows = size[0]
          const cols = size[1]
          if (rows === cols) {
            try {
              return inv(x) // invertible matrix
            } catch (err) {
              if (err instanceof Error && err.message.match(/Cannot calculate inverse, determinant is zero/)) {
                // Expected
              } else {
                throw err
              }
            }
          }
          if (isMatrix(x)) {
            return matrix(
              _pinv(x.valueOf(), rows, cols),
              x.storage()
            )
          } else {
            // return an Array
            return _pinv(x, rows, cols)
          }
        }

        default:
          // multi dimensional array
          throw new RangeError('Matrix must be two dimensional ' +
          '(size: ' + format(size) + ')')
      }
    },

    any: function (x) {
      // scalar
      if (equal(x, 0)) return clone(x) // zero
      return divideScalar(1, x)
    }
  })

  /**
   * Calculate the Moore–Penrose inverse of a matrix
   * @param {Array[]} mat     A matrix
   * @param {number} rows     Number of rows
   * @param {number} cols     Number of columns
   * @return {Array[]} pinv    Pseudoinverse matrix
   * @private
   */
  function _pinv (mat, rows, cols) {
    const { C, F } = _rankFact(mat, rows, cols) // TODO: Use SVD instead (may improve precision)
    const Cpinv = multiply(inv(multiply(ctranspose(C), C)), ctranspose(C))
    const Fpinv = multiply(ctranspose(F), inv(multiply(F, ctranspose(F))))
    return multiply(Fpinv, Cpinv)
  }

  /**
   * Calculate the reduced row echelon form of a matrix
   *
   * Modified from https://rosettacode.org/wiki/Reduced_row_echelon_form
   *
   * @param {Array[]} mat     A matrix
   * @param {number} rows     Number of rows
   * @param {number} cols     Number of columns
   * @return {Array[]}        Reduced row echelon form
   * @private
   */
  function _rref (mat, rows, cols) {
    const M = clone(mat)
    let lead = 0
    for (let r = 0; r < rows; r++) {
      if (cols <= lead) {
        return M
      }
      let i = r
      while (_isZero(M[i][lead])) {
        i++
        if (rows === i) {
          i = r
          lead++
          if (cols === lead) {
            return M
          }
        }
      }

      [M[i], M[r]] = [M[r], M[i]]

      let val = M[r][lead]
      for (let j = 0; j < cols; j++) {
        M[r][j] = dotDivide(M[r][j], val)
      }

      for (let i = 0; i < rows; i++) {
        if (i === r) continue
        val = M[i][lead]
        for (let j = 0; j < cols; j++) {
          M[i][j] = add(M[i][j], multiply(-1, multiply(val, M[r][j])))
        }
      }
      lead++
    }
    return M
  }

  /**
   * Calculate the rank factorization of a matrix
   *
   * @param {Array[]} mat                  A matrix (M)
   * @param {number} rows                  Number of rows
   * @param {number} cols                  Number of columns
   * @return {{C: Array, F: Array}}        rank factorization where M = C F
   * @private
   */
  function _rankFact (mat, rows, cols) {
    const rref = _rref(mat, rows, cols)
    const C = mat.map((_, i) => _.filter((_, j) => j < rows && !_isZero(dot(rref[j], rref[j]))))
    const F = rref.filter((_, i) => !_isZero(dot(rref[i], rref[i])))
    return { C, F }
  }

  function _isZero (x) {
    return equal(add(x, Complex(1, 1)), add(0, Complex(1, 1)))
  }

  function _isZeros (arr) {
    return deepEqual(add(arr, Complex(1, 1)), add(multiply(arr, 0), Complex(1, 1)))
  }
})
