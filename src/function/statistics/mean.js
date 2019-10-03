import { containsCollections, deepForEach, reduce } from '../../utils/collection'
import { arraySize } from '../../utils/array'
import { factory } from '../../utils/factory'
import { improveErrorMessage } from './utils/improveErrorMessage'

const name = 'mean'
const dependencies = ['typed', 'add', 'divide']

export const createMean = /* #__PURE__ */ factory(name, dependencies, ({ typed, add, divide }) => {
  /**
   * Compute the mean value of matrix or a list with values.
   * In case of a multi dimensional array, the mean of the flattened array
   * will be calculated. When `dim` is provided, the maximum over the selected
   * dimension will be calculated. Parameter `dim` is zero-based.
   *
   * Syntax:
   *
   *     math.mean(a, b, c, ...)
   *     math.mean(A)
   *     math.mean(A, dim)
   *
   * Examples:
   *
   *     math.mean(2, 1, 4, 3)                     // returns 2.5
   *     math.mean([1, 2.7, 3.2, 4])               // returns 2.725
   *
   *     math.mean([[2, 5], [6, 3], [1, 7]], 0)    // returns [3, 5]
   *     math.mean([[2, 5], [6, 3], [1, 7]], 1)    // returns [3.5, 4.5, 4]
   *
   * See also:
   *
   *     median, min, max, sum, prod, std, variance
   *
   * @param {... *} args  A single matrix or or multiple scalar values
   * @return {*} The mean of all values
   */
  return typed(name, {
    // mean([a, b, c, d, ...])
    'Array | Matrix': _mean,

    // mean([a, b, c, d, ...], dim)
    'Array | Matrix, number | BigNumber': _nmeanDim,

    // mean(a, b, c, d, ...)
    '...': function (args) {
      if (containsCollections(args)) {
        throw new TypeError('Scalar values expected in function mean')
      }

      return _mean(args)
    }
  })

  /**
   * Calculate the mean value in an n-dimensional array, returning a
   * n-1 dimensional array
   * @param {Array} array
   * @param {number} dim
   * @return {number} mean
   * @private
   */
  function _nmeanDim (array, dim) {
    try {
      const sum = reduce(array, dim, add)
      const s = Array.isArray(array) ? arraySize(array) : array.size()
      return divide(sum, s[dim])
    } catch (err) {
      throw improveErrorMessage(err, 'mean')
    }
  }

  /**
   * Recursively calculate the mean value in an n-dimensional array
   * @param {Array} array
   * @return {number} mean
   * @private
   */
  function _mean (array) {
    let sum
    let num = 0

    deepForEach(array, function (value) {
      try {
        sum = sum === undefined ? value : add(sum, value)
        num++
      } catch (err) {
        throw improveErrorMessage(err, 'mean', value)
      }
    })

    if (num === 0) {
      throw new Error('Cannot calculate the mean of an empty array')
    }
    return divide(sum, num)
  }
})
