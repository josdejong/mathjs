'use strict'

const nearlyEqual = require('../../utils/number').nearlyEqual
const bigNearlyEqual = require('../../utils/bignumber/nearlyEqual')

function factory (type, config, load, typed) {
  const matrix = load(require('../../type/matrix/function/matrix'))

  const algorithm03 = load(require('../../type/matrix/utils/algorithm03'))
  const algorithm07 = load(require('../../type/matrix/utils/algorithm07'))
  const algorithm12 = load(require('../../type/matrix/utils/algorithm12'))
  const algorithm13 = load(require('../../type/matrix/utils/algorithm13'))
  const algorithm14 = load(require('../../type/matrix/utils/algorithm14'))

  const latex = require('../../utils/latex')

  /**
   * Test whether value x is smaller than y.
   *
   * The function returns true when x is smaller than y and the relative
   * difference between x and y is smaller than the configured epsilon. The
   * function cannot be used to compare values smaller than approximately 2.22e-16.
   *
   * For matrices, the function is evaluated element wise.
   * Strings are compared by their numerical value.
   *
   * Syntax:
   *
   *    math.smaller(x, y)
   *
   * Examples:
   *
   *    math.smaller(2, 3)            // returns true
   *    math.smaller(5, 2 * 2)        // returns false
   *
   *    const a = math.unit('5 cm')
   *    const b = math.unit('2 inch')
   *    math.smaller(a, b)            // returns true
   *
   * See also:
   *
   *    equal, unequal, smallerEq, smaller, smallerEq, compare
   *
   * @param  {number | BigNumber | Fraction | boolean | Unit | string | Array | Matrix} x First value to compare
   * @param  {number | BigNumber | Fraction | boolean | Unit | string | Array | Matrix} y Second value to compare
   * @return {boolean | Array | Matrix} Returns true when the x is smaller than y, else returns false
   */
  const smaller = typed('smaller', {

    'boolean, boolean': function (x, y) {
      return x < y
    },

    'number, number': function (x, y) {
      return x < y && !nearlyEqual(x, y, config.epsilon)
    },

    'BigNumber, BigNumber': function (x, y) {
      return x.lt(y) && !bigNearlyEqual(x, y, config.epsilon)
    },

    'Fraction, Fraction': function (x, y) {
      return x.compare(y) === -1
    },

    'Complex, Complex': function (x, y) {
      throw new TypeError('No ordering relation is defined for complex numbers')
    },

    'Unit, Unit': function (x, y) {
      if (!x.equalBase(y)) {
        throw new Error('Cannot compare units with different base')
      }
      return smaller(x.value, y.value)
    },

    'SparseMatrix, SparseMatrix': function (x, y) {
      return algorithm07(x, y, smaller)
    },

    'SparseMatrix, DenseMatrix': function (x, y) {
      return algorithm03(y, x, smaller, true)
    },

    'DenseMatrix, SparseMatrix': function (x, y) {
      return algorithm03(x, y, smaller, false)
    },

    'DenseMatrix, DenseMatrix': function (x, y) {
      return algorithm13(x, y, smaller)
    },

    'Array, Array': function (x, y) {
      // use matrix implementation
      return smaller(matrix(x), matrix(y)).valueOf()
    },

    'Array, Matrix': function (x, y) {
      // use matrix implementation
      return smaller(matrix(x), y)
    },

    'Matrix, Array': function (x, y) {
      // use matrix implementation
      return smaller(x, matrix(y))
    },

    'SparseMatrix, any': function (x, y) {
      return algorithm12(x, y, smaller, false)
    },

    'DenseMatrix, any': function (x, y) {
      return algorithm14(x, y, smaller, false)
    },

    'any, SparseMatrix': function (x, y) {
      return algorithm12(y, x, smaller, true)
    },

    'any, DenseMatrix': function (x, y) {
      return algorithm14(y, x, smaller, true)
    },

    'Array, any': function (x, y) {
      // use matrix implementation
      return algorithm14(matrix(x), y, smaller, false).valueOf()
    },

    'any, Array': function (x, y) {
      // use matrix implementation
      return algorithm14(matrix(y), x, smaller, true).valueOf()
    }
  })

  smaller.toTex = {
    2: `\\left(\${args[0]}${latex.operators['smaller']}\${args[1]}\\right)`
  }

  return smaller
}

exports.name = 'smaller'
exports.factory = factory
