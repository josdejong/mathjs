'use strict';

var object = require('../util/object');

function factory (type, config, load, typed, math) {
  /**
   * Set configuration options for math.js, and get current options.
   * Will emit a 'config' event, with arguments (curr, prev).
   * @param {Object} [options] Available options:
   *                            {number} epsilon
   *                              Minimum relative difference between two
   *                              compared values, used by all comparison functions.
   *                            {string} matrix
   *                              A string 'matrix' (default) or 'array'.
   *                            {string} number
   *                              A string 'number' (default) or 'bignumber'
   *                            {number} precision
   *                              The number of significant digits for BigNumbers.
   *                              Not applicable for Numbers.
   * @return {Object} Returns the current configuration
   */
  return function _config(options) {
    if (options) {
      var prev = object.clone(config);

      // merge options
      object.deepExtend(config, options);

      var curr = object.clone(config);

      // emit 'config' event
      math.emit('config', curr, prev);

      return curr;
    }
    else {
      return object.clone(config);
    }
  };
}

exports.name = 'config';
exports.math = true; // request the math namespace as fifth argument
exports.factory = factory;
