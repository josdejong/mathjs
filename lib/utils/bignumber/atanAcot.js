var constants = require('./constants');
var asinAcsc = require('./asinAcsc');
var atan = require('./atan');

/**
 * Calculate the arctangent or arccotangent of x
 *
 * @param {BigNumber} x
 * @param {function} BigNumber   BigNumber constructor
 * @param {boolean} reciprocal   is cot
 * @returns {BigNumber} arctangent or arccotangent of x
 */
module.exports = function atanAcot (x, BigNumber, reciprocal) {
  if (x.isNaN()) {
    return new BigNumber(NaN);
  }
  if ((!reciprocal && x.isZero()) || (reciprocal && !x.isFinite())) {
    return new BigNumber(0);
  }

  var precision = BigNumber.precision;
  if ((!reciprocal && !x.isFinite()) || (reciprocal && x.isZero())) {
    var halfPi = constants.pi(BigNumber.constructor({precision: precision + 2})).div(2).toDP(precision - 1);
    halfPi.constructor = BigNumber;
    halfPi.s = x.s;

    return halfPi;
  }

  BigNumber.config({precision: precision + 4});

  if (reciprocal) {
    x = BigNumber.ONE.div(x);
  }

  var absX = x.abs();
  if (absX.lte(0.875)) {
    var ret = atan(x);

    ret.constructor = BigNumber;
    BigNumber.config({precision: precision});
    return ret.toDP(BigNumber.precision - 1);
  }
  if (absX.gte(1.143)) {
    // arctan(x) = sign(x)*((PI / 2) - arctan(1 / |x|))
    var halfPi = constants.pi(BigNumber.constructor({precision: precision + 4})).div(2);
    var ret = halfPi.minus(atan(BigNumber.ONE.div(absX)));
    ret.s = x.s;

    ret.constructor = BigNumber;
    BigNumber.config({precision: precision});
    return ret.toDP(BigNumber.precision - 1);
  }

  // arctan(x) = arcsin(x / [sqrt(1 + x^2)])
  x = x.div(x.times(x).plus(1).sqrt());

  BigNumber.config({precision: precision});
  return asinAcsc(x, BigNumber);
};
