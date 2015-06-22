'use strict';

/**
 * Attach a transform function to math.map
 * Adds a property transform containing the transform function.
 *
 * This transform creates a one-based index instead of a zero-based index
 */
function factory (type, config, load, typed) {
  var map = load(require('../../function/utils/map'));
  var matrix = load(require('../../type/matrix/function/matrix'));

  map.transform = typed('max', {
    'Array, function': function (x, callback) {
      return _map(x, callback, x);
    },

    'Matrix, function': function (x, callback) {
      return matrix(_map(x.valueOf(), callback, x));
    }
  });

  return map.transform;
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
  function recurse(value, index) {
    if (Array.isArray(value)) {
      return value.map(function (child, i) {
        // we create a copy of the index array and append the new index value
        return recurse(child, index.concat(i + 1)); // one based index, hence i + 1
      });
    }
    else {
      return callback(value, index, orig);
    }
  }

  return recurse(array, []);
}

exports.factory = factory;
