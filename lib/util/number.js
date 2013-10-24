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
 *                         'scientific'     Always use scientific notation.
 *                                          For example '1.234e+2' and '1.4e+7'
 *                         'auto' (default) Regular number notation for numbers
 *                                          having an absolute value between
 *                                          `lower` and `upper` bounds, and uses
 *                                          scientific notation elsewhere.
 *                                          Lower bound is included, upper bound
 *                                          is excluded.
 *                                          For example '123.4' and '1.4e7'.
 *                     {Number} precision   A number between 0 and 16 to round
 *                                          the digits of the number.
 *                                          In case of notations 'scientific' and
 *                                          'auto', `precision` defines the total
 *                                          number of significant digits returned
 *                                          and is undefined by default.
 *                                          In case of notation 'fixed',
 *                                          `precision` defines the number of
 *                                          significant digits after the decimal
 *                                          point, and is 0 by default.
 *                     {Object} scientific  An object containing two parameters,
 *                                          {Number} lower and {Number} upper,
 *                                          used by notation 'auto' to determine
 *                                          when to return scientific notation.
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
 *    format(52.8,   {notation: 'scientific'});           // '5.28e+1'
 *
 * @param {Number} value
 * @param {Object | Function | Number} [options]
 * @return {String} str The formatted value
 */
exports.format = function format(value, options) {
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

  if (options !== undefined) {
    // determine notation from options
    if (options.notation) {
      notation = options.notation;
    }

    // determine precision from options
    if (options) {
      if (exports.isNumber(options)) {
        precision = options;
      }
      else if (options.precision) {
        precision = options.precision;
      }
    }
  }

  // handle the various notations
  switch (notation) {
    case 'fixed':
      return value.toFixed(precision);

    case 'scientific':
      return exports.toScientific(value, precision);

    case 'auto':
      // determine lower and upper bound for scientific notation.
      var lower = 1e-3;
      var upper = 1e5;
      if (options && options.scientific) {
        if (options.scientific.lower !== undefined) {
          lower = options.scientific.lower;
        }
        if (options.scientific.upper !== undefined) {
          upper = options.scientific.upper;
        }
      }

      // handle special case zero
      if (value === 0) {
        return '0';
      }

      // determine whether or not to output scientific notation
      var abs = Math.abs(value);
      var str;
      if (abs >= lower && abs < upper) {
        // normal number notation
        str = parseFloat(value.toPrecision(precision)) + '';
      }
      else {
        // scientific notation
        str = exports.toScientific(value, precision)
            .replace(/e\+/, 'e'); // remove unnecessary e+ character
      }

      // remove trailing zeros after the decimal point
      return str.replace(/((\.\d*?)(0+))($|e)/, function () {
        var digits = arguments[2];
        var e = arguments[4];
        return (digits !== '.') ? digits + e : e;
      });

    default:
      throw new Error('Unknown notation "' + notation + '". ' +
          'Choose "auto", "scientific", or "fixed".');
  }
};

/**
 * Format a number in scientific notation. Like '1.23e+5', '2.3e+0', '3.500e-3'
 * @param {Number} value
 * @param {Number} [precision]  Number of digits in formatted output.
 *                              If not provided, the maximum available digits
 *                              is used.
 * @returns {string} str
 */
exports.toScientific = function toScientific (value, precision) {
  if (precision !== undefined) {
    return value.toExponential(precision - 1);
  }
  else {
    return value.toExponential();
  }
};
