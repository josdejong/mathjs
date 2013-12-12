module.exports = function (math) {
  var util = require('../../util/index'),

      BigNumber = require('bignumber.js'),
      Complex = require('../../type/Complex'),
      Matrix = require('../../type/Matrix'),
      Unit = require('../../type/Unit'),
      collection = require('../../type/collection'),

      isBoolean = util['boolean'].isBoolean,
      isNumber = util.number.isNumber,
      toNumber = util.number.toNumber,
      toBigNumber = util.number.toBigNumber,
      isString = util.string.isString,
      isComplex = Complex.isComplex,
      isUnit = Unit.isUnit,
      isCollection = collection.isCollection;

  /**
   * Add two values
   *
   *     x + y
   *     add(x, y)
   *
   * For matrices, the function is evaluated element wise.
   *
   * @param  {Number | BigNumber | Boolean | Complex | Unit | String | Array | Matrix} x
   * @param  {Number | BigNumber | Boolean | Complex | Unit | String | Array | Matrix} y
   * @return {Number | BigNumber | Complex | Unit | String | Array | Matrix} res
   */
  math.add = function add(x, y) {
    if (arguments.length != 2) {
      throw new math.error.ArgumentsError('add', arguments.length, 2);
    }

    if (isNumber(x)) {
      if (isNumber(y)) {
        // number + number
        return x + y;
      }
      else if (isComplex(y)) {
        // number + complex
        return new Complex(
            x + y.re,
            y.im
        )
      }
    }

    if (isComplex(x)) {
      if (isComplex(y)) {
        // complex + complex
        return new Complex(
            x.re + y.re,
            x.im + y.im
        );
      }
      else if (isNumber(y)) {
        // complex + number
        return new Complex(
            x.re + y,
            x.im
        )
      }
    }

    if (isUnit(x)) {
      if (isUnit(y)) {
        if (!x.equalBase(y)) {
          throw new Error('Units do not match');
        }

        if (x.value == null) {
          throw new Error('Unit on left hand side of operator + has an undefined value');
        }

        if (y.value == null) {
          throw new Error('Unit on right hand side of operator + has an undefined value');
        }

        var res = x.clone();
        res.value += y.value;
        res.fixPrefix = false;
        return res;
      }
    }

    if (x instanceof BigNumber) {
      // try to convert to big number
      if (isNumber(y)) {
        y = toBigNumber(y);
      }
      else if (isBoolean(y)) {
        y = new BigNumber(y ? 1 : 0);
      }

      if (y instanceof BigNumber) {
        return x.plus(y);
      }

      // downgrade to Number
      return add(toNumber(x), y);
    }
    if (y instanceof BigNumber) {
      // try to convert to big number
      if (isNumber(x)) {
        x = toBigNumber(x);
      }
      else if (isBoolean(x)) {
        x = new BigNumber(x ? 1 : 0);
      }

      if (x instanceof BigNumber) {
        return x.plus(y)
      }

      // downgrade to Number
      return add(x, toNumber(y));
    }

    if (isString(x) || isString(y)) {
      return x + y;
    }

    if (isCollection(x) || isCollection(y)) {
      return collection.deepMap2(x, y, add);
    }

    if (isBoolean(x)) {
      return add(+x, y);
    }
    if (isBoolean(y)) {
      return add(x, +y);
    }

    throw new math.error.UnsupportedTypeError('add', x, y);
  };
};
