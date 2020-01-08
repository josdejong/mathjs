import { factory } from '../../utils/factory'
import { createAlgorithm02 } from '../../type/matrix/utils/algorithm02'
import { createAlgorithm03 } from '../../type/matrix/utils/algorithm03'
import { createAlgorithm09 } from '../../type/matrix/utils/algorithm09'
import { createAlgorithm11 } from '../../type/matrix/utils/algorithm11'
import { createAlgorithm12 } from '../../type/matrix/utils/algorithm12'
import { createAlgorithm13 } from '../../type/matrix/utils/algorithm13'
import { createAlgorithm14 } from '../../type/matrix/utils/algorithm14'

const name = 'atan2'
const dependencies = [
  'typed',
  'matrix',
  'equalScalar',
  'BigNumber',
  'DenseMatrix'
]

export const createAtan2 = /* #__PURE__ */ factory(name, dependencies, ({ typed, matrix, equalScalar, BigNumber, DenseMatrix }) => {
  const algorithm02 = createAlgorithm02({ typed, equalScalar })
  const algorithm03 = createAlgorithm03({ typed })
  const algorithm09 = createAlgorithm09({ typed, equalScalar })
  const algorithm11 = createAlgorithm11({ typed, equalScalar })
  const algorithm12 = createAlgorithm12({ typed, DenseMatrix })
  const algorithm13 = createAlgorithm13({ typed })
  const algorithm14 = createAlgorithm14({ typed })

  /**
   * Calculate the inverse tangent function with two arguments, y/x.
   * By providing two arguments, the right quadrant of the computed angle can be
   * determined.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.atan2(y, x)
   *
   * Examples:
   *
   *    math.atan2(2, 2) / math.pi       // returns number 0.25
   *
   *    const angle = math.unit(60, 'deg') // returns Unit 60 deg
   *    const x = math.cos(angle)
   *    const y = math.sin(angle)
   *
   *    math.atan(2)             // returns Complex 1.5707963267948966 -1.3169578969248166 i
   *
   * See also:
   *
   *    tan, atan, sin, cos
   *
   * @param {number | Array | Matrix} y  Second dimension
   * @param {number | Array | Matrix} x  First dimension
   * @return {number | Array | Matrix} Four-quadrant inverse tangent
   */
  const atan2 = typed(name, {

    'number, number': Math.atan2,

    // Complex numbers doesn't seem to have a reasonable implementation of
    // atan2(). Even Matlab removed the support, after they only calculated
    // the atan only on base of the real part of the numbers and ignored the imaginary.

    'BigNumber, BigNumber': function (y, x) {
      return BigNumber.atan2(y, x)
    },

    'SparseMatrix, SparseMatrix': function (x, y) {
      return algorithm09(x, y, atan2, false)
    },

    'SparseMatrix, DenseMatrix': function (x, y) {
      // mind the order of y and x!
      return algorithm02(y, x, atan2, true)
    },

    'DenseMatrix, SparseMatrix': function (x, y) {
      return algorithm03(x, y, atan2, false)
    },

    'DenseMatrix, DenseMatrix': function (x, y) {
      return algorithm13(x, y, atan2)
    },

    'Array, Array': function (x, y) {
      return atan2(matrix(x), matrix(y)).valueOf()
    },

    'Array, Matrix': function (x, y) {
      return atan2(matrix(x), y)
    },

    'Matrix, Array': function (x, y) {
      return atan2(x, matrix(y))
    },

    'SparseMatrix, number | BigNumber': function (x, y) {
      return algorithm11(x, y, atan2, false)
    },

    'DenseMatrix, number | BigNumber': function (x, y) {
      return algorithm14(x, y, atan2, false)
    },

    'number | BigNumber, SparseMatrix': function (x, y) {
      // mind the order of y and x
      return algorithm12(y, x, atan2, true)
    },

    'number | BigNumber, DenseMatrix': function (x, y) {
      // mind the order of y and x
      return algorithm14(y, x, atan2, true)
    },

    'Array, number | BigNumber': function (x, y) {
      return algorithm14(matrix(x), y, atan2, false).valueOf()
    },

    'number | BigNumber, Array': function (x, y) {
      return algorithm14(matrix(y), x, atan2, true).valueOf()
    }
  })

  return atan2
})
