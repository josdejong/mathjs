'use strict';

var flatten = require('../../utils/array').flatten;

function factory (type, config, load, typed) {
  /**
   * Collect the distinct elements of a multiset.
   * A multi-dimension array will be converted to a single-dimension array before the operation.
   *
   * Syntax:
   *
   *    math.setDistinct(set)
   *
   * Examples:
   *
   *    math.setDistinct([1, 1, 1, 2, 2, 3]);        // returns [1, 2, 3]
   *
   * See also:
   *
   *    setMultiplicity
   *
   * @param {Array | Matrix}    a  A multiset
   * @return {Array | Matrix}    A set containing the distinc elements of the multiset
   */
  var setDistinct = typed('setDistinct', {
    'Array | Matrix': function (a) {
      if (a.toArray().length === 0) { // if empty, return empty
        var result = [];
      }
      else {
        var b = math.sort(flatten(a.toArray()));
        var result = [];
        result.push(b[0]);
        for (var i=1; i<b.length; i++) {
          if (b[i] !== b[i-1]) {
            result.push(b[i]);
          }
        }
      }
      // return an array, if the input was an array
      if (Array.isArray(a)) {
        return result;
      }
      // return a matrix otherwise
      return math.matrix(result);
    }
  });

  return setDistinct;
}

exports.name = 'setDistinct';
exports.factory = factory;
