module.exports = function (math) {
  var util = require('../../util/index'),

      BigNumber = math.type.BigNumber,
      Complex = require('../../type/Complex'),
      Unit = require('../../type/Unit'),
      collection = require('../../type/collection'),

      isNumber = util.number.isNumber,
      isBoolean = util['boolean'].isBoolean,
      isComplex = Complex.isComplex,
      isUnit = Unit.isUnit,
      isCollection = collection.isCollection;

  /**
   * Inverse the sign of a value, apply a unary minus operation.
   *
   * For matrices, the function is evaluated element wise. Boolean values will
   * be converted to a number. For complex numbers, both real and complex
   * value are inverted.
   *
   * Syntax:
   *
   *    math.unary(x)
   *
   * Examples:
   *
   *    var math = mathjs();
   *
   *    math.unary(3.5);      // returns -3.5
   *    math.unary(-4.2);     // returns 4.2
   *
   * See also:
   *
   *    add, subtract
   *
   * @param  {Number | BigNumber | Boolean | Complex | Unit | Array | Matrix} x Number to be inverted.
   * @return {Number | BigNumber | Complex | Unit | Array | Matrix} Returns the value with inverted sign.
   */
  math.unary = function unary(x) {
    if (arguments.length != 1) {
      throw new math.error.ArgumentsError('unary', arguments.length, 1);
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
      return collection.deepMap(x, unary);
    }

    if (isBoolean(x)) {
      return -x;
    }

    throw new math.error.UnsupportedTypeError('unary', math['typeof'](x));
  };
};
