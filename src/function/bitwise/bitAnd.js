import { bitAndBigNumber } from '../../utils/bignumber/bitwise'
import { createAlgorithm02 } from '../../type/matrix/utils/algorithm02'
import { createAlgorithm11 } from '../../type/matrix/utils/algorithm11'
import { createAlgorithm13 } from '../../type/matrix/utils/algorithm13'
import { createAlgorithm14 } from '../../type/matrix/utils/algorithm14'
import { createAlgorithm06 } from '../../type/matrix/utils/algorithm06'
import { factory } from '../../utils/factory'
import { bitAndNumber } from '../../plain/number'

const name = 'bitAnd'
const dependencies = [
  'typed',
  'matrix',
  'equalScalar'
]

export const createBitAnd = /* #__PURE__ */ factory(name, dependencies, ({ typed, matrix, equalScalar }) => {
  const algorithm02 = createAlgorithm02({ typed, equalScalar })
  const algorithm06 = createAlgorithm06({ typed, equalScalar })
  const algorithm11 = createAlgorithm11({ typed, equalScalar })
  const algorithm13 = createAlgorithm13({ typed })
  const algorithm14 = createAlgorithm14({ typed })

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
  const bitAnd = typed(name, {

    'number, number': bitAndNumber,

    'BigNumber, BigNumber': bitAndBigNumber,

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

  return bitAnd
})
