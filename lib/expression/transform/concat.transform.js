'use strict';

var BigNumber = require('decimal.js');
var errorTransform = require('./error.transform').transform;
var isNumber = require('../../util/number').isNumber;
var argsToArray = require('../../util/array').argsToArray;

/**
 * Attach a transform function to math.range
 * Adds a property transform containing the transform function.
 *
 * This transform changed the last `dim` parameter of function concat
 * from one-based to zero based
 * @param {Object} math
 */
module.exports = function (math) {
  var transform = function () {
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

    try {
      return math.concat.apply(math, args);
    }
    catch (err) {
      throw errorTransform(err);
    }
  };

  math.concat.transform = transform;

  return transform;
};
