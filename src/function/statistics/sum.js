'use strict'

import { deepForEach } from '../../utils/collection'
import { factory } from '../../utils/factory'
import { improveErrorMessage } from './utils/improveErrorMessage'

const name = 'sum'
const dependencies = ['typed', 'config', 'add', 'BigNumber', 'Fraction']

export const createSum = /* #__PURE__ */ factory(name, dependencies, ({ typed, config, add, BigNumber, Fraction }) => {
  /**
   * Compute the sum of a matrix or a list with values.
   * In case of a (multi dimensional) array or matrix, the sum of all
   * elements will be calculated.
   *
   * Syntax:
   *
   *     math.sum(a, b, c, ...)
   *     math.sum(A)
   *
   * Examples:
   *
   *     math.sum(2, 1, 4, 3)               // returns 10
   *     math.sum([2, 1, 4, 3])             // returns 10
   *     math.sum([[2, 5], [4, 3], [1, 7]]) // returns 22
   *
   * See also:
   *
   *    mean, median, min, max, prod, std, variance
   *
   * @param {... *} args  A single matrix or or multiple scalar values
   * @return {*} The sum of all values
   */
  return typed(name, {
    'Array | Matrix': function (args) {
      // sum([a, b, c, d, ...])
      return _sum(args)
    },

    'Array | Matrix, number | BigNumber': function () {
      // sum([a, b, c, d, ...], dim)
      // TODO: implement sum(A, dim)
      throw new Error('sum(A, dim) is not yet supported')
    },

    '...': function (args) {
      // sum(a, b, c, d, ...)
      return _sum(args)
    }
  })

  /**
   * Recursively calculate the sum of an n-dimensional array
   * @param {Array} array
   * @return {number} sum
   * @private
   */
  function _sum (array) {
    let res

    deepForEach(array, function (value) {
      try {
        res = (res === undefined) ? value : add(res, value)
      } catch (err) {
        throw improveErrorMessage(err, 'sum', value)
      }
    })

    if (res === undefined) {
      switch (config.number) {
        case 'number':
          return 0
        case 'BigNumber':
          return new BigNumber(0)
        case 'Fraction':
          return new Fraction(0)
        default:
          return 0
      }
    }

    return res
  }
})
