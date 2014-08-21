'use strict';

var Matrix = require('../../type/Matrix');
var BigNumber = require('decimal.js');
var Range = require('../../type/Range');
var Index = require('../../type/Index');
var isNumber = require('../../util/number').isNumber;
var isArray = Array.isArray;

/**
 * Attach a transform function to math.map
 * Adds a property transform containing the transform function.
 *
 * This transform creates a one-based index instead of a zero-based index
 * @param {Object} math
 */
module.exports = function (math) {
  math.map.transform = function (x, callback) {
    if (arguments.length != 2) {
      throw new math.error.ArgumentsError('map', arguments.length, 2);
    }

    var asMatrix = x instanceof Matrix;
    var arrayIn = asMatrix ? x.valueOf() : x;
    if (Array.isArray(arrayIn)) {
      var index = [];

      var recurse = function (value, dim) {
        if (Array.isArray(value)) {
          return value.map(function (child, i) {
            index[dim] = i + 1; // one-based index!
            return recurse(child, dim + 1);
          });
        }
        else {
          return callback(value, index, x); // Note: pass the original matrix here
        }
      };

      var res = recurse(arrayIn, 0);
      return asMatrix ? new Matrix(res) : res;
    } else {
      throw new math.error.UnsupportedTypeError('map', math['typeof'](x));
    }
  };
};
