'use strict';

var deepMap = require('../../utils/collection/deepMap');

function factory (type, config, load, typed) {
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
   *    math.sqrt(-4);                // returns Complex 2i
   *
   * See also:
   *
   *    square, multiply, cube, cbrt
   *
   * @param {number | BigNumber | Complex | Array | Matrix | Unit} x
   *            Value for which to calculate the square root.
   * @return {number | BigNumber | Complex | Array | Matrix | Unit}
   *            Returns the square root of `x`
   */
  var sqrt = typed('sqrt', {
    'number': _sqrtNumber,

    'Complex': _sqrtComplex,

    'BigNumber': function (x) {
      if (!x.isNegative() || config.predictable) {
        return x.sqrt();
      }
      else {
        // negative value -> downgrade to number to do complex value computation
        return _sqrtNumber(x.toNumber());
      }
    },

    'Array | Matrix': function (x) {
      // deep map collection, skip zeros since sqrt(0) = 0
      return deepMap(x, sqrt, true);
    },

    'Unit': function (x) {
      // Someday will work for complex units when they are implemented
      return x.pow(0.5);
    }

  });

  /**
   * Calculate sqrt for a number
   * @param {number} x
   * @returns {number | Complex} Returns the square root of x
   * @private
   */
  function _sqrtNumber(x) {
    if (x >= 0 || config.predictable) {
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

  sqrt.toTex = '\\sqrt{${args[0]}}';

  return sqrt;
}

exports.name = 'sqrt';
exports.factory = factory;
