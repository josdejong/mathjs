import { factory } from '../../utils/factory.js'
import { deepMap } from '../../utils/collection.js'
import { signNumber } from '../../plain/number/index.js'

const name = 'sign'
const dependencies = ['typed', 'BigNumber', 'Fraction', 'complex']

export const createSign = /* #__PURE__ */ factory(name, dependencies, ({ typed, BigNumber, complex, Fraction }) => {
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
  return typed(name, {
    number: signNumber,

    Complex: function (x) {
      return x.im === 0 ? complex(signNumber(x.re)) : x.sign()
    },

    BigNumber: function (x) {
      return new BigNumber(x.cmp(0))
    },

    Fraction: function (x) {
      return new Fraction(x.s, 1)
    },

    // deep map collection, skip zeros since sign(0) = 0
    'Array | Matrix': typed.referToSelf(self => x => deepMap(x, self, true)),

    Unit: typed.referToSelf(self => x => {
      if (!x._isDerived() && x.units[0].unit.offset !== 0) {
        throw new TypeError('sign is ambiguous for units with offset')
      }
      return typed.find(self, x.valueType())(x.value)
    })
  })
})
