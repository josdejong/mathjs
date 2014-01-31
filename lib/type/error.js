module.exports = function (math) {
  var types = require('./../util/types');

  // export the error constructors to namespace math.error.*
  var error = {};
  math.error = error;

  /**
   * Create a TypeError with message:
   *      'Function <fn> does not support a parameter of type <type>';
   * @param {String} name   Function name
   * @param {*} [value1]
   * @param {*...} [value_n]
   * @extends TypeError
   */
  // TODO: rename UnsupportedTypeError to TypeError?
  error.UnsupportedTypeError = function UnsupportedTypeError(name, value1, value_n) {
    if (arguments.length == 2) {
      var type1 = math['typeof'](value1);
      this.message = 'Function ' + name + '(' + type1 + ') not supported';
    }
    else if (arguments.length > 2) {
      var values = Array.prototype.splice.call(arguments, 1);
      var types = values.map(function (value) {
        return math['typeof'](value);
      });
      this.message = 'Function ' + name + '(' + types.join(', ') + ') not supported';
    }
    else {
      this.message = 'Unsupported type of argument in function ' + name;
    }

    this.stack = (new Error()).stack;
  };

  error.UnsupportedTypeError.prototype = new TypeError();
  error.UnsupportedTypeError.prototype.constructor = TypeError;
  error.UnsupportedTypeError.prototype.name = 'UnsupportedTypeError';

  /**
   * Create a syntax error with the message:
   *     'Wrong number of arguments in function <fn> (<count> provided, <min>-<max> expected)'
   * @param {String} name   Function name
   * @param {Number} count  Actual argument count
   * @param {Number} min    Minimum required argument count
   * @param {Number} [max]  Maximum required argument count
   * @extends SyntaxError
   */
  error.ArgumentsError = function ArgumentsError(name, count, min, max) {
    this.message = 'Wrong number of arguments in function ' + name +
        ' (' + count + ' provided, ' +
        min + ((max != undefined) ? ('-' + max) : '') + ' expected)';

    this.stack = (new Error()).stack;
  };

  error.ArgumentsError.prototype = new Error();
  error.ArgumentsError.prototype.constructor = Error;
  error.ArgumentsError.prototype.name = 'ArgumentError';

  // TODO: implement a InvalidValueError?

};