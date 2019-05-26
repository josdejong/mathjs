import { factory } from '../../utils/factory'
import { createAlgorithm01 } from '../../type/matrix/utils/algorithm01'
import { createAlgorithm04 } from '../../type/matrix/utils/algorithm04'
import { createAlgorithm10 } from '../../type/matrix/utils/algorithm10'
import { createAlgorithm13 } from '../../type/matrix/utils/algorithm13'
import { createAlgorithm14 } from '../../type/matrix/utils/algorithm14'
import { gcdNumber } from '../../plain/number'

const name = 'gcd'
const dependencies = [
  'typed',
  'matrix',
  'equalScalar',
  'BigNumber',
  'DenseMatrix'
]

export const createGcd = /* #__PURE__ */ factory(name, dependencies, ({ typed, matrix, equalScalar, BigNumber, DenseMatrix }) => {
  const algorithm01 = createAlgorithm01({ typed })
  const algorithm04 = createAlgorithm04({ typed, equalScalar })
  const algorithm10 = createAlgorithm10({ typed, DenseMatrix })
  const algorithm13 = createAlgorithm13({ typed })
  const algorithm14 = createAlgorithm14({ typed })

  /**
   * Calculate the greatest common divisor for two or more values or arrays.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.gcd(a, b)
   *    math.gcd(a, b, c, ...)
   *
   * Examples:
   *
   *    math.gcd(8, 12)              // returns 4
   *    math.gcd(-4, 6)              // returns 2
   *    math.gcd(25, 15, -10)        // returns 5
   *
   *    math.gcd([8, -4], [12, 6])   // returns [4, 2]
   *
   * See also:
   *
   *    lcm, xgcd
   *
   * @param {... number | BigNumber | Fraction | Array | Matrix} args  Two or more integer numbers
   * @return {number | BigNumber | Fraction | Array | Matrix}                           The greatest common divisor
   */
  const gcd = typed(name, {

    'number, number': gcdNumber,

    'BigNumber, BigNumber': _gcdBigNumber,

    'Fraction, Fraction': function (x, y) {
      return x.gcd(y)
    },

    'SparseMatrix, SparseMatrix': function (x, y) {
      return algorithm04(x, y, gcd)
    },

    'SparseMatrix, DenseMatrix': function (x, y) {
      return algorithm01(y, x, gcd, true)
    },

    'DenseMatrix, SparseMatrix': function (x, y) {
      return algorithm01(x, y, gcd, false)
    },

    'DenseMatrix, DenseMatrix': function (x, y) {
      return algorithm13(x, y, gcd)
    },

    'Array, Array': function (x, y) {
      // use matrix implementation
      return gcd(matrix(x), matrix(y)).valueOf()
    },

    'Array, Matrix': function (x, y) {
      // use matrix implementation
      return gcd(matrix(x), y)
    },

    'Matrix, Array': function (x, y) {
      // use matrix implementation
      return gcd(x, matrix(y))
    },

    'SparseMatrix, number | BigNumber': function (x, y) {
      return algorithm10(x, y, gcd, false)
    },

    'DenseMatrix, number | BigNumber': function (x, y) {
      return algorithm14(x, y, gcd, false)
    },

    'number | BigNumber, SparseMatrix': function (x, y) {
      return algorithm10(y, x, gcd, true)
    },

    'number | BigNumber, DenseMatrix': function (x, y) {
      return algorithm14(y, x, gcd, true)
    },

    'Array, number | BigNumber': function (x, y) {
      // use matrix implementation
      return algorithm14(matrix(x), y, gcd, false).valueOf()
    },

    'number | BigNumber, Array': function (x, y) {
      // use matrix implementation
      return algorithm14(matrix(y), x, gcd, true).valueOf()
    },

    // TODO: need a smarter notation here
    'Array | Matrix | number | BigNumber, Array | Matrix | number | BigNumber, ...Array | Matrix | number | BigNumber': function (a, b, args) {
      let res = gcd(a, b)
      for (let i = 0; i < args.length; i++) {
        res = gcd(res, args[i])
      }
      return res
    }
  })

  return gcd

  /**
   * Calculate gcd for BigNumbers
   * @param {BigNumber} a
   * @param {BigNumber} b
   * @returns {BigNumber} Returns greatest common denominator of a and b
   * @private
   */
  function _gcdBigNumber (a, b) {
    if (!a.isInt() || !b.isInt()) {
      throw new Error('Parameters in function gcd must be integer numbers')
    }

    // https://en.wikipedia.org/wiki/Euclidean_algorithm
    const zero = new BigNumber(0)
    while (!b.isZero()) {
      const r = a.mod(b)
      a = b
      b = r
    }
    return a.lt(zero) ? a.neg() : a
  }
})
