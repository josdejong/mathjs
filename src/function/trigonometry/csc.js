import { factory } from '../../utils/factory.js'
import { cscNumber } from '../../plain/number/index.js'

const name = 'csc'
const dependencies = ['typed', 'BigNumber']

export const createCsc = /* #__PURE__ */ factory(name, dependencies, ({ typed, BigNumber }) => {
  /**
   * Calculate the cosecant of a value, defined as `csc(x) = 1/sin(x)`.
   *
   * To avoid confusion with the matrix cosecant, this function does not
   * apply to matrices.
   *
   * Syntax:
   *
   *    math.csc(x)
   *
   * Examples:
   *
   *    math.csc(2)      // returns number 1.099750170294617
   *    1 / math.sin(2)  // returns number 1.099750170294617
   *
   * See also:
   *
   *    sin, sec, cot
   *
   * @param {number | BigNumber | Complex | Unit} x  Function input
   * @return {number | BigNumber | Complex} Cosecant of x
   */
  return typed(name, {
    number: cscNumber,

    Complex: function (x) {
      return x.csc()
    },

    BigNumber: function (x) {
      return new BigNumber(1).div(x.sin())
    },

    Unit: function (x) {
      if (!x.hasBase(x.constructor.BASE_UNITS.ANGLE)) {
        throw new TypeError('Unit in function csc is no angle')
      }
      return this(x.value)
    }
  })
})
