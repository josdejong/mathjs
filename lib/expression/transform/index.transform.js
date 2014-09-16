'use strict';

var BigNumber = require('decimal.js');
var Range = require('../../type/Range');
var Index = require('../../type/Index');
var Matrix = require('../../type/Matrix');
var isNumber = require('../../util/number').isNumber;
var isArray = Array.isArray;

/**
 * Attach a transform function to math.index
 * Adds a property transform containing the transform function.
 *
 * This transform creates a one-based index instead of a zero-based index
 * @param {Object} math
 */
module.exports = function (math) {
  math.index.transform = function () {
    var args = [];
    for (var i = 0, ii = arguments.length; i < ii; i++) {
      var arg = arguments[i];

      // change from one-based to zero based, and convert BigNumber to number
      if (arg instanceof Range) {
        arg.start--;
        arg.end -= (arg.step > 0 ? 0 : 2);
      }
      else if (isNumber(arg)) {
        arg--;
      }
      else if (arg instanceof BigNumber) {
        arg = arg.toNumber() - 1;
      }
      else {
        throw new TypeError('Ranges must be a Number or Range');
      }

      args[i] = arg;
    }

    var res = new Index();
    Index.apply(res, args);
    return res;
  };
};
