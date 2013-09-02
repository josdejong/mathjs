module.exports = function (math) {
  var util = require('../../util/index.js'),

      Complex = require('../../type/Complex.js'),
      collection = require('../../type/collection.js'),

      isNumBool = util.number.isNumBool,
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
      if (isNumBool(x)) {
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

      if (isCollection(x)) {
        return collection.map(x, log);
      }

      if (x.valueOf() !== x) {
        // fallback on the objects primitive values
        return log(x.valueOf());
      }

      throw new util.error.UnsupportedTypeError('log', x);
    }
    else if (arguments.length == 2) {
      // calculate logarithm for a specified base, log(x, base)
      return math.divide(log(x), log(base));
    }
    else {
      throw new util.error.ArgumentsError('log', arguments.length, 1, 2);
    }
  };
};
