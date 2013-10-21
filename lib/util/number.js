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
 * Convert a number to a formatted string representation.
 * @param {Number} value            The value to be formatted
 * @param {Number} [precision]      Number of digits in formatted output
 *                                  If not provided, the maximum available digits
 *                                  is used.
 * @return {String} formattedValue  The formatted value
 */
exports.format = function format(value, precision) {
  if (value === 0) {
    return '0';
  }
  if (value === Infinity) {
    return 'Infinity';
  }
  else if (value === -Infinity) {
    return '-Infinity';
  }
  else if (isNaN(value)) {
    return 'NaN';
  }

  var abs = Math.abs(value);
  if (abs > 1e-3 && abs < 1e5) {
    // normal number notation
    return exports.toPrecision(value, precision);
  }
  else {
    // scientific notation
    var exp = Math.floor(Math.log(abs) / Math.LN10);
    var v = value / (Math.pow(10, exp));
    return exports.toPrecision(v, precision) + 'e' + exp;
  }
};

/**
 * Round a value to a maximum number of digits. Trailing zeros will be
 * removed.
 * @param {Number} value
 * @param {Number} [precision]  Number of digits in formatted output.
 *                              If not provided, the maximum available digits
 *                              is used.
 * @returns {string} str
 */
exports.toPrecision = function toPrecision (value, precision) {
  var str = parseFloat(value.toPrecision(precision)) + '';

  return str.replace(_trailingZeros, function (a, b, c) {
    return a.substring(0, a.length - (b.length ? 0 : 1) - c.length);
  });
};

/**
 * regexp which tests true in cases like '2340.000', '1.0', '123.400'
 * @private
 */
var _trailingZeros = /\.(\d*?)(0+)$/;
