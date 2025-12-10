import { containsCollections, deepForEach, reduce } from '../../utils/collection.js'
import { factory } from '../../utils/factory.js'
import { improveErrorMessage } from './utils/improveErrorMessage.js'
import { createNumericPassthru } from './utils/numericPassthru.js'

const name = 'sum'
const dependencies = ['typed', 'config', 'add', 'numeric']

export const createSum = /* #__PURE__ */ factory(name, dependencies, ({
  typed, config, add, numeric
}) => {
  const passthru = createNumericPassthru({ typed })
  /**
   * Compute the sum of a matrix or a list with values.
   * In case of a multidimensional array or matrix, the sum of all
   * elements will be calculated.
   *
   * Syntax:
   *
   *     math.sum(a, b, c, ...)
   *     math.sum(A)
   *     math.sum(A, dimension)
   *
   * Examples:
   *
   *     math.sum(2, 1, 4, 3)               // returns 10
   *     math.sum([2, 1, 4, 3])             // returns 10
   *     math.sum([[2, 5], [4, 3], [1, 7]]) // returns 22
   *
   * See also:
   *
   *    mean, median, min, max, prod, std, variance, cumsum
   *
   * @param {... *} args  A single matrix or multiple scalar values
   * @return {*} The sum of all values
   */
  return typed(name, passthru, {
    // sum([a, b, c, d, ...])
    'Array | Matrix': _sum,

    // sum([a, b, c, d, ...], dim)
    'Array | Matrix, number | BigNumber': _nsumDim,

    // sum(a, b, c, d, ...)
    '...': function (args) {
      if (containsCollections(args)) {
        throw new TypeError('Scalar values expected in function sum')
      }

      return _sum(args)
    }
  })

  /**
   * Recursively calculate the sum of an n-dimensional array
   * @param {Array | Matrix} array
   * @return {number} sum
   * @private
   */
  function _sum (array) {
    let sum

    deepForEach(array, function (value) {
      try {
        sum = (sum === undefined) ? value : add(sum, value)
      } catch (err) {
        throw improveErrorMessage(err, 'sum', value)
      }
    })

    if (sum === undefined) {
      // Note any number type can represent zero
      sum = numeric(0, config.number)
    }

    return passthru(sum)
  }

  function _nsumDim (array, dim) {
    try {
      const sum = reduce(array, dim, add)
      return sum
    } catch (err) {
      throw improveErrorMessage(err, 'sum')
    }
  }
})
