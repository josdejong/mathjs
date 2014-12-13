'use strict';

module.exports = function (math, config) {
  var bignumber = require('./util/bignumber');
  var Complex = require('./type/Complex');
  var BigNumber = math.type.BigNumber;

  var big = config.number === 'bignumber';

  // TODO: in case of support for defineProperty, we can lazy evaluate the BigNumber constants by creating them as properties (calculation of PI is slow for example)
  math.pi          = big ? bignumber.pi(config.precision)  : Math.PI;
  math.tau         = big ? bignumber.tau(config.precision) : Math.PI * 2;
  math.e           = big ? bignumber.e(config.precision)   : Math.E;
  math.phi         = big ? bignumber.phi(config.precision) : 1.61803398874989484820458683436563811772030917980576286213545; // golden ratio, (1+sqrt(5))/2

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
