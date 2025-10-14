import { factory } from '../../utils/factory.js'

const name = 'finite'
const dependencies = ['typed']

export const createFinite = /* #__PURE__ */ factory(name, dependencies, ({
  typed
}) => {
  /**
   * Test whether a value is finite.
   *
   * A Matrix or Array is defined to be finite if every entry is.
   *
   * Syntax:
   *
   *     math.finite(x)
   *
   * Examples:
   *
   *    math.finite(0)                        // returns true
   *    math.finite(NaN)                      // returns false
   *    math.finite(math.bignumber(Infinity)) // returns false
   *    math.finite(math.fraction(1,3))       // returns true
   *    math.finite(math.complex('2 - 4i'))   // returns true
   *    math.finite(-10000000000000000n)      // returns true
   *    math.finite(undefined)                // returns false
   *    math.finite(null)                     // returns false
   *    math.finite([0.001, -3n, 0])          // returns true
   *    math.finite([2, -Infinity, -3])       // returns false
   *
   * See also:
   *
   *    isNumeric, isPositive, isNegative, isNaN
   *
   * @param {number | BigNumber | bigint | Complex | Fraction | Unit | Array | Matrix} x       Value to be tested
   * @return {boolean}  Returns true when `x` is finite.
   */
  return typed(name, {
    number: isFinite,
    'BigNumber | Complex': x => x.isFinite(),
    'bigint | Fraction': () => true,
    'null | undefined': () => false,
    Unit: typed.referToSelf(self => x => self(x.value)),
    'Array | Matrix': typed.referToSelf(self => A => {
      if (!Array.isArray(A)) A = A.valueOf()
      return A.every(entry => self(entry))
    })
  })
})
