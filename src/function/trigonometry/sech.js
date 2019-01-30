'use strict'

import { factory } from '../../utils/factory'
import { deepMap } from '../../utils/collection'

const name = 'sech'
const dependencies = ['typed', 'BigNumber', 'Unit']

export const createSech = /* #__PURE__ */ factory(name, dependencies, ({ typed, BigNumber, Unit }) => {
  /**
   * Calculate the hyperbolic secant of a value,
   * defined as `sech(x) = 1 / cosh(x)`.
   *
   * For matrices, the function is evaluated element wise.
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
   * @param {number | Complex | Unit | Array | Matrix} x  Function input
   * @return {number | Complex | Array | Matrix} Hyperbolic secant of x
   */
  const sech = typed(name, {
    'number': _sech,

    'Complex': function (x) {
      return x.sech()
    },

    'BigNumber': function (x) {
      return new BigNumber(1).div(x.cosh())
    },

    'Unit': function (x) {
      if (!x.hasBase(Unit.BASE_UNITS.ANGLE)) {
        throw new TypeError('Unit in function sech is no angle')
      }
      return sech(x.value)
    },

    'Array | Matrix': function (x) {
      return deepMap(x, sech)
    }
  })

  return sech
})

/**
 * Calculate the hyperbolic secant of a number
 * @param {number} x
 * @returns {number}
 * @private
 */
function _sech (x) {
  return 2 / (Math.exp(x) + Math.exp(-x))
}
