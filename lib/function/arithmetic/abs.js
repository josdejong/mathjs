'use strict';

module.exports = function (math) {
  var util = require('../../util/index'),

      BigNumber = math.type.BigNumber,
      Complex = require('../../type/Complex'),
      Matrix = require('../../type/Matrix'),
      collection = require('../../type/collection'),

      isNumber = util.number.isNumber,
      isBoolean = util['boolean'].isBoolean,
      isComplex = Complex.isComplex,
      isCollection = collection.isCollection;

  /**
   * Calculate the absolute value of a number. For matrices, the function is
   * evaluated element wise.
   *
   * Syntax:
   *
   *    math.abs(x)
   *
   * Examples:
   *
   *    math.abs(3.5);                // returns Number 3.5
   *    math.abs(-4.2);               // returns Number 4.2
   *
   *    math.abs([3, -5, -1, 0, 2]);  // returns Array [3, 5, 1, 0, 2]
   *
   * See also:
   *
   *    sign
   *
   * @param  {Number | BigNumber | Boolean | Complex | Array | Matrix | null} x
   *            A number or matrix for which to get the absolute value
   * @return {Number | BigNumber | Complex | Array | Matrix}
   *            Absolute value of `x`
   */
  math.abs = function abs(x) {
    if (arguments.length != 1) {
      throw new math.error.ArgumentsError('abs', arguments.length, 1);
    }

    if (isNumber(x)) {
      return Math.abs(x);
    }

    if (isComplex(x)) {
      return Math.sqrt(x.re * x.re + x.im * x.im);
    }

    if (x instanceof BigNumber) {
      return x.abs();
    }

    if (isCollection(x)) {
      return collection.deepMap(x, abs);
    }

    if (isBoolean(x) || x === null) {
      return Math.abs(x);
    }

    throw new math.error.UnsupportedTypeError('abs', math['typeof'](x));
  };
};
