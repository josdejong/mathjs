'use strict';

module.exports = function(math) {
  var util = require('../../util/index'),

      BigNumber = math.type.BigNumber,
      Complex = require('../../type/Complex'),
      Matrix = math.type.Matrix,
      Unit = require('../../type/Unit'),
      collection = math.collection,

      isNumber = util.number.isNumber,
      isBoolean = util['boolean'].isBoolean,
      isComplex = Complex.isComplex,
      isArray = Array.isArray,
      isUnit = Unit.isUnit;

  /**
   * Multiply two values, `x * y`. The result is squeezed.
   * For matrices, the matrix product is calculated.
   *
   * Syntax:
   *
   *    math.multiply(x, y)
   *
   * Examples:
   *
   *    math.multiply(4, 5.2);        // returns Number 20.8
   *
   *    var a = math.complex(2, 3);
   *    var b = math.complex(4, 1);
   *    math.multiply(a, b);          // returns Complex 5 + 14i
   *
   *    var c = [[1, 2], [4, 3]];
   *    var d = [[1, 2, 3], [3, -4, 7]];
   *    math.multiply(c, d);          // returns Array [[7, -6, 17], [13, -4, 33]]
   *
   *    var e = math.unit('2.1 km');
   *    math.multiply(3, e);          // returns Unit 6.3 km
   *
   * See also:
   *
   *    divide
   *
   * @param  {Number | BigNumber | Boolean | Complex | Unit | Array | Matrix | null} x First value to multiply
   * @param  {Number | BigNumber | Boolean | Complex | Unit | Array | Matrix | null} y Second value to multiply
   * @return {Number | BigNumber | Complex | Unit | Array | Matrix} Multiplication of `x` and `y`
   */
  math.multiply = function multiply(x, y) {
    var res;

    if (arguments.length != 2) {
      throw new math.error.ArgumentsError('multiply', arguments.length, 2);
    }

    if (isNumber(x)) {
      if (isNumber(y)) {
        // number * number
        return x * y;
      }
      else if (isComplex(y)) {
        // number * complex
        return _multiplyComplex(new Complex(x, 0), y);
      }
      else if (isUnit(y)) {
        res = y.clone();
        res.value = (res.value === null) ? res._normalize(x) : (res.value * x);
        return res;
      }
    }

    if (isComplex(x)) {
      if (isNumber(y)) {
        // complex * number
        return _multiplyComplex(x, new Complex(y, 0));
      }
      else if (isComplex(y)) {
        // complex * complex
        return _multiplyComplex(x, y);
      }
    }

    if (x instanceof BigNumber) {
      // try to convert to big number
      if (isNumber(y)) {
        y = BigNumber.convert(y);
      }
      else if (isBoolean(y) || y === null) {
        y = new BigNumber(y ? 1 : 0);
      }

      if (y instanceof BigNumber) {
        return x.times(y);
      }

      // downgrade to Number
      return multiply(x.toNumber(), y);
    }
    if (y instanceof BigNumber) {
      // try to convert to big number
      if (isNumber(x)) {
        x = BigNumber.convert(x);
      }
      else if (isBoolean(x) || x === null) {
        x = new BigNumber(x ? 1 : 0);
      }

      if (x instanceof BigNumber) {
        return x.times(y);
      }

      // downgrade to Number
      return multiply(x, y.toNumber());
    }

    if (isUnit(x)) {
      if (isNumber(y)) {
        res = x.clone();
        res.value = (res.value === null) ? res._normalize(y) : (res.value * y);
        return res;
      }
    }

    if (isArray(x)) {
      // create dense matrix from array
      var m = math.matrix(x);
      // use optimized operations in matrix
      var r = m.multiply(y);
      // check result
      if (r instanceof Matrix) {
        // check we need to return a matrix
        if (y instanceof Matrix)
          return r;
        // output should be an array
        return r.valueOf();
      }
      // scalar
      return r;
    }

    if (x instanceof Matrix) {
      // use optimized matrix implementation
      return x.multiply(y);
    }

    if (isArray(y)) {
      // scalar * array
      return collection.deepMap2(x, y, multiply);
    }
    else if (y instanceof Matrix) {
      // adapter function
      var mf = function (v) {
        return multiply(x, v);
      };
      // scalar * matrix
      return collection.deepMap(y, mf, true);
    }

    if (isBoolean(x) || x === null) {
      return multiply(+x, y);
    }
    if (isBoolean(y) || y === null) {
      return multiply(x, +y);
    }

    throw new math.error.UnsupportedTypeError('multiply', math['typeof'](x), math['typeof'](y));
  };

  /**
   * Multiply two complex numbers. x * y or multiply(x, y)
   * @param {Complex} x
   * @param {Complex} y
   * @return {Complex | Number} res
   * @private
   */
  function _multiplyComplex (x, y) {
    // Note: we test whether x or y are pure real or pure complex,
    // to prevent unnecessary NaN values. For example, Infinity*i should
    // result in Infinity*i, and not in NaN+Infinity*i

    if (x.im == 0) {
      // x is pure real
      if (y.im == 0) {
        // y is pure real
        return new Complex(x.re * y.re, 0);
      }
      else if (y.re == 0) {
        // y is pure complex
        return new Complex(
            0,
            x.re * y.im
        );
      }
      else {
        // y has a real and complex part
        return new Complex(
            x.re * y.re,
            x.re * y.im
        );
      }
    }
    else if (x.re == 0) {
      // x is pure complex
      if (y.im == 0) {
        // y is pure real
        return new Complex(
            0,
            x.im * y.re
        );
      }
      else if (y.re == 0) {
        // y is pure complex
        return new Complex(-x.im * y.im, 0);
      }
      else {
        // y has a real and complex part
        return new Complex(
            -x.im * y.im,
            x.im * y.re
        );
      }
    }
    else {
      // x has a real and complex part
      if (y.im == 0) {
        // y is pure real
        return new Complex(
            x.re * y.re,
            x.im * y.re
        );
      }
      else if (y.re == 0) {
        // y is pure complex
        return new Complex(
            -x.im * y.im,
            x.re * y.im
        );
      }
      else {
        // y has a real and complex part
        return new Complex(
            x.re * y.re - x.im * y.im,
            x.re * y.im + x.im * y.re
        );
      }
    }
  }
};
