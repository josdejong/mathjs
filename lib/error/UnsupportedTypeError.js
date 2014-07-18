'use strict';

/**
 * Create a TypeError with message:
 *      'Function <fn> does not support a parameter of type <type>';
 * @param {String} fn     Function name
 * @param {*...} [types]  The types of the function arguments
 * @extends TypeError
 */
function UnsupportedTypeError(fn, types) {
  if (!(this instanceof UnsupportedTypeError)) {
    throw new SyntaxError('Constructor must be called with the new operator');
  }

  this.fn = fn;
  this.types = Array.prototype.splice.call(arguments, 1);

  if (!fn) {
    this.message = 'Unsupported type of argument';
  }
  else {
    if (this.types.length == 0) {
      this.message = 'Unsupported type of argument in function ' + fn;
    }
    else {
      this.message = 'Function ' + fn + '(' + this.types.join(', ') + ') not supported';
    }
  }

  this.stack = (new Error()).stack;
}

UnsupportedTypeError.prototype = new TypeError();
UnsupportedTypeError.prototype.constructor = TypeError;
UnsupportedTypeError.prototype.name = 'UnsupportedTypeError';

module.exports = UnsupportedTypeError;
