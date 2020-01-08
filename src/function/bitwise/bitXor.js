import { bitXor as bigBitXor } from '../../utils/bignumber/bitwise'
import { createAlgorithm03 } from '../../type/matrix/utils/algorithm03'
import { createAlgorithm07 } from '../../type/matrix/utils/algorithm07'
import { createAlgorithm12 } from '../../type/matrix/utils/algorithm12'
import { createAlgorithm13 } from '../../type/matrix/utils/algorithm13'
import { createAlgorithm14 } from '../../type/matrix/utils/algorithm14'
import { factory } from '../../utils/factory'
import { bitXorNumber } from '../../plain/number'

const name = 'bitXor'
const dependencies = [
  'typed',
  'matrix',
  'DenseMatrix'
]

export const createBitXor = /* #__PURE__ */ factory(name, dependencies, ({ typed, matrix, DenseMatrix }) => {
  const algorithm03 = createAlgorithm03({ typed })
  const algorithm07 = createAlgorithm07({ typed, DenseMatrix })
  const algorithm12 = createAlgorithm12({ typed, DenseMatrix })
  const algorithm13 = createAlgorithm13({ typed })
  const algorithm14 = createAlgorithm14({ typed })

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
  const bitXor = typed(name, {

    'number, number': bitXorNumber,

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

  return bitXor
})
