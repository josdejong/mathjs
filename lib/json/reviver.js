'use strict';

module.exports = function (math) {
  /**
   * Instantiate mathjs data types from their JSON representation
   * @param {string} key
   * @param {*} value
   * @returns {*} Returns the revived object
   */
  function reviver(key, value) {
    var name = value && value.mathjs;

    var constructor = math.type[name];
    if (constructor && constructor.fromJSON) {
      return constructor.fromJSON(value);
    }

    return value;
  }

  return reviver;
};