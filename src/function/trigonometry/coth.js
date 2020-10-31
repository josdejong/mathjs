import { factory } from '../../utils/factory'
import { deepMap } from '../../utils/collection'
import { cothNumber } from '../../plain/number'

const name = 'coth'
const dependencies = ['typed', 'BigNumber']

export const createCoth = /* #__PURE__ */ factory(name, dependencies, ({ typed, BigNumber }) => {
  /**
   * Calculate the hyperbolic cotangent of a value,
   * defined as `coth(x) = 1 / tanh(x)`.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.coth(x)
   *
   * Examples:
   *
   *    // coth(x) = 1 / tanh(x)
   *    math.coth(2)         // returns 1.0373147207275482
   *    1 / math.tanh(2)     // returns 1.0373147207275482
   *
   * See also:
   *
   *    sinh, tanh, cosh
   *
   * @param {number | Complex | Unit | Array | Matrix} x  Function input
   * @return {number | Complex | Array | Matrix} Hyperbolic cotangent of x
   */
  return typed(name, {
    number: cothNumber,

    Complex: function (x) {
      return x.coth()
    },

    BigNumber: function (x) {
      return new BigNumber(1).div(x.tanh())
    },

    Unit: function (x) {
      if (!x.hasBase(x.constructor.BASE_UNITS.ANGLE)) {
        throw new TypeError('Unit in function coth is no angle')
      }
      return this(x.value)
    },

    'Array | Matrix': function (x) {
      return deepMap(x, this)
    }
  })
})
