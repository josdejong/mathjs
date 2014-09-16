'use strict';

module.exports = function (math) {
  var util = require('../../util/index'),

      BigNumber = math.type.BigNumber,
      Complex = require('../../type/Complex'),
      collection = require('../../type/collection'),

      isNumber = util.number.isNumber,
      isBoolean = util['boolean'].isBoolean,
      isComplex = Complex.isComplex,
      isCollection = collection.isCollection;

  /**
   * Compute the cube of a value, `x * x * x`.
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.cube(x)
   *
   * Examples:
   *
   *    math.cube(2);            // returns Number 8
   *    math.pow(2, 3);          // returns Number 8
   *    math.cube(4);            // returns Number 64
   *    4 * 4 * 4;               // returns Number 64
   *
   *    math.cube([1, 2, 3, 4]); // returns Array [1, 8, 27, 64]
   *
   * See also:
   *
   *    multiply, square, pow
   *
   * @param  {Number | BigNumber | Boolean | Complex | Array | Matrix | null} x  Number for which to calculate the cube
   * @return {Number | BigNumber | Complex | Array | Matrix} Cube of x
   */
  math.cube = function cube(x) {
    if (arguments.length != 1) {
      throw new math.error.ArgumentsError('cube', arguments.length, 1);
    }

    if (isNumber(x)) {
      return x * x * x;
    }

    if (isComplex(x)) {
      return math.multiply(math.multiply(x, x), x);
    }

    if (x instanceof BigNumber) {
      return x.times(x).times(x);
    }

    if (isCollection(x)) {
      return collection.deepMap(x, cube);
    }

    if (isBoolean(x) || x === null) {
      return cube(+x);
    }

    throw new math.error.UnsupportedTypeError('cube', math['typeof'](x));
  };
};
