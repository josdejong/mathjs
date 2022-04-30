import { factory } from '../../utils/factory.js'
import { createMatAlgo01xDSid } from '../../type/matrix/utils/matAlgo01xDSid.js'
import { createMatAlgo04xSidSid } from '../../type/matrix/utils/matAlgo04xSidSid.js'
import { createMatAlgo10xSids } from '../../type/matrix/utils/matAlgo10xSids.js'
import { createMatAlgo13xDD } from '../../type/matrix/utils/matAlgo13xDD.js'
import { createMatAlgo14xDs } from '../../type/matrix/utils/matAlgo14xDs.js'
import { gcdNumber } from '../../plain/number/index.js'

const name = 'gcd'
const dependencies = [
  'typed',
  'matrix',
  'equalScalar',
  'BigNumber',
  'DenseMatrix'
]

export const createGcd = /* #__PURE__ */ factory(name, dependencies, ({ typed, matrix, equalScalar, BigNumber, DenseMatrix }) => {
  const matAlgo01xDSid = createMatAlgo01xDSid({ typed })
  const matAlgo04xSidSid = createMatAlgo04xSidSid({ typed, equalScalar })
  const matAlgo10xSids = createMatAlgo10xSids({ typed, DenseMatrix })
  const matAlgo13xDD = createMatAlgo13xDD({ typed })
  const matAlgo14xDs = createMatAlgo14xDs({ typed })

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
  return typed(name, {

    'number, number': gcdNumber,

    'BigNumber, BigNumber': _gcdBigNumber,

    'Fraction, Fraction': function (x, y) {
      return x.gcd(y)
    },

    'SparseMatrix, SparseMatrix': function (x, y) {
      return matAlgo04xSidSid(x, y, this)
    },

    'SparseMatrix, DenseMatrix': function (x, y) {
      return matAlgo01xDSid(y, x, this, true)
    },

    'DenseMatrix, SparseMatrix': function (x, y) {
      return matAlgo01xDSid(x, y, this, false)
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

    'SparseMatrix, number | BigNumber': function (x, y) {
      return matAlgo10xSids(x, y, this, false)
    },

    'DenseMatrix, number | BigNumber': function (x, y) {
      return matAlgo14xDs(x, y, this, false)
    },

    'number | BigNumber, SparseMatrix': function (x, y) {
      return matAlgo10xSids(y, x, this, true)
    },

    'number | BigNumber, DenseMatrix': function (x, y) {
      return matAlgo14xDs(y, x, this, true)
    },

    'Array, number | BigNumber': function (x, y) {
      // use matrix implementation
      return matAlgo14xDs(matrix(x), y, this, false).valueOf()
    },

    'number | BigNumber, Array': function (x, y) {
      // use matrix implementation
      return matAlgo14xDs(matrix(y), x, this, true).valueOf()
    },

    // TODO: need a smarter notation here
    'Array | Matrix | number | BigNumber, Array | Matrix | number | BigNumber, ...Array | Matrix | number | BigNumber': function (a, b, args) {
      let res = this(a, b)
      for (let i = 0; i < args.length; i++) {
        res = this(res, args[i])
      }
      return res
    }
  })

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
