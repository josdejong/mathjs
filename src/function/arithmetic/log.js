import { factory } from '../../utils/factory.js'
import { promoteLogarithm } from '../../utils/bigint.js'
import { logNumber } from '../../plain/number/index.js'

const name = 'log'
const dependencies = ['config', 'typed', 'typeOf', 'divideScalar', 'Complex']
const nlg16 = Math.log(16)

export const createLog = /* #__PURE__ */ factory(name, dependencies, ({ typed, typeOf, config, divideScalar, Complex }) => {
  /**
   * Calculate the logarithm of a value.
   *
   * To avoid confusion with the matrix logarithm, this function does not
   * apply to matrices.
   *
   * Note that when the value is a Fraction, then the
   * base must be specified as a Fraction, and the log() will only be
   * returned when the result happens to be rational. When there is an
   * attempt to take a log of Fractions that would result in an irrational
   * value, a TypeError against implicit conversion of BigInt to Fraction
   * is thrown.
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
   * History:
   *
   *    v0.0.2  Created
   *    v0.2    Add optional base argument
   *    v0.3    Handle Array input
   *    v0.5    Handle Matrix input
   *    v0.16   Handle BigNumber input
   *    v0.21   Support negative BigNumbers
   *    v11     Drop Array/Matrix support in favor of explicit map of
   *            the scalar log function, to avoid confusion with the log
   *            of a matrix
   *    v14     Allow value and base to be Fractions, when the log is rational
   *
   * @param {number | BigNumber | Fraction | Complex} x
   *            Value for which to calculate the logarithm.
   * @param {number | BigNumber | Fraction | Complex} [base=e]
   *            Optional base for the logarithm. If not provided, the natural
   *            logarithm of `x` is calculated, unless x is a Fraction, in
   *            which case an error is thrown.
   * @return {number | BigNumber | Fraction | Complex}
   *            Returns the logarithm of `x`
   */
  function complexLog (c) {
    return c.log()
  }

  function complexLogNumber (x) {
    return complexLog(new Complex(x, 0))
  }

  return typed(name, {
    number: function (x) {
      if (x >= 0 || config.predictable) {
        return logNumber(x)
      } else {
        // negative value -> complex value computation
        return complexLogNumber(x)
      }
    },

    bigint: promoteLogarithm(nlg16, logNumber, config, complexLogNumber),

    Complex: complexLog,

    BigNumber: function (x) {
      if (!x.isNegative() || config.predictable) {
        return x.ln()
      } else {
        // downgrade to number, return Complex valued result
        return complexLogNumber(x.toNumber())
      }
    },

    'any, any': typed.referToSelf(self => (x, base) => {
      // calculate logarithm for a specified base, log(x, base)

      if (typeOf(x) === 'Fraction' && typeOf(base) === 'Fraction') {
        const result = x.log(base)

        if (result !== null) {
          return result
        }
      }

      return divideScalar(self(x), self(base))
    })
  })
})
