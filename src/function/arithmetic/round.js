import { factory } from '../../utils/factory.js'
import { deepMap } from '../../utils/collection.js'
import { createMatAlgo11xS0s } from '../../type/matrix/utils/matAlgo11xS0s.js'
import { createMatAlgo12xSfs } from '../../type/matrix/utils/matAlgo12xSfs.js'
import { createMatAlgo14xDs } from '../../type/matrix/utils/matAlgo14xDs.js'
import { roundNumber } from '../../plain/number/index.js'

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
  const matAlgo11xS0s = createMatAlgo11xS0s({ typed, equalScalar })
  const matAlgo12xSfs = createMatAlgo12xSfs({ typed, DenseMatrix })
  const matAlgo14xDs = createMatAlgo14xDs({ typed })

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
   *    math.round(3.22)             // returns number 3
   *    math.round(3.82)             // returns number 4
   *    math.round(-4.2)             // returns number -4
   *    math.round(-4.7)             // returns number -5
   *    math.round(3.22, 1)          // returns number 3.2
   *    math.round(3.88, 1)          // returns number 3.9
   *    math.round(-4.21, 1)         // returns number -4.2
   *    math.round(-4.71, 1)         // returns number -4.7
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
  return typed(name, {
    number: roundNumber,

    'number, number': roundNumber,

    'number, BigNumber': function (x, n) {
      if (!n.isInteger()) { throw new TypeError(NO_INT) }

      return new BigNumber(x).toDecimalPlaces(n.toNumber())
    },

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

    'Fraction, BigNumber': function (x, n) {
      if (!n.isInteger()) { throw new TypeError(NO_INT) }
      return x.round(n.toNumber())
    },

    'Array | Matrix': function (x) {
      // deep map collection, skip zeros since round(0) = 0
      return deepMap(x, this, true)
    },

    'SparseMatrix, number | BigNumber': function (x, y) {
      return matAlgo11xS0s(x, y, this, false)
    },

    'DenseMatrix, number | BigNumber': function (x, y) {
      return matAlgo14xDs(x, y, this, false)
    },

    'Array, number | BigNumber': function (x, y) {
      // use matrix implementation
      return matAlgo14xDs(matrix(x), y, this, false).valueOf()
    },

    'number | Complex | BigNumber | Fraction, SparseMatrix': function (x, y) {
      // check scalar is zero
      if (equalScalar(x, 0)) {
        // do not execute algorithm, result will be a zero matrix
        return zeros(y.size(), y.storage())
      }
      return matAlgo12xSfs(y, x, this, true)
    },

    'number | Complex | BigNumber | Fraction, DenseMatrix': function (x, y) {
      // check scalar is zero
      if (equalScalar(x, 0)) {
        // do not execute algorithm, result will be a zero matrix
        return zeros(y.size(), y.storage())
      }
      return matAlgo14xDs(y, x, this, true)
    },

    'number | Complex | BigNumber | Fraction, Array': function (x, y) {
      // use matrix implementation
      return matAlgo14xDs(matrix(y), x, this, true).valueOf()
    }
  })
})
