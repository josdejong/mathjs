'use strict';

var flatten = require('../../utils/array').flatten;
var identify = require('../../utils/array').identify;
var generalize = require('../../utils/array').generalize;

function factory (type, config, load, typed) {
  /**
   * Create the difference of two (multi)sets. (Every element of set1, that is not the element of set2.)
   * Multi-dimension arrays will be converted to single-dimension arrays before the operation.
   *
   * Syntax:
   *
   *    math.setDifference(set1, set2)
   *
   * Examples:
   *
   *    math.setDifference([1, 2, 3, 4], [3, 4, 5, 6]);            // returns [1, 2]
   *    math.setDifference([[1, 2], [3, 4]], [[3, 4], [5, 6]]);    // returns [1, 2]
   *
   * See also:
   *
   *    setUnion, setIntersect, setSymDifference
   *
   * @param {Array | Matrix}    a1  A (multi)set
   * @param {Array | Matrix}    a2  A (multi)set
   * @return {Array | Matrix}    The difference of two (multi)sets
   */
  var setDifference = typed('setDifference', {
    'Array | Matrix, Array | Matrix': function (a1, a2) {
      if (a1.toArray().length === 0) { // empty-anything=empty
        var result = [];
      }
      else if (a2.toArray().length === 0) { // anything-empty=anything
        return flatten(a1.toArray());
      }
      else {
        var b1 = identify(math.sort(flatten(a1.toArray())));
        var b2 = identify(math.sort(flatten(a2.toArray())));
        var result = [];
        var inb2;
        for (var i=0; i<b1.length; i++) {
          inb2 = false;
          for (var j=0; j<b2.length; j++) {
            if (b1[i].value === b2[j].value && b1[i].identifier === b2[j].identifier) {
              inb2 = true;
              break;
            }
          }
          if (!inb2) {
            result.push(b1[i]);
          }
        }
      }
      // return an array, if both inputs were arrays
      if (Array.isArray(a1) && Array.isArray(a2)) {
        return generalize(result);
      }
      // return a matrix otherwise
      return math.matrix(generalize(result));
    }
  });

  return setDifference;
}

exports.name = 'setDifference';
exports.factory = factory;
