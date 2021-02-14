import { deepMap } from '../../utils/collection.js'
import { isInfiniteNumber } from '../../plain/number/index.js'
import { factory } from '../../utils/factory.js'

const name = 'isInfinite'
const dependencies = ['typed']

export const createIsInfinite = /* #__PURE__ */ factory(
  name,
  dependencies,
  ({ typed }) => {
    /**
     * Test whether a value is infinite (not finite).
     * The function supports types `number`, `BigNumber`, `Fraction`, `Unit`, `Complex` and 'Array'.
     *
     * Syntax:
     *
     *    math.isInfinite(x)
     *
     * Examples:
     *
     *    math.isInfinite(3)                                            // returns false
     *    math.isInfinite(NaN)                                          // returns false
     *    math.isInfinite(0)                                            // returns false
     *    math.isInfinite(math.bignumber(NaN))                          // returns false
     *    math.isInfinite(math.bignumber(0))                            // returns false
     *    math.isInfinite(math.fraction(-2, 5))                         // returns false
     *    math.isInfinite('-2')                                         // returns false
     *    math.isInfinite(complex(-2,5))                                // returns false
     *    math.isInfinite(complex(Number.POSITIVE_INFINITY,5))          // returns true
     *    math.isInfinite([2, 0, -3, NaN, Number.POSITIVE_INFINITY]')   // returns [false, false, false, false, true]
     *
     * See also:
     *
     *    isNumeric, isNegative, isPositive, isZero, isInteger
     *
     * @param {number | BigNumber | Fraction | Unit | Complex | Array} x  Value to be tested
     * @return {boolean}  Returns true when `x` is Infinite.
     *                    Throws an error in case of an unknown data type.
     */
    return typed(name, {
      number: isInfiniteNumber,

      BigNumber: function (x) {
        return isInfiniteNumber(x)
      },

      Fraction: function (x) {
        return false
      },

      Unit: function (x) {
        return isInfiniteNumber(x.value)
      },

      Complex: function (x) {
        return isInfiniteNumber(x.re) || isInfiniteNumber(x.im)
      },

      Array: function (x) {
        return deepMap(x, this)
      }
    })
  }
)
