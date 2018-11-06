'use strict'

import { factory } from '../../utils/factory'
import { operators as latexOperators } from '../../utils/latex'

const name = 'dotDivide'
const dependencies = [
  'typed',
  'matrix',
  'divideScalar',
  'utils.algorithm02',
  'utils.algorithm03',
  'utils.algorithm07',
  'utils.algorithm11',
  'utils.algorithm12',
  'utils.algorithm13',
  'utils.algorithm14'
]

export const createDotDivide = factory(name, dependencies, ({ typed, matrix, divideScalar, utils: { algorithm02, algorithm03, algorithm07, algorithm11, algorithm12, algorithm13, algorithm14 } }) => {
  /**
   * Divide two matrices element wise. The function accepts both matrices and
   * scalar values.
   *
   * Syntax:
   *
   *    math.dotDivide(x, y)
   *
   * Examples:
   *
   *    math.dotDivide(2, 4)   // returns 0.5
   *
   *    a = [[9, 5], [6, 1]]
   *    b = [[3, 2], [5, 2]]
   *
   *    math.dotDivide(a, b)   // returns [[3, 2.5], [1.2, 0.5]]
   *    math.divide(a, b)      // returns [[1.75, 0.75], [-1.75, 2.25]]
   *
   * See also:
   *
   *    divide, multiply, dotMultiply
   *
   * @param  {number | BigNumber | Fraction | Complex | Unit | Array | Matrix} x Numerator
   * @param  {number | BigNumber | Fraction | Complex | Unit | Array | Matrix} y Denominator
   * @return {number | BigNumber | Fraction | Complex | Unit | Array | Matrix}                    Quotient, `x ./ y`
   */
  const dotDivide = typed(name, {

    'any, any': divideScalar,

    'SparseMatrix, SparseMatrix': function (x, y) {
      return algorithm07(x, y, divideScalar, false)
    },

    'SparseMatrix, DenseMatrix': function (x, y) {
      return algorithm02(y, x, divideScalar, true)
    },

    'DenseMatrix, SparseMatrix': function (x, y) {
      return algorithm03(x, y, divideScalar, false)
    },

    'DenseMatrix, DenseMatrix': function (x, y) {
      return algorithm13(x, y, divideScalar)
    },

    'Array, Array': function (x, y) {
      // use matrix implementation
      return dotDivide(matrix(x), matrix(y)).valueOf()
    },

    'Array, Matrix': function (x, y) {
      // use matrix implementation
      return dotDivide(matrix(x), y)
    },

    'Matrix, Array': function (x, y) {
      // use matrix implementation
      return dotDivide(x, matrix(y))
    },

    'SparseMatrix, any': function (x, y) {
      return algorithm11(x, y, divideScalar, false)
    },

    'DenseMatrix, any': function (x, y) {
      return algorithm14(x, y, divideScalar, false)
    },

    'any, SparseMatrix': function (x, y) {
      return algorithm12(y, x, divideScalar, true)
    },

    'any, DenseMatrix': function (x, y) {
      return algorithm14(y, x, divideScalar, true)
    },

    'Array, any': function (x, y) {
      // use matrix implementation
      return algorithm14(matrix(x), y, divideScalar, false).valueOf()
    },

    'any, Array': function (x, y) {
      // use matrix implementation
      return algorithm14(matrix(y), x, divideScalar, true).valueOf()
    }
  })

  dotDivide.toTex = {
    2: `\\left(\${args[0]}${latexOperators['dotDivide']}\${args[1]}\\right)`
  }

  return dotDivide
})
