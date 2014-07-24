'use strict';

var BigNumber = require('decimal.js');
var Range = require('../../type/Range');
var Index = require('../../type/Index');
var isNumber = require('../../util/number').isNumber;
var isArray = Array.isArray;

/**
 * Attach a transform function to math.index
 * Adds a property __transform__ containing the transform function.
 *
 * This transform creates a one-based index instead of a zero-based index
 * @param {Object} math
 */
module.exports = function (math) {
  math.index.__transform__ = function () {
    var args = [];
    for (var i = 0, ii = arguments.length; i < ii; i++) {
      var arg = arguments[i];

      // change from one-based to zero based, and convert BigNumber to number
      if (arg instanceof Range) {
        arg.start--;
        arg.end -= (arg.step.valueOf() > 0 ? 0 : 2);
      }
      else if (isArray(arg)) {
        for (var j = 0, jj = arg.length; j < jj; j++) {
          arg[j] = (arg[j] instanceof BigNumber) ? arg[j].toNumber() : arg[j];
        }

        var step = arg.length > 2 ? arg[2] : 1;
        arg[0]--; // start
        arg[1] -= (step > 0 ? 0 : 2); // end
      }
      else if (isNumber(arg)) {
        arg--;
      }
      else if (arg instanceof BigNumber) {
        arg = arg.toNumber() - 1;
      }

      args[i] = arg;
    }

    var res = new Index();
    Index.apply(res, args);
    return res;
  };
};
