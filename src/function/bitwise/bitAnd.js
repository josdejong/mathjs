import { bitAndBigNumber } from '../../utils/bignumber/bitwise.js'
import { createMatAlgo02xDS0 } from '../../type/matrix/utils/matAlgo02xDS0.js'
import { createMatAlgo11xS0s } from '../../type/matrix/utils/matAlgo11xS0s.js'
import { createMatAlgo13xDD } from '../../type/matrix/utils/matAlgo13xDD.js'
import { createMatAlgo14xDs } from '../../type/matrix/utils/matAlgo14xDs.js'
import { createMatAlgo06xS0S0 } from '../../type/matrix/utils/matAlgo06xS0S0.js'
import { factory } from '../../utils/factory.js'
import { bitAndNumber } from '../../plain/number/index.js'

const name = 'bitAnd'
const dependencies = [
  'typed',
  'matrix',
  'equalScalar'
]

export const createBitAnd = /* #__PURE__ */ factory(name, dependencies, ({ typed, matrix, equalScalar }) => {
  const matAlgo02xDS0 = createMatAlgo02xDS0({ typed, equalScalar })
  const matAlgo06xS0S0 = createMatAlgo06xS0S0({ typed, equalScalar })
  const matAlgo11xS0s = createMatAlgo11xS0s({ typed, equalScalar })
  const matAlgo13xDD = createMatAlgo13xDD({ typed })
  const matAlgo14xDs = createMatAlgo14xDs({ typed })

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
  return typed(name, {

    'number, number': bitAndNumber,

    'BigNumber, BigNumber': bitAndBigNumber,

    'SparseMatrix, SparseMatrix': function (x, y) {
      return matAlgo06xS0S0(x, y, this, false)
    },

    'SparseMatrix, DenseMatrix': function (x, y) {
      return matAlgo02xDS0(y, x, this, true)
    },

    'DenseMatrix, SparseMatrix': function (x, y) {
      return matAlgo02xDS0(x, y, this, false)
    },

    'DenseMatrix, DenseMatrix': function (x, y) {
      return matAlgo13xDD(x, y, this)
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
      return matAlgo11xS0s(x, y, this, false)
    },

    'DenseMatrix, any': function (x, y) {
      return matAlgo14xDs(x, y, this, false)
    },

    'any, SparseMatrix': function (x, y) {
      return matAlgo11xS0s(y, x, this, true)
    },

    'any, DenseMatrix': function (x, y) {
      return matAlgo14xDs(y, x, this, true)
    },

    'Array, any': function (x, y) {
      // use matrix implementation
      return matAlgo14xDs(matrix(x), y, this, false).valueOf()
    },

    'any, Array': function (x, y) {
      // use matrix implementation
      return matAlgo14xDs(matrix(y), x, this, true).valueOf()
    }
  })
})
