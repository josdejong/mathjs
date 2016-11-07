'use strict';

var NumberFormatter = require('./NumberFormatter');

/**
 * Test whether value is a number
 * @param {*} value
 * @return {boolean} isNumber
 */
exports.isNumber = function(value) {
  return typeof value === 'number';
};

/**
 * Check if a number is integer
 * @param {number | boolean} value
 * @return {boolean} isInteger
 */
exports.isInteger = function(value) {
  return isFinite(value)
      ? (value == Math.round(value))
      : false;
  // Note: we use ==, not ===, as we can have Booleans as well
};

/**
 * Calculate the sign of a number
 * @param {number} x
 * @returns {*}
 */
exports.sign = Math.sign || function(x) {
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
 *
 * Syntax:
 *
 *    format(value)
 *    format(value, options)
 *    format(value, precision)
 *    format(value, fn)
 *
 * Where:
 *
 *    {number} value   The value to be formatted
 *    {Object} options An object with formatting options. Available options:
 *                     {string} notation
 *                         Number notation. Choose from:
 *                         'fixed'          Always use regular number notation.
 *                                          For example '123.40' and '14000000'
 *                         'exponential'    Always use exponential notation.
 *                                          For example '1.234e+2' and '1.4e+7'
 *                         'engineering'    Always use engineering notation.
 *                                          For example '123.4e+0' and '14.0e+6'
 *                         'auto' (default) Regular number notation for numbers
 *                                          having an absolute value between
 *                                          `lower` and `upper` bounds, and uses
 *                                          exponential notation elsewhere.
 *                                          Lower bound is included, upper bound
 *                                          is excluded.
 *                                          For example '123.4' and '1.4e7'.
 *                     {number} precision   A number between 0 and 16 to round
 *                                          the digits of the number.
 *                                          In case of notations 'exponential' and
 *                                          'auto', `precision` defines the total
 *                                          number of significant digits returned
 *                                          and is undefined by default.
 *                                          In case of notation 'fixed',
 *                                          `precision` defines the number of
 *                                          significant digits after the decimal
 *                                          point, and is 0 by default.
 *                     {Object} exponential An object containing two parameters,
 *                                          {number} lower and {number} upper,
 *                                          used by notation 'auto' to determine
 *                                          when to return exponential notation.
 *                                          Default values are `lower=1e-3` and
 *                                          `upper=1e5`.
 *                                          Only applicable for notation `auto`.
 *    {Function} fn    A custom formatting function. Can be used to override the
 *                     built-in notations. Function `fn` is called with `value` as
 *                     parameter and must return a string. Is useful for example to
 *                     format all values inside a matrix in a particular way.
 *
 * Examples:
 *
 *    format(6.4);                                        // '6.4'
 *    format(1240000);                                    // '1.24e6'
 *    format(1/3);                                        // '0.3333333333333333'
 *    format(1/3, 3);                                     // '0.333'
 *    format(21385, 2);                                   // '21000'
 *    format(12.071, {notation: 'fixed'});                // '12'
 *    format(2.3,    {notation: 'fixed', precision: 2});  // '2.30'
 *    format(52.8,   {notation: 'exponential'});          // '5.28e+1'
 *    format(12345678, {notation: 'engineering'});        // '12.345678e+6'
 *
 * @param {number} value
 * @param {Object | Function | number} [options]
 * @return {string} str The formatted value
 */
exports.format = function(value, options) {
  if (typeof options === 'function') {
    // handle format(value, fn)
    return options(value);
  }

  // handle special cases
  if (value === Infinity) {
    return 'Infinity';
  }
  else if (value === -Infinity) {
    return '-Infinity';
  }
  else if (isNaN(value)) {
    return 'NaN';
  }

  // default values for options
  var notation = 'auto';
  var precision = undefined;

  if (options) {
    // determine notation from options
    if (options.notation) {
      notation = options.notation;
    }

    // determine precision from options
    if (exports.isNumber(options)) {
      precision = options;
    }
    else if (options.precision) {
      precision = options.precision;
    }
  }

  // handle the various notations
  switch (notation) {
    case 'fixed':
      return exports.toFixed(value, precision);

    case 'exponential':
      return exports.toExponential(value, precision);

    case 'engineering':
      return exports.toEngineering(value, precision);

    case 'auto':
      return exports
          .toPrecision(value, precision, options && options.exponential)

          // remove trailing zeros after the decimal point
          .replace(/((\.\d*?)(0+))($|e)/, function () {
            var digits = arguments[2];
            var e = arguments[4];
            return (digits !== '.') ? digits + e : e;
          });

    default:
      throw new Error('Unknown notation "' + notation + '". ' +
          'Choose "auto", "exponential", or "fixed".');
  }
};

/**
 * Format a number in exponential notation. Like '1.23e+5', '2.3e+0', '3.500e-3'
 * @param {number} value
 * @param {number} [precision]  Number of digits in formatted output.
 *                              If not provided, the maximum available digits
 *                              is used.
 * @returns {string} str
 */
exports.toExponential = function(value, precision) {
  return new NumberFormatter(value).toExponential(precision);
};

/**
 * Format a number in engineering notation. Like '1.23e+6', '2.3e+0', '3.500e-3'
 * @param {number} value
 * @param {number} [precision]  Number of digits in formatted output.
 *                              If not provided, the maximum available digits
 *                              is used.
 * @returns {string} str
 */
exports.toEngineering = function(value, precision) {
  return new NumberFormatter(value).toEngineering(precision);
};

/**
 * Format a number with fixed notation.
 * @param {number} value
 * @param {number} [precision=0]        Optional number of decimals after the
 *                                      decimal point. Zero by default.
 */
exports.toFixed = function(value, precision) {
  return new NumberFormatter(value).toFixed(precision);
};

/**
 * Format a number with a certain precision
 * @param {number} value
 * @param {number} [precision=undefined] Optional number of digits.
 * @param {{lower: number, upper: number}} [options]  By default:
 *                                                    lower = 1e-3 (excl)
 *                                                    upper = 1e+5 (incl)
 * @return {string}
 */
exports.toPrecision = function(value, precision, options) {
  return new NumberFormatter(value).toPrecision(precision, options);
};

/**
 * Count the number of significant digits of a number.
 *
 * For example:
 *   2.34 returns 3
 *   0.0034 returns 2
 *   120.5e+30 returns 4
 *
 * @param {number} value
 * @return {number} digits   Number of significant digits
 */
exports.digits = function(value) {
  return value
      .toExponential()
      .replace(/e.*$/, '')          // remove exponential notation
      .replace( /^0\.?0*|\./, '')   // remove decimal point and leading zeros
      .length
};

/**
 * Minimum number added to one that makes the result different than one
 */
exports.DBL_EPSILON = Number.EPSILON || 2.2204460492503130808472633361816E-16;

/**
 * Compares two floating point numbers.
 * @param {number} x          First value to compare
 * @param {number} y          Second value to compare
 * @param {number} [epsilon]  The maximum relative difference between x and y
 *                            If epsilon is undefined or null, the function will
 *                            test whether x and y are exactly equal.
 * @return {boolean} whether the two numbers are nearly equal
*/
exports.nearlyEqual = function(x, y, epsilon) {
  // if epsilon is null or undefined, test whether x and y are exactly equal
  if (epsilon == null) {
    return x == y;
  }

  // use "==" operator, handles infinities
  if (x == y) {
    return true;
  }

  // NaN
  if (isNaN(x) || isNaN(y)) {
    return false;
  }

  // at this point x and y should be finite
  if(isFinite(x) && isFinite(y)) {
    // check numbers are very close, needed when comparing numbers near zero
    var diff = Math.abs(x - y);
    if (diff < exports.DBL_EPSILON) {
      return true;
    }
    else {
      // use relative error
      return diff <= Math.max(Math.abs(x), Math.abs(y)) * epsilon;
    }
  }

  // Infinite and Number or negative Infinite and positive Infinite cases
  return false;
};
