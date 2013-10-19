module.exports = function (math) {
  var util = require('../../util/index.js'),
      string = util.string;

  /**
   * Format a value of any type into a string. Interpolate values into the string.
   * Numbers are rounded off to a maximum number of 5 digits by default.
   * Usage:
   *     math.format(value)
   *     math.format(template, object)
   *
   * Example usage:
   *     math.format(2/7);                // '0.28571'
   *     math.format(new Complex(2, 3));  // '2 + 3i'
   *     math.format('Hello $name! The date is $date', {
   *         name: 'user',
   *         date: new Date().toISOString().substring(0, 10)
   *     });                              // 'hello user! The date is 2013-03-23'
   *
   * @param {*} value             Value to be stringified
   * @param {Number} [precision]  Precision to be used to stringify numbers.
   *                              If not provided, the value in
   *                              math.options.format.precision is used.
   * @return {String} str
   */
  math.format = function format (value, precision) {
    var num = arguments.length;

    switch (num) {
      case 1:
        return string.format(value, math.options.format.precision);
      case 2:
        return string.format(value, precision);
      default:
        throw new util.error.ArgumentsError('format', num, 1, 2);
    }
  };
};
