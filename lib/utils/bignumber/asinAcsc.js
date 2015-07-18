var pi = require('./constants').pi;
var asin = require('./asin');
var asinNewton = require('./asinNewton');

/**
 * Calculate the arcsine or arccosecant of x
 *
 * @param {BigNumber} x
 * @param {function} BigNumber   BigNumber constructor
 * @param {boolean} reciprocal   is csc
 * @returns {BigNumber} arcsine or arccosecant of x
 */
module.exports = function asinAcsc(x, BigNumber, reciprocal) {
  if (x.isNaN()) {
    return new BigNumber(NaN);
  }

  var precision = BigNumber.precision;
  var absX = x.abs();
  if (reciprocal) {
    if (absX.lt(BigNumber.ONE)) {
      throw new Error('acsc() only has non-complex values for |x| >= 1.');
    }

    BigNumber.config({precision: precision + 2});
    x = BigNumber.ONE.div(x);
    BigNumber.config({precision: precision});

    absX = x.abs();
  } else if (absX.gt(BigNumber.ONE)) {
    throw new Error('asin() only has non-complex values for |x| <= 1.');
  }

  // Get x below 0.58
  if (absX.gt(0.8)) {
    BigNumber.config({precision: precision + 4});

    // arcsin(x) = sign(x)*(Pi/2 - arcsin(sqrt(1 - x^2)))
    var sign = x.s;
    var halfPi = pi(BigNumber.constructor({precision: precision + 4})).div(2);
    x = halfPi.minus(asinAcsc(BigNumber.ONE.minus(x.times(x)).sqrt(), BigNumber));
    x.s = sign;

    x.constructor = BigNumber;
    BigNumber.config({precision: precision});
    return x.toDP(precision - 1);
  }
  var wasReduced = absX.gt(0.58);
  if (wasReduced) {
    BigNumber.config({precision: precision + 8});

    // arcsin(x) = 2*arcsin(x / (sqrt(2)*sqrt(sqrt(1 - x^2) + 1)))
    x = x.div(new BigNumber(2).sqrt().times(BigNumber.ONE.minus(x.times(x)).sqrt()
        .plus(BigNumber.ONE).sqrt()));

    BigNumber.config({precision: precision});
  }

  // Avoid overhead of Newton's Method if feasible
  var ret = (precision <= 60 || ((x.dp() <= Math.log(precision)) && x.lt(0.05)))
      ? asin(x, precision)
      : asinNewton(x, BigNumber);

  if (wasReduced) {
    return ret.times(2);
  }
  return ret;
};
