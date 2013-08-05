var collection = require('../../type/collection.js'),
    error = require('../../util/error.js'),
    string = require('../../util/string.js'),
    Unit = require('../../type/Unit.js');

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
module.exports = function unit_in(x, unit) {
  if (arguments.length != 2) {
    throw new error.ArgumentsError('in', arguments.length, 2);
  }

  if (Unit.isUnit(x)) {
    if (Unit.isUnit(unit) || string.isString(unit)) {
      return x['in'](unit);
    }
  }

  // TODO: add support for string, in that case, convert to unit

  if (collection.isCollection(x) || collection.isCollection(unit)) {
    return collection.map2(x, unit, unit_in);
  }

  if (x.valueOf() !== x || unit.valueOf() !== unit) {
    // fallback on the objects primitive value
    return unit_in(x.valueOf(), unit.valueOf());
  }

  throw new error.UnsupportedTypeError('in', x, unit);
};
