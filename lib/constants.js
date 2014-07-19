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
   * Calculate BigNumber pi
   * @returns {BigNumber} Returns pi
   */
  function bigPi() {
    // the Bailey-Borwein-Plouffe formula
    // http://stackoverflow.com/questions/4484489/using-basic-arithmetics-for-calculating-pi-with-arbitary-precision
    var p16 = new BigNumber(1);
    var k8 = new BigNumber(0);
    var pi = new BigNumber(0);

    var one = new BigNumber(1);
    var two = new BigNumber(2);
    var four = new BigNumber(4);

    for(var k = new BigNumber(0); k.lte(config.precision); k = k.plus(1)) {
      // pi += 1/p16 * (4/(8*k + 1) - 2/(8*k + 4) - 1/(8*k + 5) - 1/(8*k+6));
      // p16 *= 16;
      //
      // a little simplified (faster):
      // pi += p16 * (4/(8*k + 1) - 2/(8*k + 4) - 1/(8*k + 5) - 1/(8*k+6));
      // p16 /= 16;

      var f = four.div(k8.plus(1))
          .minus(two.div(k8.plus(4)))
          .minus(one.div(k8.plus(5)))
          .minus(one.div(k8.plus(6)));

      pi = pi.plus(p16.times(f));
      p16 = p16.div(16);
      k8 = k8.plus(8);
    }

    return pi;
  }

  /**
   * Calculate BigNumber tau, tau = 2 * pi
   * @returns {BigNumber} Returns tau
   */
  function bigTau() {
    // we calculate pi at a slightly higher precision than configured to prevent round off errors
    // when multipling by two in the end
    BigNumber.config({precision: config.precision + 2});

    var pi = bigPi();

    BigNumber.config({precision: config.precision});

    return new BigNumber(2).times(pi);
  }

  var big = config.number === 'bignumber';

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
