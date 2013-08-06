var number = require('./number.js');

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
 * @param {String | *} template   Template or value
 * @param {Object} [values]
 * @return {String} str
 */
exports.format = function format(template, values) {
  var num = arguments.length;

  if (num == 1) {
    // just format a value as string
    var value = arguments[0];
    if (number.isNumber(value)) {
      return number.format(value);
    }

    if (Array.isArray(value)) {
      return formatArray(value);
    }

    if (exports.isString(value)) {
      return '"' + value + '"';
    }

    if (value instanceof Object) {
      return value.toString();
    }

    return String(value);
  }
  else {
    if (!exports.isString(template)) {
      throw new TypeError('String expected as first parameter in function format');
    }
    if (!(values instanceof Object)) {
      throw new TypeError('Object expected as second parameter in function format');
    }

    // format values into a string
    return template.replace(/\$([\w\.]+)/g, function (original, key) {
          var keys = key.split('.');
          var value = values[keys.shift()];
          while (keys.length && value != undefined) {
            var k = keys.shift();
            value = k ? value[k] : value + '.';
          }
          return value != undefined ? value : original;
        }
    );
  }
};

/**
 * Recursively format an n-dimensional matrix
 * Example output: "[[1, 2], [3, 4]]"
 * @param {Array} array
 * @returns {String} str
 */
function formatArray (array) {
  if (Array.isArray(array)) {
    var str = '[';
    var len = array.length;
    for (var i = 0; i < len; i++) {
      if (i != 0) {
        str += ', ';
      }
      str += formatArray(array[i]);
    }
    str += ']';
    return str;
  }
  else {
    return exports.format(array);
  }
}

/**
 * Recursively format an n-dimensional array, output looks like
 * "[1, 2, 3]"
 * @param {Array} array
 * @returns {string} str
 */
/* TODO: use function formatArray2d or remove it
function formatArray2d (array) {
  var str = '[';
  var s = size(array);

  if (s.length != 2) {
    throw new RangeError('Array must be two dimensional (size: ' +
        formatArray(s) + ')');
  }

  var rows = s[0];
  var cols = s[1];
  for (var r = 0; r < rows; r++) {
    if (r != 0) {
      str += '; ';
    }

    var row = array[r];
    for (var c = 0; c < cols; c++) {
      if (c != 0) {
        str += ', ';
      }
      var cell = row[c];
      if (cell != undefined) {
        str += exports.format(cell);
      }
    }
  }
  str += ']';

  return str;
}
*/