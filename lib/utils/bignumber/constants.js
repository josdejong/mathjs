var memoize = require('../function').memoize;
var atan = require('./atan');

/**
 * Calculate BigNumber e
 * @param {function} BigNumber   BigNumber constructor
 * @returns {BigNumber} Returns e
 */
exports.e = memoize(function (BigNumber) {
  return new BigNumber(1).exp();
}, hasher);

/**
 * Calculate BigNumber golden ratio, phi = (1+sqrt(5))/2
 * @param {function} BigNumber   BigNumber constructor
 * @returns {BigNumber} Returns phi
 */
exports.phi = memoize(function (BigNumber) {
  return new BigNumber(1).plus(new BigNumber(5).sqrt()).div(2);
}, hasher);

/**
 * Calculate BigNumber pi.
 *
 * Uses Machin's formula: pi / 4 = 4 * arctan(1 / 5) - arctan(1 / 239)
 * http://milan.milanovic.org/math/english/pi/machin.html
 * @param {function} BigNumber   BigNumber constructor
 * @returns {BigNumber} Returns pi
 */
exports.pi = memoize(function (BigNumber) {
  // we calculate pi with a few decimal places extra to prevent round off issues
  var Big = BigNumber.constructor({precision: BigNumber.precision + 4});
  var pi4th = new Big(4).times(atan(new Big(1).div(5)))
      .minus(atan(new Big(1).div(239)));

  // the final pi has the requested number of decimals
  return new BigNumber(4).times(pi4th);
}, hasher);

/**
 * Calculate BigNumber tau, tau = 2 * pi
 * @param {function} BigNumber   BigNumber constructor
 * @returns {BigNumber} Returns tau
 */
exports.tau = memoize(function (BigNumber) {
  // we calculate pi at a slightly higher precision than configured to prevent round off errors
  // when multiplying by two in the end

  var pi = exports.pi(BigNumber.constructor({precision: BigNumber.precision + 2}));

  return new BigNumber(2).times(pi);
}, hasher);

/**
 * Create a hash for a BigNumber constructor function. The created has is
 * the configured precision
 * @param {Array} args         Supposed to contain a single entry with
 *                             a BigNumber constructor
 * @return {number} precision
 * @private
 */
function hasher (args) {
  return args[0].precision;
}
