module.exports = function (math) {
  var util = require('../../util/index.js'),
      string = util.string,
      number = util.number,

      isNumber = number.isNumber;

  /**
   * Format a value of any type into a string.
   *
   * Usage:
   *     math.format(value)
   *     math.format(value, precision)
   *
   * Example usage:
   *     math.format(2/7);                // '0.2857142857142857'
   *     math.format(math.pi, 3);         // '3.14'
   *     math.format(new Complex(2, 3));  // '2 + 3i'
   *
   * @param {*} value             Value to be stringified
   * @param {Number} [precision]  Precision to be used to stringify numbers.
   *                              If not provided, the value in
   *                              math.options.format.precision is used.
   * @return {String} str
   */
  math.format = function format (value, precision) {
    var num = arguments.length;
    if (num !== 1 && num !== 2) {
      throw new util.error.ArgumentsError('format', num, 1, 2);
    }

    if (precision === undefined) {
      precision = math.options.format.precision;
    }

    if (!isNumber(precision)) {
      throw new TypeError('Parameter precision must be a number');
    }

    return string.format(value, precision);
  };
};
