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

    if (Array.isArray(x)) {
      return _mapArray(x, callback, x);
    } else if (x instanceof Matrix) {
      return new Matrix(_mapArray(x.valueOf(), callback, x))
    } else {
      throw new math.error.UnsupportedTypeError('map', math['typeof'](x));
    }
  };

  function _mapArray (arrayIn, callback, arrayOrig) {
    var recurse = function (value, index) {
      if (Array.isArray(value)) {
        return value.map(function (child, i) {
          // we create a copy of the index array and append the new index value
          return recurse(child, index.concat(i + 1)); // one based index, hence i + 1
        });
      }
      else {
        return callback(value, index, arrayOrig);
      }
    };

    return recurse(arrayIn, []);
  }
};
