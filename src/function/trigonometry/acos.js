import { factory } from '../../utils/factory.js'

const name = 'acos'
const dependencies = ['typed', 'config', 'Complex']

export const createAcos = /* #__PURE__ */ factory(name, dependencies, ({ typed, config, Complex }) => {
  /**
   * Calculate the inverse cosine of a value.
   *
   * To avoid confusion with the matrix arccosine, this function does not
   * apply to matrices.
   *
   * Syntax:
   *
   *    math.acos(x)
   *
   * Examples:
   *
   *    math.acos(0.5)           // returns number 1.0471975511965979
   *    math.acos(math.cos(1.5)) // returns number 1.5
   *
   *    math.acos(2)             // returns Complex 0 + 1.3169578969248166 i
   *
   * See also:
   *
   *    cos, atan, asin
   *
   * @param {number | BigNumber | Complex} x  Function input
   * @return {number | BigNumber | Complex} The arc cosine of x
   */
  return typed(name, {
    number: function (x) {
      if ((x >= -1 && x <= 1) || config.predictable) {
        return Math.acos(x)
      } else {
        return new Complex(x, 0).acos()
      }
    },

    Complex: function (x) {
      return x.acos()
    },

    BigNumber: function (x) {
      return x.acos()
    }
  })
})
