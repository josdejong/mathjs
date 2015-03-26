'use strict';

var collection = require('../../type/collection');
var bigAtan2 = require('../../util/bignumber').arctan2;

function factory (type, config, load, typed) {
  /**
   * Calculate the inverse tangent function with two arguments, y/x.
   * By providing two arguments, the right quadrant of the computed angle can be
   * determined.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.atan2(y, x)
   *
   * Examples:
   *
   *    math.atan2(2, 2) / math.pi;       // returns number 0.25
   *
   *    var angle = math.unit(60, 'deg'); // returns Unit 60 deg
   *    var x = math.cos(angle);
   *    var y = math.sin(angle);
   *
   *    math.atan(2);             // returns Complex 1.5707963267948966 -1.3169578969248166 i
   *
   * See also:
   *
   *    tan, atan, sin, cos
   *
   * @param {Number | Boolean | Array | Matrix | null} y  Second dimension
   * @param {Number | Boolean | Array | Matrix | null} x  First dimension
   * @return {Number | Array | Matrix} Four-quadrant inverse tangent
   */
  var atan2 = typed('atan2', {
    'number, number': Math.atan2,

    // TODO: implement atan2 for complex numbers

    'BigNumber, BigNumber': function (y, x) {
      return bigAtan2(y, x, type.BigNumber);
    },

    'Array | Matrix, any': function (y, x) {
      return collection.deepMap2(y, x, atan2);
    },

    'any, Array | Matrix': function (y, x) {
      return collection.deepMap2(y, x, atan2);
    }
  });

  return atan2;
}

exports.name = 'atan2';
exports.factory = factory;
