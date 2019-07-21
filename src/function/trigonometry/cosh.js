import { factory } from '../../utils/factory'
import { deepMap } from '../../utils/collection'
import { cosh as coshNumber } from '../../utils/number'

const name = 'cosh'
const dependencies = ['typed']

export const createCosh = /* #__PURE__ */ factory(name, dependencies, ({ typed }) => {
  /**
   * Calculate the hyperbolic cosine of a value,
   * defined as `cosh(x) = 1/2 * (exp(x) + exp(-x))`.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.cosh(x)
   *
   * Examples:
   *
   *    math.cosh(0.5)       // returns number 1.1276259652063807
   *
   * See also:
   *
   *    sinh, tanh
   *
   * @param {number | BigNumber | Complex | Unit | Array | Matrix} x  Function input
   * @return {number | BigNumber | Complex | Array | Matrix} Hyperbolic cosine of x
   */
  const cosh = typed(name, {
    number: coshNumber,

    Complex: function (x) {
      return x.cosh()
    },

    BigNumber: function (x) {
      return x.cosh()
    },

    Unit: function (x) {
      if (!x.hasBase(x.constructor.BASE_UNITS.ANGLE)) {
        throw new TypeError('Unit in function cosh is no angle')
      }
      return cosh(x.value)
    },

    'Array | Matrix': function (x) {
      return deepMap(x, cosh)
    }
  })

  return cosh
})
