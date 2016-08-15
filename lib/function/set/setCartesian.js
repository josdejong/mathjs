'use strict';

var flatten = require('../../utils/array').flatten;

function factory (type, config, load, typed) {
  /**
   * Create the cartesian product of two (multi)sets.
   * Multi-dimension arrays will be converted to single-dimension arrays before the operation.
   *
   * Syntax:
   *
   *    math.setCartesian(set1, set2)
   *
   * Examples:
   *
   *    math.setCartesian([1, 2], [3, 4]);        // returns [[1, 3], [1, 4], [2, 3], [2, 4]]
   *
   * See also:
   *
   *    setUnion, setIntersect, setDifference, setPowerset
   *
   * @param {Array | Matrix}    a1  A (multi)set
   * @param {Array | Matrix}    a2  A (multi)set
   * @return {Array | Matrix}    The cartesian product of two (multi)sets
   */
  var setCartesian = typed('setCartesian', {
    'Array | Matrix, Array | Matrix': function (a1, a2) {
      if (a1.toArray().length === 0 || a2.toArray().length === 0) { // if any of them is empty, return empty
        var result = [];
      }
      else {
        var b1 = math.sort(flatten(a1.toArray()));
        var b2 = math.sort(flatten(a2.toArray()));
        var result = [];
        for (var i=0; i<b1.length; i++) {
          for (var j=0; j<b2.length; j++) {
            result.push([b1[i], b2[j]]);
          }
        }
      }
      // return an array, if both inputs were arrays
      if (Array.isArray(a1) && Array.isArray(a2)) {
        return result;
      }
      // return a matrix otherwise
      return math.matrix(result);
    }
  });

  return setCartesian;
}

exports.name = 'setCartesian';
exports.factory = factory;
