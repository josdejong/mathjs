var Complex = require('./type/Complex.js');

/**
 * mathjs constants
 */
exports.pi          = Math.PI;
exports.e           = Math.E;
exports.tau         = Math.PI * 2;
exports.i           = new Complex(0, 1);

exports['Infinity'] = Infinity;
exports['NaN']      = NaN;
exports['true']     = true;
exports['false']    = false;

// uppercase constants (for compatibility with built-in Math)
exports.E           = Math.E;
exports.LN2         = Math.LN2;
exports.LN10        = Math.LN10;
exports.LOG2E       = Math.LOG2E;
exports.LOG10E      = Math.LOG10E;
exports.PI          = Math.PI;
exports.SQRT1_2     = Math.SQRT1_2;
exports.SQRT2       = Math.SQRT2;
