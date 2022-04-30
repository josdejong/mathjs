import { factory } from '../../utils/factory.js'
import { createMatAlgo02xDS0 } from '../../type/matrix/utils/matAlgo02xDS0.js'
import { createMatAlgo03xDSf } from '../../type/matrix/utils/matAlgo03xDSf.js'
import { createMatAlgo07xSSf } from '../../type/matrix/utils/matAlgo07xSSf.js'
import { createMatAlgo11xS0s } from '../../type/matrix/utils/matAlgo11xS0s.js'
import { createMatAlgo12xSfs } from '../../type/matrix/utils/matAlgo12xSfs.js'
import { createMatAlgo13xDD } from '../../type/matrix/utils/matAlgo13xDD.js'
import { createMatAlgo14xDs } from '../../type/matrix/utils/matAlgo14xDs.js'

const name = 'dotDivide'
const dependencies = [
  'typed',
  'matrix',
  'equalScalar',
  'divideScalar',
  'DenseMatrix'
]

export const createDotDivide = /* #__PURE__ */ factory(name, dependencies, ({ typed, matrix, equalScalar, divideScalar, DenseMatrix }) => {
  const matAlgo02xDS0 = createMatAlgo02xDS0({ typed, equalScalar })
  const matAlgo03xDSf = createMatAlgo03xDSf({ typed })
  const matAlgo07xSSf = createMatAlgo07xSSf({ typed, DenseMatrix })
  const matAlgo11xS0s = createMatAlgo11xS0s({ typed, equalScalar })
  const matAlgo12xSfs = createMatAlgo12xSfs({ typed, DenseMatrix })
  const matAlgo13xDD = createMatAlgo13xDD({ typed })
  const matAlgo14xDs = createMatAlgo14xDs({ typed })

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
  return typed(name, {

    'any, any': divideScalar,

    'SparseMatrix, SparseMatrix': function (x, y) {
      return matAlgo07xSSf(x, y, divideScalar, false)
    },

    'SparseMatrix, DenseMatrix': function (x, y) {
      return matAlgo02xDS0(y, x, divideScalar, true)
    },

    'DenseMatrix, SparseMatrix': function (x, y) {
      return matAlgo03xDSf(x, y, divideScalar, false)
    },

    'DenseMatrix, DenseMatrix': function (x, y) {
      return matAlgo13xDD(x, y, divideScalar)
    },

    'Array, Array': function (x, y) {
      // use matrix implementation
      return this(matrix(x), matrix(y)).valueOf()
    },

    'Array, Matrix': function (x, y) {
      // use matrix implementation
      return this(matrix(x), y)
    },

    'Matrix, Array': function (x, y) {
      // use matrix implementation
      return this(x, matrix(y))
    },

    'SparseMatrix, any': function (x, y) {
      return matAlgo11xS0s(x, y, divideScalar, false)
    },

    'DenseMatrix, any': function (x, y) {
      return matAlgo14xDs(x, y, divideScalar, false)
    },

    'any, SparseMatrix': function (x, y) {
      return matAlgo12xSfs(y, x, divideScalar, true)
    },

    'any, DenseMatrix': function (x, y) {
      return matAlgo14xDs(y, x, divideScalar, true)
    },

    'Array, any': function (x, y) {
      // use matrix implementation
      return matAlgo14xDs(matrix(x), y, divideScalar, false).valueOf()
    },

    'any, Array': function (x, y) {
      // use matrix implementation
      return matAlgo14xDs(matrix(y), x, divideScalar, true).valueOf()
    }
  })
})
