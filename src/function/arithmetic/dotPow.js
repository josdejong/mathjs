'use strict'

import { factory } from '../../utils/factory'
import { operators as latexOperators } from '../../utils/latex'
import { createAlgorithm03 } from '../../type/matrix/utils/algorithm03'
import { createAlgorithm07 } from '../../type/matrix/utils/algorithm07'
import { createAlgorithm11 } from '../../type/matrix/utils/algorithm11'
import { createAlgorithm12 } from '../../type/matrix/utils/algorithm12'
import { createAlgorithm13 } from '../../type/matrix/utils/algorithm13'
import { createAlgorithm14 } from '../../type/matrix/utils/algorithm14'

const name = 'dotPow'
const dependencies = [
  'typed',
  'equalScalar',
  'matrix',
  'pow',
  'type.DenseMatrix',
  'type.SparseMatrix'
]

export const createDotPow = factory(name, dependencies, ({ typed, equalScalar, matrix, pow, type: { DenseMatrix, SparseMatrix } }) => {
  const algorithm03 = createAlgorithm03({ typed, type: { DenseMatrix } })
  const algorithm07 = createAlgorithm07({ typed, type: { DenseMatrix } })
  const algorithm11 = createAlgorithm11({ typed, equalScalar, type: { SparseMatrix } })
  const algorithm12 = createAlgorithm12({ typed, type: { DenseMatrix } })
  const algorithm13 = createAlgorithm13({ typed, type: { DenseMatrix } })
  const algorithm14 = createAlgorithm14({ typed, type: { DenseMatrix } })

  /**
   * Calculates the power of x to y element wise.
   *
   * Syntax:
   *
   *    math.dotPow(x, y)
   *
   * Examples:
   *
   *    math.dotPow(2, 3)            // returns number 8
   *
   *    const a = [[1, 2], [4, 3]]
   *    math.dotPow(a, 2)            // returns Array [[1, 4], [16, 9]]
   *    math.pow(a, 2)               // returns Array [[9, 8], [16, 17]]
   *
   * See also:
   *
   *    pow, sqrt, multiply
   *
   * @param  {number | BigNumber | Complex | Unit | Array | Matrix} x  The base
   * @param  {number | BigNumber | Complex | Unit | Array | Matrix} y  The exponent
   * @return {number | BigNumber | Complex | Unit | Array | Matrix}                     The value of `x` to the power `y`
   */
  const dotPow = typed(name, {

    'any, any': pow,

    'SparseMatrix, SparseMatrix': function (x, y) {
      return algorithm07(x, y, pow, false)
    },

    'SparseMatrix, DenseMatrix': function (x, y) {
      return algorithm03(y, x, pow, true)
    },

    'DenseMatrix, SparseMatrix': function (x, y) {
      return algorithm03(x, y, pow, false)
    },

    'DenseMatrix, DenseMatrix': function (x, y) {
      return algorithm13(x, y, pow)
    },

    'Array, Array': function (x, y) {
      // use matrix implementation
      return dotPow(matrix(x), matrix(y)).valueOf()
    },

    'Array, Matrix': function (x, y) {
      // use matrix implementation
      return dotPow(matrix(x), y)
    },

    'Matrix, Array': function (x, y) {
      // use matrix implementation
      return dotPow(x, matrix(y))
    },

    'SparseMatrix, any': function (x, y) {
      return algorithm11(x, y, dotPow, false)
    },

    'DenseMatrix, any': function (x, y) {
      return algorithm14(x, y, dotPow, false)
    },

    'any, SparseMatrix': function (x, y) {
      return algorithm12(y, x, dotPow, true)
    },

    'any, DenseMatrix': function (x, y) {
      return algorithm14(y, x, dotPow, true)
    },

    'Array, any': function (x, y) {
      // use matrix implementation
      return algorithm14(matrix(x), y, dotPow, false).valueOf()
    },

    'any, Array': function (x, y) {
      // use matrix implementation
      return algorithm14(matrix(y), x, dotPow, true).valueOf()
    }
  })

  dotPow.toTex = {
    2: `\\left(\${args[0]}${latexOperators['dotPow']}\${args[1]}\\right)`
  }

  return dotPow
})
