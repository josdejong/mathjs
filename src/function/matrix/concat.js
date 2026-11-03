import { isBigNumber, isMatrix, isNumber } from '../../utils/is.js'
import { clone } from '../../utils/object.js'
import { arraySize, concat as _concat } from '../../utils/array.js'
import { IndexError } from '../../error/IndexError.js'
import { DimensionError } from '../../error/DimensionError.js'
import { factory } from '../../utils/factory.js'

const name = 'concat'
const dependencies = ['typed', 'matrix', 'isInteger']

export const createConcat = /* #__PURE__ */ factory(name, dependencies, ({ typed, matrix, isInteger }) => {
  /**
   * Concatenate two or more arrays or matrices, or two or more strings.
   * A single input is also accepted: an array or matrix is copied, and a string
   * is returned unchanged.
   *
   * Syntax:
   *
   *     math.concat(A, B, ...)
   *     math.concat(A, B, ..., dim)
   *     math.concat(str1, str2, ...)
   *
   * Where:
   *
   * - `A, B, ...` are arrays or Matrix objects with the same number of dimensions.
   *   Arrays and Matrix objects can be combined in one call.
   * - `dim: number | BigNumber` is an optional final argument for arrays and
   *   matrices. It is the integer index of the dimension to extend, defaulting
   *   to the last dimension. For two-dimensional inputs, dimension 0 appends rows
   *   and dimension 1 appends columns. The JavaScript API uses zero-based
   *   dimensions; the expression parser uses one-based dimensions instead.
   * - `str1, str2, ...` are strings. String concatenation has no dimension argument.
   *
   * Examples:
   *
   *    const A = [[1, 2], [5, 6]]
   *    const B = [[3, 4], [7, 8]]
   *
   *    math.concat(A, B, 0)              // returns [[1, 2], [5, 6], [3, 4], [7, 8]]
   *    math.concat(A, B, 1)              // returns [[1, 2, 3, 4], [5, 6, 7, 8]]
   *    math.concat(A, B)                 // returns [[1, 2, 3, 4], [5, 6, 7, 8]]
   *    math.concat('hello', ' ', 'world') // returns 'hello world'
   *
   * See also:
   *
   *    size, squeeze, subset, transpose
   *
   * History:
   *
   *    v2.0   Support string concatenation
   *    v0.26  Support BigNumber dimensions; use one-based dimensions in expressions
   *    v0.11  Use zero-based dimensions in the JavaScript API
   *    v0.5   Created
   *
   * @param {... Array | Matrix | string | number | BigNumber} args  Arrays and/or
   *                            matrices, optionally followed by a number or
   *                            BigNumber dimension; or string arguments only
   * @return {Array | Matrix | string} Concatenated array, matrix, or string
   */
  return typed(name, {
    // TODO: change signature to '...Array | Matrix, dim?' when supported
    '...Array | Matrix | number | BigNumber': function (args) {
      let i
      const len = args.length
      let dim = -1 // zero-based dimension
      let prevDim
      let asMatrix = false
      const matrices = [] // contains multi dimensional arrays

      for (i = 0; i < len; i++) {
        const arg = args[i]

        // test whether we need to return a Matrix (if not we return an Array)
        if (isMatrix(arg)) {
          asMatrix = true
        }

        if (isNumber(arg) || isBigNumber(arg)) {
          if (i !== len - 1) {
            throw new Error('Dimension must be specified as last argument')
          }

          // last argument contains the dimension on which to concatenate
          prevDim = dim
          dim = arg.valueOf() // change BigNumber to number

          if (!isInteger(dim)) {
            throw new TypeError('Integer number expected for dimension')
          }

          if (dim < 0 || (i > 0 && dim > prevDim)) {
            // TODO: would be more clear when throwing a DimensionError here
            throw new IndexError(dim, prevDim + 1)
          }
        } else {
          // this is a matrix or array
          const m = clone(arg).valueOf()
          const size = arraySize(m)
          matrices[i] = m
          prevDim = dim
          dim = size.length - 1

          // verify whether each of the matrices has the same number of dimensions
          if (i > 0 && dim !== prevDim) {
            throw new DimensionError(prevDim + 1, dim + 1)
          }
        }
      }

      if (matrices.length === 0) {
        throw new SyntaxError('At least one matrix expected')
      }

      let res = matrices.shift()
      while (matrices.length) {
        res = _concat(res, matrices.shift(), dim)
      }

      return asMatrix ? matrix(res) : res
    },

    '...string': function (args) {
      return args.join('')
    }
  })
})
