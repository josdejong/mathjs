var cosSinSecCsc = require('./cosSinSecCsc');
var sinToCos = require('./sinToCos');

/**
 * Calculate the arc sine of x using Newton's method
 *
 * f(x) = sin(x) = N  =>  f(x)  = sin(x) - N
 *                        f'(x) = cos(x)
 *
 * Thus we solve each step as follows:
 *     x_(i+1) = x_i - (sin(x_i) - N)/cos(x_i)
 *
 * @param {BigNumber} x
 * @param {function} BigNumber   BigNumber constructor
 * @returns {BigNumber} arc sine of x
 */
module.exports = function asinNewton(x, BigNumber) {
  var oldPrecision = BigNumber.precision;

  // Calibration variables, adjusted from MAPM
  var tolerance = -(oldPrecision + 4);
  var maxp = oldPrecision + 8 - x.e;
  var localPrecision = 25 - x.e;
  var maxIter = Math.max(Math.log(oldPrecision + 2) * 1.442695 | 0 + 5, 5);
  BigNumber.config({precision: localPrecision});

  var i = 0;
  var curr = new BigNumber(Math.asin(x.toNumber()) + '');
  do {
    var tmp0 = cosSinSecCsc(curr, BigNumber, 1, false);
    var tmp1 = sinToCos(tmp0);
    if (!tmp0.isZero()) {
      tmp0.s = curr.s;
    }

    var tmp2 = tmp0.minus(x).div(tmp1);
    curr = curr.minus(tmp2);

    localPrecision = Math.min(2*localPrecision, maxp);
    BigNumber.config({precision: localPrecision});
  } while ((2*tmp2.e >= tolerance) && !tmp2.isZero() && (++i <= maxIter))

  if (i == maxIter) {
    throw new Error('asin() failed to converge to the requested accuracy.' +
        'Try with a higher precision.');
  }

  BigNumber.config({precision: oldPrecision});
  return curr.toDP(oldPrecision - 1);
};
