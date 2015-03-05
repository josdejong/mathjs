'use strict';

/**
 * Test whether value is a Number
 * @param {*} value
 * @return {Boolean} isNumber
 */
exports.isNumber = function(value) {
  return (value instanceof Number) || (typeof value == 'number');
};

/**
 * Check if a number is integer
 * @param {Number | Boolean} value
 * @return {Boolean} isInteger
 */
exports.isInteger = function(value) {
  return (value == Math.round(value));
  // Note: we use ==, not ===, as we can have Booleans as well
};

/**
 * Calculate the sign of a number
 * @param {Number} x
 * @returns {*}
 */
exports.sign = function(x) {
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
 *    {Number} value   The value to be formatted
 *    {Object} options An object with formatting options. Available options:
 *                     {String} notation
 *                         Number notation. Choose from:
 *                         'fixed'          Always use regular number notation.
 *                                          For example '123.40' and '14000000'
 *                         'exponential'    Always use exponential notation.
 *                                          For example '1.234e+2' and '1.4e+7'
 *                         'auto' (default) Regular number notation for numbers
 *                                          having an absolute value between
 *                                          `lower` and `upper` bounds, and uses
 *                                          exponential notation elsewhere.
 *                                          Lower bound is included, upper bound
 *                                          is excluded.
 *                                          For example '123.4' and '1.4e7'.
 *                     {Number} precision   A number between 0 and 16 to round
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
 *                                          {Number} lower and {Number} upper,
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
 *
 * @param {Number} value
 * @param {Object | Function | Number} [options]
 * @return {String} str The formatted value
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
 * @param {Number} value
 * @param {Number} [precision]  Number of digits in formatted output.
 *                              If not provided, the maximum available digits
 *                              is used.
 * @returns {string} str
 */
exports.toExponential = function(value, precision) {
  // Note: IE7 does not allow value.toExponential(undefined)
  if (precision !== undefined) {
    return value.toExponential(Math.min(precision - 1, 20));
  }
  else {
    return value.toExponential();
  }
};

/**
 * Format a number with fixed notation.
 * @param {Number} value
 * @param {Number} [precision=0]        Optional number of decimals after the
 *                                      decimal point. Zero by default.
 */
exports.toFixed = function(value, precision) {
  var abs = Math.abs(value);
  if ((abs > 1e-20 && abs < 1e20) || abs === 0) {
    return value.toFixed(Math.min(precision, 20));
  }
  else {
    var str = exports.toPrecision(value, undefined, {
      lower: -Infinity,
      upper: Infinity
    });

    var dot = str.indexOf('.');
    var actual = (dot !== -1) ? (str.length - dot - 1) : 0;
    var required = precision != undefined ? precision : 0;

    if (required > actual) {
      // append zeros
      return str + (dot === -1 ? '.' : '') + repeat('0', required - actual);
    }
    else if (required < actual) {
      // remove decimals

      var end = dot + (required > 0 ? required + 1 : 0);

      if (parseInt(str.charAt(end)) < 5) {
        // no need to round, just remove the tail
        return str.substring(0, end);
      }
      else {
        // round up

        // move the dot temporarily to the place where we have to round
        var tempDot = str.substring(0, dot) +
            str.substring(dot + 1, end) + '.' +
            str.substring(end);

        // round to the correct number of digits
        var zeros = tempDot.match(/^0*/); // leading zeros
        var fixed = (zeros ? zeros[0] : '') + parseFloat(tempDot).toFixed();

        // restore the original dot
        if (required > 0) {
          return fixed.substring(0, dot) + '.' + fixed.substring(dot);
        }
        else {
          return fixed.substring(0, dot);
        }
      }
    }
    else {
      return str;
    }
  }
};

/**
 * Format a number with a certain precision
 * @param {Number} value
 * @param {Number} [precision=undefined] Optional number of digits.
 * @param {{lower: number, upper: number}} [options]  By default:
 *                                                    lower = 1e-3 (excl)
 *                                                    upper = 1e+5 (incl)
 * @return {string}
 */
exports.toPrecision = function(value, precision, options) {
  // determine lower and upper bound for exponential notation.
  var lower = (options && options.lower !== undefined) ? options.lower : 1e-3;
  var upper = (options && options.upper !== undefined) ? options.upper : 1e+5;

  // handle special case zero
  if (value === 0) return '0';

  // determine whether or not to output exponential notation
  var abs = Math.abs(value);
  if (abs < lower || abs >= upper) {
    // exponential notation
    return exports.toExponential(value, precision);
  }
  else {
    // normal number notation

    // split coefficient and exponent
    var str         = exports.toExponential(value, precision);
    var match       = str.match(/^(-?[\d.]+)e([+-]?\d+)$/);
    var coefficient = match[1];
    var exponent    = parseFloat(match[2]);
    var digits      = coefficient.replace('.', '');

    if (exponent === 0) {
      // return as is
      return coefficient;
    }
    else if (exponent > 0) {
      var diff = exponent + 1 - digits.length;
      if (diff >= 0) {
        // append zeros
        return digits + repeat('0', diff);
      }
      else {
        // insert the dot at the right place
        return digits.substr(0, exponent + 1) + '.' + digits.substr(exponent + 1);
      }
    }
    else { // exponent < 0
      return '0.' + repeat('0', -(exponent + 1)) + digits;
    }
  }
};

/**
 * Repeat a string
 * http://stackoverflow.com/a/5450113/1262753
 * @param {string} pattern
 * @param {number} count
 * @returns {string}
 */
function repeat(pattern, count) {
  var c = count;
  if (c < 1) return '';
  var result = '';
  while (c > 1) {
    if (c & 1) {
      result += pattern;
    }
    c >>= 1;
    pattern += pattern;
  }
  return result + pattern;
}

/**
 * Count the number of significant digits of a number.
 *
 * For example:
 *   2.34 returns 3
 *   0.0034 returns 2
 *   120.5e+30 returns 4
 *
 * @param {Number} value
 * @return {Number} digits   Number of significant digits
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
 * @param {Number} x          First value to compare
 * @param {Number} y          Second value to compare
 * @param {Number} [epsilon]  The maximum relative difference between x and y
 *                            If epsilon is undefined or null, the function will
 *                            test whether x and y are exactly equal.
 * @return {boolean} whether the two numbers are equal
*/
exports.nearlyEqual = function(x, y, epsilon) {
  // if epsilon is null or undefined, test whether x and y are exactly equal
  if (epsilon == null) return x == y;

  // use "==" operator, handles infinities
  if (x == y) return true;

  // NaN
  if (isNaN(x) || isNaN(y)) return false;

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
