'use strict';

module.exports = function (math) {
  var util = require('../../util/index'),

      BigNumber = math.type.BigNumber,
      Complex = require('../../type/Complex'),
      collection = require('../../type/collection'),

      isNumber = util.number.isNumber,
      isBoolean = util['boolean'].isBoolean,
      isCollection =collection.isCollection,
      isComplex = Complex.isComplex;

  /**
   * Round a value towards plus infinity
   * If `x` is complex, both real and imaginary part are rounded towards plus infinity.
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.ceil(x)
   *
   * Examples:
   *
   *    math.ceil(3.2);               // returns Number 4
   *    math.ceil(3.8);               // returns Number 4
   *    math.ceil(-4.2);              // returns Number -4
   *    math.ceil(-4.7);              // returns Number -4
   *
   *    var c = math.complex(3.2, -2.7);
   *    math.ceil(c);                 // returns Complex 4 - 2i
   *
   *    math.ceil([3.2, 3.8, -4.7]);  // returns Array [4, 4, -4]
   *
   * See also:
   *
   *    floor, fix, round
   *
   * @param  {Number | BigNumber | Boolean | Complex | Array | Matrix | null} x  Number to be rounded
   * @return {Number | BigNumber | Complex | Array | Matrix} Rounded value
   */
  math.ceil = function ceil(x) {
    if (arguments.length != 1) {
      throw new math.error.ArgumentsError('ceil', arguments.length, 1);
    }

    if (isNumber(x)) {
      return Math.ceil(x);
    }

    if (isComplex(x)) {
      return new Complex (
          Math.ceil(x.re),
          Math.ceil(x.im)
      );
    }

    if (x instanceof BigNumber) {
      return x.ceil();
    }

    if (isCollection(x)) {
      return collection.deepMap(x, ceil);
    }

    if (isBoolean(x) || x === null) {
      return Math.ceil(x);
    }

    throw new math.error.UnsupportedTypeError('ceil', math['typeof'](x));
  };
};
