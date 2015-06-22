'use strict';

function factory(type, config, load, typed) {
  
  /**
   * Multiply two scalar values, `x * y`.
   * This function is meant for internal use: it is used by the public function
   * `multiply`
   *
   * This function does not support collections (Array or Matrix), and does
   * not validate the number of of inputs.
   *
   * @param  {number | BigNumber | Fraction | Complex | Unit} x   First value to multiply
   * @param  {number | BigNumber | Fraction | Complex} y          Second value to multiply
   * @return {number | BigNumber | Fraction | Complex | Unit}                      Multiplication of `x` and `y`
   * @private
   */
  var multiplyScalar = typed('multiplyScalar', {

    'number, number': function (x, y) {
      return x * y;
    },

    'Complex, Complex': function (x, y) {
      return new type.Complex(
        x.re * y.re - x.im * y.im,
        x.re * y.im + x.im * y.re
      );
    },

    'BigNumber, BigNumber': function (x, y) {
      return x.times(y);
    },

    'Fraction, Fraction': function (x, y) {
      return x.mul(y);
    },

    'number, Unit': function (x, y) {
      var res = y.clone();
      res.value = (res.value === null) ? res._normalize(x) : (res.value * x);
      return res;
    },

    'Unit, number': function (x, y) {
      var res = x.clone();
      res.value = (res.value === null) ? res._normalize(y) : (res.value * y);
      return res;
    }
  });

  return multiplyScalar;
}

exports.factory = factory;
