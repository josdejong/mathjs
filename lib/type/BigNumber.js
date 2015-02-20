var BigNumber = require('decimal.js');

// FIXME: replace all require('decimal.js') with require('./BigNumber').

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

module.exports = BigNumber;
