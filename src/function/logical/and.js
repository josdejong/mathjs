'use strict'

function factory (type, config, load, typed) {
  const latex = require('../../utils/latex')

  const matrix = load(require('../../type/matrix/function/matrix'))
  const zeros = load(require('../matrix/zeros'))
  const not = load(require('./not'))

  const algorithm02 = load(require('../../type/matrix/utils/algorithm02'))
  const algorithm06 = load(require('../../type/matrix/utils/algorithm06'))
  const algorithm11 = load(require('../../type/matrix/utils/algorithm11'))
  const algorithm13 = load(require('../../type/matrix/utils/algorithm13'))
  const algorithm14 = load(require('../../type/matrix/utils/algorithm14'))

  /**
   * Logical `and`. Test whether two values are both defined with a nonzero/nonempty value.
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.and(x, y)
   *
   * Examples:
   *
   *    math.and(2, 4)   // returns true
   *
   *    a = [2, 0, 0]
   *    b = [3, 7, 0]
   *    c = 0
   *
   *    math.and(a, b)   // returns [true, false, false]
   *    math.and(a, c)   // returns [false, false, false]
   *
   * See also:
   *
   *    not, or, xor
   *
   * @param  {number | BigNumber | Complex | Unit | Array | Matrix} x First value to check
   * @param  {number | BigNumber | Complex | Unit | Array | Matrix} y Second value to check
   * @return {boolean | Array | Matrix}
   *            Returns true when both inputs are defined with a nonzero/nonempty value.
   */
  const and = typed('and', {

    'number, number': function (x, y) {
      return !!(x && y)
    },

    'Complex, Complex': function (x, y) {
      return (x.re !== 0 || x.im !== 0) && (y.re !== 0 || y.im !== 0)
    },

    'BigNumber, BigNumber': function (x, y) {
      return !x.isZero() && !y.isZero() && !x.isNaN() && !y.isNaN()
    },

    'Unit, Unit': function (x, y) {
      return and(x.value || 0, y.value || 0)
    },

    'SparseMatrix, SparseMatrix': function (x, y) {
      return algorithm06(x, y, and, false)
    },

    'SparseMatrix, DenseMatrix': function (x, y) {
      return algorithm02(y, x, and, true)
    },

    'DenseMatrix, SparseMatrix': function (x, y) {
      return algorithm02(x, y, and, false)
    },

    'DenseMatrix, DenseMatrix': function (x, y) {
      return algorithm13(x, y, and)
    },

    'Array, Array': function (x, y) {
      // use matrix implementation
      return and(matrix(x), matrix(y)).valueOf()
    },

    'Array, Matrix': function (x, y) {
      // use matrix implementation
      return and(matrix(x), y)
    },

    'Matrix, Array': function (x, y) {
      // use matrix implementation
      return and(x, matrix(y))
    },

    'SparseMatrix, any': function (x, y) {
      // check scalar
      if (not(y)) {
        // return zero matrix
        return zeros(x.size(), x.storage())
      }
      return algorithm11(x, y, and, false)
    },

    'DenseMatrix, any': function (x, y) {
      // check scalar
      if (not(y)) {
        // return zero matrix
        return zeros(x.size(), x.storage())
      }
      return algorithm14(x, y, and, false)
    },

    'any, SparseMatrix': function (x, y) {
      // check scalar
      if (not(x)) {
        // return zero matrix
        return zeros(x.size(), x.storage())
      }
      return algorithm11(y, x, and, true)
    },

    'any, DenseMatrix': function (x, y) {
      // check scalar
      if (not(x)) {
        // return zero matrix
        return zeros(x.size(), x.storage())
      }
      return algorithm14(y, x, and, true)
    },

    'Array, any': function (x, y) {
      // use matrix implementation
      return and(matrix(x), y).valueOf()
    },

    'any, Array': function (x, y) {
      // use matrix implementation
      return and(x, matrix(y)).valueOf()
    }
  })

  and.toTex = {
    2: `\\left(\${args[0]}${latex.operators['and']}\${args[1]}\\right)`
  }

  return and
}

exports.name = 'and'
exports.factory = factory
