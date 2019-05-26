import { factory } from '../../utils/factory'
import { arraySize } from '../../utils/array'
import { isMatrix } from '../../utils/is'
import { IndexError } from '../../error/IndexError'

const name = 'apply'
const dependencies = ['typed', 'isInteger']

export const createApply = /* #__PURE__ */ factory(name, dependencies, ({ typed, isInteger }) => {
  /**
   * Apply a function that maps an array to a scalar
   * along a given axis of a matrix or array.
   * Returns a new matrix or array with one less dimension than the input.
   *
   * Syntax:
   *
   *     math.apply(A, dim, callback)
   *
   * Where:
   *
   * - `dim: number` is a zero-based dimension over which to concatenate the matrices.
   *
   * Examples:
   *
   *    const A = [[1, 2], [3, 4]]
   *    const sum = math.sum
   *
   *    math.apply(A, 0, sum)             // returns [4, 6]
   *    math.apply(A, 1, sum)             // returns [3, 7]
   *
   * See also:
   *
   *    map, filter, forEach
   *
   * @param {Array | Matrix} array   The input Matrix
   * @param {number} dim             The dimension along which the callback is applied
   * @param {Function} callback      The callback function that is applied. This Function
   *                                 should take an array or 1-d matrix as an input and
   *                                 return a number.
   * @return {Array | Matrix} res    The residual matrix with the function applied over some dimension.
   */
  const apply = typed(name, {
    'Array | Matrix, number | BigNumber, function': function (mat, dim, callback) {
      if (!isInteger(dim)) {
        throw new TypeError('Integer number expected for dimension')
      }

      const size = Array.isArray(mat) ? arraySize(mat) : mat.size()
      if (dim < 0 || (dim >= size.length)) {
        throw new IndexError(dim, size.length)
      }

      if (isMatrix(mat)) {
        return mat.create(_apply(mat.valueOf(), dim, callback))
      } else {
        return _apply(mat, dim, callback)
      }
    }
  })

  return apply
})

/**
 * Recursively reduce a matrix
 * @param {Array} mat
 * @param {number} dim
 * @param {Function} callback
 * @returns {Array} ret
 * @private
 */
function _apply (mat, dim, callback) {
  let i, ret, tran

  if (dim <= 0) {
    if (!Array.isArray(mat[0])) {
      return callback(mat)
    } else {
      tran = _switch(mat)
      ret = []
      for (i = 0; i < tran.length; i++) {
        ret[i] = _apply(tran[i], dim - 1, callback)
      }
      return ret
    }
  } else {
    ret = []
    for (i = 0; i < mat.length; i++) {
      ret[i] = _apply(mat[i], dim - 1, callback)
    }
    return ret
  }
}

/**
 * Transpose a matrix
 * @param {Array} mat
 * @returns {Array} ret
 * @private
 */
function _switch (mat) {
  const I = mat.length
  const J = mat[0].length
  let i, j
  const ret = []
  for (j = 0; j < J; j++) {
    const tmp = []
    for (i = 0; i < I; i++) {
      tmp.push(mat[i][j])
    }
    ret.push(tmp)
  }
  return ret
}
