var number = require('./number');

/**
 * Test whether value is a String
 * @param {*} value
 * @return {Boolean} isString
 */
exports.isString = function isString(value) {
  return (value instanceof String) || (typeof value == 'string');
};

/**
 * Check if a text ends with a certain string.
 * @param {String} text
 * @param {String} search
 */
exports.endsWith = function endsWith(text, search) {
  var start = text.length - search.length;
  var end = text.length;
  return (text.substring(start, end) === search);
};

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
 *                              If not provided, maximum number of digits will
 *                              be used.
 * @return {String} str
 */
exports.format = function format(value, precision) {
  if (number.isNumber(value)) {
    return number.format(value, precision);
  }

  if (Array.isArray(value)) {
    return formatArray(value, precision);
  }

  if (exports.isString(value)) {
    return '"' + value + '"';
  }

  if (value instanceof Object) {
    if (typeof value.format === 'function') {
      return value.format(precision);
    }
    else {
      return value.toString();
    }
  }

  return String(value);
};

/**
 * Recursively format an n-dimensional matrix
 * Example output: "[[1, 2], [3, 4]]"
 * @param {Array} array
 * @param {Number} [precision]
 * @returns {String} str
 */
function formatArray (array, precision) {
  if (Array.isArray(array)) {
    var str = '[';
    var len = array.length;
    for (var i = 0; i < len; i++) {
      if (i != 0) {
        str += ', ';
      }
      str += formatArray(array[i], precision);
    }
    str += ']';
    return str;
  }
  else {
    return exports.format(array, precision);
  }
}
