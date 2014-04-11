module.exports = function (math) {
  var util = require('../../util/index'),

      BigNumber = math.type.BigNumber,
      Complex = require('../../type/Complex'),
      Matrix = require('../../type/Matrix'),
      Unit = require('../../type/Unit'),
      collection = require('../../type/collection'),

      isBoolean = util['boolean'].isBoolean,
      isNumber = util.number.isNumber,
      isComplex = Complex.isComplex,
      isUnit = Unit.isUnit,
      isCollection = collection.isCollection;

  /**
   * Subtract two values
   *
   *     x - y
   *     subtract(x, y)
   *
   * For matrices, the function is evaluated element wise.
   *
   * @param  {Number | BigNumber | Boolean | Complex | Unit | Array | Matrix} x
   * @param  {Number | BigNumber | Boolean | Complex | Unit | Array | Matrix} y
   * @return {Number | BigNumber | Complex | Unit | Array | Matrix} res
   */
  math.subtract = function subtract(x, y) {
    if (arguments.length != 2) {
      throw new math.error.ArgumentsError('subtract', arguments.length, 2);
    }

    if (isNumber(x)) {
      if (isNumber(y)) {
        // number - number
        return x - y;
      }
      else if (isComplex(y)) {
        // number - complex
        return new Complex (
            x - y.re,
            - y.im
        );
      }
    }
    else if (isComplex(x)) {
      if (isNumber(y)) {
        // complex - number
        return new Complex (
            x.re - y,
            x.im
        )
      }
      else if (isComplex(y)) {
        // complex - complex
        return new Complex (
            x.re - y.re,
            x.im - y.im
        )
      }
    }

    if (x instanceof BigNumber) {
      // try to convert to big number
      if (isNumber(y)) {
        y = BigNumber.convert(y);
      }
      else if (isBoolean(y)) {
        y = new BigNumber(y ? 1 : 0);
      }

      if (y instanceof BigNumber) {
        return x.minus(y);
      }

      // downgrade to Number
      return subtract(x.toNumber(), y);
    }
    if (y instanceof BigNumber) {
      // try to convert to big number
      if (isNumber(x)) {
        x = BigNumber.convert(x);
      }
      else if (isBoolean(x)) {
        x = new BigNumber(x ? 1 : 0);
      }

      if (x instanceof BigNumber) {
        return x.minus(y)
      }

      // downgrade to Number
      return subtract(x, y.toNumber());
    }

    if (isUnit(x)) {
      if (isUnit(y)) {
        if (x.value == null) {
          throw new Error('Parameter x contains a unit with undefined value');
        }

        if (y.value == null) {
          throw new Error('Parameter y contains a unit with undefined value');
        }

        if (!x.equalBase(y)) {
          throw new Error('Units do not match');
        }

        var res = x.clone();
        res.value -= y.value;
        res.fixPrefix = false;

        return res;
      }
    }

    if (isCollection(x) || isCollection(y)) {
      return collection.deepMap2(x, y, subtract);
    }

    if (isBoolean(x)) {
      return subtract(+x, y);
    }
    if (isBoolean(y)) {
      return subtract(x, +y);
    }

    throw new math.error.UnsupportedTypeError('subtract', math['typeof'](x), math['typeof'](y));
  };
};
