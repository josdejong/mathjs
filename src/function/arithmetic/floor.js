import { factory } from '../../utils/factory'
import { deepMap } from '../../utils/collection'
import { nearlyEqual } from '../../utils/number'
import { nearlyEqual as bigNearlyEqual } from '../../utils/bignumber/nearlyEqual'

const name = 'floor'
const dependencies = ['typed', 'config', 'round']

export const createFloor = /* #__PURE__ */ factory(name, dependencies, ({ typed, config, round }) => {
  /**
   * Round a value towards minus infinity.
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.floor(x)
   *
   * Examples:
   *
   *    math.floor(3.2)              // returns number 3
   *    math.floor(3.8)              // returns number 3
   *    math.floor(-4.2)             // returns number -5
   *    math.floor(-4.7)             // returns number -5
   *
   *    const c = math.complex(3.2, -2.7)
   *    math.floor(c)                // returns Complex 3 - 3i
   *
   *    math.floor([3.2, 3.8, -4.7]) // returns Array [3, 3, -5]
   *
   * See also:
   *
   *    ceil, fix, round
   *
   * @param  {number | BigNumber | Fraction | Complex | Array | Matrix} x  Number to be rounded
   * @return {number | BigNumber | Fraction | Complex | Array | Matrix} Rounded value
   */
  return typed('floor', {
    number: function (x) {
      if (nearlyEqual(x, round(x), config.epsilon)) {
        return round(x)
      } else {
        return Math.floor(x)
      }
    },

    Complex: function (x) {
      return x.floor()
    },

    BigNumber: function (x) {
      if (bigNearlyEqual(x, round(x), config.epsilon)) {
        return round(x)
      } else {
        return x.floor()
      }
    },

    Fraction: function (x) {
      return x.floor()
    },

    'Array | Matrix': function (x) {
      // deep map collection, skip zeros since floor(0) = 0
      return deepMap(x, this, true)
    }
  })
})
