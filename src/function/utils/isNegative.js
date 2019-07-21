import { deepMap } from '../../utils/collection'
import { factory } from '../../utils/factory'
import { isNegativeNumber } from '../../plain/number'

const name = 'isNegative'
const dependencies = ['typed']

export const createIsNegative = /* #__PURE__ */ factory(name, dependencies, ({ typed }) => {
  /**
   * Test whether a value is negative: smaller than zero.
   * The function supports types `number`, `BigNumber`, `Fraction`, and `Unit`.
   *
   * The function is evaluated element-wise in case of Array or Matrix input.
   *
   * Syntax:
   *
   *     math.isNegative(x)
   *
   * Examples:
   *
   *    math.isNegative(3)                     // returns false
   *    math.isNegative(-2)                    // returns true
   *    math.isNegative(0)                     // returns false
   *    math.isNegative(-0)                    // returns false
   *    math.isNegative(math.bignumber(2))     // returns false
   *    math.isNegative(math.fraction(-2, 5))  // returns true
   *    math.isNegative('-2')                  // returns true
   *    math.isNegative([2, 0, -3]')           // returns [false, false, true]
   *
   * See also:
   *
   *    isNumeric, isPositive, isZero, isInteger
   *
   * @param {number | BigNumber | Fraction | Unit | Array | Matrix} x  Value to be tested
   * @return {boolean}  Returns true when `x` is larger than zero.
   *                    Throws an error in case of an unknown data type.
   */
  const isNegative = typed(name, {
    number: isNegativeNumber,

    BigNumber: function (x) {
      return x.isNeg() && !x.isZero() && !x.isNaN()
    },

    Fraction: function (x) {
      return x.s < 0 // It's enough to decide on the sign
    },

    Unit: function (x) {
      return isNegative(x.value)
    },

    'Array | Matrix': function (x) {
      return deepMap(x, isNegative)
    }
  })

  return isNegative
})
