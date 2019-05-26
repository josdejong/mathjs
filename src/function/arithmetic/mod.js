import { factory } from '../../utils/factory'
import { createAlgorithm02 } from '../../type/matrix/utils/algorithm02'
import { createAlgorithm03 } from '../../type/matrix/utils/algorithm03'
import { createAlgorithm05 } from '../../type/matrix/utils/algorithm05'
import { createAlgorithm11 } from '../../type/matrix/utils/algorithm11'
import { createAlgorithm12 } from '../../type/matrix/utils/algorithm12'
import { createAlgorithm13 } from '../../type/matrix/utils/algorithm13'
import { createAlgorithm14 } from '../../type/matrix/utils/algorithm14'
import { modNumber } from '../../plain/number'

const name = 'mod'
const dependencies = [
  'typed',
  'matrix',
  'equalScalar',
  'DenseMatrix'
]

export const createMod = /* #__PURE__ */ factory(name, dependencies, ({ typed, matrix, equalScalar, DenseMatrix }) => {
  const algorithm02 = createAlgorithm02({ typed, equalScalar })
  const algorithm03 = createAlgorithm03({ typed })
  const algorithm05 = createAlgorithm05({ typed, equalScalar })
  const algorithm11 = createAlgorithm11({ typed, equalScalar })
  const algorithm12 = createAlgorithm12({ typed, DenseMatrix })
  const algorithm13 = createAlgorithm13({ typed })
  const algorithm14 = createAlgorithm14({ typed })

  /**
   * Calculates the modulus, the remainder of an integer division.
   *
   * For matrices, the function is evaluated element wise.
   *
   * The modulus is defined as:
   *
   *     x - y * floor(x / y)
   *
   * See https://en.wikipedia.org/wiki/Modulo_operation.
   *
   * Syntax:
   *
   *    math.mod(x, y)
   *
   * Examples:
   *
   *    math.mod(8, 3)                // returns 2
   *    math.mod(11, 2)               // returns 1
   *
   *    function isOdd(x) {
   *      return math.mod(x, 2) != 0
   *    }
   *
   *    isOdd(2)                      // returns false
   *    isOdd(3)                      // returns true
   *
   * See also:
   *
   *    divide
   *
   * @param  {number | BigNumber | Fraction | Array | Matrix} x Dividend
   * @param  {number | BigNumber | Fraction | Array | Matrix} y Divisor
   * @return {number | BigNumber | Fraction | Array | Matrix} Returns the remainder of `x` divided by `y`.
   */
  const mod = typed(name, {

    'number, number': modNumber,

    'BigNumber, BigNumber': function (x, y) {
      return y.isZero() ? x : x.mod(y)
    },

    'Fraction, Fraction': function (x, y) {
      return x.mod(y)
    },

    'SparseMatrix, SparseMatrix': function (x, y) {
      return algorithm05(x, y, mod, false)
    },

    'SparseMatrix, DenseMatrix': function (x, y) {
      return algorithm02(y, x, mod, true)
    },

    'DenseMatrix, SparseMatrix': function (x, y) {
      return algorithm03(x, y, mod, false)
    },

    'DenseMatrix, DenseMatrix': function (x, y) {
      return algorithm13(x, y, mod)
    },

    'Array, Array': function (x, y) {
      // use matrix implementation
      return mod(matrix(x), matrix(y)).valueOf()
    },

    'Array, Matrix': function (x, y) {
      // use matrix implementation
      return mod(matrix(x), y)
    },

    'Matrix, Array': function (x, y) {
      // use matrix implementation
      return mod(x, matrix(y))
    },

    'SparseMatrix, any': function (x, y) {
      return algorithm11(x, y, mod, false)
    },

    'DenseMatrix, any': function (x, y) {
      return algorithm14(x, y, mod, false)
    },

    'any, SparseMatrix': function (x, y) {
      return algorithm12(y, x, mod, true)
    },

    'any, DenseMatrix': function (x, y) {
      return algorithm14(y, x, mod, true)
    },

    'Array, any': function (x, y) {
      // use matrix implementation
      return algorithm14(matrix(x), y, mod, false).valueOf()
    },

    'any, Array': function (x, y) {
      // use matrix implementation
      return algorithm14(matrix(y), x, mod, true).valueOf()
    }
  })

  return mod
})
