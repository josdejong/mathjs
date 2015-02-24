'use strict';

var BigNumber = require('../type/BigNumber');
var Complex   = require('../type/Complex');
var Help      = require('../type/Help');
var Index     = require('../type/Index');
var Matrix    = require('../type/Matrix');
var Range     = require('../type/Range');
var ResultSet = require('../type/ResultSet');
var Unit      = require('../type/Unit');

/**
 * Instantiate mathjs data types from their JSON representation
 * @param {string} key
 * @param {*} value
 * @returns {*} Returns the revived object
 */
function reviver(key, value) {
  var type = value && value.mathjs;

  switch (type) {
    case 'BigNumber': return BigNumber.fromJSON(value);
    case 'Complex':   return Complex.fromJSON(value);
    case 'Help':      return Help.fromJSON(value);
    case 'Index':     return Index.fromJSON(value);
    case 'Matrix':    return Matrix.fromJSON(value);
    case 'Range':     return Range.fromJSON(value);
    case 'ResultSet': return ResultSet.fromJSON(value);
    case 'Unit':      return Unit.fromJSON(value);
  }

  return value;
}

module.exports = reviver;
