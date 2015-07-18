var pi = require('./constants').pi;
var atanAcot = require('./atanAcot');

/**
 * Calculate the arccosine or arcsecant of x
 *
 * acos(x) = 2*atan(sqrt(1-x^2)/(1+x))
 *
 * asec(x) = acos(1/x)
 *
 * @param {BigNumber} x
 * @param {function} BigNumber   BigNumber constructor
 * @param {boolean} reciprocal   is sec
 * @returns {BigNumber} arccosine or arcsecant of x
 */
module.exports = function acosAsec(x, BigNumber, reciprocal) {
  if (reciprocal) {
    if (x.abs().lt(BigNumber.ONE)) {
      throw new Error('asec() only has non-complex values for |x| >= 1.');
    }
  } else if (x.abs().gt(BigNumber.ONE)) {
    throw new Error('acos() only has non-complex values for |x| <= 1.');
  }
  if (x.eq(-1)) {
    return pi(BigNumber);
  }

  var precision = BigNumber.precision;
  BigNumber.config({precision: precision + 4});

  if (reciprocal) {
    x = BigNumber.ONE.div(x);
  }

  var acos = atanAcot(BigNumber.ONE.minus(x.times(x)).sqrt()
      .div(x.plus(BigNumber.ONE)), BigNumber).times(2);

  BigNumber.config({precision: precision});
  return acos.toDP(precision - 1);
};
