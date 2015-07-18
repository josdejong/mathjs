
/**
 * Calculate the hyperbolic arctangent or arccotangent of x
 *
 * atanh(x) = ln((1 + x)/(1 - x)) / 2
 *
 * acoth(x) = atanh(1 / x)
 *
 * @param {BigNumber} x
 * @param {function} BigNumber   BigNumber constructor
 * @param {boolean} reciprocal   is sec or csc
 * @returns {BigNumber} hyperbolic arctangent or arccotangent of x
 */
module.exports = function atanhAcoth(x, BigNumber, reciprocal) {
  if (x.isNaN()) {
    return new BigNumber(NaN);
  }

  var absX = x.abs();
  if (absX.eq(BigNumber.ONE)) {
    return new BigNumber(x.isNegative() ? -Infinity : Infinity);
  }
  if (absX.gt(BigNumber.ONE)) {
    if (!reciprocal) {
      throw new Error('atanh() only has non-complex values for |x| <= 1.');
    }
  } else if (reciprocal) {
    throw new Error('acoth() has complex values for |x| < 1.');
  }

  if (x.isZero()) {
    return new BigNumber(0);
  }

  var precision = BigNumber.precision;
  BigNumber.config({precision: precision + 4});

  var y = new BigNumber(x);
  y.constructor = BigNumber;

  if (reciprocal) {
    y = BigNumber.ONE.div(y);
  }
  var ret = BigNumber.ONE.plus(y).div(BigNumber.ONE.minus(y)).ln().div(2);

  BigNumber.config({precision: precision});
  return new BigNumber(ret.toPrecision(precision));
};
