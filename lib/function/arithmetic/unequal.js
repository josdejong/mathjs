module.exports = function (math) {
  var util = require('../../util/index.js'),

      Complex = require('../../type/Complex.js'),
      Unit = require('../../type/Unit.js'),
      collection = require('../../type/collection.js'),

      isNumBool = util.number.isNumBool,
      isString = util.string.isString,
      isComplex = Complex.isComplex,
      isUnit = Unit.isUnit,
      isCollection = collection.isCollection;

  /**
   * Check if value x unequals y, x != y
   * In case of complex numbers, x.re must unequal y.re, or x.im must unequal y.im
   * @param  {Number | Boolean | Complex | Unit | String | Array | Matrix} x
   * @param  {Number | Boolean | Complex | Unit | String | Array | Matrix} y
   * @return {Boolean | Array | Matrix} res
   */
  math.unequal = function unequal(x, y) {
    if (arguments.length != 2) {
      throw new util.error.ArgumentsError('unequal', arguments.length, 2);
    }

    if (isNumBool(x)) {
      if (isNumBool(y)) {
        return x != y;
      }
      else if (isComplex(y)) {
        return (x != y.re) || (y.im != 0);
      }
    }

    if (isComplex(x)) {
      if (isNumBool(y)) {
        return (x.re != y) || (x.im != 0);
      }
      else if (isComplex(y)) {
        return (x.re != y.re) || (x.im != y.im);
      }
    }

    if ((isUnit(x)) && (isUnit(y))) {
      if (!x.equalBase(y)) {
        throw new Error('Cannot compare units with different base');
      }
      return x.value != y.value;
    }

    if (isString(x) || isString(y)) {
      return x != y;
    }

    if (isCollection(x) || isCollection(y)) {
      return collection.map2(x, y, unequal);
    }

    if (x.valueOf() !== x || y.valueOf() !== y) {
      // fallback on the objects primitive values
      return unequal(x.valueOf(), y.valueOf());
    }

    throw new util.error.UnsupportedTypeError('unequal', x, y);
  };
};
