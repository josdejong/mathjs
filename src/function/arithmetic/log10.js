import { log10Number } from '../../plain/number/index.js'
import { promoteLogarithm } from '../../utils/bigint.js'
import { deepMap } from '../../utils/collection.js'
import { factory } from '../../utils/factory.js'

const name = 'log10'
const dependencies = ['typed', 'config', 'Complex']
const log16 = log10Number(16)

export const createLog10 = /* #__PURE__ */ factory(name, dependencies, ({ typed, config, Complex }) => {
  /**
   * Calculate the 10-base logarithm of a value. This is the same as calculating `log(x, 10)`.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.log10(x)
   *
   * Examples:
   *
   *    math.log10(0.00001)            // returns -5
   *    math.log10(10000)              // returns 4
   *    math.log(10000) / math.log(10) // returns 4
   *    math.pow(10, 4)                // returns 10000
   *
   * See also:
   *
   *    exp, log, log1p, log2
   *
   * @param {number | BigNumber | Complex | Array | Matrix} x
   *            Value for which to calculate the logarithm.
   * @return {number | BigNumber | Complex | Array | Matrix}
   *            Returns the 10-base logarithm of `x`
   */

  function complexLog (c) {
    return c.log().div(Math.LN10)
  }

  function complexLogNumber (x) {
    return complexLog(new Complex(x, 0))
  }
  return typed(name, {
    number: function (x) {
      if (x >= 0 || config.predictable) {
        return log10Number(x)
      } else {
        // negative value -> complex value computation
        return complexLogNumber(x)
      }
    },

    bigint: promoteLogarithm(log16, log10Number, config, complexLogNumber),

    Complex: complexLog,

    BigNumber: function (x) {
      if (!x.isNegative() || config.predictable) {
        return x.log()
      } else {
        // downgrade to number, return Complex valued result
        return complexLogNumber(x.toNumber())
      }
    },

    'Array | Matrix': typed.referToSelf(self => x => deepMap(x, self))
  })
})
