/**
 * Create a string or convert any object into a string
 * @param {*} [value]
 * @return {String} str
 */
math.string = function (value) {
  switch (arguments.length) {
    case 0:
      return '';

    case 1:
      return _toString(value);

    default:
      throw newArgumentsError('string', arguments.length, 0, 1);
  }
};

/**
 * Recursive toString function
 * @param {*} value  Value can be anything: number, string, array, Matrix, ...
 * @returns {String} str
 * @private
 */
function _toString(value) {
  if (Array.isArray(value) || value instanceof Matrix || value instanceof Range) {
    var array = value.valueOf();

    var str = '[';
    var len = array.length;
    for (var i = 0; i < len; i++) {
      if (i != 0) {
        str += ', ';
      }
      str += _toString(array[i]);
    }
    str += ']';
    return str;
  }
  else if (isNumber(value)) {
    return util.formatNumber(value); // no digits specified
  }
  else {
    return value.toString();
  }
}