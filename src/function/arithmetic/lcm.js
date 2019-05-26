import { factory } from '../../utils/factory'
import { createAlgorithm02 } from '../../type/matrix/utils/algorithm02'
import { createAlgorithm06 } from '../../type/matrix/utils/algorithm06'
import { createAlgorithm11 } from '../../type/matrix/utils/algorithm11'
import { createAlgorithm13 } from '../../type/matrix/utils/algorithm13'
import { createAlgorithm14 } from '../../type/matrix/utils/algorithm14'
import { lcmNumber } from '../../plain/number'

const name = 'lcm'
const dependencies = [
  'typed',
  'matrix',
  'equalScalar'
]

export const createLcm = /* #__PURE__ */ factory(name, dependencies, ({ typed, matrix, equalScalar }) => {
  const algorithm02 = createAlgorithm02({ typed, equalScalar })
  const algorithm06 = createAlgorithm06({ typed, equalScalar })
  const algorithm11 = createAlgorithm11({ typed, equalScalar })
  const algorithm13 = createAlgorithm13({ typed })
  const algorithm14 = createAlgorithm14({ typed })

  /**
   * Calculate the least common multiple for two or more values or arrays.
   *
   * lcm is defined as:
   *
   *     lcm(a, b) = abs(a * b) / gcd(a, b)
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.lcm(a, b)
   *    math.lcm(a, b, c, ...)
   *
   * Examples:
   *
   *    math.lcm(4, 6)               // returns 12
   *    math.lcm(6, 21)              // returns 42
   *    math.lcm(6, 21, 5)           // returns 210
   *
   *    math.lcm([4, 6], [6, 21])    // returns [12, 42]
   *
   * See also:
   *
   *    gcd, xgcd
   *
   * @param {... number | BigNumber | Array | Matrix} args  Two or more integer numbers
   * @return {number | BigNumber | Array | Matrix}                           The least common multiple
   */
  const lcm = typed(name, {
    'number, number': lcmNumber,

    'BigNumber, BigNumber': _lcmBigNumber,

    'Fraction, Fraction': function (x, y) {
      return x.lcm(y)
    },

    'SparseMatrix, SparseMatrix': function (x, y) {
      return algorithm06(x, y, lcm)
    },

    'SparseMatrix, DenseMatrix': function (x, y) {
      return algorithm02(y, x, lcm, true)
    },

    'DenseMatrix, SparseMatrix': function (x, y) {
      return algorithm02(x, y, lcm, false)
    },

    'DenseMatrix, DenseMatrix': function (x, y) {
      return algorithm13(x, y, lcm)
    },

    'Array, Array': function (x, y) {
      // use matrix implementation
      return lcm(matrix(x), matrix(y)).valueOf()
    },

    'Array, Matrix': function (x, y) {
      // use matrix implementation
      return lcm(matrix(x), y)
    },

    'Matrix, Array': function (x, y) {
      // use matrix implementation
      return lcm(x, matrix(y))
    },

    'SparseMatrix, number | BigNumber': function (x, y) {
      return algorithm11(x, y, lcm, false)
    },

    'DenseMatrix, number | BigNumber': function (x, y) {
      return algorithm14(x, y, lcm, false)
    },

    'number | BigNumber, SparseMatrix': function (x, y) {
      return algorithm11(y, x, lcm, true)
    },

    'number | BigNumber, DenseMatrix': function (x, y) {
      return algorithm14(y, x, lcm, true)
    },

    'Array, number | BigNumber': function (x, y) {
      // use matrix implementation
      return algorithm14(matrix(x), y, lcm, false).valueOf()
    },

    'number | BigNumber, Array': function (x, y) {
      // use matrix implementation
      return algorithm14(matrix(y), x, lcm, true).valueOf()
    },

    // TODO: need a smarter notation here
    'Array | Matrix | number | BigNumber, Array | Matrix | number | BigNumber, ...Array | Matrix | number | BigNumber': function (a, b, args) {
      let res = lcm(a, b)
      for (let i = 0; i < args.length; i++) {
        res = lcm(res, args[i])
      }
      return res
    }
  })

  return lcm

  /**
   * Calculate lcm for two BigNumbers
   * @param {BigNumber} a
   * @param {BigNumber} b
   * @returns {BigNumber} Returns the least common multiple of a and b
   * @private
   */
  function _lcmBigNumber (a, b) {
    if (!a.isInt() || !b.isInt()) {
      throw new Error('Parameters in function lcm must be integer numbers')
    }

    if (a.isZero()) {
      return a
    }
    if (b.isZero()) {
      return b
    }

    // https://en.wikipedia.org/wiki/Euclidean_algorithm
    // evaluate lcm here inline to reduce overhead
    const prod = a.times(b)
    while (!b.isZero()) {
      const t = b
      b = a.mod(t)
      a = t
    }
    return prod.div(a).abs()
  }
})
