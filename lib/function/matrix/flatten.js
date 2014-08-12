'use strict';

module.exports = function (math, config) {
  var util = require('../../util/index');

  var Matrix = require('../../type/Matrix');

  var object = util.object;
  var array = util.array;
  var isArray = Array.isArray;

  /**
   * Flatten a multi dimensional matrix into a single dimensional matrix.
   *
   * Syntax:
   *
   *    math.flatten(x)
   *
   * Examples:
   *
   *    math.flatten([[1,2], [3,4]]);   // returns [1, 2, 3, 4]
   *
   * See also:
   *
   *    concat, resize, size, squeeze
   *
   * @param {Matrix | Array} x   Matrix to be flattened
   * @return {Matrix | Array} Returns the flattened matrix
   */
  math.flatten = function flatten (x) {
    if (arguments.length !== 1) {
      throw new math.error.ArgumentsError('flatten', arguments.length, 1);
    }

    if (x instanceof Matrix) {
      var clone = object.clone(x.toArray());
      var flat = array.flatten(clone);
      return new Matrix(flat);
    }

    if (isArray(x)) {
      return array.flatten(object.clone(x));
    }

    throw new math.error.UnsupportedTypeError('flatten', math['typeof'](x));
  };
};
