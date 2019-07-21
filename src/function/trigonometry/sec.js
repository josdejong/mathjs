import { factory } from '../../utils/factory'
import { deepMap } from '../../utils/collection'
import { secNumber } from '../../plain/number'

const name = 'sec'
const dependencies = ['typed', 'BigNumber']

export const createSec = /* #__PURE__ */ factory(name, dependencies, ({ typed, BigNumber }) => {
  /**
   * Calculate the secant of a value, defined as `sec(x) = 1/cos(x)`.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.sec(x)
   *
   * Examples:
   *
   *    math.sec(2)      // returns number -2.4029979617223822
   *    1 / math.cos(2)  // returns number -2.4029979617223822
   *
   * See also:
   *
   *    cos, csc, cot
   *
   * @param {number | Complex | Unit | Array | Matrix} x  Function input
   * @return {number | Complex | Array | Matrix} Secant of x
   */
  const sec = typed(name, {
    number: secNumber,

    Complex: function (x) {
      return x.sec()
    },

    BigNumber: function (x) {
      return new BigNumber(1).div(x.cos())
    },

    Unit: function (x) {
      if (!x.hasBase(x.constructor.BASE_UNITS.ANGLE)) {
        throw new TypeError('Unit in function sec is no angle')
      }
      return sec(x.value)
    },

    'Array | Matrix': function (x) {
      return deepMap(x, sec)
    }
  })

  return sec
})
