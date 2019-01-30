'use strict'

import { factory } from '../../utils/factory'
import { deepMap } from '../../utils/collection'

const name = 'expm1'
const dependencies = [ 'typed', 'Complex' ]

export const createExpm1 = /* #__PURE__ */ factory(name, dependencies, ({ typed, Complex }) => {
  /**
   * Calculate the value of subtracting 1 from the exponential value.
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.expm1(x)
   *
   * Examples:
   *
   *    math.expm1(2)                      // returns number 6.38905609893065
   *    math.pow(math.e, 2) - 1            // returns number 6.3890560989306495
   *    math.log(math.expm1(2) + 1)        // returns number 2
   *
   *    math.expm1([1, 2, 3])
   *    // returns Array [
   *    //   1.718281828459045,
   *    //   6.3890560989306495,
   *    //   19.085536923187668
   *    // ]
   *
   * See also:
   *
   *    exp, log, pow
   *
   * @param {number | BigNumber | Complex | Array | Matrix} x  A number or matrix to apply expm1
   * @return {number | BigNumber | Complex | Array | Matrix} Exponent of `x`
   */
  const expm1 = typed(name, {
    'number': Math.expm1 || _expm1,

    'Complex': function (x) {
      const r = Math.exp(x.re)
      return new Complex(
        r * Math.cos(x.im) - 1,
        r * Math.sin(x.im)
      )
    },

    'BigNumber': function (x) {
      return x.exp().minus(1)
    },

    'Array | Matrix': function (x) {
      return deepMap(x, expm1)
    }
  })

  /**
   * Calculates exponentiation minus 1.
   * @param {number} x
   * @return {number} res
   * @private
   */
  function _expm1 (x) {
    return (x >= 2e-4 || x <= -2e-4)
      ? Math.exp(x) - 1
      : x + x * x / 2 + x * x * x / 6
  }

  return expm1
})
