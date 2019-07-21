import { deepMap } from '../../utils/collection'
import { factory } from '../../utils/factory'
import { isNaNNumber } from '../../plain/number'

const name = 'isNaN'
const dependencies = ['typed']

export const createIsNaN = /* #__PURE__ */ factory(name, dependencies, ({ typed }) => {
  /**
   * Test whether a value is NaN (not a number).
   * The function supports types `number`, `BigNumber`, `Fraction`, `Unit` and `Complex`.
   *
   * The function is evaluated element-wise in case of Array or Matrix input.
   *
   * Syntax:
   *
   *     math.isNaN(x)
   *
   * Examples:
   *
   *    math.isNaN(3)                     // returns false
   *    math.isNaN(NaN)                   // returns true
   *    math.isNaN(0)                     // returns false
   *    math.isNaN(math.bignumber(NaN))   // returns true
   *    math.isNaN(math.bignumber(0))     // returns false
   *    math.isNaN(math.fraction(-2, 5))  // returns false
   *    math.isNaN('-2')                  // returns false
   *    math.isNaN([2, 0, -3, NaN]')      // returns [false, false, false, true]
   *
   * See also:
   *
   *    isNumeric, isNegative, isPositive, isZero, isInteger
   *
   * @param {number | BigNumber | Fraction | Unit | Array | Matrix} x  Value to be tested
   * @return {boolean}  Returns true when `x` is NaN.
   *                    Throws an error in case of an unknown data type.
   */
  return typed(name, {
    number: isNaNNumber,

    BigNumber: function (x) {
      return x.isNaN()
    },

    Fraction: function (x) {
      return false
    },

    Complex: function (x) {
      return x.isNaN()
    },

    Unit: function (x) {
      return Number.isNaN(x.value)
    },

    'Array | Matrix': function (x) {
      return deepMap(x, Number.isNaN)
    }
  })
})
