import { createAlgorithm03 } from '../../type/matrix/utils/algorithm03'
import { createAlgorithm07 } from '../../type/matrix/utils/algorithm07'
import { createAlgorithm12 } from '../../type/matrix/utils/algorithm12'
import { createAlgorithm13 } from '../../type/matrix/utils/algorithm13'
import { createAlgorithm14 } from '../../type/matrix/utils/algorithm14'
import { factory } from '../../utils/factory'
import { xorNumber } from '../../plain/number'

const name = 'xor'
const dependencies = [
  'typed',
  'matrix',
  'DenseMatrix'
]

export const createXor = /* #__PURE__ */ factory(name, dependencies, ({ typed, matrix, DenseMatrix }) => {
  const algorithm03 = createAlgorithm03({ typed })
  const algorithm07 = createAlgorithm07({ typed, DenseMatrix })
  const algorithm12 = createAlgorithm12({ typed, DenseMatrix })
  const algorithm13 = createAlgorithm13({ typed })
  const algorithm14 = createAlgorithm14({ typed })

  /**
   * Logical `xor`. Test whether one and only one value is defined with a nonzero/nonempty value.
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.xor(x, y)
   *
   * Examples:
   *
   *    math.xor(2, 4)   // returns false
   *
   *    a = [2, 0, 0]
   *    b = [2, 7, 0]
   *    c = 0
   *
   *    math.xor(a, b)   // returns [false, true, false]
   *    math.xor(a, c)   // returns [true, false, false]
   *
   * See also:
   *
   *    and, not, or
   *
   * @param  {number | BigNumber | Complex | Unit | Array | Matrix} x First value to check
   * @param  {number | BigNumber | Complex | Unit | Array | Matrix} y Second value to check
   * @return {boolean | Array | Matrix}
   *            Returns true when one and only one input is defined with a nonzero/nonempty value.
   */
  const xor = typed(name, {

    'number, number': xorNumber,

    'Complex, Complex': function (x, y) {
      return ((x.re !== 0 || x.im !== 0) !== (y.re !== 0 || y.im !== 0))
    },

    'BigNumber, BigNumber': function (x, y) {
      return ((!x.isZero() && !x.isNaN()) !== (!y.isZero() && !y.isNaN()))
    },

    'Unit, Unit': function (x, y) {
      return xor(x.value || 0, y.value || 0)
    },

    'SparseMatrix, SparseMatrix': function (x, y) {
      return algorithm07(x, y, xor)
    },

    'SparseMatrix, DenseMatrix': function (x, y) {
      return algorithm03(y, x, xor, true)
    },

    'DenseMatrix, SparseMatrix': function (x, y) {
      return algorithm03(x, y, xor, false)
    },

    'DenseMatrix, DenseMatrix': function (x, y) {
      return algorithm13(x, y, xor)
    },

    'Array, Array': function (x, y) {
      // use matrix implementation
      return xor(matrix(x), matrix(y)).valueOf()
    },

    'Array, Matrix': function (x, y) {
      // use matrix implementation
      return xor(matrix(x), y)
    },

    'Matrix, Array': function (x, y) {
      // use matrix implementation
      return xor(x, matrix(y))
    },

    'SparseMatrix, any': function (x, y) {
      return algorithm12(x, y, xor, false)
    },

    'DenseMatrix, any': function (x, y) {
      return algorithm14(x, y, xor, false)
    },

    'any, SparseMatrix': function (x, y) {
      return algorithm12(y, x, xor, true)
    },

    'any, DenseMatrix': function (x, y) {
      return algorithm14(y, x, xor, true)
    },

    'Array, any': function (x, y) {
      // use matrix implementation
      return algorithm14(matrix(x), y, xor, false).valueOf()
    },

    'any, Array': function (x, y) {
      // use matrix implementation
      return algorithm14(matrix(y), x, xor, true).valueOf()
    }
  })

  return xor
})
