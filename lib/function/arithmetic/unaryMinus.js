'use strict';

module.exports = function (math, config) {
  var util = require('../../util/index'),

      BigNumber = math.type.BigNumber,
      Complex = require('../../type/Complex'),
      Unit = require('../../type/Unit'),
      collection = math.collection,

      isNumber = util.number.isNumber,
      isBoolean = util['boolean'].isBoolean,
      isString = util.string.isString,
      isComplex = Complex.isComplex,
      isUnit = Unit.isUnit,
      isCollection = collection.isCollection;

  /**
   * Inverse the sign of a value, apply a unary minus operation.
   *
   * For matrices, the function is evaluated element wise. Boolean values and
   * strings will be converted to a number. For complex numbers, both real and
   * complex value are inverted.
   *
   * Syntax:
   *
   *    math.unaryMinus(x)
   *
   * Examples:
   *
   *    math.unaryMinus(3.5);      // returns -3.5
   *    math.unaryMinus(-4.2);     // returns 4.2
   *
   * See also:
   *
   *    add, subtract, unaryPlus
   *
   * @param  {Number | BigNumber | Boolean | String | Complex | Unit | Array | Matrix | null} x Number to be inverted.
   * @return {Number | BigNumber | Complex | Unit | Array | Matrix} Returns the value with inverted sign.
   */
  math.unaryMinus = function unaryMinus(x) {
    if (arguments.length != 1) {
      throw new math.error.ArgumentsError('unaryMinus', arguments.length, 1);
    }

    if (isNumber(x)) {
      return -x;
    }

    if (isComplex(x)) {
      return new Complex(
          -x.re,
          -x.im
      );
    }

    if (x instanceof BigNumber) {
      return x.neg();
    }

    if (isUnit(x)) {
      var res = x.clone();
      res.value = -x.value;
      return res;
    }

    if (isCollection(x)) {
      // deep map collection, skip zeros since unaryMinus(0) = 0
      return collection.deepMap(x, unaryMinus, true);
    }

    if (isBoolean(x) || isString(x) || x === null) {
      // convert to a number or bignumber
      return (config.number == 'bignumber') ? new BigNumber(-x): -x;
    }

    throw new math.error.UnsupportedTypeError('unaryMinus', math['typeof'](x));
  };

  // TODO: function unary is renamed to unaryMinus since version 0.23.0. Cleanup some day
  math.unary = function unary() {
    throw new Error('Function unary is deprecated. Use unaryMinus instead.');
  };
};
