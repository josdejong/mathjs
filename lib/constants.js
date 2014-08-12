'use strict';

module.exports = function (math, config) {
  var bignumber = require('./util/bignumber');
  var Complex = require('./type/Complex');
  var BigNumber = math.type.BigNumber;

  /**
   * Calculate BigNumber e
   * @returns {BigNumber} Returns e
   */
  function bigE() {
    return new BigNumber(1).exp();
  }

  /**
   * Calculate BigNumber golden ratio, phi = (1+sqrt(5))/2
   * @returns {BigNumber} Returns phi
   */
  function bigPhi() {
    return new BigNumber(1).plus(new BigNumber(5).sqrt()).div(2);
  }

  /**
   * arctan(x) = x - x^3/3 + x^5/5 - x^7/7 + x^9/9 - ...
   *           = x - x^2*x^1/3 + x^2*x^3/5 - x^2*x^5/7 + x^2*x^7/9 - ...
   * @param {BigNumber} x
   * @returns {BigNumber} arc tangent of x
   */
  function arctan(x) {
    var y = x;
    var yPrev = NaN;
    var x2 = x.times(x);
    var num = x;
    var sign = -1;

    for (var k = 3; !y.equals(yPrev); k += 2) {
      num = num.times(x2);

      yPrev = y;
      y = (sign > 0) ? y.plus(num.div(k)) : y.minus(num.div(k));
      sign = -sign;
    }

    return y;
  }

  /**
   * Calculate BigNumber pi.
   *
   * Uses Machin's formula: pi / 4 = 4 * arctan(1 / 5) - arctan(1 / 239)
   * http://milan.milanovic.org/math/english/pi/machin.html
   * @returns {BigNumber} Returns pi
   */
  function bigPi() {
    // we calculate pi with a few decimal places extra to prevent round off issues
    var Big = BigNumber.constructor({precision: BigNumber.precision + 4});
    var pi4th = new Big(4).times(arctan(new Big(1).div(5)))
        .minus(arctan(new Big(1).div(239)));

    // the final pi has the requested number of decimals
    return new BigNumber(4).times(pi4th);
  }

  /**
   * Calculate BigNumber tau, tau = 2 * pi
   * @returns {BigNumber} Returns tau
   */
  function bigTau() {
    // we calculate pi at a slightly higher precision than configured to prevent round off errors
    // when multiplying by two in the end
    BigNumber.config({precision: config.precision + 2});

    var pi = bigPi();

    BigNumber.config({precision: config.precision});

    return new BigNumber(2).times(pi);
  }

  var big = config.number === 'bignumber';

  // TODO: in case of support for defineProperty, we can lazy evaluate the BigNumber constants by creating them as properties (calculation of PI is slow for example)
  math.pi          = big ? bigPi()  : Math.PI;
  math.tau         = big ? bigTau() : Math.PI * 2;
  math.e           = big ? bigE()   : Math.E;
  math.phi         = big ? bigPhi() : 1.61803398874989484820458683436563811772030917980576286213545; // golden ratio, (1+sqrt(5))/2

  math.i           = new Complex(0, 1);

  math['Infinity'] = Infinity;
  math['NaN']      = NaN;
  math['true']     = true;
  math['false']    = false;
  math['null']     = null;
  math['uninitialized'] = require('./util/array').UNINITIALIZED;

  // uppercase constants (for compatibility with built-in Math)
  math.E           = math.e;
  math.LN2         = big ? new BigNumber(2).ln()                        : Math.LN2;
  math.LN10        = big ? new BigNumber(10).ln()                       : Math.LN10;
  math.LOG2E       = big ? new BigNumber(1).div(new BigNumber(2).ln())  : Math.LOG2E;
  math.LOG10E      = big ? new BigNumber(1).div(new BigNumber(10).ln()) : Math.LOG10E;
  math.PI          = math.pi;
  math.SQRT1_2     = big ? new BigNumber(0.5).sqrt()                    : Math.SQRT1_2;
  math.SQRT2       = big ? new BigNumber(2).sqrt()                      : Math.SQRT2;

  // meta information
  math.version = require('./version');
};
