'use strict';

module.exports = function (math) {
  var util = require('../../util/index'),

      Matrix = math.type.Matrix,

      object = util.object,
      array = util.array,
      isArray = Array.isArray;

  /**
   * Squeeze a matrix, remove inner and outer singleton dimensions from a matrix.
   *
   * Syntax:
   *
   *     math.squeeze(x)
   *
   * Examples:
   *
   *     math.squeeze([3]);           // returns 3
   *     math.squeeze([[3]]);         // returns 3
   *
   *     var A = math.zeros(3, 1);    // returns [[0], [0], [0]] (size 3x1)
   *     math.squeeze(A);             // returns [0, 0, 0] (size 3)
   *
   *     var B = math.zeros(1, 3);    // returns [[0, 0, 0]] (size 1x3)
   *     math.squeeze(B);             // returns [0, 0, 0] (size 3)
   *
   *     // only inner and outer dimensions are removed
   *     var C = math.zeros(2, 1, 3); // returns [[[0, 0, 0]], [[0, 0, 0]]] (size 2x1x3)
   *     math.squeeze(C);             // returns [[[0, 0, 0]], [[0, 0, 0]]] (size 2x1x3)
   *
   * See also:
   *
   *     subset
   *
   * @param {Matrix | Array} x      Matrix to be squeezed
   * @return {Matrix | Array} Squeezed matrix
   */
  math.squeeze = function squeeze (x) {
    if (arguments.length != 1) {
      throw new math.error.ArgumentsError('squeeze', arguments.length, 1);
    }

    if (isArray(x)) {
      return array.squeeze(object.clone(x));
    }
    else if (x instanceof Matrix) {
      var res = array.squeeze(x.toArray());
      return isArray(res) ? math.matrix(res) : res;
    }
    else {
      // scalar
      return object.clone(x);
    }
  };
};
