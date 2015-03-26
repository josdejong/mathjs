'use strict';

var isString = require('../../util/string').isString;
var format = require('../../util/string').format;

function factory (type, config, load, typed) {
  /**
   * Interpolate values into a string template.
   *
   * Syntax:
   *
   *     math.print(template, values)
   *     math.print(template, values, precision)
   *
   * Example usage:
   *
   *     // the following outputs: 'Lucy is 5 years old'
   *     math.print('Lucy is $age years old', {age: 5});
   *
   *     // the following outputs: 'The value of pi is 3.141592654'
   *     math.print('The value of pi is $pi', {pi: math.pi}, 10);
   *
   *     // the following outputs: 'hello Mary! The date is 2013-03-23'
   *     math.print('Hello $user.name! The date is $date', {
   *       user: {
   *         name: 'Mary',
   *       },
   *       date: new Date(2013, 2, 23).toISOString().substring(0, 10)
   *     });
   *
   * See also:
   *
   *     format
   *
   * @param {String} template     A string containing variable placeholders.
   * @param {Object} values       An object containing variables which will
   *                              be filled in in the template.
   * @param {Number} [precision]  Number of digits to format numbers.
   *                              If not provided, the value will not be rounded.
   * @return {String} Interpolated string
   */
  return typed ('print', {
    'string, Object': _print,
    'string, Object, number': _print
  });
}

/**
 * Interpolate values into a string template.
 * @param {string} template
 * @param {Object} values
 * @param {number} [precision]
 * @returns {string} Interpolated string
 * @private
 */
function _print(template, values, precision) {
  return template.replace(/\$([\w\.]+)/g, function (original, key) {
        var keys = key.split('.');
        var value = values[keys.shift()];
        while (keys.length && value !== undefined) {
          var k = keys.shift();
          value = k ? value[k] : value + '.';
        }

        if (value !== undefined) {
          if (!isString(value)) {
            return format(value, precision);
          }
          else {
            return value;
          }
        }

        return original;
      }
  );
}

exports.name = 'print';
exports.factory = factory;
