// TODO: put each of the errors in a separate files

/**
 * Create a syntax error with the message:
 *     'Wrong number of arguments in function <fn> (<count> provided, <min>-<max> expected)'
 * @param {String} name   Function name
 * @param {Number} count  Actual argument count
 * @param {Number} min    Minimum required argument count
 * @param {Number} [max]  Maximum required argument count
 * @extends Error
 */
function ArgumentsError(name, count, min, max) {
  if (!(this instanceof ArgumentsError)) {
    throw new SyntaxError('Constructor must be called with the new operator');
  }

  this.message = 'Wrong number of arguments in function ' + name +
      ' (' + count + ' provided, ' +
      min + ((max != undefined) ? ('-' + max) : '') + ' expected)';

  this.stack = (new Error()).stack;
}

ArgumentsError.prototype = new Error();
ArgumentsError.prototype.constructor = Error;
ArgumentsError.prototype.name = 'ArgumentsError';

exports.ArgumentsError = ArgumentsError;

/**
 * Create a range error with the message:
 *     'Dimension mismatch (<actual size> != <expected size>)'
 * @param {number | number[]} actual        The actual size
 * @param {number | number[]} expected      The expected size
 * @param {string} [relation='!=']          Optional relation between actual
 *                                          and expected size: '!=', '<', etc.
 * @extends RangeError
 */
function DimensionError(actual, expected, relation) {
  if (!(this instanceof DimensionError)) {
    throw new SyntaxError('Constructor must be called with the new operator');
  }

  this.actual   = actual;
  this.expected = expected;
  this.relation = relation || '!=';

  this.message = 'Dimension mismatch (' +
      (Array.isArray(actual) ? ('[' + actual.join(', ') + ']') : actual) +
      ' ' + this.relation + ' ' +
      (Array.isArray(expected) ? ('[' + expected.join(', ') + ']') : expected) +
      ')';

  this.stack = (new Error()).stack;
}

DimensionError.prototype = new RangeError();
DimensionError.prototype.constructor = RangeError;
DimensionError.prototype.name = 'DimensionError';

exports.DimensionError = DimensionError;

/**
 * Create a range error with the message:
 *     'Index out of range (index < min)'
 *     'Index out of range (index < max)'
 *
 * @param {number} index     The actual index
 * @param {number} [min=0]   Minimum index (included)
 * @param {number} [max]     Maximum index (excluded)
 * @extends RangeError
 */
function IndexError(index, min, max) {
  if (!(this instanceof IndexError)) {
    throw new SyntaxError('Constructor must be called with the new operator');
  }

  this.index = index;
  if (arguments.length <= 2) {
    this.min = 0;
    this.max = min;
  }
  else {
    this.min = min;
    this.max = max;
  }

  if (this.index < this.min) {
    this.message = 'Index out of range (' + this.index + ' < ' + this.min + ')';
  }
  else if (this.index >= this.max) {
    this.message = 'Index out of range (' + this.index + ' > ' + (this.max - 1) + ')';
  }
  else {
    this.message = 'Index out of range (' + this.index + ')';
  }

  this.stack = (new Error()).stack;
}

IndexError.prototype = new RangeError();
IndexError.prototype.constructor = RangeError;
IndexError.prototype.name = 'IndexError';

exports.IndexError = IndexError;

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

exports.UnsupportedTypeError = UnsupportedTypeError;



// TODO: implement an InvalidValueError?
