import { factory } from '../../utils/factory'
import { deepMap } from '../../utils/collection'
import { nearlyEqual } from '../../utils/number'
import { nearlyEqual as bigNearlyEqual } from '../../utils/bignumber/nearlyEqual'
import { ceilNumber } from '../../plain/number'

const name = 'ceil'
const dependencies = ['typed', 'config', 'round']

export const createCeil = /* #__PURE__ */ factory(name, dependencies, ({ typed, config, round }) => {
  /**
   * Round a value towards plus infinity
   * If `x` is complex, both real and imaginary part are rounded towards plus infinity.
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.ceil(x)
   *
   * Examples:
   *
   *    math.ceil(3.2)               // returns number 4
   *    math.ceil(3.8)               // returns number 4
   *    math.ceil(-4.2)              // returns number -4
   *    math.ceil(-4.7)              // returns number -4
   *
   *    const c = math.complex(3.2, -2.7)
   *    math.ceil(c)                 // returns Complex 4 - 2i
   *
   *    math.ceil([3.2, 3.8, -4.7])  // returns Array [4, 4, -4]
   *
   * See also:
   *
   *    floor, fix, round
   *
   * @param  {number | BigNumber | Fraction | Complex | Array | Matrix} x  Number to be rounded
   * @return {number | BigNumber | Fraction | Complex | Array | Matrix} Rounded value
   */
  return typed('ceil', {
    number: function (x) {
      if (nearlyEqual(x, round(x), config.epsilon)) {
        return round(x)
      } else {
        return ceilNumber(x)
      }
    },

    Complex: function (x) {
      return x.ceil()
    },

    BigNumber: function (x) {
      if (bigNearlyEqual(x, round(x), config.epsilon)) {
        return round(x)
      } else {
        return x.ceil()
      }
    },

    Fraction: function (x) {
      return x.ceil()
    },

    'Array | Matrix': function (x) {
      // deep map collection, skip zeros since ceil(0) = 0
      return deepMap(x, this, true)
    }
  })
})
