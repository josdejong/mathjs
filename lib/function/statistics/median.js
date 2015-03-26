'use strict';

var collection = require('../../type/collection');
var flatten = require('../../util/array').flatten;

function factory (type, config, load, typed) {
  var add     = load(require('../arithmetic/add'));
  var divide  = load(require('../arithmetic/divide'));
  var compare = load(require('../relational/compare'));

  /**
   * Compute the median of a matrix or a list with values. The values are
   * sorted and the middle value is returned. In case of an even number of
   * values, the average of the two middle values is returned.
   * Supported types of values are: Number, BigNumber, Unit
   *
   * In case of a (multi dimensional) array or matrix, the median of all
   * elements will be calculated.
   *
   * Syntax:
   *
   *     mean.median(a, b, c, ...)
   *     mean.median(A)
   *
   * Examples:
   *
   *     math.median(5, 2, 7);        // returns 5
   *     math.median([3, -1, 5, 7]);  // returns 4
   *
   * See also:
   *
   *     mean, min, max, sum, prod, std, var
   *
   * @param {... *} args  A single matrix or or multiple scalar values
   * @return {*} The median
   */
  var median = typed('median', {
    // median([a, b, c, d, ...])
    'Array | Matrix': _median,

    // median([a, b, c, d, ...], dim)
    'Array | Matrix, number | BigNumber': function (array, dim) {
        // TODO: implement median(A, dim)
        throw new Error('median(A, dim) is not yet supported');
        //return collection.reduce(arguments[0], arguments[1], ...);
    },

    // median(a, b, c, d, ...)
    '...': function () {
      return _median(Array.prototype.slice.call(arguments));
    }
  });
  
  /**
   * Recursively calculate the median of an n-dimensional array
   * @param {Array | Matrix} array
   * @return {Number} median
   * @private
   */
  function _median(array) {
    var flat = flatten(array.valueOf());

    flat.sort(compare);

    var num = flat.length;

    if (num == 0) {
      throw new Error('Cannot calculate median of an empty array');
    }

    if (num % 2 == 0) {
      // even: return the average of the two middle values
      return middle2(flat[num / 2 - 1], flat[num / 2]);
    }
    else {
      // odd: return the middle value
      return middle(flat[(num - 1) / 2]);
    }
  }
  
  // helper function to type check the middle value of the array
  var middle = typed('number | BigNumber | Unit', function (value) {
    return value;
  });
  
  // helper function to type check the two middle value of the array
  var middle2 = typed('number | BigNumber | Unit, number | BigNumber | Unit', function (left, right) {
      return divide(add(left, right), 2);
  });
  
  return median;
}

exports.name = 'median';
exports.factory = factory;
