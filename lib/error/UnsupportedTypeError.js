/**
 * Create a TypeError with message:
 *      'Function <fn> does not support a parameter of type <type>';
 * @param {String} name   Function name
 * @param {*} [type1]
 * @param {*...} [type_n]
 * @extends TypeError
 */
function UnsupportedTypeError(name, type1, type_n) {
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
      this.message = 'Function ' + name + '(' + type1 + ') not supported';
      break;

    default: // more than two arguments
      var types = Array.prototype.splice.call(arguments, 1);
      this.message = 'Function ' + name + '(' + types.join(', ') + ') not supported';
      break;
  }

  this.stack = (new Error()).stack;
}

UnsupportedTypeError.prototype = new TypeError();
UnsupportedTypeError.prototype.constructor = TypeError;
UnsupportedTypeError.prototype.name = 'UnsupportedTypeError';

module.exports = UnsupportedTypeError;
