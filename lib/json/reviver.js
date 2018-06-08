'use strict';

function factory (type, config, load, typed, math) {
  /**
   * Instantiate mathjs data types from their JSON representation
   * @param {string} key
   * @param {*} value
   * @returns {*} Returns the revived object
   */
  return function reviver(key, value) {
    var constructor = type[value && value.mathjs] ||
        (math.expression && math.expression.node[value && value.mathjs]);
    // TODO: instead of checking math.expression.node, expose all Node classes on math.type too

    if (constructor && typeof constructor.fromJSON === 'function') {
      return constructor.fromJSON(value);
    }

    return value;
  }
}

exports.name = 'reviver';
exports.path = 'json';
exports.factory = factory;
exports.math = true; // request the math namespace as fifth argument
