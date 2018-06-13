'use strict'

const isInteger = require('../../utils/number').isInteger
const bigBitAnd = require('../../utils/bignumber/bitAnd')

function factory (type, config, load, typed) {
  const latex = require('../../utils/latex')

  const matrix = load(require('../../type/matrix/function/matrix'))

  const algorithm02 = load(require('../../type/matrix/utils/algorithm02'))
  const algorithm06 = load(require('../../type/matrix/utils/algorithm06'))
  const algorithm11 = load(require('../../type/matrix/utils/algorithm11'))
  const algorithm13 = load(require('../../type/matrix/utils/algorithm13'))
  const algorithm14 = load(require('../../type/matrix/utils/algorithm14'))

  /**
   * Bitwise AND two values, `x & y`.
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.bitAnd(x, y)
   *
   * Examples:
   *
   *    math.bitAnd(53, 131)               // returns number 1
   *
   *    math.bitAnd([1, 12, 31], 42)       // returns Array [0, 8, 10]
   *
   * See also:
   *
   *    bitNot, bitOr, bitXor, leftShift, rightArithShift, rightLogShift
   *
   * @param  {number | BigNumber | Array | Matrix} x First value to and
   * @param  {number | BigNumber | Array | Matrix} y Second value to and
   * @return {number | BigNumber | Array | Matrix} AND of `x` and `y`
   */
  const bitAnd = typed('bitAnd', {

    'number, number': function (x, y) {
      if (!isInteger(x) || !isInteger(y)) {
        throw new Error('Integers expected in function bitAnd')
      }

      return x & y
    },

    'BigNumber, BigNumber': bigBitAnd,

    'SparseMatrix, SparseMatrix': function (x, y) {
      return algorithm06(x, y, bitAnd, false)
    },

    'SparseMatrix, DenseMatrix': function (x, y) {
      return algorithm02(y, x, bitAnd, true)
    },

    'DenseMatrix, SparseMatrix': function (x, y) {
      return algorithm02(x, y, bitAnd, false)
    },

    'DenseMatrix, DenseMatrix': function (x, y) {
      return algorithm13(x, y, bitAnd)
    },

    'Array, Array': function (x, y) {
      // use matrix implementation
      return bitAnd(matrix(x), matrix(y)).valueOf()
    },

    'Array, Matrix': function (x, y) {
      // use matrix implementation
      return bitAnd(matrix(x), y)
    },

    'Matrix, Array': function (x, y) {
      // use matrix implementation
      return bitAnd(x, matrix(y))
    },

    'SparseMatrix, any': function (x, y) {
      return algorithm11(x, y, bitAnd, false)
    },

    'DenseMatrix, any': function (x, y) {
      return algorithm14(x, y, bitAnd, false)
    },

    'any, SparseMatrix': function (x, y) {
      return algorithm11(y, x, bitAnd, true)
    },

    'any, DenseMatrix': function (x, y) {
      return algorithm14(y, x, bitAnd, true)
    },

    'Array, any': function (x, y) {
      // use matrix implementation
      return algorithm14(matrix(x), y, bitAnd, false).valueOf()
    },

    'any, Array': function (x, y) {
      // use matrix implementation
      return algorithm14(matrix(y), x, bitAnd, true).valueOf()
    }
  })

  bitAnd.toTex = {
    2: `\\left(\${args[0]}${latex.operators['bitAnd']}\${args[1]}\\right)`
  }

  return bitAnd
}

exports.name = 'bitAnd'
exports.factory = factory
