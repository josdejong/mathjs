'use strict';

var isBoolean = require('../../util/boolean').isBoolean;
var argsToArray = require('../../util/array').argsToArray;

/**
 * Attach a transform function to math.range
 * Adds a property transform containing the transform function.
 *
 * This transform creates a range which includes the end value
 * @param {Object} math
 */
module.exports = function (math) {
  math.range.transform = function () {
    var args = argsToArray(arguments);

    var lastIndex = args.length - 1;
    var last = args[lastIndex];
    if (!isBoolean(last)) {
      args.push(true); // append a parameter includeEnd=true
    }

    return math.range.apply(math, args);
  };
};
