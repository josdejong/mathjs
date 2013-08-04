/**
 * Get or set a subset of a matrix or string
 *
 * Usage:
 *     var subset = math.subset(value, index)               // retrieve subset
 *     var value = math.subset(value, index, replacement)   // replace subset
 *
 * Where:
 *     {*} value        An array, matrix, or scalar value
 *     {Array} index    An array containing index values
 *     {*} replacement  An array, matrix, or scalar
 *
 * @param args
 * @return res
 */
math.subset = function subset (args) {
  switch (arguments.length) {
    case 2: // get subset
      return _getSubset(arguments[0], arguments[1]);

    case 3: // set subset
      return _setSubset(arguments[0], arguments[1], arguments[2]);

    default: // wrong number of arguments
      throw newArgumentsError('subset', arguments.length, 2, 3);
  }
};

/**
 * Retrieve a subset of an value such as an Array, Matrix, or String
 * @param {*} value            Object from which to get a subset
 * @param {Array[] | Range[] | Number[] | Matrix} index
 *                              Two dimensional array (size 1 x n) containing
 *                              the indexes to be retrieved. Can also be a two
 *                              dimensional Matrix (size 1 x n), or an Array
 *                              (size 1) containing a Range or a Number.
 * @returns {*} subset
 * @private
 */
function _getSubset(value, index) {
  var matrix, subset;

  if (value instanceof Array || value instanceof Range) {
    matrix = math.matrix(value);
    subset = matrix.get(index);
    return subset.valueOf();
  }
  else if (value instanceof Matrix) {
    return value.get(index);
  }
  else if (isString(value)) {
    return _getSubstring(value, index);
  }
  else {
    // scalar
    matrix = math.matrix([value]);
    subset = matrix.get(index);
    return subset.valueOf();
  }
}

/**
 * Retrieve a subset of a string
 * @param {String} str          String from which to get a substring
 * @param {Array[] | Range[] | Number[] | Matrix} index
 *                              Two dimensional array (size 1 x n) containing
 *                              the indexes to be retrieved. Can also be a two
 *                              dimensional Matrix (size 1 x n), or an Array
 *                              (size 1) containing a Range or a Number.
 * @returns {string} substring
 * @private
 */
function _getSubstring(str, index) {
  var i, len;
  index = index.valueOf(); // cast from matrix or range to array
  if (index.length != 1) {
    throw new RangeError('Dimension mismatch (' + index.length + ' != 1)');
  }

  if (index instanceof Array) {
    index = index[0];   // read first dimension
  }
  index = index.valueOf(); // cast from matrix or range to array
  if (!(index instanceof Array)) {
    index = [index];
  }

  var substr = '';
  var strLen = str.length;
  for (i = 0, len = index.length; i < len; i++) {
    var index_i = index[i];
    util.validateIndex(index_i, strLen);
    substr += str.charAt(index_i);  // index_i is zero based
  }

  return substr;
}

/**
 * Replace a subset in an value such as an Array, Matrix, or String
 * @param {*} value            Object to be replaced
 * @param {Array[] | Range[] | Number[] | Matrix} index
 *                              Two dimensional array (size 1 x n) containing
 *                              the indexes to be replaced. Can also be a two
 *                              dimensional Matrix (size 1 x n), or an Array
 *                              (size 1) containing a Range.
 * @param {String} replacement
 * @returns {*} result
 * @private
 */
function _setSubset(value, index, replacement) {
  if (value instanceof Array || value instanceof Range) {
    var matrix = math.matrix(math.clone(value));
    matrix.set(index, replacement);
    return matrix.valueOf();
  }
  else if (value instanceof Matrix) {
    return value.clone().set(index, replacement);
  }
  else if (isString(value)) {
    return _setSubstring(value, index, replacement);
  }
  else {
    // scalar
    matrix = math.matrix([value]);
    matrix.set(index, replacement);

    if (matrix.isScalar()) {
      // still a scalar
      return matrix.toScalar();
    }
    else {
      // changed into a matrix. return array
      return matrix.valueOf();
    }
  }
}

/**
 * Replace a substring in a string
 * @param {String} str          String to be replaced
 * @param {Array[] | Range[] | Number[] | Matrix} index
 *                              Two dimensional array (size 1 x n) containing
 *                              the indexes to be replaced. Can also be a two
 *                              dimensional Matrix (size 1 x n), or an Array
 *                              (size 1) containing a Range.
 * @param {String} replacement  Replacement string
 * @returns {string} result
 * @private
 */
function _setSubstring(str, index, replacement) {
  var i, len;
  index = index.valueOf();  // cast from matrix or range to array

  if (index.length != 1) {
    throw new RangeError('Dimension mismatch (' + index.length + ' != 1)');
  }
  if (index instanceof Array) {
    index = index[0];   // read first dimension
  }
  index = index.valueOf(); // cast from matrix or range to array
  if (!(index instanceof Array)) {
    index = [index];
  }

  if (index.length != replacement.length) {
    throw new RangeError('Dimension mismatch ' +
        '(' + index.length + ' != ' + replacement.length + ')');
  }

  // copy the string into an array with characters
  var strLen = str.length;
  var chars = [];
  for (i = 0; i < strLen; i++) {
    chars[i] = str.charAt(i);
  }

  for (i = 0, len = index.length; i < len; i++) {
    var index_i = index[i];
    util.validateIndex(index_i);
    chars[index_i] = replacement.charAt(i); // index_i is zero based
  }

  // initialize undefined characters with a space
  if (chars.length > strLen) {
    for (i = strLen - 1, len = chars.length; i < len; i++) {
      if (!chars[i]) {
        chars[i] = ' ';
      }
    }
  }

  return chars.join('');
}
