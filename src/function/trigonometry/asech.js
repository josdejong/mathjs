'use strict'

import { factory } from '../../utils/factory'
import { deepMap } from '../../utils/collection'

const name = 'asech'
const dependencies = ['typed', 'config', 'Complex', 'BigNumber']

export const createAsech = /* #__PURE__ */ factory(name, dependencies, ({ typed, config, Complex, BigNumber }) => {
  /**
   * Calculate the hyperbolic arcsecant of a value,
   * defined as `asech(x) = acosh(1/x) = ln(sqrt(1/x^2 - 1) + 1/x)`.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.asech(x)
   *
   * Examples:
   *
   *    math.asech(0.5)       // returns 1.3169578969248166
   *
   * See also:
   *
   *    acsch, acoth
   *
   * @param {number | Complex | Array | Matrix} x  Function input
   * @return {number | Complex | Array | Matrix} Hyperbolic arcsecant of x
   */
  const asech = typed(name, {
    'number': function (x) {
      if ((x <= 1 && x >= -1) || config.predictable) {
        x = 1 / x

        const ret = Math.sqrt(x * x - 1)
        if (x > 0 || config.predictable) {
          return Math.log(ret + x)
        }

        return new Complex(Math.log(ret - x), Math.PI)
      }

      return new Complex(x, 0).asech()
    },

    'Complex': function (x) {
      return x.asech()
    },

    'BigNumber': function (x) {
      return new BigNumber(1).div(x).acosh()
    },

    'Array | Matrix': function (x) {
      return deepMap(x, asech)
    }
  })

  return asech
})
