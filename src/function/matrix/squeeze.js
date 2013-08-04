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
    throw newArgumentsError('squeeze', arguments.length, 1);
  }

  if (x instanceof Array) {
    return _squeezeArray(math.clone(x));
  }
  else if (x instanceof Matrix) {
    return math.matrix(_squeezeArray(x.toArray()));
  }
  else if (x.valueOf() instanceof Array) {
    return _squeezeArray(math.clone(x.valueOf()));
  }
  else {
    // scalar
    return math.clone(x);
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
      if (child instanceof Array) {
        array[i] = _squeezeArray(child);
      }
    }
    return array;
  }
}
