import { factory } from '../../utils/factory'
import { deepMap } from '../../utils/collection'

const name = 'tan'
const dependencies = ['typed']

export const createTan = /* #__PURE__ */ factory(name, dependencies, ({ typed }) => {
  /**
   * Calculate the tangent of a value. `tan(x)` is equal to `sin(x) / cos(x)`.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.tan(x)
   *
   * Examples:
   *
   *    math.tan(0.5)                    // returns number 0.5463024898437905
   *    math.sin(0.5) / math.cos(0.5)    // returns number 0.5463024898437905
   *    math.tan(math.pi / 4)            // returns number 1
   *    math.tan(math.unit(45, 'deg'))   // returns number 1
   *
   * See also:
   *
   *    atan, sin, cos
   *
   * @param {number | BigNumber | Complex | Unit | Array | Matrix} x  Function input
   * @return {number | BigNumber | Complex | Array | Matrix} Tangent of x
   */
  const tan = typed(name, {
    number: function (x) {
      // Simple exact values of tan(x) for better simplification
      switch ((4 * x / Math.PI) % 4) {
        // tan(0), tan(pi), tan(2pi), etc = 0
        case 0:
          return 0
        // tan(pi/4), tan(5pi/4), tan(9pi/4), etc = 1
        case 1:
          return 1
        // tan(pi/2), tan(3pi/2), tan(5pi/2), etc = NaN/+ and - Infinity
        case 2:
          return NaN
        // tan(3pi/4), tan(7pi/4), tan(11pi/4), etc = -1
        case 3:
          return -1
        // If not easy exact value then calculate normally
        default:
          return Math.tan(x)
      }
    },

    Complex: function (x) {
      return x.tan()
    },

    BigNumber: function (x) {
      return x.tan()
    },

    Unit: function (x) {
      if (!x.hasBase(x.constructor.BASE_UNITS.ANGLE)) {
        throw new TypeError('Unit in function tan is no angle')
      }
      return tan(x.value)
    },

    'Array | Matrix': function (x) {
      // deep map collection, skip zeros since tan(0) = 0
      return deepMap(x, tan, true)
    }
  })

  return tan
})
