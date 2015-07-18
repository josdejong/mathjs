/**
 * Calculate the hyperbolic sine, cosine, secant, or cosecant of x
 *
 * cosh(x) = (exp(x) + exp(-x)) / 2
 *         = (e^x + 1/e^x) / 2
 *
 * sinh(x) = (exp(x) - exp(-x)) / 2
 *         = (e^x - 1/e^x) / 2
 *
 * sech(x) = 2 / (exp(x) + exp(-x))
 *         = 2 / (e^x + 1/e^x)
 *
 * csch(x) = 2 / (exp(x) - exp(-x))
 *         = 2 / (e^x - 1/e^x)
 *
 * @param {BigNumber} x
 * @param {function} BigNumber   BigNumber constructor
 * @param {boolean} mode         sinh function if true, cosh function if false
 * @param {boolean} reciprocal   is sech or csch
 * @returns {BigNumber} hyperbolic cosine, sine, secant. or cosecant of x
 */
module.exports = function coshSinhSschSech(x, BigNumber, mode, reciprocal) {
  if (x.isNaN()) {
    return new BigNumber(NaN);
  }
  if (!x.isFinite()) {
    if (reciprocal) {
      return new BigNumber(0);
    }
    return new BigNumber((mode) ? x : Infinity);
  }

  var precision = BigNumber.precision;
  BigNumber.config({precision: precision + 4});

  var y = new BigNumber(x);
  y.constructor = BigNumber;

  y = y.exp();
  y = (mode) ? y.minus(BigNumber.ONE.div(y)) : y.plus(BigNumber.ONE.div(y));
  y = (reciprocal) ? new BigNumber(2).div(y) : y.div(2);

  BigNumber.config({precision: precision});
  return new BigNumber(y.toPrecision(precision));
};
