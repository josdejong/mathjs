module.exports = function (math) {
  var string = require('../../util/string');

  /**
   * Format a value of any type into a string.
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
   *    {*} value        The value to be formatted
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
   * @param {*} value             Value to be stringified
   * @param {Object | Function | Number} [options]
   * @return {String} str The formatted value
   */
  math.format = function format (value, options) {
    var num = arguments.length;
    if (num !== 1 && num !== 2) {
      throw new math.error.ArgumentsError('format', num, 1, 2);
    }

    return string.format(value, options);
  };
};
