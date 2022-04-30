import { factory } from '../../utils/factory.js'
import { createMatAlgo02xDS0 } from '../../type/matrix/utils/matAlgo02xDS0.js'
import { createMatAlgo09xS0Sf } from '../../type/matrix/utils/matAlgo09xS0Sf.js'
import { createMatAlgo11xS0s } from '../../type/matrix/utils/matAlgo11xS0s.js'
import { createMatAlgo13xDD } from '../../type/matrix/utils/matAlgo13xDD.js'
import { createMatAlgo14xDs } from '../../type/matrix/utils/matAlgo14xDs.js'

const name = 'dotMultiply'
const dependencies = [
  'typed',
  'matrix',
  'equalScalar',
  'multiplyScalar'
]

export const createDotMultiply = /* #__PURE__ */ factory(name, dependencies, ({ typed, matrix, equalScalar, multiplyScalar }) => {
  const matAlgo02xDS0 = createMatAlgo02xDS0({ typed, equalScalar })
  const matAlgo09xS0Sf = createMatAlgo09xS0Sf({ typed, equalScalar })
  const matAlgo11xS0s = createMatAlgo11xS0s({ typed, equalScalar })
  const matAlgo13xDD = createMatAlgo13xDD({ typed })
  const matAlgo14xDs = createMatAlgo14xDs({ typed })

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
  return typed(name, {

    'any, any': multiplyScalar,

    'SparseMatrix, SparseMatrix': function (x, y) {
      return matAlgo09xS0Sf(x, y, multiplyScalar, false)
    },

    'SparseMatrix, DenseMatrix': function (x, y) {
      return matAlgo02xDS0(y, x, multiplyScalar, true)
    },

    'DenseMatrix, SparseMatrix': function (x, y) {
      return matAlgo02xDS0(x, y, multiplyScalar, false)
    },

    'DenseMatrix, DenseMatrix': function (x, y) {
      return matAlgo13xDD(x, y, multiplyScalar)
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
      return matAlgo11xS0s(x, y, multiplyScalar, false)
    },

    'DenseMatrix, any': function (x, y) {
      return matAlgo14xDs(x, y, multiplyScalar, false)
    },

    'any, SparseMatrix': function (x, y) {
      return matAlgo11xS0s(y, x, multiplyScalar, true)
    },

    'any, DenseMatrix': function (x, y) {
      return matAlgo14xDs(y, x, multiplyScalar, true)
    },

    'Array, any': function (x, y) {
      // use matrix implementation
      return matAlgo14xDs(matrix(x), y, multiplyScalar, false).valueOf()
    },

    'any, Array': function (x, y) {
      // use matrix implementation
      return matAlgo14xDs(matrix(y), x, multiplyScalar, true).valueOf()
    }
  })
})
