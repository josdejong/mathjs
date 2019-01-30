'use strict'

import { factory } from '../../utils/factory'
import { deepMap } from '../../utils/collection'

const name = 'coth'
const dependencies = ['typed', 'BigNumber', 'Unit']

export const createCoth = /* #__PURE__ */ factory(name, dependencies, ({ typed, BigNumber, Unit }) => {
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
  const coth = typed(name, {
    'number': _coth,

    'Complex': function (x) {
      return x.coth()
    },

    'BigNumber': function (x) {
      return new BigNumber(1).div(x.tanh())
    },

    'Unit': function (x) {
      if (!x.hasBase(Unit.BASE_UNITS.ANGLE)) {
        throw new TypeError('Unit in function coth is no angle')
      }
      return coth(x.value)
    },

    'Array | Matrix': function (x) {
      return deepMap(x, coth)
    }
  })

  return coth
})

/**
 * Calculate the hyperbolic cosine of a number
 * @param {number} x
 * @returns {number}
 * @private
 */
function _coth (x) {
  const e = Math.exp(2 * x)
  return (e + 1) / (e - 1)
}
