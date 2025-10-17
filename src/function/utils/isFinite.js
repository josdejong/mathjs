import { factory } from '../../utils/factory.js'

const name = 'isFinite'
const dependencies = ['typed', 'isBounded', 'map']

export const createIsFinite = /* #__PURE__ */ factory(name, dependencies, ({
  typed, isBounded, map
}) => {
  /**
   * Test whether a value is finite.
   *
   * Operates elementwise on Array and Matrix values. To test if all entries
   * of an Array or Matrix are finite, use isBounded.
   *
   * Syntax:
   *
   *     math.isFinite(x)
   *
   * Examples:
   *
   *    math.isFinite(0)                        // returns true
   *    math.isFinite(NaN)                      // returns false
   *    math.isFinite(math.bignumber(Infinity)) // returns false
   *    math.isFinite(math.fraction(1,3))       // returns true
   *    math.isFinite(math.complex('2 - 4i'))   // returns true
   *    math.isFinite(-10000000000000000n)      // returns true
   *    math.isFinite(undefined)                // returns false
   *    math.isFinite(null)                     // returns false
   *    math.isFinite([0.001, -3n, 0])          // Array [true, true, true]
   *    math.isFinite([2, -Infinity, -3])       // Array [true, false, true]
   *
   * See also:
   *
   *    isBounded isNumeric, isPositive, isNegative, isNaN
   *
   * @param {number | BigNumber | bigint | Complex | Fraction | Unit | Array | Matrix} x       Value to be tested
   * @return {boolean | Array | Matrix}
   */
  return typed(name, {
    'Array | Matrix': A => map(A, isBounded),
    any: x => isBounded(x)
  })
})
