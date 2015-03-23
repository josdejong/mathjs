'use strict';

module.exports = function (math) {
  var util = require('../../util/index'),

      Unit = require('../../type/Unit'),
      collection = math.collection,

      isString = util.string.isString,
      isUnit = Unit.isUnit,
      isCollection = collection.isCollection;

  /**
   * Change the unit of a value.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.to(x, unit)
   *
   * Examples:
   *
   *    math.to(math.unit('2 inch'), 'cm');                   // returns Unit 5.08 cm
   *    math.to(math.unit('2 inch'), math.unit(null, 'cm'));  // returns Unit 5.08 cm
   *    math.to(math.unit(16, 'bytes'), 'bits');              // returns Unit 128 bits
   *
   * See also:
   *
   *    unit
   *
   * @param {Unit | Array | Matrix} x     The unit to be converted.
   * @param {Unit | Array | Matrix} unit  New unit. Can be a string like "cm"
   *                                      or a unit without value.
   * @return {Unit | Array | Matrix} value with changed, fixed unit.
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

    throw new math.error.UnsupportedTypeError('to', math['typeof'](x), math['typeof'](unit));
  };
};
