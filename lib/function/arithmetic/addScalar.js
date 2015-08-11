'use strict';

function factory(type, config, load, typed) {

  /**
   * Add two Unit values.
   * @param {Unit} x   First value to add
   * @param {Unit} y   Second value to add
   * @return {Unit}    Sum of `x` and `y`
   * @private
   */
  var unitUnitAddScalar = function (x, y) {
    if (x.value == null) throw new Error('Parameter x contains a unit with undefined value');
    if (y.value == null) throw new Error('Parameter y contains a unit with undefined value');
    if (!x.equalBase(y)) throw new Error('Units do not match');

    var res = x.clone();
    res.value += y.value;
    res.fixPrefix = false;
    return res;
  };

  /**
   * Add two scalar values, `x + y`.
   * This function is meant for internal use: it is used by the public function
   * `add`
   *
   * This function does not support collections (Array or Matrix), and does
   * not validate the number of of inputs.
   *
   * @param  {number | BigNumber | Fraction | Complex | Unit} x   First value to add
   * @param  {number | BigNumber | Fraction | Complex | Unit} y   Second value to add
   * @return {number | BigNumber | Fraction | Complex | Unit}     Sum of `x` and `y`
   * @private
   */
  return typed('add', {

    'number, number': function (x, y) {
      return x + y;
    },

    'Complex, Complex': function (x, y) {
      return new type.Complex(
        x.re + y.re,
        x.im + y.im
      );
    },

    'BigNumber, BigNumber': function (x, y) {
      return x.plus(y);
    },

    'Fraction, Fraction': function (x, y) {
      return x.add(y);
    },

    'number, Unit': function (x, y) {
      if (!config['defaultUnits']) throw new TypeError('Can not add a unitless value to one with units.');
      var z = new type.Unit(x, config['defaultUnits']);
      return unitUnitAddScalar(z, y);
    },

    'Unit, number': function (x, y) {
      if (!config['defaultUnits']) throw new TypeError('Can not add a unitless value to one with units.');
      var z = new type.Unit(y, config['defaultUnits']);
      return unitUnitAddScalar(x, z);
    },

    'Unit, Unit': unitUnitAddScalar
  });
}

exports.factory = factory;
