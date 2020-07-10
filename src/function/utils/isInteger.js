import { deepMap } from '../../utils/collection'
import { isInteger as isIntegerNumber } from '../../utils/number'
import { factory } from '../../utils/factory'

const name = 'isInteger'
const dependencies = ['typed']

export const createIsInteger = /* #__PURE__ */ factory(name, dependencies, ({ typed }) => {
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
   *    math.isInteger(math.complex('2-4i')   // throws an error
   *
   * See also:
   *
   *    isNumeric, isPositive, isNegative, isZero
   *
   * @param {number | BigNumber | Fraction | Array | Matrix} x   Value to be tested
   * @return {boolean}  Returns true when `x` contains a numeric, integer value.
   *                    Throws an error in case of an unknown data type.
   */
  return typed(name, {
    number: isIntegerNumber, // TODO: what to do with isInteger(add(0.1, 0.2))  ?

    BigNumber: function (x) {
      return x.isInt()
    },

    Fraction: function (x) {
      return x.d === 1 && isFinite(x.n)
    },

    'Array | Matrix': function (x) {
      return deepMap(x, this)
    }
  })
})
