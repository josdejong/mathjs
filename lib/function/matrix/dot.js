'use strict';

module.exports = function(math) {
  var array = require('../../util/array');
  var Matrix = math.type.Matrix;

  /**
   * Calculate the dot product of two vectors. The dot product of
   * `A = [a1, a2, a3, ..., an]` and `B = [b1, b2, b3, ..., bn]` is defined as:
   *
   *    dot(A, B) = a1 * b1 + a2 * b2 + a3 * b3 + ... + an * bn
   *
   * Syntax:
   *
   *    math.dot(x, y)
   *
   * Examples:
   *
   *    math.dot([2, 4, 1], [2, 2, 3]);       // returns Number 15
   *    math.multiply([2, 4, 1], [2, 2, 3]);  // returns Number 15
   *
   * See also:
   *
   *    multiply, cross
   *
   * @param  {Array | Matrix} x     First vector
   * @param  {Array | Matrix} y     Second vector
   * @return {Number}               Returns the dot product of `x` and `y`
   */
  math.dot = function dot(x, y) {
    if (x instanceof Matrix) {
      if (y instanceof Matrix) {
        return _dot(x.toArray(), y.toArray());
      }
      else if (Array.isArray(y)) {
        return _dot(x.toArray(), y);
      }
    }
    else if (Array.isArray(x)) {
      if (y instanceof Matrix) {
        return _dot(x, y.toArray());
      }
      else if (Array.isArray(y)) {
        return _dot(x, y);
      }
    }

    throw new math.error.UnsupportedTypeError('dot', math['typeof'](x), math['typeof'](y));
  };

  /**
   * Calculate the dot product for two arrays
   * @param {Array} x  First vector
   * @param {Array} y  Second vector
   * @returns {Number} Returns the dot product of x and y
   * @private
   */
  // TODO: double code with math.multiply
  function _dot(x, y) {
    var xSize= array.size(x);
    var ySize = array.size(y);
    var len = xSize[0];

    if (xSize.length !== 1 || ySize.length !== 1) throw new RangeError('Vector expected'); // TODO: better error message
    if (xSize[0] != ySize[0]) throw new RangeError('Vectors must have equal length (' + xSize[0] + ' != ' + ySize[0] + ')');
    if (len == 0) throw new RangeError('Cannot calculate the dot product of empty vectors');

    var prod = 0;
    for (var i = 0; i < len; i++) {
      prod = math.add(prod, math.multiply(x[i], y[i]));
    }

    return prod;
  }
};
