import { deepMap } from '../../utils/collection.js'
import { factory } from '../../utils/factory.js'

const name = 'isZero'
const dependencies = ['typed', 'equalScalar']

export const createIsZero = /* #__PURE__ */ factory(name, dependencies, ({ typed, equalScalar }) => {
  /**
   * Test whether a value is zero.
   * The function can check for zero for types `number`, `BigNumber`, `Fraction`,
   * `Complex`, and `Unit`.
   *
   * The function is evaluated element-wise in case of Array or Matrix input.
   *
   * Syntax:
   *
   *     math.isZero(x)
   *
   * Examples:
   *
   *    math.isZero(0)                      // returns true
   *    math.isZero(2)                      // returns false
   *    math.isZero(0.5)                    // returns false
   *    math.isZero(math.bignumber(0))      // returns true
   *    math.isZero(math.fraction(0))       // returns true
   *    math.isZero(math.fraction(1,3))     // returns false
   *    math.isZero(math.complex('2 - 4i')) // returns false
   *    math.isZero(math.complex('0i'))     // returns true
   *    math.isZero('0')                    // returns true
   *    math.isZero('2')                    // returns false
   *    math.isZero([2, 0, -3])             // returns [false, true, false]
   *
   * See also:
   *
   *    isNumeric, isPositive, isNegative, isInteger
   *
   * @param {number | BigNumber | bigint | Complex | Fraction | Unit | Array | Matrix} x       Value to be tested
   * @return {boolean}  Returns true when `x` is zero.
   *                    Throws an error in case of an unknown data type.
   */
  return typed(name, {
    'number | BigNumber | Complex | Fraction': x => equalScalar(x, 0),

    bigint: x => x === 0n,

    Unit: typed.referToSelf(self =>
      x => typed.find(self, x.valueType())(x.value)),

    'Array | Matrix': typed.referToSelf(self => x => deepMap(x, self))
  })
})
