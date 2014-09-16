'use strict';

module.exports = function (math, config) {
  var util = require('../../util/index'),

      BigNumber = math.type.BigNumber,
      Complex = require('../../type/Complex'),
      Unit = require('../../type/Unit'),
      Matrix = require('../../type/Matrix'),

      array = util.array,
      isNumber = util.number.isNumber,
      isBoolean = util['boolean'].isBoolean,
      isString = util.string.isString,
      isComplex = Complex.isComplex,
      isUnit = Unit.isUnit;

  /**
   * Calculate the size of a matrix or scalar.
   *
   * Syntax:
   *
   *     math.size(x)
   *
   * Examples:
   *
   *     math.size(2.3);                  // returns []
   *     math.size('hello world');        // returns [11]
   *
   *     var A = [[1, 2, 3], [4, 5, 6]];
   *     math.size(A);                    // returns [2, 3]
   *     math.size(math.range(1,6));      // returns [5]
   *
   * See also:
   *
   *     resize, squeeze, subset
   *
   * @param {Boolean | Number | Complex | Unit | String | Array | Matrix} x  A matrix
   * @return {Array | Matrix} A vector with size of `x`.
   */
  math.size = function size (x) {
    if (arguments.length != 1) {
      throw new math.error.ArgumentsError('size', arguments.length, 1);
    }

    var asArray = (config.matrix === 'array');

    if (isNumber(x) || isComplex(x) || isUnit(x) || isBoolean(x) ||
        x == null || x instanceof BigNumber) {
      return asArray ? [] : new Matrix([]);
    }

    if (isString(x)) {
      return asArray ? [x.length] : new Matrix([x.length]);
    }

    if (Array.isArray(x)) {
      return array.size(x);
    }

    if (x instanceof Matrix) {
      return new Matrix(x.size());
    }

    throw new math.error.UnsupportedTypeError('size', math['typeof'](x));
  };
};
