import { containsCollections } from '../../utils/collection.js'
import { factory } from '../../utils/factory.js'
import { _switch } from '../../utils/switch.js'
import { improveErrorMessage } from './utils/improveErrorMessage.js'
import { arraySize } from '../../utils/array.js'
import { IndexError } from '../../error/IndexError.js'

const name = 'cumsum'
const dependencies = ['typed', 'add', 'unaryPlus']

export const createCumSum = /* #__PURE__ */ factory(name, dependencies, ({ typed, add, unaryPlus }) => {
  /**
   * Compute the cumulative sum of a matrix or a list with values.
   * In case of a (multi dimensional) array or matrix, the cumulative sums
   * along a specified dimension (defaulting to the first) will be calculated.
   *
   * Syntax:
   *
   *     math.cumsum(a, b, c, ...)
   *     math.cumsum(A)
   *
   * Examples:
   *
   *     math.cumsum(2, 1, 4, 3)               // returns [2, 3, 7, 10]
   *     math.cumsum([2, 1, 4, 3])             // returns [2, 3, 7, 10]
   *     math.cumsum([[1, 2], [3, 4]])         // returns [[1, 2], [4, 6]]
   *     math.cumsum([[1, 2], [3, 4]], 0)      // returns [[1, 2], [4, 6]]
   *     math.cumsum([[1, 2], [3, 4]], 1)      // returns [[1, 3], [3, 7]]
   *     math.cumsum([[2, 5], [4, 3], [1, 7]]) // returns [[2, 5], [6, 8], [7, 15]]
   *
   * See also:
   *
   *    mean, median, min, max, prod, std, variance, sum
   *
   * @param {... *} args  A single matrix or or multiple scalar values
   * @return {*} The cumulative sum of all values
   */
  return typed(name, {
    // sum([a, b, c, d, ...])
    Array: _cumsum,
    Matrix: function (matrix) {
      return matrix.create(_cumsum(matrix.valueOf(), matrix.datatype()))
    },

    // sum([a, b, c, d, ...], dim)
    'Array, number | BigNumber': _ncumSumDim,
    'Matrix, number | BigNumber': function (matrix, dim) {
      return matrix.create(_ncumSumDim(matrix.valueOf(), dim), matrix.datatype())
    },

    // cumsum(a, b, c, d, ...)
    '...': function (args) {
      if (containsCollections(args)) {
        throw new TypeError('All values expected to be scalar in function cumsum')
      }

      return _cumsum(args)
    }
  })

  /**
     * Recursively calculate the cumulative sum of an n-dimensional array
     * @param {Array} array
     * @return {number} cumsum
     * @private
     */
  function _cumsum (array) {
    try {
      return _cumsummap(array)
    } catch (err) {
      throw improveErrorMessage(err, name)
    }
  }

  function _cumsummap (array) {
    if (array.length === 0) {
      return []
    }

    const sums = [unaryPlus(array[0])] // unaryPlus converts to number if need be
    for (let i = 1; i < array.length; ++i) {
      // Must use add below and not addScalar for the case of summing a
      // 2+-dimensional array along the 0th dimension (the row vectors,
      // or higher-d analogues, are literally added to each other).
      sums.push(add(sums[i - 1], array[i]))
    }
    return sums
  }

  function _ncumSumDim (array, dim) {
    const size = arraySize(array)
    if (dim < 0 || (dim >= size.length)) {
      // TODO: would be more clear when throwing a DimensionError here
      throw new IndexError(dim, size.length)
    }

    try {
      return _cumsumDimensional(array, dim)
    } catch (err) {
      throw improveErrorMessage(err, name)
    }
  }

  /* Possible TODO: Refactor _reduce in collection.js to be able to work here as well */
  function _cumsumDimensional (mat, dim) {
    let i, ret, tran

    if (dim <= 0) {
      const initialValue = mat[0][0]
      if (!Array.isArray(initialValue)) {
        return _cumsummap(mat)
      } else {
        tran = _switch(mat)
        ret = []
        for (i = 0; i < tran.length; i++) {
          ret[i] = _cumsumDimensional(tran[i], dim - 1)
        }
        return ret
      }
    } else {
      ret = []
      for (i = 0; i < mat.length; i++) {
        ret[i] = _cumsumDimensional(mat[i], dim - 1)
      }
      return ret
    }
  }
})
