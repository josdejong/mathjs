import { factory } from '../../utils/factory'
import { deepMap } from '../../utils/collection'
import { tanh as _tanh } from '../../utils/number'

const name = 'tanh'
const dependencies = ['typed']

export const createTanh = /* #__PURE__ */ factory(name, dependencies, ({ typed }) => {
  /**
   * Calculate the hyperbolic tangent of a value,
   * defined as `tanh(x) = (exp(2 * x) - 1) / (exp(2 * x) + 1)`.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.tanh(x)
   *
   * Examples:
   *
   *    // tanh(x) = sinh(x) / cosh(x) = 1 / coth(x)
   *    math.tanh(0.5)                   // returns 0.46211715726000974
   *    math.sinh(0.5) / math.cosh(0.5)  // returns 0.46211715726000974
   *    1 / math.coth(0.5)               // returns 0.46211715726000974
   *
   * See also:
   *
   *    sinh, cosh, coth
   *
   * @param {number | BigNumber | Complex | Unit | Array | Matrix} x  Function input
   * @return {number | BigNumber | Complex | Array | Matrix} Hyperbolic tangent of x
   */
  const tanh = typed('tanh', {
    'number': _tanh,

    'Complex': function (x) {
      return x.tanh()
    },

    'BigNumber': function (x) {
      return x.tanh()
    },

    'Unit': function (x) {
      if (!x.hasBase(x.constructor.BASE_UNITS.ANGLE)) {
        throw new TypeError('Unit in function tanh is no angle')
      }
      return tanh(x.value)
    },

    'Array | Matrix': function (x) {
      // deep map collection, skip zeros since tanh(0) = 0
      return deepMap(x, tanh, true)
    }
  })

  return tanh
})
