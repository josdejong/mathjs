'use strict';

var maxArgumentCount = require('../../utils/function').maxArgumentCount;

/**
 * Attach a transform function to math.forEach
 * Adds a property transform containing the transform function.
 *
 * This transform creates a one-based index instead of a zero-based index
 */
function factory (type, config, load, typed) {
  var forEach = load(require('../../function/matrix/forEach'));

  return typed('forEach', {
    'Array | Matrix, function': function (array, callback) {
      // figure out what number of arguments the callback function expects
      var args = maxArgumentCount(callback);

      var recurse = function (value, index) {
        if (Array.isArray(value)) {
          value.forEach(function (child, i) {
            // we create a copy of the index array and append the new index value
            recurse(child, index.concat(i + 1)); // one based index, hence i+1
          });
        }
        else {
          // invoke the callback function with the right number of arguments
          if (args === 1) {
            callback(value);
          }
          else if (args === 2) {
            callback(value, index);
          }
          else { // 3 or -1
            callback(value, index, array);
          }
        }
      };
      recurse(array.valueOf(), []); // pass Array
    }
  });
}

exports.name = 'forEach';
exports.path = 'expression.transform';
exports.factory = factory;
