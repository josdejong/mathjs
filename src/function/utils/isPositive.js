import { factory } from '../../utils/factory.js'

const name = 'isPositive'
const dependencies = ['typed', 'zero', 'larger']

export const createIsPositive = /* #__PURE__ */ factory(name, dependencies, ({
  typed, zero, larger
}) => {
  /**
   * Test whether a value is positive: larger than zero.
   * The function supports any type mathjs can compare.
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
  return typed(name, { any: x => larger(x, zero(x)) })
})
