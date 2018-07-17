'use strict'

const isInteger = require('../../utils/number').isInteger

function factory (type, config, load, typed) {
  const matrix = load(require('../../type/matrix/function/matrix'))

  const algorithm02 = load(require('../../type/matrix/utils/algorithm02'))
  const algorithm06 = load(require('../../type/matrix/utils/algorithm06'))
  const algorithm11 = load(require('../../type/matrix/utils/algorithm11'))
  const algorithm13 = load(require('../../type/matrix/utils/algorithm13'))
  const algorithm14 = load(require('../../type/matrix/utils/algorithm14'))

  /**
   * Calculate the least common multiple for two or more values or arrays.
   *
   * lcm is defined as:
   *
   *     lcm(a, b) = abs(a * b) / gcd(a, b)
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.lcm(a, b)
   *    math.lcm(a, b, c, ...)
   *
   * Examples:
   *
   *    math.lcm(4, 6)               // returns 12
   *    math.lcm(6, 21)              // returns 42
   *    math.lcm(6, 21, 5)           // returns 210
   *
   *    math.lcm([4, 6], [6, 21])    // returns [12, 42]
   *
   * See also:
   *
   *    gcd, xgcd
   *
   * @param {... number | BigNumber | Array | Matrix} args  Two or more integer numbers
   * @return {number | BigNumber | Array | Matrix}                           The least common multiple
   */
  const lcm = typed('lcm', {
    'number, number': _lcm,

    'BigNumber, BigNumber': _lcmBigNumber,

    'Fraction, Fraction': function (x, y) {
      return x.lcm(y)
    },

    'SparseMatrix, SparseMatrix': function (x, y) {
      return algorithm06(x, y, lcm)
    },

    'SparseMatrix, DenseMatrix': function (x, y) {
      return algorithm02(y, x, lcm, true)
    },

    'DenseMatrix, SparseMatrix': function (x, y) {
      return algorithm02(x, y, lcm, false)
    },

    'DenseMatrix, DenseMatrix': function (x, y) {
      return algorithm13(x, y, lcm)
    },

    'Array, Array': function (x, y) {
      // use matrix implementation
      return lcm(matrix(x), matrix(y)).valueOf()
    },

    'Array, Matrix': function (x, y) {
      // use matrix implementation
      return lcm(matrix(x), y)
    },

    'Matrix, Array': function (x, y) {
      // use matrix implementation
      return lcm(x, matrix(y))
    },

    'SparseMatrix, number | BigNumber': function (x, y) {
      return algorithm11(x, y, lcm, false)
    },

    'DenseMatrix, number | BigNumber': function (x, y) {
      return algorithm14(x, y, lcm, false)
    },

    'number | BigNumber, SparseMatrix': function (x, y) {
      return algorithm11(y, x, lcm, true)
    },

    'number | BigNumber, DenseMatrix': function (x, y) {
      return algorithm14(y, x, lcm, true)
    },

    'Array, number | BigNumber': function (x, y) {
      // use matrix implementation
      return algorithm14(matrix(x), y, lcm, false).valueOf()
    },

    'number | BigNumber, Array': function (x, y) {
      // use matrix implementation
      return algorithm14(matrix(y), x, lcm, true).valueOf()
    },

    // TODO: need a smarter notation here
    'Array | Matrix | number | BigNumber, Array | Matrix | number | BigNumber, ...Array | Matrix | number | BigNumber': function (a, b, args) {
      let res = lcm(a, b)
      for (let i = 0; i < args.length; i++) {
        res = lcm(res, args[i])
      }
      return res
    }
  })

  lcm.toTex = undefined // use default template

  return lcm

  /**
   * Calculate lcm for two BigNumbers
   * @param {BigNumber} a
   * @param {BigNumber} b
   * @returns {BigNumber} Returns the least common multiple of a and b
   * @private
   */
  function _lcmBigNumber (a, b) {
    if (!a.isInt() || !b.isInt()) {
      throw new Error('Parameters in function lcm must be integer numbers')
    }

    if (a.isZero() || b.isZero()) {
      return new type.BigNumber(0)
    }

    // http://en.wikipedia.org/wiki/Euclidean_algorithm
    // evaluate lcm here inline to reduce overhead
    const prod = a.times(b)
    while (!b.isZero()) {
      const t = b
      b = a.mod(t)
      a = t
    }
    return prod.div(a).abs()
  }
}

/**
 * Calculate lcm for two numbers
 * @param {number} a
 * @param {number} b
 * @returns {number} Returns the least common multiple of a and b
 * @private
 */
function _lcm (a, b) {
  if (!isInteger(a) || !isInteger(b)) {
    throw new Error('Parameters in function lcm must be integer numbers')
  }

  if (a === 0 || b === 0) {
    return 0
  }

  // http://en.wikipedia.org/wiki/Euclidean_algorithm
  // evaluate lcm here inline to reduce overhead
  let t
  const prod = a * b
  while (b !== 0) {
    t = b
    b = a % t
    a = t
  }
  return Math.abs(prod / a)
}

exports.name = 'lcm'
exports.factory = factory
