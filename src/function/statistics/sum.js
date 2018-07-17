'use strict'

const deepForEach = require('../../utils/collection/deepForEach')

function factory (type, config, load, typed) {
  const add = load(require('../arithmetic/addScalar'))
  const improveErrorMessage = load(require('./utils/improveErrorMessage'))

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
   *    mean, median, min, max, prod, std, var
   *
   * @param {... *} args  A single matrix or or multiple scalar values
   * @return {*} The sum of all values
   */
  const sum = typed('sum', {
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

  sum.toTex = undefined // use default template

  return sum

  /**
   * Recursively calculate the sum of an n-dimensional array
   * @param {Array} array
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
      switch (config.number) {
        case 'number':
          return 0
        case 'BigNumber':
          return new type.BigNumber(0)
        case 'Fraction':
          return new type.Fraction(0)
        default:
          return 0
      }
    }

    return sum
  }
}

exports.name = 'sum'
exports.factory = factory
