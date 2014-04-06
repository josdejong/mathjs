module.exports = function (math) {
  var types = require('./../util/types');

  // TODO: make error.js independent of the math namespace (currently uses math.typeof)

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
    if (!(this instanceof UnsupportedTypeError)) {
      throw new SyntaxError('Constructor must be called with the new operator');
    }

    switch (arguments.length) {
      case 0:
        this.message = 'Unsupported type of argument';
        break;

      case 1:
        this.message = 'Unsupported type of argument in function ' + name;
        break;

      case 2:
        var type1 = math['typeof'](value1);
        this.message = 'Function ' + name + '(' + type1 + ') not supported';
        break;

      default: // more than two arguments
        var values = Array.prototype.splice.call(arguments, 1);
        var types = values.map(function (value) {
          return math['typeof'](value);
        });
        this.message = 'Function ' + name + '(' + types.join(', ') + ') not supported';
        break;
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
   * @extends Error
   */
  error.ArgumentsError = function ArgumentsError(name, count, min, max) {
    if (!(this instanceof ArgumentsError)) {
      throw new SyntaxError('Constructor must be called with the new operator');
    }

    this.message = 'Wrong number of arguments in function ' + name +
        ' (' + count + ' provided, ' +
        min + ((max != undefined) ? ('-' + max) : '') + ' expected)';

    this.stack = (new Error()).stack;
  };

  error.ArgumentsError.prototype = new Error();
  error.ArgumentsError.prototype.constructor = Error;
  error.ArgumentsError.prototype.name = 'ArgumentsError';

  // TODO: implement a InvalidValueError?

};