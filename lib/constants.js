'use strict';

module.exports = function (math, config) {
  var object = require('./util/object');
  var bignumber = require('./util/bignumber');
  var Complex = require('./type/Complex');
  var BigNumber = math.type.BigNumber;

  math['true']     = true;
  math['false']    = false;
  math['null']     = null;
  math['uninitialized'] = require('./util/array').UNINITIALIZED;

  if (config.number === 'bignumber') {
    math['Infinity'] = new BigNumber(Infinity);
    math['NaN']      = new BigNumber(NaN);

    object.lazy(math, 'pi',  function () {return bignumber.pi(config.precision)});
    object.lazy(math, 'tau', function () {return bignumber.tau(config.precision)});
    object.lazy(math, 'e',   function () {return bignumber.e(config.precision)});
    object.lazy(math, 'phi', function () {return bignumber.phi(config.precision)}); // golden ratio, (1+sqrt(5))/2

    // uppercase constants (for compatibility with built-in Math)
    object.lazy(math, 'E',       function () {return math.e;});
    object.lazy(math, 'LN2',     function () {return new BigNumber(2).ln();});
    object.lazy(math, 'LN10',    function () {return new BigNumber(10).ln()});
    object.lazy(math, 'LOG2E',   function () {return new BigNumber(1).div(new BigNumber(2).ln());});
    object.lazy(math, 'LOG10E',  function () {return new BigNumber(1).div(new BigNumber(10).ln())});
    object.lazy(math, 'PI',      function () {return math.pi});
    object.lazy(math, 'SQRT1_2', function () {return new BigNumber('0.5').sqrt()});
    object.lazy(math, 'SQRT2',   function () {return new BigNumber(2).sqrt()});
  }
  else {
    math['Infinity'] = Infinity;
    math['NaN']      = NaN;

    math.pi  = Math.PI;
    math.tau = Math.PI * 2;
    math.e   = Math.E;
    math.phi = 1.61803398874989484820458683436563811772030917980576286213545; // golden ratio, (1+sqrt(5))/2

    // uppercase constants (for compatibility with built-in Math)
    math.E           = math.e;
    math.LN2         = Math.LN2;
    math.LN10        = Math.LN10;
    math.LOG2E       = Math.LOG2E;
    math.LOG10E      = Math.LOG10E;
    math.PI          = math.pi;
    math.SQRT1_2     = Math.SQRT1_2;
    math.SQRT2       = Math.SQRT2;
  }

  // complex i
  math.i = new Complex(0, 1);

  // meta information
  math.version = require('./version');
};
