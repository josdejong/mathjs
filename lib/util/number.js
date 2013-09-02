var options = require('../options.js');

/**
 * Test whether value is a Number
 * @param {*} value
 * @return {Boolean} isNumber
 */
exports.isNumber = function isNumber(value) {
  return (value instanceof Number) || (typeof value == 'number');
};

/**
 * Test whether value is a Number or a Boolean
 * @param {*} value
 * @return {Boolean} isNumberOrBoolean
 */
exports.isNumBool = function isNumBool(value) {
  var type = typeof value;
  return (type === 'number') || (type === 'boolean') ||
      (value instanceof Number) || (value instanceof Boolean);
};

/**
 * Check if a number is integer
 * @param {Number | Boolean} value
 * @return {Boolean} isInteger
 */
exports.isInteger = function isInteger(value) {
  return (value == Math.round(value));
  // Note: we use ==, not ===, as we can have Booleans as well
};

/**
 * Convert a number to a formatted string representation.
 * @param {Number} value            The value to be formatted
 * @param {Number} [precision]      number of digits in formatted output
 * @return {String} formattedValue  The formatted value
 */
exports.format = function format(value, precision) {
  if (value === Infinity) {
    return 'Infinity';
  }
  else if (value === -Infinity) {
    return '-Infinity';
  }
  else if (isNaN(value)) {
    return 'NaN';
  }

  // TODO: what is a nice limit for non-scientific values?
  var abs = Math.abs(value);
  if ( (abs > 0.001 && abs < 100000) || abs == 0.0 ) {
    // round the value to a limited number of precision
    return exports.toPrecision(value, precision);
  }
  else {
    // scientific notation
    var exp = Math.round(Math.log(abs) / Math.LN10);
    var v = value / (Math.pow(10.0, exp));
    return exports.toPrecision(v, precision) + 'e' + exp;
  }
};

/**
 * Calculate the sign of a number
 * @param {Number} x
 * @returns {*}
 */
exports.sign = function sign (x) {
  if (x > 0) {
    return 1;
  }
  else if (x < 0) {
    return -1;
  }
  else {
    return 0;
  }
};

/**
 * Round a value to a maximum number of precision. Trailing zeros will be
 * removed.
 * @param {Number} value
 * @param {Number} [precision]  Number of digits in formatted output
 * @returns {string} str
 */
exports.toPrecision = function toPrecision (value, precision) {
  if (precision === undefined) {
    precision = options.precision;
  }

  return value.toPrecision(precision).replace(_trailingZeros, function (a, b, c) {
    return a.substring(0, a.length - (b.length ? 0 : 1) - c.length);
  });
};

/** @private */
var _trailingZeros = /\.(\d*?)(0+)$/g;
