import { factory } from '../../utils/factory'
import { deepMap } from '../../utils/collection'
import { cotNumber } from '../../plain/number'

const name = 'cot'
const dependencies = ['typed', 'BigNumber']

export const createCot = /* #__PURE__ */ factory(name, dependencies, ({ typed, BigNumber }) => {
  /**
   * Calculate the cotangent of a value. Defined as `cot(x) = 1 / tan(x)`.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.cot(x)
   *
   * Examples:
   *
   *    math.cot(2)      // returns number -0.45765755436028577
   *    1 / math.tan(2)  // returns number -0.45765755436028577
   *
   * See also:
   *
   *    tan, sec, csc
   *
   * @param {number | Complex | Unit | Array | Matrix} x  Function input
   * @return {number | Complex | Array | Matrix} Cotangent of x
   */
  const cot = typed(name, {
    number: function (x) {
      // Simple exact values of tan(x) for better simplification
      switch ((4 * x / Math.PI) % 4) {
        // tan(0), tan(pi), tan(2pi). etc = NaN/+ and - Infinity
        case 0:
          return NaN
        // tan(pi/4), tan(5pi/4), tan(9pi/4), etc = 1
        case 1:
          return 1
        // tan(pi/2), tan(3pi/2), tan(5pi/2), etc = 0
        case 2:
          return 0
        // tan(3pi/4), tan(7pi/4), tan(11pi/4), etc = -1
        case 3:
          return -1
        // If not easy exact value then calculate normally
        default:
          return cotNumber(x)
      }
    },

    Complex: function (x) {
      return x.cot()
    },

    BigNumber: function (x) {
      return new BigNumber(1).div(x.tan())
    },

    Unit: function (x) {
      if (!x.hasBase(x.constructor.BASE_UNITS.ANGLE)) {
        throw new TypeError('Unit in function cot is no angle')
      }
      return cot(x.value)
    },

    'Array | Matrix': function (x) {
      return deepMap(x, cot)
    }
  })

  return cot
})
