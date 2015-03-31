'use strict';

function factory (type, config, load, typed) {
  var collection = load(require('../../type/collection'));

  /**
   * Calculate the square root of a value.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.sqrt(x)
   *
   * Examples:
   *
   *    math.sqrt(25);                // returns 5
   *    math.square(5);               // returns 25
   *    math.sqrt(-4);                // returns Complex -2i
   *
   * See also:
   *
   *    square, multiply
   *
   * @param {Number | BigNumber | Boolean | Complex | Array | Matrix | null} x
   *            Value for which to calculate the square root.
   * @return {Number | BigNumber | Complex | Array | Matrix}
   *            Returns the square root of `x`
   */
  var sqrt = typed('sqrt', {
    'number': _sqrtNumber,

    'Complex': _sqrtComplex,

    'BigNumber': function (x) {
      if (x.isNegative()) {
        // negative value -> downgrade to number to do complex value computation
        return _sqrtNumber(x.toNumber());
      }
      else {
        return x.sqrt();
      }
    },

    'Array | Matrix': function (x) {
      // deep map collection, skip zeros since sqrt(0) = 0
      return collection.deepMap(x, sqrt, true);
    }
  });

  /**
   * Calculate sqrt for a number
   * @param {Number} x
   * @returns {Number | Complex} Returns the square root of x
   * @private
   */
  function _sqrtNumber(x) {
    if (x >= 0) {
      return Math.sqrt(x);
    }
    else {
      return _sqrtComplex(new type.Complex(x, 0));
    }
  }

  /**
   * Calculate sqrt for a complex number
   * @param {Complex} x
   * @returns {Complex} Returns the square root of x
   * @private
   */
  function _sqrtComplex(x) {
    var r = Math.sqrt(x.re * x.re + x.im * x.im);

    var re, im;

    if (x.re >= 0) {
      re = 0.5 * Math.sqrt(2.0 * (r + x.re));
    }
    else {
      re = Math.abs(x.im) / Math.sqrt(2 * (r - x.re));
    }

    if (x.re <= 0) {
      im = 0.5 * Math.sqrt(2.0 * (r - x.re));
    }
    else {
      im = Math.abs(x.im) / Math.sqrt(2 * (r + x.re));
    }

    if (x.im >= 0) {
      return new type.Complex(re, im);
    }
    else {
      return new type.Complex(re, -im);
    }
  }

  return sqrt;
}

exports.name = 'sqrt';
exports.factory = factory;
