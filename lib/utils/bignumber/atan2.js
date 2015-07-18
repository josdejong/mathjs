var constants = require('./constants');
var atanAcot = require('./atanAcot');

/**
 * Calculate the arctangent of y, x
 *
 * @param {BigNumber} y
 * @param {BigNumber} x
 * @param {function} BigNumber   BigNumber constructor
 * @returns {BigNumber} arctangent of y, x
 */
module.exports = function arctan2(y, x, BigNumber) {
  var precision = BigNumber.precision;

  if (x.isZero()) {
    if (y.isZero()) {
      return new BigNumber(NaN);
    }

    var halfPi = constants.pi(BigNumber.constructor({precision: precision + 2})).div(2).toDP(precision - 1);
    halfPi.constructor = BigNumber;
    halfPi.s = y.s;

    return halfPi;
  }

  BigNumber.config({precision: precision + 2});

  var ret = atanAcot(y.div(x), BigNumber, false);
  if (x.isNegative()) {
    var pi = constants.pi(BigNumber);
    ret = y.isNegative() ? ret.minus(pi) : ret.plus(pi);
  }

  ret.constructor = BigNumber;
  BigNumber.config({precision: precision});
  return ret.toDP(precision - 1);
};
