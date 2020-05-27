import { containsCollections } from '../../utils/collection'
import { factory } from '../../utils/factory'
import { _switch } from '../../utils/switch'
import { improveErrorMessage } from './utils/improveErrorMessage'
import { isUnit } from '../../utils/is'
import { arraySize } from '../../utils/array'
import { IndexError } from '../../error/IndexError'

const name = 'cumsum'
const dependencies = ['typed', 'add', '?Unit']

export const createCumSum = /* #__PURE__ */ factory(name, dependencies, ({ typed, add, Unit }) => {
  /**
   * Compute the cumulative sum of a matrix or a list with values.
   * In case of a (multi dimensional) array or matrix, the cumulative sum of
   * across a certain dimension will be calculated.
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
      return matrix.create(_cumsum(matrix.valueOf()))
    },

    // sum([a, b, c, d, ...], dim)
    'Array, number | BigNumber': _ncumSumDim,
    'Matrix, number | BigNumber': function (matrix, dim) {
      return matrix.create(_ncumSumDim(matrix.valueOf(), dim))
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
    // TODO: rewrite this logic, it's hard to understand
    return array.map((sum => value => sum = add(sum, value))(_initialCumsumValue(array[0])))
  }

  function _initialCumsumValue (value) {
    return isUnit(value) ? new Unit(0, value.units[0].unit.name) : 0
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
