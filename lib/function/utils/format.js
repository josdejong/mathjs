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
   * @param {String} template
   * @param {Object} values
   * @return {String} str
   */
  math.format = function format (template, values) {
    var num = arguments.length;
    if (num != 1 && num != 2) {
      throw new util.error.ArgumentsError('format', num, 1, 2);
    }

    return string.format.apply(string.format, arguments);
  };
};
