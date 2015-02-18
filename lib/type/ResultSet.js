'use strict';

/**
 * A ResultSet contains a list or results
 * @param {Array} entries
 * @constructor
 */
function ResultSet(entries) {
  if (!(this instanceof ResultSet)) {
    throw new SyntaxError('Constructor must be called with the new operator');
  }

  this.entries = entries || [];
}

/**
 * Returns the array with results hold by this ResultSet
 * @returns {Array} entries
 */
ResultSet.prototype.valueOf = function () {
  return this.entries;
};

/**
 * Returns the stringified results of the ResultSet
 * @returns {String} string
 */
ResultSet.prototype.toString = function () {
  return '[' + this.entries.join(', ') + ']';
};

/**
 * Get a JSON representation of the ResultSet
 * @returns {Object} Returns a JSON object structured as:
 *                   `{"mathjs": "ResultSet", "entries": [...]}`
 */
ResultSet.prototype.toJSON = function () {
  return {
    mathjs: 'ResultSet',
    entries: this.entries
  };
};

/**
 * Instantiate a ResultSet from a JSON object
 * @param {Object} json  A JSON object structured as:
 *                       `{"mathjs": "ResultSet", "entries": [...]}`
 * @return {ResultSet}
 */
ResultSet.fromJSON = function (json) {
  return new ResultSet(json.entries);
};

module.exports = ResultSet;
