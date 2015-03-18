'use strict';

var collection = require('../../type/collection');

function factory (type, config, load, typed) {
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
  var to = typed('to', {
    'Unit, Unit | string': function (x, unit) {
      return x.to(unit);
    },

    'Array | Matrix, any': function (x, unit) {
      return collection.deepMap2(x, unit, to);
    },

    'any, Array | Matrix': function (x, unit) {
      return collection.deepMap2(x, unit, to);
    }
  });

  return to;
}

exports.type = 'function';
exports.name = 'to';
exports.factory = factory;
