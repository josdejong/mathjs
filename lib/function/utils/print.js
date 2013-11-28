module.exports = function (math) {
  var string = require('../../util/string'),

      isString = string.isString;

  /**
   * Interpolate values into a string template.
   *     math.print(template, values)
   *     math.print(template, values, precision)
   *
   * Example usage:
   *
   *     // the following outputs: 'The value of pi is 3.141592654'
   *     math.format('The value of pi is $pi', {pi: math.pi}, 10);
   *
   *     // the following outputs: 'hello Mary! The date is 2013-03-23'
   *     math.format('Hello $user.name! The date is $date', {
   *       user: {
   *         name: 'Mary',
   *       },
   *       date: new Date().toISOString().substring(0, 10)
   *     });
   *
   * @param {String} template
   * @param {Object} values
   * @param {Number} [precision]  Number of digits to format numbers.
   *                              If not provided, the value will not be rounded.
   * @return {String} str
   */
  math.print = function print (template, values, precision) {
    var num = arguments.length;
    if (num != 2 && num != 3) {
      throw new math.error.ArgumentsError('print', num, 2, 3);
    }

    if (!isString(template)) {
      throw new TypeError('String expected as first parameter in function format');
    }
    if (!(values instanceof Object)) {
      throw new TypeError('Object expected as second parameter in function format');
    }

    // format values into a string
    return template.replace(/\$([\w\.]+)/g, function (original, key) {
          var keys = key.split('.');
          var value = values[keys.shift()];
          while (keys.length && value !== undefined) {
            var k = keys.shift();
            value = k ? value[k] : value + '.';
          }

          if (value !== undefined) {
            if (!isString(value)) {
              return math.format(value, precision);
            }
            else {
              return value;
            }
          }

          return original;
        }
    );
  };
};
