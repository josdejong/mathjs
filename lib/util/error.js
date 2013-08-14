var types = require('./types.js');

/**
 * Create a TypeError with message:
 *      'Function <fn> does not support a parameter of type <type>';
 * @param {String} name   Function name
 * @param {*} value1
 * @param {*} [value2]
 * @extends TypeError
 */
exports.UnsupportedTypeError = function UnsupportedTypeError(name, value1, value2) {
  if (arguments.length == 2) {
    var t = types.type(value1);
    this.message = 'Function ' + name + '(' + t + ') not supported';
  }
  else if (arguments.length > 2) {
    var args = [];
    for (var i = 1; i < arguments.length; i++) {
      args.push(types.type(arguments[i]));
    }
    this.message = 'Function ' + name + '(' + args.join(', ') + ') not supported';
  }
  else {
    this.message = 'Unsupported parameter in function ' + name;
  }
};

exports.UnsupportedTypeError.prototype = new TypeError();
exports.UnsupportedTypeError.prototype.name = 'UnsupportedTypeError';

/**
 * Create a syntax error with the message:
 *     'Wrong number of arguments in function <fn> (<count> provided, <min>-<max> expected)'
 * @param {String} name   Function name
 * @param {Number} count  Actual argument count
 * @param {Number} min    Minimum required argument count
 * @param {Number} [max]  Maximum required argument count
 * @extends SyntaxError
 */
exports.ArgumentsError = function ArgumentsError(name, count, min, max) {
  this.message = 'Wrong number of arguments in function ' + name +
      ' (' + count + ' provided, ' +
      min + ((max != undefined) ? ('-' + max) : '') + ' expected)';
};

exports.ArgumentsError.prototype = new SyntaxError();
exports.ArgumentsError.prototype.name = 'ArgumentError';
