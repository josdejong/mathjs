var Decimal = require('decimal.js');
var digits = require('../../utils/number').digits;

function factory (type, config, load, typed, math) {
  var BigNumber = Decimal.constructor(config);

  /**
   * Attach type information
   */
  BigNumber.prototype.type = 'BigNumber';
  BigNumber.prototype.isBigNumber = true;

  /**
   * Get a JSON representation of a BigNumber containing
   * type information
   * @returns {Object} Returns a JSON object structured as:
   *                   `{"mathjs": "BigNumber", "value": "0.2"}`
   */
  BigNumber.prototype.toJSON = function () {
    return {
      mathjs: 'BigNumber',
      value: this.toString()
    };
  };

  /**
   * Instantiate a BigNumber from a JSON object
   * @param {Object} json  a JSON object structured as:
   *                       `{"mathjs": "BigNumber", "value": "0.2"}`
   * @return {BigNumber}
   */
  BigNumber.fromJSON = function (json) {
    return new BigNumber(json.value);
  };

  var _mod_defs = {
    'truncated': 1,
    'floored': 3,
    'euclidean': 9,
  }

  var _decimalMod = BigNumber.prototype.mod;

  /**
   * Calculate the modulo of this BigNumber with another
   * @param {BigNumber} y  divisor
   * @param {string} func  modulo function to use
   * @return {BigNumber} res
   */
  BigNumber.prototype.modulo = BigNumber.prototype.mod = function (y, func) {
    // TODO: modify Decimal.js to permit overriding config by passing the mod function
    var x = this,
        Decimal = x['constructor'],
        m = Decimal['modulo'];
    Decimal['modulo'] = _mod_defs[func || 'floored'];
	var res = _decimalMod.call(x, y);
    Decimal['modulo'] = m;
    return res;
  };

  // listen for changed in the configuration, automatically apply changed precision
  math.on('config', function (curr, prev) {
    if (curr.precision !== prev.precision) {
      BigNumber.config({ precision: curr.precision });
    }
  });

  return BigNumber;
}

exports.name = 'BigNumber';
exports.path = 'type';
exports.factory = factory;
exports.math = true; // request access to the math namespace