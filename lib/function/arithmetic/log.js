module.exports = function (math) {
  var util = require('../../util/index'),

      BigNumber = require('bignumber.js'),
      Complex = require('../../type/Complex'),
      collection = require('../../type/collection'),

      isNumber = util.number.isNumber,
      isBoolean = util['boolean'].isBoolean,
      isComplex = Complex.isComplex,
      isCollection = collection.isCollection;

  /**
   * Calculate the logarithm of a value
   *
   *     log(x)
   *     log(x, base)
   *
   * base is optional. If not provided, the natural logarithm of x is calculated.
   * For matrices, the function is evaluated element wise.
   *
   * @param {Number | Boolean | Complex | Array | Matrix} x
   * @param {Number | Boolean | Complex} [base]
   * @return {Number | Complex | Array | Matrix} res
   */
  math.log = function log(x, base) {
    if (arguments.length == 1) {
      // calculate natural logarithm, log(x)
      if (isNumber(x)) {
        if (x >= 0) {
          return Math.log(x);
        }
        else {
          // negative value -> complex value computation
          return log(new Complex(x, 0));
        }
      }

      if (isComplex(x)) {
        return new Complex (
            Math.log(Math.sqrt(x.re * x.re + x.im * x.im)),
            Math.atan2(x.im, x.re)
        );
      }

      if (x instanceof BigNumber) {
        // TODO: implement BigNumber support
        // downgrade to Number
        return log(util.number.toNumber(x));
      }

      if (isCollection(x)) {
        return collection.deepMap(x, log);
      }

      if (isBoolean(x)) {
        return log(+x);
      }

      throw new math.error.UnsupportedTypeError('log', x);
    }
    else if (arguments.length == 2) {
      // calculate logarithm for a specified base, log(x, base)
      return math.divide(log(x), log(base));
    }
    else {
      throw new math.error.ArgumentsError('log', arguments.length, 1, 2);
    }
  };
};
