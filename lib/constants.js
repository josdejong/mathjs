module.exports = function (math) {
  var Complex = require('./type/Complex');

  math.version     = require('./version');

  math.pi          = Math.PI;
  math.e           = Math.E;
  math.tau         = Math.PI * 2;
  math.phi         = 1.61803398874989484820458683436563811772030917980576286213545; // golden ratio, (1+sqrt(5))/2
  math.i           = new Complex(0, 1);

  math['Infinity'] = Infinity;
  math['NaN']      = NaN;
  math['true']     = true;
  math['false']    = false;
  math['null']     = null;

  // uppercase constants (for compatibility with built-in Math)
  math.E           = Math.E;
  math.LN2         = Math.LN2;
  math.LN10        = Math.LN10;
  math.LOG2E       = Math.LOG2E;
  math.LOG10E      = Math.LOG10E;
  math.PI          = Math.PI;
  math.SQRT1_2     = Math.SQRT1_2;
  math.SQRT2       = Math.SQRT2;
};
