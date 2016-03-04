'use strict';

var object = require('./utils/object');
var bigConstants = require('./utils/bignumber/constants');

function factory (type, config, load, typed, math) {
  // listen for changed in the configuration, automatically reload
  // constants when needed
  math.on('config', function (curr, prev) {
    if (curr.number !== prev.number) {
      factory(type, config, load, typed, math);
    }
  });

  math['true']     = true;
  math['false']    = false;
  math['null']     = null;
  math['uninitialized'] = require('./utils/array').UNINITIALIZED;

  if (config.number === 'BigNumber') {
    math['Infinity'] = new type.BigNumber(Infinity);
    math['NaN']      = new type.BigNumber(NaN);

    object.lazy(math, 'pi',  function () {return bigConstants.pi(type.BigNumber)});
    object.lazy(math, 'tau', function () {return bigConstants.tau(type.BigNumber)});
    object.lazy(math, 'e',   function () {return bigConstants.e(type.BigNumber)});
    object.lazy(math, 'phi', function () {return bigConstants.phi(type.BigNumber)}); // golden ratio, (1+sqrt(5))/2

    // uppercase constants (for compatibility with built-in Math)
    object.lazy(math, 'E',       function () {return math.e;});
    object.lazy(math, 'LN2',     function () {return new type.BigNumber(2).ln();});
    object.lazy(math, 'LN10',    function () {return new type.BigNumber(10).ln()});
    object.lazy(math, 'LOG2E',   function () {return new type.BigNumber(1).div(new type.BigNumber(2).ln());});
    object.lazy(math, 'LOG10E',  function () {return new type.BigNumber(1).div(new type.BigNumber(10).ln())});
    object.lazy(math, 'PI',      function () {return math.pi});
    object.lazy(math, 'SQRT1_2', function () {return new type.BigNumber('0.5').sqrt()});
    object.lazy(math, 'SQRT2',   function () {return new type.BigNumber(2).sqrt()});
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
  math.i = type.Complex.I;

  // meta information
  math.version = require('./version');
}

exports.factory = factory;
exports.lazy = false;  // no lazy loading of constants, the constants themselves are lazy when needed
exports.math = true;   // request access to the math namespace