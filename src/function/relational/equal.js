'use strict'

function factory (type, config, load, typed) {
  const matrix = load(require('../../type/matrix/function/matrix'))
  const equalScalar = load(require('./equalScalar'))

  const algorithm03 = load(require('../../type/matrix/utils/algorithm03'))
  const algorithm07 = load(require('../../type/matrix/utils/algorithm07'))
  const algorithm12 = load(require('../../type/matrix/utils/algorithm12'))
  const algorithm13 = load(require('../../type/matrix/utils/algorithm13'))
  const algorithm14 = load(require('../../type/matrix/utils/algorithm14'))

  const latex = require('../../utils/latex')

  /**
   * Test whether two values are equal.
   *
   * The function tests whether the relative difference between x and y is
   * smaller than the configured epsilon. The function cannot be used to
   * compare values smaller than approximately 2.22e-16.
   *
   * For matrices, the function is evaluated element wise.
   * In case of complex numbers, x.re must equal y.re, and x.im must equal y.im.
   *
   * Values `null` and `undefined` are compared strictly, thus `null` is only
   * equal to `null` and nothing else, and `undefined` is only equal to
   * `undefined` and nothing else. Strings are compared by their numerical value.
   *
   * Syntax:
   *
   *    math.equal(x, y)
   *
   * Examples:
   *
   *    math.equal(2 + 2, 3)         // returns false
   *    math.equal(2 + 2, 4)         // returns true
   *
   *    const a = math.unit('50 cm')
   *    const b = math.unit('5 m')
   *    math.equal(a, b)             // returns true
   *
   *    const c = [2, 5, 1]
   *    const d = [2, 7, 1]
   *
   *    math.equal(c, d)             // returns [true, false, true]
   *    math.deepEqual(c, d)         // returns false
   *
   *    math.equal("1000", "1e3")    // returns true
   *    math.equal(0, null)          // returns false
   *
   * See also:
   *
   *    unequal, smaller, smallerEq, larger, largerEq, compare, deepEqual, equalText
   *
   * @param  {number | BigNumber | boolean | Complex | Unit | string | Array | Matrix} x First value to compare
   * @param  {number | BigNumber | boolean | Complex | Unit | string | Array | Matrix} y Second value to compare
   * @return {boolean | Array | Matrix} Returns true when the compared values are equal, else returns false
   */
  const equal = typed('equal', {

    'any, any': function (x, y) {
      // strict equality for null and undefined?
      if (x === null) { return y === null }
      if (y === null) { return x === null }
      if (x === undefined) { return y === undefined }
      if (y === undefined) { return x === undefined }

      return equalScalar(x, y)
    },

    'SparseMatrix, SparseMatrix': function (x, y) {
      return algorithm07(x, y, equalScalar)
    },

    'SparseMatrix, DenseMatrix': function (x, y) {
      return algorithm03(y, x, equalScalar, true)
    },

    'DenseMatrix, SparseMatrix': function (x, y) {
      return algorithm03(x, y, equalScalar, false)
    },

    'DenseMatrix, DenseMatrix': function (x, y) {
      return algorithm13(x, y, equalScalar)
    },

    'Array, Array': function (x, y) {
      // use matrix implementation
      return equal(matrix(x), matrix(y)).valueOf()
    },

    'Array, Matrix': function (x, y) {
      // use matrix implementation
      return equal(matrix(x), y)
    },

    'Matrix, Array': function (x, y) {
      // use matrix implementation
      return equal(x, matrix(y))
    },

    'SparseMatrix, any': function (x, y) {
      return algorithm12(x, y, equalScalar, false)
    },

    'DenseMatrix, any': function (x, y) {
      return algorithm14(x, y, equalScalar, false)
    },

    'any, SparseMatrix': function (x, y) {
      return algorithm12(y, x, equalScalar, true)
    },

    'any, DenseMatrix': function (x, y) {
      return algorithm14(y, x, equalScalar, true)
    },

    'Array, any': function (x, y) {
      // use matrix implementation
      return algorithm14(matrix(x), y, equalScalar, false).valueOf()
    },

    'any, Array': function (x, y) {
      // use matrix implementation
      return algorithm14(matrix(y), x, equalScalar, true).valueOf()
    }
  })

  equal.toTex = {
    2: `\\left(\${args[0]}${latex.operators['equal']}\${args[1]}\\right)`
  }

  return equal
}

exports.name = 'equal'
exports.factory = factory
