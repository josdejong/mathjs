/**
 * Calculate the hyperbolic tangent of x
 *
 * tanh(x) = (exp(x) + exp(-x)) / (exp(x) - exp(-x))
 *         = (exp(2x) - 1) / (exp(2x) + 1)
 *         = (e^x - 1/e^x) / (e^x + 1/e^x)
 *
 * coth(x) = (exp(x) - exp(-x)) / (exp(x) + exp(-x))
 *         = (exp(2x) + 1) / (exp(2x) - 1)
 *         = (e^x + 1/e^x) / (e^x - 1/e^x)
 *
 * @param {BigNumber} x
 * @param {function} BigNumber   BigNumber constructor
 * @param {boolean} reciprocal   is coth
 * @returns {BigNumber} hyperbolic tangent or cotangent of x
 */
module.exports = function tanhCoth(x, BigNumber, reciprocal) {
  if (x.isNaN()) {
    return new BigNumber(NaN);
  }
  if (!x.isFinite()) {
    return new BigNumber(x.s);
  }

  var precision = BigNumber.precision;
  BigNumber.config({precision: precision + 4});

  var y = new BigNumber(x);
  y.constructor = BigNumber;

  var posExp = y.exp();
  var negExp = BigNumber.ONE.div(posExp);
  var ret = posExp.minus(negExp);
  ret = (reciprocal) ? posExp.plus(negExp).div(ret) : ret.div(posExp.plus(negExp));

  BigNumber.config({precision: precision});
  return ret.toDP(precision - 1);
};
