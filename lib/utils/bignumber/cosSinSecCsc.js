var reduceToPeriod = require('./reduceToPeriod');
var cosSin = require('./cosSin');

/**
 * Calculate the cosine/sine of x using the multiple angle identity:
 *
 * cos(4x) = 8[cos(x)^4 - cos(x)^2] + 1
 *
 * sin(5x) = 16sin(x)^5 - 20sin(x)^3 + 5sin(x)
 * http://www.tc.umn.edu/~ringx004/sidebar.html
 *
 * @param {BigNumber} x
 * @param {function} BigNumber   BigNumber constructor
 * @param {number} mode          cosine function if 0, sine function if 1
 * @param {boolean} reciprocal   is sec or csc
 * @returns {BigNumber} cosine, sine, secant, or cosecant of x
 */
module.exports = function cosSinSecCsc(x, BigNumber, mode, reciprocal) {
  if (x.isNaN() || !x.isFinite()) {
    return new BigNumber(NaN);
  }
  var precision = BigNumber.precision;

  // Avoid changing the original value
  var y = new BigNumber(x);

  // sin(-x) == -sin(x), cos(-x) == cos(x)
  var isNeg = y.isNegative();
  if (isNeg) {
    y.s = -y.s;
  }

  // Apply ~log(precision) guard bits
  var precPlusGuardDigits = precision + (Math.log(precision) | 0) + 3;
  BigNumber.config({precision: precPlusGuardDigits});

  y = reduceToPeriod(y, BigNumber.constructor({precision: precPlusGuardDigits}), mode);  // Make this destructive
  y[0].constructor = BigNumber;
  if (y[1]) {
    y = y[0];
    if (reciprocal && y.isZero()) {
      y = new BigNumber(Infinity);
    }

    BigNumber.config({precision: precision});
    return y;
  }

  var ret;
  y = y[0];
  if (mode) {
    ret = cosSin(y.div(3125), mode);
    BigNumber.config({precision: Math.min(precPlusGuardDigits, precision + 15)});

    var five = new BigNumber(5);
    var sixteen = new BigNumber(16);
    var twenty = new BigNumber(20);
    for (var i = 0; i < 5; ++i) {
      var ret2 = ret.times(ret);
      var ret3 = ret2.times(ret);
      var ret5 = ret3.times(ret2);
      ret = sixteen.times(ret5).minus(
          twenty.times(ret3)).plus(
          five.times(ret));
    }

    if (isNeg) {
      ret.s = -ret.s;
    }
  } else {
    var div_factor, loops;
    if (y.abs().lt(BigNumber.ONE)) {
      div_factor = 64;
      loops = 3;
    } else {
      div_factor = 256;
      loops = 4;
    }

    ret = cosSin(y.div(div_factor), mode);
    BigNumber.config({precision: Math.min(precPlusGuardDigits, precision + 8)});

    var eight = new BigNumber(8);
    for (; loops > 0; --loops) {
      var ret2 = ret.times(ret);
      var ret4 = ret2.times(ret2);
      ret = eight.times(ret4.minus(ret2)).plus(BigNumber.ONE);
    }
  }

  if (reciprocal) {
    ret = (ret.e <= -precision)
        ? new BigNumber(Infinity)
        : BigNumber.ONE.div(ret);
  }

  BigNumber.config({precision: precision});
  return ret.toDP(precision - 1);
};
