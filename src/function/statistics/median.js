import { containsCollections } from '../../utils/collection.js'
import { flatten } from '../../utils/array.js'
import { factory } from '../../utils/factory.js'
import { improveErrorMessage } from './utils/improveErrorMessage.js'

const name = 'median'
const dependencies = ['typed', 'add', 'unaryPlus', 'divide', 'compare', 'partitionSelect']

export const createMedian = /* #__PURE__ */ factory(name, dependencies, ({ typed, add, unaryPlus, divide, compare, partitionSelect }) => {
  /**
   * Recursively calculate the median of an n-dimensional array
   * @param {Array} array
   * @return {Number} median
   * @private
   */
  function _median (array) {
    try {
      array = flatten(array.valueOf())

      const num = array.length
      if (num === 0) {
        throw new Error('Cannot calculate median of an empty array')
      }

      if (num % 2 === 0) {
        // even: return the average of the two middle values
        const mid = num / 2 - 1
        const right = partitionSelect(array, mid + 1)

        // array now partitioned at mid + 1, take max of left part
        let left = array[mid]
        for (let i = 0; i < mid; ++i) {
          if (compare(array[i], left) > 0) {
            left = array[i]
          }
        }

        // divide a bigint sum by a bigint, so it is not converted to number
        const sum = add(left, right)
        return divide(sum, typeof sum === 'bigint' ? 2n : 2)
      } else {
        // odd: return the middle value
        const m = partitionSelect(array, (num - 1) / 2)

        // unaryPlus keeps numeric values as they are, and converts
        // strings and booleans into a numeric value
        return unaryPlus(m)
      }
    } catch (err) {
      throw improveErrorMessage(err, 'median')
    }
  }

  /**
   * Compute the median of a matrix or a list with values. The values are
   * sorted and the middle value is returned. In case of an even number of
   * values, the average of the two middle values is returned.
   * All types of values that can be compared, added, and divided by two
   * are supported.
   *
   * In case of a (multi dimensional) array or matrix, the median of all
   * elements will be calculated.
   *
   * The median of bigints is a bigint. For an even number of bigints it is
   * the average of the two middle values rounded towards zero, so it is not
   * always the exact midpoint and can be equal to one of the two middle
   * values.
   *
   * Syntax:
   *
   *     math.median(a, b, c, ...)
   *     math.median(A)
   *
   * Examples:
   *
   *     math.median(5, 2, 7)        // returns 5
   *     math.median([3, -1, 5, 7])  // returns 4
   *     math.median(2n, 3n)         // returns 2n
   *
   * See also:
   *
   *     mean, min, max, sum, prod, std, variance, quantileSeq
   *
   * History:
   *
   *    v15.3  Support Fraction and bigint arguments
   *    v0.19  Created
   *
   * @param {... *} args  A single matrix or or multiple scalar values
   * @return {*} The median
   */
  return typed(name, {
    // median([a, b, c, d, ...])
    'Array | Matrix': _median,

    // median([a, b, c, d, ...], dim)
    'Array | Matrix, number | BigNumber': function (array, dim) {
      // TODO: implement median(A, dim)
      throw new Error('median(A, dim) is not yet supported')
      // return reduce(arguments[0], arguments[1], ...)
    },

    // median(a, b, c, d, ...)
    '...': function (args) {
      if (containsCollections(args)) {
        throw new TypeError('Scalar values expected in function median')
      }

      return _median(args)
    }
  })
})
