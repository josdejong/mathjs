import { factory } from '../../utils/factory'
import { deepMap } from '../../utils/collection'
import { signNumber } from '../../plain/number'

const name = 'sign'
const dependencies = ['typed', 'BigNumber', 'Fraction']

export const createSign = /* #__PURE__ */ factory(name, dependencies, ({ typed, BigNumber, Fraction }) => {
  /**
   * Compute the sign of a value. The sign of a value x is:
   *
   * -  1 when x > 0
   * - -1 when x < 0
   * -  0 when x == 0
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.sign(x)
   *
   * Examples:
   *
   *    math.sign(3.5)               // returns 1
   *    math.sign(-4.2)              // returns -1
   *    math.sign(0)                 // returns 0
   *
   *    math.sign([3, 5, -2, 0, 2])  // returns [1, 1, -1, 0, 1]
   *
   * See also:
   *
   *    abs
   *
   * @param  {number | BigNumber | Fraction | Complex | Array | Matrix | Unit} x
   *            The number for which to determine the sign
   * @return {number | BigNumber | Fraction | Complex | Array | Matrix | Unit}e
   *            The sign of `x`
   */
  const sign = typed(name, {
    'number': signNumber,

    'Complex': function (x) {
      return x.sign()
    },

    'BigNumber': function (x) {
      return new BigNumber(x.cmp(0))
    },

    'Fraction': function (x) {
      return new Fraction(x.s, 1)
    },

    'Array | Matrix': function (x) {
      // deep map collection, skip zeros since sign(0) = 0
      return deepMap(x, sign, true)
    },

    'Unit': function (x) {
      return sign(x.value)
    }
  })

  return sign
})
