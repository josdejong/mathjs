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
   * Round a value towards zero.
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.fix(x)
   *
   * Examples:
   *
   *    math.fix(3.2);                // returns Number 3
   *    math.fix(3.8);                // returns Number 3
   *    math.fix(-4.2);               // returns Number -4
   *    math.fix(-4.7);               // returns Number -4
   *
   *    var c = math.complex(3.2, -2.7);
   *    math.fix(c);                  // returns Complex 3 - 2i
   *
   *    math.fix([3.2, 3.8, -4.7]);   // returns Array [3, 3, -4]
   *
   * See also:
   *
   *    ceil, floor, round
   *
   * @param {Number | BigNumber | Boolean | Complex | Array | Matrix | null} x Number to be rounded
   * @return {Number | BigNumber | Complex | Array | Matrix}            Rounded value
   */
  math.fix = function fix(x) {
    if (arguments.length != 1) {
      throw new math.error.ArgumentsError('fix', arguments.length, 1);
    }

    if (isNumber(x)) {
      return (x > 0) ? Math.floor(x) : Math.ceil(x);
    }

    if (isComplex(x)) {
      return new Complex(
          (x.re > 0) ? Math.floor(x.re) : Math.ceil(x.re),
          (x.im > 0) ? Math.floor(x.im) : Math.ceil(x.im)
      );
    }

    if (x instanceof BigNumber) {
      return x.isNegative() ? x.ceil() : x.floor();
    }

    if (isCollection(x)) {
      return collection.deepMap(x, fix);
    }

    if (isBoolean(x) || x === null) {
      return fix(+x);
    }

    throw new math.error.UnsupportedTypeError('fix', math['typeof'](x));
  };
};
