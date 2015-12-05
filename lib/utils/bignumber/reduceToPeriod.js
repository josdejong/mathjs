var constants = require('./constants');

/**
 * Reduce x within a period of pi (0, pi] with guard digits.
 *
 * @param {BigNumber} x
 * @param {function} BigNumber   BigNumber constructor
 * @param {number} mode          Will reduce sin if mode=1, cos if mode=0
 * @returns {Array} [Reduced x, is tau multiple?]
 */
module.exports = function reduceToPeriod(x, BigNumber, mode) {
  var pi = constants.pi(BigNumber.constructor({precision: BigNumber.precision + 2}));
  var tau = constants.tau(BigNumber);

  // TODO: the conditions in this function are too complicated, simplify this function

  if (x.abs().lte(pi.toDP(x.dp()))) {
    return [x, false];
  }

  // Catch if input is tau multiple using pi's precision
  if (x.dp() > 0 && x.div(pi.toDP(x.dp())).toNumber() % 2 == 0) {
    return [new BigNumber(mode ^ 1), true];
  }

  var y = x.mod(tau);

  // Catch if tau multiple with tau's precision
  if (x.dp() > 0 && y.toDP(x.dp(), 1).isZero()) {
    return [new BigNumber(mode ^ 1), true];
  }

  if (y.gt(pi)) {
    if (mode) {
      // sin(x + pi) = -sin(x)
      y = y.minus(pi);
      y.s = -y.s;
    } else {
      // cos(x) = cos(tau - x)
      y = tau.minus(y);
    }
  }

  y.constructor = x.constructor;
  return [y, false];
};
