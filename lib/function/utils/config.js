'use strict';

var object = require('../../util/object');

function factory (type, config, load, typed, math) {
  /**
   * Set configuration options for math.js, and get current options
   * @param {Object} [options] Available options:
   *                            {String} matrix
   *                              A string 'matrix' (default) or 'array'.
   *                            {String} number
   *                              A string 'number' (default) or 'bignumber'
   *                            {Number} precision
   *                              The number of significant digits for BigNumbers.
   *                              Not applicable for Numbers.
   * @return {Object} Returns the current configuration
   */
  return function _config(options) {
    if (options) {
      // merge options
      object.deepExtend(config, options);

      // TODO: BigNumber should do this by itself, should register on an onChange handler of config
      if (options.precision && type.BigNumber) {
        type.BigNumber.config({
          precision: options.precision
        });
      }

      // reload the constants (they depend on option number and precision)
      // this must be done after math.type.BigNumber.config is applied
      // TODO: this is an ugly solution, refreshing the constants like this
      require('../../constants')(math, config);
    }

    // return a clone of the settings
    return object.clone(config);
  };
}

exports.name = 'config';
exports.math = true; // request the math namespace as fifth argument
exports.factory = factory;
