'use strict'

import { factory } from '../../utils/factory'
import { operators as latexOperators } from '../../utils/latex'

const name = 'mod'
const dependencies = [
  'typed',
  'matrix',
  'utils.algorithm02',
  'utils.algorithm03',
  'utils.algorithm05',
  'utils.algorithm11',
  'utils.algorithm12',
  'utils.algorithm13',
  'utils.algorithm14'
]

export const createMod = factory(name, dependencies, ({ typed, matrix, utils: { algorithm02, algorithm03, algorithm05, algorithm11, algorithm12, algorithm13, algorithm14 } }) => {
  /**
   * Calculates the modulus, the remainder of an integer division.
   *
   * For matrices, the function is evaluated element wise.
   *
   * The modulus is defined as:
   *
   *     x - y * floor(x / y)
   *
   * See http://en.wikipedia.org/wiki/Modulo_operation.
   *
   * Syntax:
   *
   *    math.mod(x, y)
   *
   * Examples:
   *
   *    math.mod(8, 3)                // returns 2
   *    math.mod(11, 2)               // returns 1
   *
   *    function isOdd(x) {
   *      return math.mod(x, 2) != 0
   *    }
   *
   *    isOdd(2)                      // returns false
   *    isOdd(3)                      // returns true
   *
   * See also:
   *
   *    divide
   *
   * @param  {number | BigNumber | Fraction | Array | Matrix} x Dividend
   * @param  {number | BigNumber | Fraction | Array | Matrix} y Divisor
   * @return {number | BigNumber | Fraction | Array | Matrix} Returns the remainder of `x` divided by `y`.
   */
  const mod = typed(name, {

    'number, number': _mod,

    'BigNumber, BigNumber': function (x, y) {
      return y.isZero() ? x : x.mod(y)
    },

    'Fraction, Fraction': function (x, y) {
      return x.mod(y)
    },

    'SparseMatrix, SparseMatrix': function (x, y) {
      return algorithm05(x, y, mod, false)
    },

    'SparseMatrix, DenseMatrix': function (x, y) {
      return algorithm02(y, x, mod, true)
    },

    'DenseMatrix, SparseMatrix': function (x, y) {
      return algorithm03(x, y, mod, false)
    },

    'DenseMatrix, DenseMatrix': function (x, y) {
      return algorithm13(x, y, mod)
    },

    'Array, Array': function (x, y) {
      // use matrix implementation
      return mod(matrix(x), matrix(y)).valueOf()
    },

    'Array, Matrix': function (x, y) {
      // use matrix implementation
      return mod(matrix(x), y)
    },

    'Matrix, Array': function (x, y) {
      // use matrix implementation
      return mod(x, matrix(y))
    },

    'SparseMatrix, any': function (x, y) {
      return algorithm11(x, y, mod, false)
    },

    'DenseMatrix, any': function (x, y) {
      return algorithm14(x, y, mod, false)
    },

    'any, SparseMatrix': function (x, y) {
      return algorithm12(y, x, mod, true)
    },

    'any, DenseMatrix': function (x, y) {
      return algorithm14(y, x, mod, true)
    },

    'Array, any': function (x, y) {
      // use matrix implementation
      return algorithm14(matrix(x), y, mod, false).valueOf()
    },

    'any, Array': function (x, y) {
      // use matrix implementation
      return algorithm14(matrix(y), x, mod, true).valueOf()
    }
  })

  mod.toTex = {
    2: `\\left(\${args[0]}${latexOperators['mod']}\${args[1]}\\right)`
  }

  return mod

  /**
   * Calculate the modulus of two numbers
   * @param {number} x
   * @param {number} y
   * @returns {number} res
   * @private
   */
  function _mod (x, y) {
    if (y > 0) {
      // We don't use JavaScript's % operator here as this doesn't work
      // correctly for x < 0 and x === 0
      // see http://en.wikipedia.org/wiki/Modulo_operation
      return x - y * Math.floor(x / y)
    } else if (y === 0) {
      return x
    } else { // y < 0
      // TODO: implement mod for a negative divisor
      throw new Error('Cannot calculate mod for a negative divisor')
    }
  }
})
