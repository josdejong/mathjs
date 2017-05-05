'use strict';

var maxArgumentCount = require('../../utils/function').maxArgumentCount;

/**
 * Attach a transform function to math.map
 * Adds a property transform containing the transform function.
 *
 * This transform creates a one-based index instead of a zero-based index
 */
function factory (type, config, load, typed) {
  var matrix = load(require('../../type/matrix/function/matrix'));

  return typed('max', {
    'Array, function': function (x, callback) {
      return _map(x, callback, x);
    },

    'Matrix, function': function (x, callback) {
      return matrix(_map(x.valueOf(), callback, x));
    }
  });
}

/**
 * Map for a multi dimensional array. One-based indexes
 * @param {Array} array
 * @param {function} callback
 * @param {Array} orig
 * @return {Array}
 * @private
 */
function _map (array, callback, orig) {
  // figure out what number of arguments the callback function expects
  var args = maxArgumentCount(callback);

  function recurse(value, index) {
    if (Array.isArray(value)) {
      return value.map(function (child, i) {
        // we create a copy of the index array and append the new index value
        return recurse(child, index.concat(i + 1)); // one based index, hence i + 1
      });
    }
    else {
      // invoke the callback function with the right number of arguments
      if (args === 1) {
        return callback(value);
      }
      else if (args === 2) {
        return callback(value, index);
      }
      else { // 3 or -1
        return callback(value, index, orig);
      }
    }
  }

  return recurse(array, []);
}

exports.name = 'map';
exports.path = 'expression.transform';
exports.factory = factory;
