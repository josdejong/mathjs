'use strict';

function factory (type, config, load, typed) {
  var collection = load(require('../../matrix/collection'));

  /**
   * Create a unit. Depending on the passed arguments, the function
   * will create and return a new math.type.Unit object.
   * When a matrix is provided, all elements will be converted to units.
   *
   * Syntax:
   *
   *     math.unit(unit : string)
   *     math.unit(value : number, unit : string)
   *
   * Examples:
   *
   *    var a = math.unit(5, 'cm');    // returns Unit 50 mm
   *    var b = math.unit('23 kg');    // returns Unit 23 kg
   *    a.to('m');                     // returns Unit 0.05 m
   *
   * See also:
   *
   *    bignumber, boolean, complex, index, matrix, number, string
   *
   * @param {* | Array | Matrix} args   A number and unit.
   * @return {Unit | Array | Matrix}    The created unit
   */

  var unit = typed('unit', {
    'Unit': function (x) {
      return x.clone();
    },

    'string': function (x) {
      if (type.Unit.isValuelessUnit(x)) {
        return new type.Unit(null, x); // a pure unit
      }

      var u = type.Unit.parse(x);        // a unit with value, like '5cm'
      if (u) {
        return u;
      }

      throw new SyntaxError('String "' + x + '" is no valid unit');
    },

    'number, string': function (value, unit) {
      return new type.Unit(value, unit);
    },

    'BigNumber, string': function (value, unit) {
      return new type.Unit(value.toNumber(), unit);
    },

    'Array | Matrix': function (x) {
      return collection.deepMap(x, unit);
    }
  });

  return unit;
}

exports.name = 'unit';
exports.factory = factory;
