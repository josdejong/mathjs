'use strict'

const isInteger = require('../../utils/number').isInteger
const bigBitOr = require('../../utils/bignumber/bitOr')

function factory (type, config, load, typed) {
  const latex = require('../../utils/latex')

  const matrix = load(require('../../type/matrix/function/matrix'))

  const algorithm01 = load(require('../../type/matrix/utils/algorithm01'))
  const algorithm04 = load(require('../../type/matrix/utils/algorithm04'))
  const algorithm10 = load(require('../../type/matrix/utils/algorithm10'))
  const algorithm13 = load(require('../../type/matrix/utils/algorithm13'))
  const algorithm14 = load(require('../../type/matrix/utils/algorithm14'))

  /**
   * Bitwise OR two values, `x | y`.
   * For matrices, the function is evaluated element wise.
   * For units, the function is evaluated on the lowest print base.
   *
   * Syntax:
   *
   *    math.bitOr(x, y)
   *
   * Examples:
   *
   *    math.bitOr(1, 2)               // returns number 3
   *
   *    math.bitOr([1, 2, 3], 4)       // returns Array [5, 6, 7]
   *
   * See also:
   *
   *    bitAnd, bitNot, bitXor, leftShift, rightArithShift, rightLogShift
   *
   * @param  {number | BigNumber | Array | Matrix} x First value to or
   * @param  {number | BigNumber | Array | Matrix} y Second value to or
   * @return {number | BigNumber | Array | Matrix} OR of `x` and `y`
   */
  const bitOr = typed('bitOr', {

    'number, number': function (x, y) {
      if (!isInteger(x) || !isInteger(y)) {
        throw new Error('Integers expected in function bitOr')
      }

      return x | y
    },

    'BigNumber, BigNumber': bigBitOr,

    'SparseMatrix, SparseMatrix': function (x, y) {
      return algorithm04(x, y, bitOr)
    },

    'SparseMatrix, DenseMatrix': function (x, y) {
      return algorithm01(y, x, bitOr, true)
    },

    'DenseMatrix, SparseMatrix': function (x, y) {
      return algorithm01(x, y, bitOr, false)
    },

    'DenseMatrix, DenseMatrix': function (x, y) {
      return algorithm13(x, y, bitOr)
    },

    'Array, Array': function (x, y) {
      // use matrix implementation
      return bitOr(matrix(x), matrix(y)).valueOf()
    },

    'Array, Matrix': function (x, y) {
      // use matrix implementation
      return bitOr(matrix(x), y)
    },

    'Matrix, Array': function (x, y) {
      // use matrix implementation
      return bitOr(x, matrix(y))
    },

    'SparseMatrix, any': function (x, y) {
      return algorithm10(x, y, bitOr, false)
    },

    'DenseMatrix, any': function (x, y) {
      return algorithm14(x, y, bitOr, false)
    },

    'any, SparseMatrix': function (x, y) {
      return algorithm10(y, x, bitOr, true)
    },

    'any, DenseMatrix': function (x, y) {
      return algorithm14(y, x, bitOr, true)
    },

    'Array, any': function (x, y) {
      // use matrix implementation
      return algorithm14(matrix(x), y, bitOr, false).valueOf()
    },

    'any, Array': function (x, y) {
      // use matrix implementation
      return algorithm14(matrix(y), x, bitOr, true).valueOf()
    }
  })

  bitOr.toTex = {
    2: `\\left(\${args[0]}${latex.operators['bitOr']}\${args[1]}\\right)`
  }

  return bitOr
}

exports.name = 'bitOr'
exports.factory = factory
