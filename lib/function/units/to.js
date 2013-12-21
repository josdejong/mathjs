module.exports = function (math) {
  var util = require('../../util/index'),

      Unit = require('../../type/Unit'),
      collection = require('../../type/collection'),

      isString = util.string.isString,
      isUnit = Unit.isUnit,
      isCollection = collection.isCollection;

  /**
   * Change the unit of a value.
   *
   *     x to unit
   *     to(x, unit)
   *
   * For matrices, the function is evaluated element wise.
   *
   * @param {Unit | Array | Matrix} x
   * @param {Unit | Array | Matrix} unit
   * @return {Unit | Array | Matrix} res
   */
  math.to = function to(x, unit) {
    if (arguments.length != 2) {
      throw new math.error.ArgumentsError('to', arguments.length, 2);
    }

    if (isUnit(x)) {
      if (isUnit(unit) || isString(unit)) {
        return x.to(unit);
      }
    }

    // TODO: add support for string, in that case, convert to unit

    if (isCollection(x) || isCollection(unit)) {
      return collection.deepMap2(x, unit, to);
    }

    throw new math.error.UnsupportedTypeError('to', x, unit);
  };
};
