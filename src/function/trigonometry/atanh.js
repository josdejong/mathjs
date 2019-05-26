import { factory } from '../../utils/factory'
import { deepMap } from '../../utils/collection'
import { atanhNumber } from '../../plain/number'

const name = 'atanh'
const dependencies = ['typed', 'config', 'Complex']

export const createAtanh = /* #__PURE__ */ factory(name, dependencies, ({ typed, config, Complex }) => {
  /**
   * Calculate the hyperbolic arctangent of a value,
   * defined as `atanh(x) = ln((1 + x)/(1 - x)) / 2`.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.atanh(x)
   *
   * Examples:
   *
   *    math.atanh(0.5)       // returns 0.5493061443340549
   *
   * See also:
   *
   *    acosh, asinh
   *
   * @param {number | Complex | Array | Matrix} x  Function input
   * @return {number | Complex | Array | Matrix} Hyperbolic arctangent of x
   */
  const atanh = typed(name, {
    'number': function (x) {
      if ((x <= 1 && x >= -1) || config.predictable) {
        return atanhNumber(x)
      }
      return new Complex(x, 0).atanh()
    },

    'Complex': function (x) {
      return x.atanh()
    },

    'BigNumber': function (x) {
      return x.atanh()
    },

    'Array | Matrix': function (x) {
      // deep map collection, skip zeros since atanh(0) = 0
      return deepMap(x, atanh, true)
    }
  })

  return atanh
})
