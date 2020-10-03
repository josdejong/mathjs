import { Decimal } from 'decimal.js'
import { factory } from '../../utils/factory'
import { deepMap } from '../../utils/collection'
import { nearlyEqual } from '../../utils/number'
import { nearlyEqual as bigNearlyEqual } from '../../utils/bignumber/nearlyEqual'
import { ceilNumber } from '../../plain/number'
import { createAlgorithm11 } from '../../type/matrix/utils/algorithm11'
import { createAlgorithm14 } from '../../type/matrix/utils/algorithm14'

const name = 'ceil'
const dependencies = ['typed', 'config', 'round', 'matrix', 'equalScalar']

export const createCeil = /* #__PURE__ */ factory(name, dependencies, ({ typed, config, round, matrix, equalScalar }) => {
  const algorithm11 = createAlgorithm11({ typed, equalScalar })
  const algorithm14 = createAlgorithm14({ typed })

  /**
   * Round a value towards plus infinity
   * If `x` is complex, both real and imaginary part are rounded towards plus infinity.
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.ceil(x)
   *    math.ceil(x, n)
   *
   * Examples:
   *
   *    math.ceil(3.2)               // returns number 4
   *    math.ceil(3.8)               // returns number 4
   *    math.ceil(-4.2)              // returns number -4
   *    math.ceil(-4.7)              // returns number -4
   *
   *    math.ceil(3.212, 2)          // returns number 3.22
   *    math.ceil(3.288, 2)          // returns number 3.29
   *    math.ceil(-4.212, 2)         // returns number -4.21
   *    math.ceil(-4.782, 2)         // returns number -4.78
   *
   *    const c = math.complex(3.24, -2.71)
   *    math.ceil(c)                 // returns Complex 4 - 2i
   *    math.ceil(c, 1)              // returns Complex 3.3 - 2.7i
   *
   *    math.ceil([3.2, 3.8, -4.7])  // returns Array [4, 4, -4]
   *    math.ceil([3.21, 3.82, -4.71], 1)  // returns Array [3.3, 3.9, -4.7]
   *
   * See also:
   *
   *    floor, fix, round
   *
   * @param  {number | BigNumber | Fraction | Complex | Array | Matrix} x  Number to be rounded
   * @param  {number | BigNumber | Array} [n=0]                            Number of decimals
   * @return {number | BigNumber | Fraction | Complex | Array | Matrix} Rounded value
   */
  return typed('ceil', {
    number: function (x) {
      if (nearlyEqual(x, round(x), config.epsilon)) {
        return round(x)
      } else {
        return ceilNumber(x)
      }
    },

    'number, number': function (x, n) {
      if (nearlyEqual(x, round(x, n), config.epsilon)) {
        return round(x, n)
      } else {
        let [number, exponent] = `${x}e`.split('e')
        const result = Math.ceil(Number(`${number}e${Number(exponent) + n}`));
        [number, exponent] = `${result}e`.split('e')
        return Number(`${number}e${Number(exponent) - n}`)
      }
    },

    Complex: function (x) {
      return x.ceil()
    },

    'Complex, number': function (x, n) {
      return x.ceil(n)
    },

    BigNumber: function (x) {
      if (bigNearlyEqual(x, round(x), config.epsilon)) {
        return round(x)
      } else {
        return x.ceil()
      }
    },

    'BigNumber, BigNumber': function (x, n) {
      if (bigNearlyEqual(x, round(x, n), config.epsilon)) {
        return round(x, n)
      } else {
        return x.toDecimalPlaces(n.toNumber(), Decimal.ROUND_CEIL)
      }
    },

    Fraction: function (x) {
      return x.ceil()
    },

    'Fraction, number': function (x, n) {
      return x.ceil(n)
    },

    'Array | Matrix': function (x) {
      // deep map collection, skip zeros since ceil(0) = 0
      return deepMap(x, this, true)
    },

    'Array | Matrix, number': function (x, n) {
      // deep map collection, skip zeros since ceil(0) = 0
      return deepMap(x, i => this(i, n), true)
    },

    'SparseMatrix, number | BigNumber': function (x, y) {
      return algorithm11(x, y, this, false)
    },

    'DenseMatrix, number | BigNumber': function (x, y) {
      return algorithm14(x, y, this, false)
    },

    'number | Complex | BigNumber, Array': function (x, y) {
      // use matrix implementation
      return algorithm14(matrix(y), x, this, true).valueOf()
    }
  })
})
