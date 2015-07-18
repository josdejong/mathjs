var constants = require('./constants');
var cosSinSecCsc = require('./cosSinSecCsc');
var sinToCos = require('./sinToCos');
var reduceToPeriod = require('./reduceToPeriod');

/**
 * Calculate the tangent of x
 *
 * tan(x) = sin(x) / cos(x)
 *
 * cot(x) = cos(x) / sin(x)
 *
 * @param {BigNumber} x
 * @param {function} BigNumber   BigNumber constructor
 * @param {boolean} reciprocal   is cot
 * @returns {BigNumber} tangent or cotangent of x
 */
module.exports = function tanCot(x, BigNumber, reciprocal) {
  if (x.isNaN()) {
    return new BigNumber(NaN);
  }

  var precision = BigNumber.precision;
  var pi = constants.pi(BigNumber.constructor({precision: precision + 2}));
  var halfPi = pi.div(2).toDP(precision - 1);
  pi = pi.toDP(precision - 1);

  var y = reduceToPeriod(x, BigNumber, 1)[0];
  if (y.abs().eq(pi)) {
    return new BigNumber(Infinity);
  }

  BigNumber.config({precision: precision + 4});
  var sin = cosSinSecCsc(y, BigNumber, 1, false);
  var cos = sinToCos(sin);

  sin = sin.toDP(precision);
  cos = cos.toDP(precision);

  // Make sure sign for cosine is correct
  if (y.eq(x)) {
    if (y.gt(halfPi)) {
      cos.s = -cos.s;
    }
  } else if (pi.minus(y.abs()).gt(halfPi)) {
    cos.s = -cos.s;
  }

  var tan = (reciprocal) ? cos.div(sin) : sin.div(cos);

  BigNumber.config({precision: precision});
  return new BigNumber(tan.toPrecision(precision));
};
