'use strict';

var string = require('../../utils/string');

function factory (type, config, load, typed) {
  /**
   * Format a value of any type into a string.
   *
   * Syntax:
   *
   *    math.format(value)
   *    math.format(value, options)
   *    math.format(value, precision)
   *    math.format(value, fn)
   *
   * Where:
   *
   *  - `value: *`
   *    The value to be formatted
   *  - `options: Object`
   *    An object with formatting options. Available options:
   *    - `notation: string`
   *      Number notation. Choose from:
   *      - 'fixed'
   *        Always use regular number notation.
   *        For example '123.40' and '14000000'
   *      - 'exponential'
   *        Always use exponential notation.
   *        For example '1.234e+2' and '1.4e+7'
   *      - 'auto' (default)
   *        Regular number notation for numbers having an absolute value between
   *        `lower` and `upper` bounds, and uses exponential notation elsewhere.
   *        Lower bound is included, upper bound is excluded.
   *        For example '123.4' and '1.4e7'.
   *    - `precision: number`
   *      A number between 0 and 16 to round the digits of the number. In case
   *      of notations 'exponential' and 'auto', `precision` defines the total
   *      number of significant digits returned and is undefined by default.
   *      In case of notation 'fixed', `precision` defines the number of
   *      significant digits after the decimal point, and is 0 by default.
   *    - `exponential: Object`
   *      An object containing two parameters, {number} lower and {number} upper,
   *      used by notation 'auto' to determine when to return exponential
   *      notation. Default values are `lower=1e-3` and `upper=1e5`. Only
   *      applicable for notation `auto`.
   *    - `fraction: string`. Available values: 'ratio' (default) or 'decimal'.
   *      For example `format(fraction(1, 3))` will output '1/3' when 'ratio' is
   *      configured, and will output `0.(3)` when 'decimal' is configured.
   * - `fn: Function`
   *   A custom formatting function. Can be used to override the built-in notations.
   *   Function `fn` is called with `value` as parameter and must return a string.
   *   Is useful for example to format all values inside a matrix in a particular way.
   *
   * When `value` is an Object:
   *
   * - When the object contains a property `format` being a function, this function
   *   is invoked as `value.format(options)` and the result is returned.
   * - When the object has its own `toString` method, this method is invoked
   *   and the result is returned.
   * - In other cases the function will loop over all object properties and
   *   return JSON object notation like '{"a": 2, "b": 3}'.
   *
   * When value is a function:
   *
   * - When the function has a property `syntax`, it returns this
   *   syntax description.
   * - In other cases, a string `'function'` is returned.
   *
   * Examples:
   *
   *    math.format(6.4);                                        // returns '6.4'
   *    math.format(1240000);                                    // returns '1.24e6'
   *    math.format(1/3);                                        // returns '0.3333333333333333'
   *    math.format(1/3, 3);                                     // returns '0.333'
   *    math.format(21385, 2);                                   // returns '21000'
   *    math.format(12.071, {notation: 'fixed'});                // returns '12'
   *    math.format(2.3,    {notation: 'fixed', precision: 2});  // returns '2.30'
   *    math.format(52.8,   {notation: 'exponential'});          // returns '5.28e+1'
   *
   * See also:
   *
   *    print
   *
   * @param {*} value                               Value to be stringified
   * @param {Object | Function | number} [options]  Formatting options
   * @return {string} The formatted value
   */
  var format = typed('format', {
    'any': string.format,
    'any, Object | function | number': string.format
  });

  format.toTex = '\\mathrm{${name}}\\left(${args}\\right)';

  return format;
}

exports.name = 'format';
exports.factory = factory;
