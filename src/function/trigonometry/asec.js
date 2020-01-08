import { factory } from '../../utils/factory'
import { deepMap } from '../../utils/collection'
import { asecNumber } from '../../plain/number'

const name = 'asec'
const dependencies = ['typed', 'config', 'Complex', 'BigNumber']

export const createAsec = /* #__PURE__ */ factory(name, dependencies, ({ typed, config, Complex, BigNumber }) => {
  /**
   * Calculate the inverse secant of a value. Defined as `asec(x) = acos(1/x)`.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.asec(x)
   *
   * Examples:
   *
   *    math.asec(0.5)           // returns 1.0471975511965979
   *    math.asec(math.sec(1.5)) // returns 1.5
   *
   *    math.asec(2)             // returns 0 + 1.3169578969248166 i
   *
   * See also:
   *
   *    acos, acot, acsc
   *
   * @param {number | Complex | Array | Matrix} x  Function input
   * @return {number | Complex | Array | Matrix} The arc secant of x
   */
  const asec = typed(name, {
    number: function (x) {
      if (x <= -1 || x >= 1 || config.predictable) {
        return asecNumber(x)
      }
      return new Complex(x, 0).asec()
    },

    Complex: function (x) {
      return x.asec()
    },

    BigNumber: function (x) {
      return new BigNumber(1).div(x).acos()
    },

    'Array | Matrix': function (x) {
      return deepMap(x, asec)
    }
  })

  return asec
})
