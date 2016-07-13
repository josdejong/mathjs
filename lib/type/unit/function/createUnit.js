'use strict';

var deepMap = require('../../../utils/collection/deepMap');

function factory (type, config, load, typed) {
  /**
   * Create a user-defined unit and register it with the Unit type.
   *
   * Syntax:
   *
   * math.createUnit(string, unit : string, [object])
   *
   * Example: 
   *
   *  math.createUnit('knot', '0.514444444 m/s', {aliases: ['knots', 'kt', 'kts]})
   *
   * @param {string} name      The name of the new unit. Must be unique. Example: 'knot'
   * @param {string, Unit} definition      Definition of the unit in terms of existing units. For example, '0.514444444 m / s'.
   * @param {Object} options   (optional) An object containing any of the following properties:
   *     prefixes {string} "none", "short", "long", "binary_short", or "binary_long". The default is "none".
   *     aliases {Array} Array of strings. Example: ['knots', 'kt', 'kts']
   *     offset {Numeric} An offset to apply when converting from the unit. For example, the offset for celsius is 273.15. Default is 0.
   *
   * @return {Unit} The new unit
   */
  var createUnit = typed('createUnit', {
    'string, Unit | string': function (name, def) {
      return type.Unit.createUnit(name, def);
    },
    'string, Unit | string, Object': function (name, def, options) {
      return type.Unit.createUnit(name, def, options);
    }
  });

  return createUnit;
}

exports.name = 'createUnit';
exports.factory = factory;
