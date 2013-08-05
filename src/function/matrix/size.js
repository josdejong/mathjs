var error = require('../../util/error.js'),
    number = require('../../util/number.js'),
    string = require('../../util/string.js'),
    array = require('../../util/array.js'),

    Complex = require('../../type/Complex.js'),
    Unit = require('../../type/Unit.js'),
    Matrix = require('../../type/Matrix.js');

/**
 * Calculate the size of a matrix or scalar
 *
 *     size(x)
 *
 * @param {Number | Complex | Array | Matrix} x
 * @return {Number | Complex | Array | Matrix} res
 */
module.exports = function size (x) {
  if (arguments.length != 1) {
    throw new error.ArgumentsError('size', arguments.length, 1);
  }

  if (number.isNumber(x) || Complex.isComplex(x) || Unit.isUnit(x) || x == null) {
    return [];
  }

  if (string.isString(x)) {
    return [x.length];
  }

  if (Array.isArray(x)) {
    return array.size(x);
  }

  if (x instanceof Matrix) {
    return new Matrix(x.size());
  }

  if (x.valueOf() !== x) {
    // fallback on the objects primitive value
    return size(x.valueOf());
  }

  throw new error.UnsupportedTypeError('size', x);
};
