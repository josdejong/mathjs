'use strict'

import { deepForEach } from '../../utils/collection'
import { isBigNumber } from '../../utils/is'
import { factory } from '../../utils/factory'
import { improveErrorMessage } from './utils/improveErrorMessage'

const DEFAULT_NORMALIZATION = 'unbiased'

const name = 'variance'
const dependencies = ['typed', 'add', 'subtract', 'multiply', 'divide', 'isNaN']

export const createVariance = /* #__PURE__ */ factory(name, dependencies, ({ typed, add, subtract, multiply, divide, isNaN }) => {
  /**
   * Compute the variance of a matrix or a  list with values.
   * In case of a (multi dimensional) array or matrix, the variance over all
   * elements will be calculated.
   *
   * Optionally, the type of normalization can be specified as second
   * parameter. The parameter `normalization` can be one of the following values:
   *
   * - 'unbiased' (default) The sum of squared errors is divided by (n - 1)
   * - 'uncorrected'        The sum of squared errors is divided by n
   * - 'biased'             The sum of squared errors is divided by (n + 1)
   *
   * Syntax:
   *
   *     math.variance(a, b, c, ...)
   *     math.variance(A)
   *     math.variance(A, normalization)
   *
   * Examples:
   *
   *     math.variance(2, 4, 6)                     // returns 4
   *     math.variance([2, 4, 6, 8])                // returns 6.666666666666667
   *     math.variance([2, 4, 6, 8], 'uncorrected') // returns 5
   *     math.variance([2, 4, 6, 8], 'biased')      // returns 4
   *
   *     math.variance([[1, 2, 3], [4, 5, 6]])      // returns 3.5
   *
   * See also:
   *
   *    mean, median, max, min, prod, std, sum
   *
   * @param {Array | Matrix} array
   *                        A single matrix or or multiple scalar values
   * @param {string} [normalization='unbiased']
   *                        Determines how to normalize the variance.
   *                        Choose 'unbiased' (default), 'uncorrected', or 'biased'.
   * @return {*} The variance
   */
  return typed(name, {
    // variance([a, b, c, d, ...])
    'Array | Matrix': function (array) {
      return _var(array, DEFAULT_NORMALIZATION)
    },

    // variance([a, b, c, d, ...], normalization)
    'Array | Matrix, string': _var,

    // variance(a, b, c, d, ...)
    '...': function (args) {
      return _var(args, DEFAULT_NORMALIZATION)
    }
  })

  /**
   * Recursively calculate the variance of an n-dimensional array
   * @param {Array} array
   * @param {string} normalization
   *                        Determines how to normalize the variance:
   *                        - 'unbiased'    The sum of squared errors is divided by (n - 1)
   *                        - 'uncorrected' The sum of squared errors is divided by n
   *                        - 'biased'      The sum of squared errors is divided by (n + 1)
   * @return {number | BigNumber} variance
   * @private
   */
  function _var (array, normalization) {
    let sum = 0
    let num = 0

    if (array.length === 0) {
      throw new SyntaxError('Function variance requires one or more parameters (0 provided)')
    }

    // calculate the mean and number of elements
    deepForEach(array, function (value) {
      try {
        sum = add(sum, value)
        num++
      } catch (err) {
        throw improveErrorMessage(err, 'variance', value)
      }
    })
    if (num === 0) throw new Error('Cannot calculate variance of an empty array')

    const mean = divide(sum, num)

    // calculate the variance
    sum = 0
    deepForEach(array, function (value) {
      const diff = subtract(value, mean)
      sum = add(sum, multiply(diff, diff))
    })

    if (isNaN(sum)) {
      return sum
    }

    switch (normalization) {
      case 'uncorrected':
        return divide(sum, num)

      case 'biased':
        return divide(sum, num + 1)

      case 'unbiased':
        const zero = isBigNumber(sum) ? sum.mul(0) : 0
        return (num === 1) ? zero : divide(sum, num - 1)

      default:
        throw new Error('Unknown normalization "' + normalization + '". ' +
        'Choose "unbiased" (default), "uncorrected", or "biased".')
    }
  }
})

// For backward compatibility, deprecated since version 6.0.0. Date: 2018-11-09
export const createDeprecatedVar = /* #__PURE__ */ factory('var', ['variance'], ({ variance }) => {
  let warned = false

  return function (...args) {
    if (!warned) {
      warned = true
      console.warn('Function "var" has been renamed to "variance", please use the new function instead.')
    }
    return variance.apply(variance, args)
  }
})
