import { isBigNumber } from '../../utils/is'
import { resize } from '../../utils/array'
import { isInteger } from '../../utils/number'
import { factory } from '../../utils/factory'

const name = 'identity'
const dependencies = [
  'typed',
  'config',
  'matrix',
  'BigNumber',
  'DenseMatrix',
  'SparseMatrix'
]

export const createIdentity = /* #__PURE__ */ factory(name, dependencies, ({ typed, config, matrix, BigNumber, DenseMatrix, SparseMatrix }) => {
  /**
   * Create a 2-dimensional identity matrix with size m x n or n x n.
   * The matrix has ones on the diagonal and zeros elsewhere.
   *
   * Syntax:
   *
   *    math.identity(n)
   *    math.identity(n, format)
   *    math.identity(m, n)
   *    math.identity(m, n, format)
   *    math.identity([m, n])
   *    math.identity([m, n], format)
   *
   * Examples:
   *
   *    math.identity(3)                    // returns [[1, 0, 0], [0, 1, 0], [0, 0, 1]]
   *    math.identity(3, 2)                 // returns [[1, 0], [0, 1], [0, 0]]
   *
   *    const A = [[1, 2, 3], [4, 5, 6]]
   *    math.identity(math.size(A))         // returns [[1, 0, 0], [0, 1, 0]]
   *
   * See also:
   *
   *    diag, ones, zeros, size, range
   *
   * @param {...number | Matrix | Array} size   The size for the matrix
   * @param {string} [format]                   The Matrix storage format
   *
   * @return {Matrix | Array | number} A matrix with ones on the diagonal.
   */
  return typed(name, {
    '': function () {
      return (config.matrix === 'Matrix') ? matrix([]) : []
    },

    string: function (format) {
      return matrix(format)
    },

    'number | BigNumber': function (rows) {
      return _identity(rows, rows, config.matrix === 'Matrix' ? 'dense' : undefined)
    },

    'number | BigNumber, string': function (rows, format) {
      return _identity(rows, rows, format)
    },

    'number | BigNumber, number | BigNumber': function (rows, cols) {
      return _identity(rows, cols, config.matrix === 'Matrix' ? 'dense' : undefined)
    },

    'number | BigNumber, number | BigNumber, string': function (rows, cols, format) {
      return _identity(rows, cols, format)
    },

    Array: function (size) {
      return _identityVector(size)
    },

    'Array, string': function (size, format) {
      return _identityVector(size, format)
    },

    Matrix: function (size) {
      return _identityVector(size.valueOf(), size.storage())
    },

    'Matrix, string': function (size, format) {
      return _identityVector(size.valueOf(), format)
    }
  })

  function _identityVector (size, format) {
    switch (size.length) {
      case 0: return format ? matrix(format) : []
      case 1: return _identity(size[0], size[0], format)
      case 2: return _identity(size[0], size[1], format)
      default: throw new Error('Vector containing two values expected')
    }
  }

  /**
   * Create an identity matrix
   * @param {number | BigNumber} rows
   * @param {number | BigNumber} cols
   * @param {string} [format]
   * @returns {Matrix}
   * @private
   */
  function _identity (rows, cols, format) {
    // BigNumber constructor with the right precision
    const Big = (isBigNumber(rows) || isBigNumber(cols))
      ? BigNumber
      : null

    if (isBigNumber(rows)) rows = rows.toNumber()
    if (isBigNumber(cols)) cols = cols.toNumber()

    if (!isInteger(rows) || rows < 1) {
      throw new Error('Parameters in function identity must be positive integers')
    }
    if (!isInteger(cols) || cols < 1) {
      throw new Error('Parameters in function identity must be positive integers')
    }

    const one = Big ? new BigNumber(1) : 1
    const defaultValue = Big ? new Big(0) : 0
    const size = [rows, cols]

    // check we need to return a matrix
    if (format) {
      // create diagonal matrix (use optimized implementation for storage format)
      if (format === 'sparse') {
        return SparseMatrix.diagonal(size, one, 0, defaultValue)
      }
      if (format === 'dense') {
        return DenseMatrix.diagonal(size, one, 0, defaultValue)
      }
      throw new TypeError(`Unknown matrix type "${format}"`)
    }

    // create and resize array
    const res = resize([], size, defaultValue)
    // fill in ones on the diagonal
    const minimum = rows < cols ? rows : cols
    // fill diagonal
    for (let d = 0; d < minimum; d++) {
      res[d][d] = one
    }
    return res
  }
})
