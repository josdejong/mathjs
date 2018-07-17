'use strict'

const isInteger = require('../../utils/number').isInteger
const bigBitXor = require('../../utils/bignumber/bitXor')

function factory (type, config, load, typed) {
  const latex = require('../../utils/latex')

  const matrix = load(require('../../type/matrix/function/matrix'))

  const algorithm03 = load(require('../../type/matrix/utils/algorithm03'))
  const algorithm07 = load(require('../../type/matrix/utils/algorithm07'))
  const algorithm12 = load(require('../../type/matrix/utils/algorithm12'))
  const algorithm13 = load(require('../../type/matrix/utils/algorithm13'))
  const algorithm14 = load(require('../../type/matrix/utils/algorithm14'))

  /**
   * Bitwise XOR two values, `x ^ y`.
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.bitXor(x, y)
   *
   * Examples:
   *
   *    math.bitXor(1, 2)               // returns number 3
   *
   *    math.bitXor([2, 3, 4], 4)       // returns Array [6, 7, 0]
   *
   * See also:
   *
   *    bitAnd, bitNot, bitOr, leftShift, rightArithShift, rightLogShift
   *
   * @param  {number | BigNumber | Array | Matrix} x First value to xor
   * @param  {number | BigNumber | Array | Matrix} y Second value to xor
   * @return {number | BigNumber | Array | Matrix} XOR of `x` and `y`
   */
  const bitXor = typed('bitXor', {

    'number, number': function (x, y) {
      if (!isInteger(x) || !isInteger(y)) {
        throw new Error('Integers expected in function bitXor')
      }

      return x ^ y
    },

    'BigNumber, BigNumber': bigBitXor,

    'SparseMatrix, SparseMatrix': function (x, y) {
      return algorithm07(x, y, bitXor)
    },

    'SparseMatrix, DenseMatrix': function (x, y) {
      return algorithm03(y, x, bitXor, true)
    },

    'DenseMatrix, SparseMatrix': function (x, y) {
      return algorithm03(x, y, bitXor, false)
    },

    'DenseMatrix, DenseMatrix': function (x, y) {
      return algorithm13(x, y, bitXor)
    },

    'Array, Array': function (x, y) {
      // use matrix implementation
      return bitXor(matrix(x), matrix(y)).valueOf()
    },

    'Array, Matrix': function (x, y) {
      // use matrix implementation
      return bitXor(matrix(x), y)
    },

    'Matrix, Array': function (x, y) {
      // use matrix implementation
      return bitXor(x, matrix(y))
    },

    'SparseMatrix, any': function (x, y) {
      return algorithm12(x, y, bitXor, false)
    },

    'DenseMatrix, any': function (x, y) {
      return algorithm14(x, y, bitXor, false)
    },

    'any, SparseMatrix': function (x, y) {
      return algorithm12(y, x, bitXor, true)
    },

    'any, DenseMatrix': function (x, y) {
      return algorithm14(y, x, bitXor, true)
    },

    'Array, any': function (x, y) {
      // use matrix implementation
      return algorithm14(matrix(x), y, bitXor, false).valueOf()
    },

    'any, Array': function (x, y) {
      // use matrix implementation
      return algorithm14(matrix(y), x, bitXor, true).valueOf()
    }
  })

  bitXor.toTex = {
    2: `\\left(\${args[0]}${latex.operators['bitXor']}\${args[1]}\\right)`
  }

  return bitXor
}

exports.name = 'bitXor'
exports.factory = factory
