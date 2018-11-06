'use strict'

import { factory } from '../../utils/factory'
import { operators as latexOperators } from '../../utils/latex'
import DimensionError from '../../error/DimensionError'

const name = 'subtract'
const dependencies = [
  'typed',
  'matrix',
  'addScalar',
  'unaryMinus',
  'utils.algorithm01',
  'utils.algorithm03',
  'utils.algorithm05',
  'utils.algorithm10',
  'utils.algorithm13',
  'utils.algorithm14'
]

export const createSubtract = factory(name, dependencies, ({ typed, matrix, addScalar, unaryMinus, utils: { algorithm01, algorithm03, algorithm05, algorithm10, algorithm13, algorithm14 } }) => {
  // TODO: split function subtract in two: subtract and subtractScalar

  /**
   * Subtract two values, `x - y`.
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.subtract(x, y)
   *
   * Examples:
   *
   *    math.subtract(5.3, 2)        // returns number 3.3
   *
   *    const a = math.complex(2, 3)
   *    const b = math.complex(4, 1)
   *    math.subtract(a, b)          // returns Complex -2 + 2i
   *
   *    math.subtract([5, 7, 4], 4)  // returns Array [1, 3, 0]
   *
   *    const c = math.unit('2.1 km')
   *    const d = math.unit('500m')
   *    math.subtract(c, d)          // returns Unit 1.6 km
   *
   * See also:
   *
   *    add
   *
   * @param  {number | BigNumber | Fraction | Complex | Unit | Array | Matrix} x
   *            Initial value
   * @param  {number | BigNumber | Fraction | Complex | Unit | Array | Matrix} y
   *            Value to subtract from `x`
   * @return {number | BigNumber | Fraction | Complex | Unit | Array | Matrix}
   *            Subtraction of `x` and `y`
   */
  const subtract = typed(name, {

    'number, number': function (x, y) {
      return x - y
    },

    'Complex, Complex': function (x, y) {
      return x.sub(y)
    },

    'BigNumber, BigNumber': function (x, y) {
      return x.minus(y)
    },

    'Fraction, Fraction': function (x, y) {
      return x.sub(y)
    },

    'Unit, Unit': function (x, y) {
      if (x.value === null) {
        throw new Error('Parameter x contains a unit with undefined value')
      }

      if (y.value === null) {
        throw new Error('Parameter y contains a unit with undefined value')
      }

      if (!x.equalBase(y)) {
        throw new Error('Units do not match')
      }

      const res = x.clone()
      res.value = subtract(res.value, y.value)
      res.fixPrefix = false

      return res
    },

    'SparseMatrix, SparseMatrix': function (x, y) {
      checkEqualDimensions(x, y)
      return algorithm05(x, y, subtract)
    },

    'SparseMatrix, DenseMatrix': function (x, y) {
      checkEqualDimensions(x, y)
      return algorithm03(y, x, subtract, true)
    },

    'DenseMatrix, SparseMatrix': function (x, y) {
      checkEqualDimensions(x, y)
      return algorithm01(x, y, subtract, false)
    },

    'DenseMatrix, DenseMatrix': function (x, y) {
      checkEqualDimensions(x, y)
      return algorithm13(x, y, subtract)
    },

    'Array, Array': function (x, y) {
      // use matrix implementation
      return subtract(matrix(x), matrix(y)).valueOf()
    },

    'Array, Matrix': function (x, y) {
      // use matrix implementation
      return subtract(matrix(x), y)
    },

    'Matrix, Array': function (x, y) {
      // use matrix implementation
      return subtract(x, matrix(y))
    },

    'SparseMatrix, any': function (x, y) {
      return algorithm10(x, unaryMinus(y), addScalar)
    },

    'DenseMatrix, any': function (x, y) {
      return algorithm14(x, y, subtract)
    },

    'any, SparseMatrix': function (x, y) {
      return algorithm10(y, x, subtract, true)
    },

    'any, DenseMatrix': function (x, y) {
      return algorithm14(y, x, subtract, true)
    },

    'Array, any': function (x, y) {
      // use matrix implementation
      return algorithm14(matrix(x), y, subtract, false).valueOf()
    },

    'any, Array': function (x, y) {
      // use matrix implementation
      return algorithm14(matrix(y), x, subtract, true).valueOf()
    }
  })

  subtract.toTex = {
    2: `\\left(\${args[0]}${latexOperators['subtract']}\${args[1]}\\right)`
  }

  return subtract
})

/**
 * Check whether matrix x and y have the same number of dimensions.
 * Throws a DimensionError when dimensions are not equal
 * @param {Matrix} x
 * @param {Matrix} y
 */
function checkEqualDimensions (x, y) {
  const xsize = x.size()
  const ysize = y.size()

  if (xsize.length !== ysize.length) {
    throw new DimensionError(xsize.length, ysize.length)
  }
}
