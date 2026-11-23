import { deepMap } from '../../utils/collection.js'
import { factory } from '../../utils/factory.js'

const name = 'isInteger'
const dependencies = ['typed', 'equalScalar']

export const createIsInteger = /* #__PURE__ */ factory(name, dependencies, ({
  typed, equalScalar
}) => {
  /**
   * Test whether a value is an integer number.
   * The function supports `number`, `BigNumber`, and `Fraction`.
   *
   * The function is evaluated element-wise in case of Array or Matrix input.
   *
   * Syntax:
   *
   *     math.isInteger(x)
   *
   * Examples:
   *
   *    math.isInteger(2)                     // returns true
   *    math.isInteger(0)                     // returns true
   *    math.isInteger(0.5)                   // returns false
   *    math.isInteger(math.bignumber(500))   // returns true
   *    math.isInteger(math.fraction(4))      // returns true
   *    math.isInteger('3')                   // returns true
   *    math.isInteger([3, 0.5, -2])          // returns [true, false, true]
   *    math.isInteger(math.complex('2-4i'))  // throws TypeError
   *
   * See also:
   *
   *    isNumeric, isPositive, isNegative, isZero
   *
   * History:
   *
   *    v16    Only respect the absolute tolerance, not the relative
   *    v15.1  Respect the config tolerances in determining whether a value
   *           is an integer
   *    v2     Created
   *
   * @param {number | BigNumber | bigint | Fraction | Array | Matrix} x   Value to be tested
   * @return {boolean}  Returns true when `x` contains a numeric, integer value.
   *                    Throws an error in case of an unknown data type.
   */
  return typed(name, {
    // Don't use any relative tolerance when deciding on integer-ness,
    // only absolute.
    number: n => Number.isFinite(n) ? equalScalar(n, Math.round(n), 0) : false,

    BigNumber: b => b.isFinite() ? equalScalar(b.round(), b, 0) : false,

    bigint: b => true,

    Fraction: r => r.d === 1n,

    'Array | Matrix': typed.referToSelf(self => x => deepMap(x, self))
  })
})
