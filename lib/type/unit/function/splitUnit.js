'use strict';

var deepMap = require('../../../utils/collection/deepMap');

function factory (type, config, load, typed) {

  /**
  * Returns an array of units whose sum is equal to this unit
  * @memberof Unit
  * @param {Array} [parts] An array of strings or valueless units.
  *
  *   Example:
  *
  *   splitUnit(new Unit(1, 'm'), ['feet', 'inch']);
  *     [ 3 feet, 3.3700787401575 inch ]
  *
  * @return {Array} An array of units.
  */

  var splitUnit = typed('splitUnit', {
    'Unit, Array': function(unit, parts) {
      return unit.splitUnit(parts);
    }
  });

  return splitUnit;

}

exports.name = 'splitUnit';
exports.factory = factory;
