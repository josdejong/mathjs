'use strict';

module.exports = function(math) {
  var util = require('../../util/index');

  var BigNumber = math.type.BigNumber;
  var Complex = require('../../type/Complex');
  var Matrix = require('../../type/Matrix');
  var Unit = require('../../type/Unit');

  var isNumber = util.number.isNumber;
  var isBoolean = util['boolean'].isBoolean;
  var isComplex = Complex.isComplex;
  var isUnit = Unit.isUnit;

  /**
   * Divide two scalar values, `x / y`.
   * This function is meant for internal use: it is used by the public functions
   * `divide` and `inv`.
   *
   * This function does not support collections (Array or Matrix), and does
   * not validate the number of of inputs.
   *
   * @param  {Number | BigNumber | Boolean | Complex | Unit | null} x   Numerator
   * @param  {Number | BigNumber | Boolean | Complex | null} y          Denominator
   * @return {Number | BigNumber | Complex | Unit}                      Quotient, `x / y`
   * @private
   */
  math._divide = function _divide(x, y) {
    // TODO: this is a temporary function, to be removed as soon as the library is modularized (i.e. no dependencies on math from the individual functions)
    if (isNumber(x)) {
      if (isNumber(y)) {
        // number / number
        return x / y;
      }
      else if (isComplex(y)) {
        // number / complex
        return _divideComplex(new Complex(x, 0), y);
      }
    }

    if (isComplex(x)) {
      if (isComplex(y)) {
        // complex / complex
        return _divideComplex(x, y);
      }
      else if (isNumber(y)) {
        // complex / number
        return _divideComplex(x, new Complex(y, 0));
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
        return x.div(y);
      }

      // downgrade to Number
      return _divide(x.toNumber(), y);
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
        return x.div(y)
      }

      // downgrade to Number
      return _divide(x, y.toNumber());
    }

    if (isUnit(x)) {
      if (isNumber(y)) {
        var res = x.clone();
        res.value = ((res.value === null) ? res._normalize(1) : res.value) / y;
        return res;
      }
    }

    if (isBoolean(x) || x === null) {
      return _divide(+x, y);
    }
    if (isBoolean(y) || y === null) {
      return _divide(x, +y);
    }

    throw new math.error.UnsupportedTypeError('divide', math['typeof'](x), math['typeof'](y));
  };

  /**
   * Divide two complex numbers. x / y or divide(x, y)
   * @param {Complex} x
   * @param {Complex} y
   * @return {Complex} res
   * @private
   */
  function _divideComplex (x, y) {
    var den = y.re * y.re + y.im * y.im;
    if (den != 0) {
      return new Complex(
          (x.re * y.re + x.im * y.im) / den,
          (x.im * y.re - x.re * y.im) / den
      );
    }
    else {
      // both y.re and y.im are zero
      return new Complex(
          (x.re != 0) ? (x.re / 0) : 0,
          (x.im != 0) ? (x.im / 0) : 0
      );
    }
  }
};
