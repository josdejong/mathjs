'use strict';

module.exports = function (math) {
  var util = require('../../util/index'),

      BigNumber = math.type.BigNumber,
      Complex = require('../../type/Complex'),
      collection = require('../../type/collection'),

      isNumber = util.number.isNumber,
      isBoolean = util['boolean'].isBoolean,
      isCollection = collection.isCollection,
      isComplex = Complex.isComplex;

  /**
   * Compute the argument of a complex value.
   * For a complex number `a + bi`, the argument is computed as `atan2(b, a)`.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.arg(x)
   *
   * Examples:
   *
   *    var a = math.complex(2, 2);
   *    math.arg(a) / math.pi;          // returns Number 0.25
   *
   *    var b = math.complex('2 + 3i');
   *    math.arg(b);                    // returns Number 0.982793723247329
   *    math.atan2(3, 2);               // returns Number 0.982793723247329
   *
   * See also:
   *
   *    re, im, conj, abs
   *
   * @param {Number | Complex | Array | Matrix | Boolean | null} x
   *            A complex number or array with complex numbers
   * @return {Number | Array | Matrix} The argument of x
   */
  math.arg = function arg(x) {
    if (arguments.length != 1) {
      throw new math.error.ArgumentsError('arg', arguments.length, 1);
    }

    if (isNumber(x)) {
      return Math.atan2(0, x);
    }

    if (isComplex(x)) {
      return Math.atan2(x.im, x.re);
    }

    if (isCollection(x)) {
      return collection.deepMap(x, arg);
    }

    if (isBoolean(x) || x === null) {
      return arg(+x);
    }

    if (x instanceof BigNumber) {
      // downgrade to Number
      // TODO: implement BigNumber support
      return arg(x.toNumber());
    }

    throw new math.error.UnsupportedTypeError('arg', math['typeof'](x));
  };
};
