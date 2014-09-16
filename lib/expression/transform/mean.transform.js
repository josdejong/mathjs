'use strict';

var BigNumber = require('decimal.js');
var errorTransform = require('./error.transform').transform;
var isNumber = require('../../util/number').isNumber;
var isCollection = require('../../type/collection').isCollection;
var argsToArray = require('../../util/array').argsToArray;

/**
 * Attach a transform function to math.mean
 * Adds a property transform containing the transform function.
 *
 * This transform changed the last `dim` parameter of function mean
 * from one-based to zero based
 * @param {Object} math
 */
module.exports = function (math) {
  math.mean.transform = function () {
    var args = argsToArray(arguments);

    // change last argument dim from one-based to zero-based
    if (args.length == 2 && isCollection(args[0])) {
      var dim = args[1];
      if (isNumber(dim)) {
        args[1] = dim - 1;
      }
      else if (dim instanceof BigNumber) {
        args[1] = dim.minus(1);
      }
    }

    try {
      return math.mean.apply(math, args);
    }
    catch (err) {
      throw errorTransform(err);
    }
  };
};
