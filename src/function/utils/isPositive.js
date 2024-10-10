import { deepMap } from '../../utils/collection.js'
import { factory } from '../../utils/factory.js'
import { isPositiveNumber } from '../../plain/number/index.js'
import { nearlyEqual as bigNearlyEqual } from '../../utils/bignumber/nearlyEqual.js'
import { nearlyEqual } from '../../utils/number.js'

const name = 'isPositive'
const dependencies = ['typed', 'config']

export const createIsPositive = /* #__PURE__ */ factory(name, dependencies, ({ typed, config }) => {
  /**
   * Test whether a value is positive: larger than zero.
   * The function supports types `number`, `BigNumber`, `Fraction`, and `Unit`.
   *
   * The function is evaluated element-wise in case of Array or Matrix input.
   *
   * Syntax:
   *
   *     math.isPositive(x)
   *
   * Examples:
   *
   *    math.isPositive(3)                     // returns true
   *    math.isPositive(-2)                    // returns false
   *    math.isPositive(0)                     // returns false
   *    math.isPositive(-0)                    // returns false
   *    math.isPositive(0.5)                   // returns true
   *    math.isPositive(math.bignumber(2))     // returns true
   *    math.isPositive(math.fraction(-2, 5))  // returns false
   *    math.isPositive(math.fraction(1, 3))   // returns true
   *    math.isPositive('2')                   // returns true
   *    math.isPositive([2, 0, -3])            // returns [true, false, false]
   *
   * See also:
   *
   *    isNumeric, isZero, isNegative, isInteger
   *
   * @param {number | BigNumber | bigint | Fraction | Unit | Array | Matrix} x  Value to be tested
   * @return {boolean}  Returns true when `x` is larger than zero.
   *                    Throws an error in case of an unknown data type.
   */
  return typed(name, {
    number: x => nearlyEqual(x, 0, config.relTol, config.absTol) ? false : isPositiveNumber(x),

    BigNumber: x =>
      bigNearlyEqual(x, new x.constructor(0), config.relTol, config.absTol)
        ? false
        : !x.isNeg() && !x.isZero() && !x.isNaN(),

    bigint: x => x > 0n,

    Fraction: x => x.s > 0n && x.n > 0n,

    Unit: typed.referToSelf(self =>
      x => typed.find(self, x.valueType())(x.value)),

    'Array | Matrix': typed.referToSelf(self => x => deepMap(x, self))
  })
})
