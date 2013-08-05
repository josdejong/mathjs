var error = require('../../util/error.js'),
    object = require('../../util/object.js'),
    Matrix = require('../../type/Matrix.js');

/**
 * Remove singleton dimensions from a matrix
 *
 *     squeeze(x)
 *
 * @param {Matrix | Array} x
 * @return {Matrix | Array} res
 */
module.exports = function squeeze (x) {
  if (arguments.length != 1) {
    throw new error.ArgumentsError('squeeze', arguments.length, 1);
  }

  if (Array.isArray(x)) {
    return _squeezeArray(object.clone(x));
  }
  else if (x instanceof Matrix) {
    return new Matrix(_squeezeArray(x.toArray()));
  }
  else if (Array.isArray(x.valueOf())) {
    return _squeezeArray(object.clone(x.valueOf()));
  }
  else {
    // scalar
    return object.clone(x);
  }
};

/**
 * Recursively squeeze a multi dimensional array
 * @param {Array} array
 * @return {Array} array
 * @private
 */
function _squeezeArray(array) {
  if (array.length == 1) {
    // squeeze this array
    return _squeezeArray(array[0]);
  }
  else {
    // process all childs
    for (var i = 0, len = array.length; i < len; i++) {
      var child = array[i];
      if (Array.isArray(child)) {
        array[i] = _squeezeArray(child);
      }
    }
    return array;
  }
}
