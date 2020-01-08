import { deepForEach } from '../../utils/collection'
import { factory } from '../../utils/factory'
import { improveErrorMessage } from './utils/improveErrorMessage'

const name = 'prod'
const dependencies = ['typed', 'multiply']

export const createProd = /* #__PURE__ */ factory(name, dependencies, ({ typed, multiply }) => {
  /**
   * Compute the product of a matrix or a list with values.
   * In case of a (multi dimensional) array or matrix, the sum of all
   * elements will be calculated.
   *
   * Syntax:
   *
   *     math.prod(a, b, c, ...)
   *     math.prod(A)
   *
   * Examples:
   *
   *     math.multiply(2, 3)           // returns 6
   *     math.prod(2, 3)               // returns 6
   *     math.prod(2, 3, 4)            // returns 24
   *     math.prod([2, 3, 4])          // returns 24
   *     math.prod([[2, 5], [4, 3]])   // returns 120
   *
   * See also:
   *
   *    mean, median, min, max, sum, std, variance
   *
   * @param {... *} args  A single matrix or or multiple scalar values
   * @return {*} The product of all values
   */
  return typed(name, {
    // prod([a, b, c, d, ...])
    'Array | Matrix': _prod,

    // prod([a, b, c, d, ...], dim)
    'Array | Matrix, number | BigNumber': function (array, dim) {
      // TODO: implement prod(A, dim)
      throw new Error('prod(A, dim) is not yet supported')
      // return reduce(arguments[0], arguments[1], math.prod)
    },

    // prod(a, b, c, d, ...)
    '...': function (args) {
      return _prod(args)
    }
  })

  /**
   * Recursively calculate the product of an n-dimensional array
   * @param {Array} array
   * @return {number} prod
   * @private
   */
  function _prod (array) {
    let prod

    deepForEach(array, function (value) {
      try {
        prod = (prod === undefined) ? value : multiply(prod, value)
      } catch (err) {
        throw improveErrorMessage(err, 'prod', value)
      }
    })

    if (prod === undefined) {
      throw new Error('Cannot calculate prod of an empty array')
    }

    return prod
  }
})
