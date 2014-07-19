'use strict';

var BigNumber = require('decimal.js');
var isNumber = require('../../util/number').isNumber;
var argsToArray = require('../../util/array').argsToArray;

/**
 * Attach a transform function to math.range
 * Adds a property __transform__ containing the transform function.
 *
 * This transform changed the last `dim` parameter of function concat
 * from one-based to zero based
 * @param {Object} math
 */
module.exports = function (math) {
  math.concat.__transform__ = function () {
    // copy arguments into an array
    var args = argsToArray(arguments);

    // change last argument from one-based to zero-based
    var lastIndex = args.length - 1;
    var last = args[lastIndex];
    if (isNumber(last)) {
      args[lastIndex] = last - 1;
    }
    else if (last instanceof BigNumber) {
      args[lastIndex] = last.minus(1);
    }

    // TODO: transform and catch TypeError dimension out of range
    // TODO: transform and catch DimensionError

    return math.concat.apply(math.concat, args);
  };
};
