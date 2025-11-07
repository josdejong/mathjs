import { deepMap } from '../../utils/collection.js'
import { factory } from '../../utils/factory.js'

const name = 'isInteger'
const dependencies = ['typed', 'equal']

export const createIsInteger = /* #__PURE__ */ factory(name, dependencies, ({
  typed, equal
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
   * @param {number | BigNumber | bigint | Fraction | Array | Matrix} x   Value to be tested
   * @return {boolean}  Returns true when `x` contains a numeric, integer value.
   *                    Throws an error in case of an unknown data type.
   */
  return typed(name, {
    number: n => Number.isFinite(n) ? equal(n, Math.round(n)) : false,

    BigNumber: b => b.isFinite() ? equal(b.round(), b) : false,

    bigint: b => true,

    Fraction: r => r.d === 1n,

    'Array | Matrix': typed.referToSelf(self => x => deepMap(x, self))
  })
})
