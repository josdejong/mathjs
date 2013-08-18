module.exports = function (math) {
  var util = require('../../util/index.js'),

      Matrix = require('../../type/Matrix.js'),

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
      throw new util.error.ArgumentsError('squeeze', arguments.length, 1);
    }

    if (isArray(x)) {
      return array.squeeze(object.clone(x));
    }
    else if (x instanceof Matrix) {
      return new Matrix(array.squeeze(x.toArray()));
    }
    else if (isArray(x.valueOf())) {
      return array.squeeze(object.clone(x.valueOf()));
    }
    else {
      // scalar
      return object.clone(x);
    }
  };
};
