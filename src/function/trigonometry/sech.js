import { factory } from '../../utils/factory.js'
import { sechNumber } from '../../plain/number/index.js'

const name = 'sech'
const dependencies = ['typed', 'BigNumber']

export const createSech = /* #__PURE__ */ factory(name, dependencies, ({ typed, BigNumber }) => {
  /**
   * Calculate the hyperbolic secant of a value,
   * defined as `sech(x) = 1 / cosh(x)`.
   *
   * To avoid confusion with the matrix hyperbolic secant, this function does
   * not apply to matrices.
   *
   * Syntax:
   *
   *    math.sech(x)
   *
   * Examples:
   *
   *    // sech(x) = 1/ cosh(x)
   *    math.sech(0.5)       // returns 0.886818883970074
   *    1 / math.cosh(0.5)   // returns 0.886818883970074
   *
   * See also:
   *
   *    cosh, csch, coth
   *
   * @param {number | BigNumber | Complex | Unit} x  Function input
   * @return {number | BigNumber | Complex} Hyperbolic secant of x
   */
  return typed(name, {
    number: sechNumber,

    Complex: function (x) {
      return x.sech()
    },

    BigNumber: function (x) {
      return new BigNumber(1).div(x.cosh())
    },

    Unit: function (x) {
      if (!x.hasBase(x.constructor.BASE_UNITS.ANGLE)) {
        throw new TypeError('Unit in function sech is no angle')
      }
      return this(x.value)
    }
  })
})
