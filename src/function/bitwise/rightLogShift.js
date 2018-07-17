'use strict'

const isInteger = require('../../utils/number').isInteger

function factory (type, config, load, typed) {
  const latex = require('../../utils/latex')

  const matrix = load(require('../../type/matrix/function/matrix'))
  const equalScalar = load(require('../relational/equalScalar'))
  const zeros = load(require('../matrix/zeros'))

  const algorithm01 = load(require('../../type/matrix/utils/algorithm01'))
  const algorithm02 = load(require('../../type/matrix/utils/algorithm02'))
  const algorithm08 = load(require('../../type/matrix/utils/algorithm08'))
  const algorithm10 = load(require('../../type/matrix/utils/algorithm10'))
  const algorithm11 = load(require('../../type/matrix/utils/algorithm11'))
  const algorithm13 = load(require('../../type/matrix/utils/algorithm13'))
  const algorithm14 = load(require('../../type/matrix/utils/algorithm14'))

  /**
   * Bitwise right logical shift of value x by y number of bits, `x >>> y`.
   * For matrices, the function is evaluated element wise.
   * For units, the function is evaluated on the best prefix base.
   *
   * Syntax:
   *
   *    math.rightLogShift(x, y)
   *
   * Examples:
   *
   *    math.rightLogShift(4, 2)               // returns number 1
   *
   *    math.rightLogShift([16, -32, 64], 4)   // returns Array [1, 2, 3]
   *
   * See also:
   *
   *    bitAnd, bitNot, bitOr, bitXor, leftShift, rightLogShift
   *
   * @param  {number | Array | Matrix} x Value to be shifted
   * @param  {number} y Amount of shifts
   * @return {number | Array | Matrix} `x` zero-filled shifted right `y` times
   */

  const rightLogShift = typed('rightLogShift', {

    'number, number': function (x, y) {
      if (!isInteger(x) || !isInteger(y)) {
        throw new Error('Integers expected in function rightLogShift')
      }

      return x >>> y
    },

    // 'BigNumber, BigNumber': ..., // TODO: implement BigNumber support for rightLogShift

    'SparseMatrix, SparseMatrix': function (x, y) {
      return algorithm08(x, y, rightLogShift, false)
    },

    'SparseMatrix, DenseMatrix': function (x, y) {
      return algorithm02(y, x, rightLogShift, true)
    },

    'DenseMatrix, SparseMatrix': function (x, y) {
      return algorithm01(x, y, rightLogShift, false)
    },

    'DenseMatrix, DenseMatrix': function (x, y) {
      return algorithm13(x, y, rightLogShift)
    },

    'Array, Array': function (x, y) {
      // use matrix implementation
      return rightLogShift(matrix(x), matrix(y)).valueOf()
    },

    'Array, Matrix': function (x, y) {
      // use matrix implementation
      return rightLogShift(matrix(x), y)
    },

    'Matrix, Array': function (x, y) {
      // use matrix implementation
      return rightLogShift(x, matrix(y))
    },

    'SparseMatrix, number | BigNumber': function (x, y) {
      // check scalar
      if (equalScalar(y, 0)) {
        return x.clone()
      }
      return algorithm11(x, y, rightLogShift, false)
    },

    'DenseMatrix, number | BigNumber': function (x, y) {
      // check scalar
      if (equalScalar(y, 0)) {
        return x.clone()
      }
      return algorithm14(x, y, rightLogShift, false)
    },

    'number | BigNumber, SparseMatrix': function (x, y) {
      // check scalar
      if (equalScalar(x, 0)) {
        return zeros(y.size(), y.storage())
      }
      return algorithm10(y, x, rightLogShift, true)
    },

    'number | BigNumber, DenseMatrix': function (x, y) {
      // check scalar
      if (equalScalar(x, 0)) {
        return zeros(y.size(), y.storage())
      }
      return algorithm14(y, x, rightLogShift, true)
    },

    'Array, number | BigNumber': function (x, y) {
      // use matrix implementation
      return rightLogShift(matrix(x), y).valueOf()
    },

    'number | BigNumber, Array': function (x, y) {
      // use matrix implementation
      return rightLogShift(x, matrix(y)).valueOf()
    }
  })

  rightLogShift.toTex = {
    2: `\\left(\${args[0]}${latex.operators['rightLogShift']}\${args[1]}\\right)`
  }

  return rightLogShift
}

exports.name = 'rightLogShift'
exports.factory = factory
