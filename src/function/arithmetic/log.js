import { factory } from '../../utils/factory.js'
import { logNumber } from '../../plain/number/index.js'

const name = 'log'
const dependencies = ['config', 'typed', 'divideScalar', 'Complex']

export const createLog = /* #__PURE__ */ factory(name, dependencies, ({ typed, config, divideScalar, Complex }) => {
  /**
   * Calculate the logarithm of a value.
   *
   * To avoid confusion with the matrix logarithm, this function does not
   * apply to matrices.
   *
   * Syntax:
   *
   *    math.log(x)
   *    math.log(x, base)
   *
   * Examples:
   *
   *    math.log(3.5)                  // returns 1.252762968495368
   *    math.exp(math.log(2.4))        // returns 2.4
   *
   *    math.pow(10, 4)                // returns 10000
   *    math.log(10000, 10)            // returns 4
   *    math.log(10000) / math.log(10) // returns 4
   *
   *    math.log(1024, 2)              // returns 10
   *    math.pow(2, 10)                // returns 1024
   *
   * See also:
   *
   *    exp, log2, log10, log1p
   *
   * @param {number | BigNumber | Complex} x
   *            Value for which to calculate the logarithm.
   * @param {number | BigNumber | Complex} [base=e]
   *            Optional base for the logarithm. If not provided, the natural
   *            logarithm of `x` is calculated.
   * @return {number | BigNumber | Complex}
   *            Returns the logarithm of `x`
   */
  return typed(name, {
    number: function (x) {
      if (x >= 0 || config.predictable) {
        return logNumber(x)
      } else {
        // negative value -> complex value computation
        return new Complex(x, 0).log()
      }
    },

    Complex: function (x) {
      return x.log()
    },

    BigNumber: function (x) {
      if (!x.isNegative() || config.predictable) {
        return x.ln()
      } else {
        // downgrade to number, return Complex valued result
        return new Complex(x.toNumber(), 0).log()
      }
    },

    'any, any': typed.referToSelf(self => (x, base) => {
      // calculate logarithm for a specified base, log(x, base)
      return divideScalar(self(x), self(base))
    })
  })
})
