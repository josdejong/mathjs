import { factory } from '../../utils/factory.js'

const name = 'isBounded'
const dependencies = ['typed']

export const createIsBounded = /* #__PURE__ */ factory(name, dependencies, ({
  typed
}) => {
  /**
   * Test whether a value is bounded. For scalars, this test is equivalent
   * to the isFinite finiteness test. On the other hand, a Matrix or Array
   * is defined to be bounded if every entry is finite.
   *
   * Syntax:
   *
   *     math.isBounded(x)
   *
   * Examples:
   *
   *    math.isBounded(0)                        // returns true
   *    math.isBounded(NaN)                      // returns false
   *    math.isBounded(math.bignumber(Infinity)) // returns false
   *    math.isBounded(math.fraction(1,3))       // returns true
   *    math.isBounded(math.complex('2 - 4i'))   // returns true
   *    math.isBounded(-10000000000000000n)      // returns true
   *    math.isBounded(undefined)                // returns false
   *    math.isBounded(null)                     // returns false
   *    math.isBounded([0.001, -3n, 0])          // returns true
   *    math.isBounded([2, -Infinity, -3])       // returns false
   *
   * See also:
   *
   *    isFinite, isNumeric, isPositive, isNegative, isNaN
   *
   * @param {number | BigNumber | bigint | Complex | Fraction | Unit | Array | Matrix} x       Value to be tested
   * @return {boolean}  Returns true when `x` is bounded.
   */
  return typed(name, {
    number: n => Number.isFinite(n),
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
