'use strict'

const deepMap = require('../../utils/collection/deepMap')

function factory (type, config, load, typed) {
  const divideScalar = load(require('./divideScalar'))
  const log = load(require('./log'))

  /**
   * Calculate the logarithm of a `value+1`.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.log1p(x)
   *    math.log1p(x, base)
   *
   * Examples:
   *
   *    math.log1p(2.5)                 // returns 1.252762968495368
   *    math.exp(math.log1p(1.4))       // returns 2.4
   *
   *    math.pow(10, 4)                 // returns 10000
   *    math.log1p(9999, 10)            // returns 4
   *    math.log1p(9999) / math.log(10) // returns 4
   *
   * See also:
   *
   *    exp, log, log2, log10
   *
   * @param {number | BigNumber | Complex | Array | Matrix} x
   *            Value for which to calculate the logarithm of `x+1`.
   * @param {number | BigNumber | Complex} [base=e]
   *            Optional base for the logarithm. If not provided, the natural
   *            logarithm of `x+1` is calculated.
   * @return {number | BigNumber | Complex | Array | Matrix}
   *            Returns the logarithm of `x+1`
   */
  const log1p = typed('log1p', {
    'number': _log1pNumber,

    'Complex': _log1pComplex,

    'BigNumber': function (x) {
      const y = x.plus(1)
      if (!y.isNegative() || config.predictable) {
        return y.ln()
      } else {
        // downgrade to number, return Complex valued result
        return _log1pComplex(new type.Complex(x.toNumber(), 0))
      }
    },

    'Array | Matrix': function (x) {
      return deepMap(x, log1p)
    },

    'any, any': function (x, base) {
      // calculate logarithm for a specified base, log1p(x, base)
      return divideScalar(log1p(x), log(base))
    }
  })

  /**
   * Calculate the natural logarithm of a `number+1`
   * @param {number} x
   * @returns {number | Complex}
   * @private
   */
  function _log1pNumber (x) {
    if (x >= -1 || config.predictable) {
      return (Math.log1p) ? Math.log1p(x) : Math.log(x + 1)
    } else {
      // negative value -> complex value computation
      return _log1pComplex(new type.Complex(x, 0))
    }
  }

  /**
   * Calculate the natural logarithm of a complex number + 1
   * @param {Complex} x
   * @returns {Complex}
   * @private
   */
  function _log1pComplex (x) {
    const xRe1p = x.re + 1
    return new type.Complex(
      Math.log(Math.sqrt(xRe1p * xRe1p + x.im * x.im)),
      Math.atan2(x.im, xRe1p)
    )
  }

  log1p.toTex = {
    1: `\\ln\\left(\${args[0]}+1\\right)`,
    2: `\\log_{\${args[1]}}\\left(\${args[0]}+1\\right)`
  }

  return log1p
}

exports.name = 'log1p'
exports.factory = factory
