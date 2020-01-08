import { factory } from '../../utils/factory'
import { deepMap } from '../../utils/collection'
import { isInteger } from '../../utils/number'
import { createAlgorithm11 } from '../../type/matrix/utils/algorithm11'
import { createAlgorithm12 } from '../../type/matrix/utils/algorithm12'
import { createAlgorithm14 } from '../../type/matrix/utils/algorithm14'
import { roundNumber } from '../../plain/number'

const NO_INT = 'Number of decimals in function round must be an integer'

const name = 'round'
const dependencies = [
  'typed',
  'matrix',
  'equalScalar',
  'zeros',
  'BigNumber',
  'DenseMatrix'
]

export const createRound = /* #__PURE__ */ factory(name, dependencies, ({ typed, matrix, equalScalar, zeros, BigNumber, DenseMatrix }) => {
  const algorithm11 = createAlgorithm11({ typed, equalScalar })
  const algorithm12 = createAlgorithm12({ typed, DenseMatrix })
  const algorithm14 = createAlgorithm14({ typed })

  /**
   * Round a value towards the nearest integer.
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.round(x)
   *    math.round(x, n)
   *
   * Examples:
   *
   *    math.round(3.2)              // returns number 3
   *    math.round(3.8)              // returns number 4
   *    math.round(-4.2)             // returns number -4
   *    math.round(-4.7)             // returns number -5
   *    math.round(math.pi, 3)       // returns number 3.142
   *    math.round(123.45678, 2)     // returns number 123.46
   *
   *    const c = math.complex(3.2, -2.7)
   *    math.round(c)                // returns Complex 3 - 3i
   *
   *    math.round([3.2, 3.8, -4.7]) // returns Array [3, 4, -5]
   *
   * See also:
   *
   *    ceil, fix, floor
   *
   * @param  {number | BigNumber | Fraction | Complex | Array | Matrix} x  Number to be rounded
   * @param  {number | BigNumber | Array} [n=0]                            Number of decimals
   * @return {number | BigNumber | Fraction | Complex | Array | Matrix} Rounded value
   */
  const round = typed(name, {
    ...roundNumberSignatures,

    Complex: function (x) {
      return x.round()
    },

    'Complex, number': function (x, n) {
      if (n % 1) { throw new TypeError(NO_INT) }

      return x.round(n)
    },

    'Complex, BigNumber': function (x, n) {
      if (!n.isInteger()) { throw new TypeError(NO_INT) }

      const _n = n.toNumber()
      return x.round(_n)
    },

    'number, BigNumber': function (x, n) {
      if (!n.isInteger()) { throw new TypeError(NO_INT) }

      return new BigNumber(x).toDecimalPlaces(n.toNumber())
    },

    BigNumber: function (x) {
      return x.toDecimalPlaces(0)
    },

    'BigNumber, BigNumber': function (x, n) {
      if (!n.isInteger()) { throw new TypeError(NO_INT) }

      return x.toDecimalPlaces(n.toNumber())
    },

    Fraction: function (x) {
      return x.round()
    },

    'Fraction, number': function (x, n) {
      if (n % 1) { throw new TypeError(NO_INT) }
      return x.round(n)
    },

    'Array | Matrix': function (x) {
      // deep map collection, skip zeros since round(0) = 0
      return deepMap(x, round, true)
    },

    'SparseMatrix, number | BigNumber': function (x, y) {
      return algorithm11(x, y, round, false)
    },

    'DenseMatrix, number | BigNumber': function (x, y) {
      return algorithm14(x, y, round, false)
    },

    'number | Complex | BigNumber, SparseMatrix': function (x, y) {
      // check scalar is zero
      if (equalScalar(x, 0)) {
        // do not execute algorithm, result will be a zero matrix
        return zeros(y.size(), y.storage())
      }
      return algorithm12(y, x, round, true)
    },

    'number | Complex | BigNumber, DenseMatrix': function (x, y) {
      // check scalar is zero
      if (equalScalar(x, 0)) {
        // do not execute algorithm, result will be a zero matrix
        return zeros(y.size(), y.storage())
      }
      return algorithm14(y, x, round, true)
    },

    'Array, number | BigNumber': function (x, y) {
      // use matrix implementation
      return algorithm14(matrix(x), y, round, false).valueOf()
    },

    'number | Complex | BigNumber, Array': function (x, y) {
      // use matrix implementation
      return algorithm14(matrix(y), x, round, true).valueOf()
    }
  })

  return round
})

const roundNumberSignatures = {
  number: roundNumber,

  'number, number': function (x, n) {
    if (!isInteger(n)) { throw new TypeError(NO_INT) }
    if (n < 0 || n > 15) { throw new Error('Number of decimals in function round must be in te range of 0-15') }

    return roundNumber(x, n)
  }
}

export const createRoundNumber = /* #__PURE__ */ factory(name, ['typed'], ({ typed }) => {
  return typed(name, roundNumberSignatures)
})
