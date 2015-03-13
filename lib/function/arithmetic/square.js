'use strict';

module.exports = function (math) {
  var util = require('../../util/index'),

      BigNumber = math.type.BigNumber,
      Complex = require('../../type/Complex'),
      collection = math.collection,

      isNumber = util.number.isNumber,
      isBoolean = util['boolean'].isBoolean,
      isComplex = Complex.isComplex,
      isCollection = collection.isCollection;

  /**
   * Compute the square of a value, `x * x`.
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.square(x)
   *
   * Examples:
   *
   *    math.square(2);           // returns Number 4
   *    math.square(3);           // returns Number 9
   *    math.pow(3, 2);           // returns Number 9
   *    math.multiply(3, 3);      // returns Number 9
   *
   *    math.square([1, 2, 3, 4]);  // returns Array [1, 4, 9, 16]
   *
   * See also:
   *
   *    multiply, cube, sqrt, pow
   *
   * @param  {Number | BigNumber | Boolean | Complex | Array | Matrix | null} x
   *            Number for which to calculate the square
   * @return {Number | BigNumber | Complex | Array | Matrix}
   *            Squared value
   */
  math.square = function square(x) {
    if (arguments.length != 1) {
      throw new math.error.ArgumentsError('square', arguments.length, 1);
    }

    if (isNumber(x)) {
      return x * x;
    }

    if (isComplex(x)) {
      return math.multiply(x, x);
    }

    if (x instanceof BigNumber) {
      return x.times(x);
    }

    if (isCollection(x)) {
      // deep map collection, skip zeros since square(0) = 0
      return collection.deepMap(x, square, true);
    }

    if (isBoolean(x) || x === null) {
      return x * x;
    }

    throw new math.error.UnsupportedTypeError('square', math['typeof'](x));
  };
};
