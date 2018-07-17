'use strict'

const isInteger = require('../../utils/number').isInteger
const toFixed = require('../../utils/number').toFixed
const deepMap = require('../../utils/collection/deepMap')

const NO_INT = 'Number of decimals in function round must be an integer'

function factory (type, config, load, typed) {
  const matrix = load(require('../../type/matrix/function/matrix'))
  const equalScalar = load(require('../relational/equalScalar'))
  const zeros = load(require('../matrix/zeros'))

  const algorithm11 = load(require('../../type/matrix/utils/algorithm11'))
  const algorithm12 = load(require('../../type/matrix/utils/algorithm12'))
  const algorithm14 = load(require('../../type/matrix/utils/algorithm14'))

  /**
   * Round a value towards the nearest integer.
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.round(x)
   *    math.round(x, n)
   *
   * Examples:
   *
   *    math.round(3.2)              // returns number 3
   *    math.round(3.8)              // returns number 4
   *    math.round(-4.2)             // returns number -4
   *    math.round(-4.7)             // returns number -5
   *    math.round(math.pi, 3)       // returns number 3.142
   *    math.round(123.45678, 2)     // returns number 123.46
   *
   *    const c = math.complex(3.2, -2.7)
   *    math.round(c)                // returns Complex 3 - 3i
   *
   *    math.round([3.2, 3.8, -4.7]) // returns Array [3, 4, -5]
   *
   * See also:
   *
   *    ceil, fix, floor
   *
   * @param  {number | BigNumber | Fraction | Complex | Array | Matrix} x  Number to be rounded
   * @param  {number | BigNumber | Array} [n=0]                            Number of decimals
   * @return {number | BigNumber | Fraction | Complex | Array | Matrix} Rounded value
   */
  const round = typed('round', {

    'number': Math.round,

    'number, number': function (x, n) {
      if (!isInteger(n)) { throw new TypeError(NO_INT) }
      if (n < 0 || n > 15) { throw new Error('Number of decimals in function round must be in te range of 0-15') }

      return _round(x, n)
    },

    'Complex': function (x) {
      return x.round()
    },

    'Complex, number': function (x, n) {
      if (n % 1) { throw new TypeError(NO_INT) }

      return x.round(n)
    },

    'Complex, BigNumber': function (x, n) {
      if (!n.isInteger()) { throw new TypeError(NO_INT) }

      const _n = n.toNumber()
      return x.round(_n)
    },

    'number, BigNumber': function (x, n) {
      if (!n.isInteger()) { throw new TypeError(NO_INT) }

      return new type.BigNumber(x).toDecimalPlaces(n.toNumber())
    },

    'BigNumber': function (x) {
      return x.toDecimalPlaces(0)
    },

    'BigNumber, BigNumber': function (x, n) {
      if (!n.isInteger()) { throw new TypeError(NO_INT) }

      return x.toDecimalPlaces(n.toNumber())
    },

    'Fraction': function (x) {
      return x.round()
    },

    'Fraction, number': function (x, n) {
      if (n % 1) { throw new TypeError(NO_INT) }
      return x.round(n)
    },

    'Array | Matrix': function (x) {
      // deep map collection, skip zeros since round(0) = 0
      return deepMap(x, round, true)
    },

    'SparseMatrix, number | BigNumber': function (x, y) {
      return algorithm11(x, y, round, false)
    },

    'DenseMatrix, number | BigNumber': function (x, y) {
      return algorithm14(x, y, round, false)
    },

    'number | Complex | BigNumber, SparseMatrix': function (x, y) {
      // check scalar is zero
      if (equalScalar(x, 0)) {
        // do not execute algorithm, result will be a zero matrix
        return zeros(y.size(), y.storage())
      }
      return algorithm12(y, x, round, true)
    },

    'number | Complex | BigNumber, DenseMatrix': function (x, y) {
      // check scalar is zero
      if (equalScalar(x, 0)) {
        // do not execute algorithm, result will be a zero matrix
        return zeros(y.size(), y.storage())
      }
      return algorithm14(y, x, round, true)
    },

    'Array, number | BigNumber': function (x, y) {
      // use matrix implementation
      return algorithm14(matrix(x), y, round, false).valueOf()
    },

    'number | Complex | BigNumber, Array': function (x, y) {
      // use matrix implementation
      return algorithm14(matrix(y), x, round, true).valueOf()
    }
  })

  round.toTex = {
    1: `\\left\\lfloor\${args[0]}\\right\\rceil`,
    2: undefined // use default template
  }

  return round
}

/**
 * round a number to the given number of decimals, or to zero if decimals is
 * not provided
 * @param {number} value
 * @param {number} decimals       number of decimals, between 0 and 15 (0 by default)
 * @return {number} roundedValue
 * @private
 */
function _round (value, decimals) {
  return parseFloat(toFixed(value, decimals))
}

exports.name = 'round'
exports.factory = factory
