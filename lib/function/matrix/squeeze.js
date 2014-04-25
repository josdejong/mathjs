module.exports = function (math) {
  var util = require('../../util/index'),

      Matrix = require('../../type/Matrix'),

      object = util.object,
      array = util.array,
      isArray = Array.isArray;

  /**
   * Remove singleton dimensions from a matrix
   *
   *     squeeze(x)
   *
   * @param {Matrix | Array} x
   * @return {Matrix | Array} res
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
      return isArray(res) ? new Matrix(res) : res;
    }
    else {
      // scalar
      return object.clone(x);
    }
  };
};
