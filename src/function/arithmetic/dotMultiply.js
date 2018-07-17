'use strict'

function factory (type, config, load, typed) {
  const matrix = load(require('../../type/matrix/function/matrix'))
  const multiplyScalar = load(require('./multiplyScalar'))
  const latex = require('../../utils/latex')

  const algorithm02 = load(require('../../type/matrix/utils/algorithm02'))
  const algorithm09 = load(require('../../type/matrix/utils/algorithm09'))
  const algorithm11 = load(require('../../type/matrix/utils/algorithm11'))
  const algorithm13 = load(require('../../type/matrix/utils/algorithm13'))
  const algorithm14 = load(require('../../type/matrix/utils/algorithm14'))

  /**
   * Multiply two matrices element wise. The function accepts both matrices and
   * scalar values.
   *
   * Syntax:
   *
   *    math.dotMultiply(x, y)
   *
   * Examples:
   *
   *    math.dotMultiply(2, 4) // returns 8
   *
   *    a = [[9, 5], [6, 1]]
   *    b = [[3, 2], [5, 2]]
   *
   *    math.dotMultiply(a, b) // returns [[27, 10], [30, 2]]
   *    math.multiply(a, b)    // returns [[52, 28], [23, 14]]
   *
   * See also:
   *
   *    multiply, divide, dotDivide
   *
   * @param  {number | BigNumber | Fraction | Complex | Unit | Array | Matrix} x Left hand value
   * @param  {number | BigNumber | Fraction | Complex | Unit | Array | Matrix} y Right hand value
   * @return {number | BigNumber | Fraction | Complex | Unit | Array | Matrix}                    Multiplication of `x` and `y`
   */
  const dotMultiply = typed('dotMultiply', {

    'any, any': multiplyScalar,

    'SparseMatrix, SparseMatrix': function (x, y) {
      return algorithm09(x, y, multiplyScalar, false)
    },

    'SparseMatrix, DenseMatrix': function (x, y) {
      return algorithm02(y, x, multiplyScalar, true)
    },

    'DenseMatrix, SparseMatrix': function (x, y) {
      return algorithm02(x, y, multiplyScalar, false)
    },

    'DenseMatrix, DenseMatrix': function (x, y) {
      return algorithm13(x, y, multiplyScalar)
    },

    'Array, Array': function (x, y) {
      // use matrix implementation
      return dotMultiply(matrix(x), matrix(y)).valueOf()
    },

    'Array, Matrix': function (x, y) {
      // use matrix implementation
      return dotMultiply(matrix(x), y)
    },

    'Matrix, Array': function (x, y) {
      // use matrix implementation
      return dotMultiply(x, matrix(y))
    },

    'SparseMatrix, any': function (x, y) {
      return algorithm11(x, y, multiplyScalar, false)
    },

    'DenseMatrix, any': function (x, y) {
      return algorithm14(x, y, multiplyScalar, false)
    },

    'any, SparseMatrix': function (x, y) {
      return algorithm11(y, x, multiplyScalar, true)
    },

    'any, DenseMatrix': function (x, y) {
      return algorithm14(y, x, multiplyScalar, true)
    },

    'Array, any': function (x, y) {
      // use matrix implementation
      return algorithm14(matrix(x), y, multiplyScalar, false).valueOf()
    },

    'any, Array': function (x, y) {
      // use matrix implementation
      return algorithm14(matrix(y), x, multiplyScalar, true).valueOf()
    }
  })

  dotMultiply.toTex = {
    2: `\\left(\${args[0]}${latex.operators['dotMultiply']}\${args[1]}\\right)`
  }

  return dotMultiply
}

exports.name = 'dotMultiply'
exports.factory = factory
