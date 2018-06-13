'use strict'

const clone = require('../../utils/object').clone
const array = require('../../utils/array')
const IndexError = require('../../error/IndexError')
const DimensionError = require('../../error/DimensionError')

function factory (type, config, load, typed) {
  const matrix = load(require('../../type/matrix/function/matrix'))
  const isInteger = load(require('../utils/isInteger'))

  /**
   * Concatenate two or more matrices.
   *
   * Syntax:
   *
   *     math.concat(A, B, C, ...)
   *     math.concat(A, B, C, ..., dim)
   *
   * Where:
   *
   * - `dim: number` is a zero-based dimension over which to concatenate the matrices.
   *   By default the last dimension of the matrices.
   *
   * Examples:
   *
   *    const A = [[1, 2], [5, 6]]
   *    const B = [[3, 4], [7, 8]]
   *
   *    math.concat(A, B)                  // returns [[1, 2, 3, 4], [5, 6, 7, 8]]
   *    math.concat(A, B, 0)               // returns [[1, 2], [5, 6], [3, 4], [7, 8]]
   *    math.concat('hello', ' ', 'world') // returns 'hello world'
   *
   * See also:
   *
   *    size, squeeze, subset, transpose
   *
   * @param {... Array | Matrix} args     Two or more matrices
   * @return {Array | Matrix} Concatenated matrix
   */
  const concat = typed('concat', {
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
        if (type.isMatrix(arg)) {
          asMatrix = true
        }

        if (type.isNumber(arg) || type.isBigNumber(arg)) {
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
          const size = array.size(m)
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
        res = _concat(res, matrices.shift(), dim, 0)
      }

      return asMatrix ? matrix(res) : res
    },

    '...string': function (args) {
      return args.join('')
    }
  })

  concat.toTex = undefined // use default template

  return concat
}

/**
 * Recursively concatenate two matrices.
 * The contents of the matrices is not cloned.
 * @param {Array} a             Multi dimensional array
 * @param {Array} b             Multi dimensional array
 * @param {number} concatDim    The dimension on which to concatenate (zero-based)
 * @param {number} dim          The current dim (zero-based)
 * @return {Array} c            The concatenated matrix
 * @private
 */
function _concat (a, b, concatDim, dim) {
  if (dim < concatDim) {
    // recurse into next dimension
    if (a.length !== b.length) {
      throw new DimensionError(a.length, b.length)
    }

    const c = []
    for (let i = 0; i < a.length; i++) {
      c[i] = _concat(a[i], b[i], concatDim, dim + 1)
    }
    return c
  } else {
    // concatenate this dimension
    return a.concat(b)
  }
}

exports.name = 'concat'
exports.factory = factory
