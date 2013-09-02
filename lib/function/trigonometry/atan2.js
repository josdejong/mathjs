module.exports = function (math) {
  var util = require('../../util/index.js'),

      Complex = require('../../type/Complex.js'),
      collection = require('../../type/collection.js'),

      isNumBool = util.number.isNumBool,
      isComplex = Complex.isComplex,
      isCollection = collection.isCollection;

  /**
   * Computes the principal value of the arc tangent of y/x in radians
   *
   *     atan2(y, x)
   *
   * For matrices, the function is evaluated element wise.
   *
   * @param {Number | Boolean | Complex | Array | Matrix} y
   * @param {Number | Boolean | Complex | Array | Matrix} x
   * @return {Number | Complex | Array | Matrix} res
   *
   * @see http://mathworld.wolfram.com/InverseTangent.html
   */
  math.atan2 = function atan2(y, x) {
    if (arguments.length != 2) {
      throw new util.error.ArgumentsError('atan2', arguments.length, 2);
    }

    if (isNumBool(y)) {
      if (isNumBool(x)) {
        return Math.atan2(y, x);
      }
      /* TODO: support for complex computation of atan2
       else if (isComplex(x)) {
       return Math.atan2(y.re, x.re);
       }
       */
    }
    else if (isComplex(y)) {
      if (isNumBool(x)) {
        return Math.atan2(y.re, x);
      }
      /* TODO: support for complex computation of atan2
       else if (isComplex(x)) {
       return Math.atan2(y.re, x.re);
       }
       */
    }

    if (isCollection(y) || isCollection(x)) {
      return collection.map2(y, x, atan2);
    }

    if (x.valueOf() !== x || y.valueOf() !== y) {
      // fallback on the objects primitive values
      return atan2(y.valueOf(), x.valueOf());
    }

    throw new util.error.UnsupportedTypeError('atan2', y, x);
  };
};
