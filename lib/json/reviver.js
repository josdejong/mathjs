'use strict';

module.exports = function (math) {

  var BigNumber = require('../type/BigNumber');
  var Complex   = math.type.Complex;
  var Help      = math.type.Help;
  var Index     = math.type.Index;
  var Matrix    = math.type.Matrix;
  var Range     = math.type.Range;
  var ResultSet = math.type.ResultSet;
  var Unit      = math.type.Unit;

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

  return reviver;
};