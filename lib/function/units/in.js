module.exports = function (math) {
  var util = require('../../util/index.js'),

      Unit = require('../../type/Unit.js'),
      collection = require('../../type/collection.js'),

      isString = util.string.isString,
      isUnit = Unit.isUnit,
      isCollection = collection.isCollection;

  /**
   * Change the unit of a value.
   *
   *     x in unit
   *     in(x, unit)
   *
   * For matrices, the function is evaluated element wise.
   *
   * @param {Unit | Array | Matrix} x
   * @param {Unit | Array | Matrix} unit
   * @return {Unit | Array | Matrix} res
   */
  math['in'] = function unit_in(x, unit) {
    if (arguments.length != 2) {
      throw new util.error.ArgumentsError('in', arguments.length, 2);
    }

    if (isUnit(x)) {
      if (isUnit(unit) || isString(unit)) {
        return x['in'](unit);
      }
    }

    // TODO: add support for string, in that case, convert to unit

    if (isCollection(x) || isCollection(unit)) {
      return collection.map2(x, unit, unit_in);
    }

    if (x.valueOf() !== x || unit.valueOf() !== unit) {
      // fallback on the objects primitive value
      return unit_in(x.valueOf(), unit.valueOf());
    }

    throw new util.error.UnsupportedTypeError('in', x, unit);
  };
};
