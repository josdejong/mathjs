var util = require('../util/index'),
    Index = require('./Index'),

    number = util.number,
    string = util.string,
    array = util.array,
    object = util.object;

/**
 * @constructor Matrix
 *
 * A Matrix is a wrapper around an Array. A matrix can hold a multi dimensional
 * array. A matrix can be constructed as:
 *     var matrix = new Matrix(data)
 *
 * Matrix contains the functions to resize, get and set values, get the size,
 * clone the matrix and to convert the matrix to a vector, array, or scalar.
 * Furthermore, one can iterate over the matrix using map and forEach.
 * The internal Array of the Matrix can be accessed using the method valueOf.
 *
 * Example usage:
 *     var matrix = new Matrix([[1, 2], [3, 4]);
 *     matix.size();              // [2, 2]
 *     matrix.resize([3, 2], 5);
 *     matrix.valueOf();          // [[1, 2], [3, 4], [5, 5]]
 *     matrix.subset([1,2])       // 3 (indexes are zero-based)
 *
 * @param {Array | Matrix} [data]    A multi dimensional array
 */
function Matrix(data) {
  if (!(this instanceof Matrix)) {
    throw new SyntaxError(
        'Matrix constructor must be called with the new operator');
  }

  if (data instanceof Matrix) {
    // clone data from a Matrix
    this._data = data.clone()._data;
  }
  else if (Array.isArray(data)) {
    // use array as is
    this._data = data;
  }
  else if (data != null) {
    // unsupported type
    throw new TypeError('Unsupported type of data (' + util.types.type(data) + ')');
  }
  else {
    // nothing provided
    this._data = [];
  }

  // verify the size of the array
  this._size = array.size(this._data);
}

/**
 * Test whether an object is a Matrix
 * @param {*} object
 * @return {Boolean} isMatrix
 */
Matrix.isMatrix = function isMatrix(object) {
  return (object instanceof Matrix);
};

/**
 * Get a subset of the matrix, or replace a subset of the matrix.
 *
 * Usage:
 *     var subset = matrix.subset(index)               // retrieve subset
 *     var value = matrix.subset(index, replacement)   // replace subset
 *
 * @param {Index} index
 * @param {Array | Matrix | *} [replacement]
 */
Matrix.prototype.subset = function subset(index, replacement) {
  switch (arguments.length) {
    case 1: return _get(this, index);
    case 2: return _set(this, index, replacement);
    default:
      throw new util.error.ArgumentsError('subset', arguments.length, 1, 2);
  }
};

/**
 * Get a value or a submatrix of the matrix.
 * @param {Index} index   Zero-based index
 */
// TODO: Matrix.get is deprecated since version 0.13.0, remove it some day
Matrix.prototype.get = function get(index) {
  throw new Error('Matrix.get is removed. Use matrix.subet(index) instead.');
};


/**
 * Replace a value or a submatrix in the matrix.
 * Indexes are zero-based.
 * @param {Index} index
 * @param {Matrix | Array | *} submatrix
 * @return {Matrix} matrix
 */
// TODO: Matrix.set is deprecated since version 0.13.0, remove it some day
Matrix.prototype.set = function set (index, submatrix) {
  throw new Error('Matrix.set is removed. Use matrix.subet(index, replacement) instead.');
};

/**
 * Get a value or a submatrix of the matrix.
 * @param {Matrix} matrix
 * @param {Index} index   Zero-based index
 */
function _get (matrix, index) {
  if (!(index instanceof Index)) {
    throw new TypeError('Invalid index');
  }

  var size = index.size();
  var isScalar = !size.some(function (i) {
    return (i != 1);
  });

  if (size.length != matrix._size.length) {
    throw new RangeError('Dimension mismatch ' +
        '(' + size.length + ' != ' + matrix._size.length + ')');
  }

  if (isScalar) {
    // return a single value
    switch (size.length) {
      case 1:     return _getScalar1D(matrix._data, index);
      case 2:     return _getScalar2D(matrix._data, index);
      default:    return _getScalar(matrix._data, index);
    }
  }
  else {
    // return a submatrix
    switch (size.length) {
      case 1: return new Matrix(_getSubmatrix1D(matrix._data, index));
      case 2: return new Matrix(_getSubmatrix2D(matrix._data, index));
      default: return new Matrix(_getSubmatrix(matrix._data, index, 0));
    }
    // TODO: more efficient when creating an empty matrix and setting _data and _size manually
  }
}

/**
 * Get a single value from an array. The method tests whether:
 * - index is a non-negative integer
 * - index does not exceed the dimensions of array
 * @param {Array} arr
 * @param {Number} index   Zero-based index
 * @return {*} value
 * @private
 */
function _getElement (arr, index) {
  array.validateIndex(index, arr.length);
  return arr[index]; // zero-based index
}

/**
 * Get a single value from the matrix. The value will be a copy of the original
 * value in the matrix.
 * Index is not checked for correct number of dimensions.
 * @param {Array} data
 * @param {Index} index
 * @return {*} scalar
 * @private
 */
function _getScalar (data, index) {
  index.forEach(function (range) {
    data = _getElement(data, range.start);
  });
  return object.clone(data);
}

/**
 * Get a single value from a one dimensional matrix.
 * The value will be a copy of the original value in the matrix.
 * Index is not checked for correct number of dimensions.
 * @param {Array} data
 * @param {Index} index
 * @return {*} scalar
 * @private
 */
function _getScalar1D (data, index) {
  return _getElement(data, index.range(0).start);
}

/**
 * Get a single value from a two dimensional matrix.
 * The value will be a copy of the original value in the matrix.
 * Index is not checked for correct number of dimensions.
 * @param {Array} data
 * @param {Index} index
 * @return {*} scalar
 * @private
 */
function _getScalar2D (data, index) {
  return _getElement(_getElement(data, index.range(0).start), index.range(1).start);
}

/**
 * Get a submatrix of a zero dimensional matrix.
 * Index is not checked for correct number of dimensions.
 * @param {Array} data
 * @param {Index} index
 * @return {Array} submatrix
 * @private
 */
function _getSubmatrix1D (data, index) {
  var range = index.range(0);

  return range.map(function (i) {
    return _getElement(data, i);
  });
}

/**
 * Get a submatrix of a 2 dimensional matrix.
 * Index is not checked for correct number of dimensions.
 * @param {Array} data
 * @param {Index} index
 * @return {Array} submatrix
 * @private
 */
function _getSubmatrix2D (data, index) {
  var rows = index.range(0);
  var cols = index.range(1);

  return rows.map(function (row) {
    var child = _getElement(data, row);
    return cols.map(function (col) {
      return _getElement(child, col);
    });
  });
}

/**
 * Get a submatrix of a multi dimensional matrix.
 * Index is not checked for correct number of dimensions.
 * @param {Array} data
 * @param {Index} index
 * @param {number} dim
 * @return {Array} submatrix
 * @private
 */
function _getSubmatrix (data, index, dim) {
  var last = (dim == index.size().length - 1);
  var range = index.range(dim);

  if (last) {
    return range.map(function (i) {
      return _getElement(data, i);
    });
  }
  else {
    return range.map(function (i) {
      var child = _getElement(data, i);
      return _getSubmatrix(child, index, dim + 1);
    });
  }
}

/**
 * Replace a value or a submatrix in the matrix.
 * Indexes are zero-based.
 * @param {Matrix} matrix
 * @param {Index} index
 * @param {Matrix | Array | *} submatrix
 * @return {Matrix} matrix
 */
function _set (matrix, index, submatrix) {
  if (!(index instanceof Index)) {
    throw new TypeError('Invalid index');
  }

  var size = index.size();
  var isScalar = !size.some(function (i) {
    return (i != 1);
  });

  if (size.length < matrix._size.length) {
    throw new RangeError('Dimension mismatch ' +
        '(' + size.length + ' != ' + matrix._size.length + ')');
  }

  if (submatrix instanceof Matrix) {
    submatrix = submatrix.valueOf();
  }

  if (isScalar) {
    // set a scalar
    // check whether submatrix is no matrix/array
    if (array.size(submatrix.valueOf()).length != 0) {
      throw new TypeError('Scalar value expected');
    }

    switch (index.length) {
      case 1:  _setScalar1D(matrix._data, matrix._size, index, submatrix); break;
      case 2:  _setScalar2D(matrix._data, matrix._size, index, submatrix); break;
      default: _setScalar(matrix._data, matrix._size, index, submatrix); break;
    }
  }
  else {
    // set a submatrix
    var newSize = matrix._size.concat();
    _setSubmatrix (matrix._data, newSize, index, 0, submatrix);
    if (!object.deepEqual(matrix._size, newSize)) {
      _init(matrix._data);
      matrix.resize(newSize);
    }
  }

  return matrix;
}

/**
 * Replace a single value in an array. The method tests whether index is a
 * non-negative integer
 * @param {Array} arr
 * @param {Number} index   Zero-based index
 * @param {*} value
 * @private
 */
function _setElement (arr, index, value) {
  array.validateIndex(index);
  if (Array.isArray(value)) {
    throw new TypeError('Dimension mismatch, value expected instead of array');
  }
  arr[index] = value; // zero-based index
}

/**
 * Replace a single value in a multi dimensional matrix
 * @param {Array} data
 * @param {Number[]} size
 * @param {Index} index
 * @param {*} value
 * @private
 */
function _setScalar (data, size, index, value) {
  var resized = false;
  if (index.size().length > size.length) {
    // dimension added
    resized = true;
  }

  index.forEach(function (range, i) {
    var v = range.start;
    array.validateIndex(v);
    if ((size[i] == null) || (v + 1 > size[i])) {
      size[i] = v + 1; // size is index + 1 as index is zero-based
      resized = true;
    }
  });

  if (resized) {
    array.resize(data, size, 0);
  }

  var len = size.length;
  index.forEach(function (range, dim) {
    var i = range.start;
    if (dim < len - 1) {
      data = data[i]; // zero-based index
    }
    else {
      data[i] = value; // zero-based index
    }
  });
}

/**
 * Replace a single value in a zero dimensional matrix
 * @param {Array} data
 * @param {Number[]} size
 * @param {Index} index
 * @param {*} value
 * @private
 */
function _setScalar1D (data, size, index, value) {
  var row = index.range(0).start;
  array.validateIndex(row);
  if (row + 1 > size[0]) {
    array.resize(data, [row + 1], 0); // size is index + 1 as index is zero-based
    size[0] = row + 1;
  }
  data[row] = value; // zero-based index
}

/**
 * Replace a single value in a two dimensional matrix
 * @param {Array} data
 * @param {Number[]} size
 * @param {Index} index  zero-based index
 * @param {*} value
 * @private
 */
function _setScalar2D (data, size, index, value) {
  var row = index.range(0).start;
  var col = index.range(1).start;
  array.validateIndex(row);
  array.validateIndex(col);

  var resized = false;
  if (row + 1 > (size[0] || 0)) {
    size[0] = row + 1;   // size is index + 1 as index is zero-based
    resized = true;
  }
  if (col + 1 > (size[1] || 0)) {
    size[1] = col + 1;   // size is index + 1 as index is zero-based
    resized = true;
  }
  if (resized) {
    array.resize(data, size, 0);
  }

  data[row][col] = value; // zero-based index
}

/**
 * Replace a submatrix of a multi dimensional matrix.
 * @param {Array} data
 * @param {Array} size
 * @param {Index} index
 * @param {number} dim
 * @param {Array} submatrix
 * @private
 */
function _setSubmatrix (data, size, index, dim, submatrix) {
  var last = (dim == index.size().length - 1);
  var range = index.range(dim);

  var len = (range.size()[0]);
  if (len != submatrix.length) {
    throw new RangeError('Dimensions mismatch ' +
        '(' + len + ' != '+ submatrix.length + ')');
  }

  if (last) {
    range.forEach(function (dataIndex, subIndex) {
      _setElement(data, dataIndex, submatrix[subIndex]);
      if (dataIndex + 1 > (size[dim] || 0)) {
        size[dim] = dataIndex + 1;
      }
    });
  }
  else {
    range.forEach(function (dataIndex, subIndex) {
      var child = data[dataIndex];
      if (!Array.isArray(child)) {
        data[dataIndex] = child = [child];
      }
      if (dataIndex + 1 > (size[dim] || 0)) {
        size[dim] = dataIndex + 1;
      }
      _setSubmatrix(child, size, index, dim + 1, submatrix[subIndex]);
    });
  }
}

/**
 * Recursively initialize all undefined values in the array with zeros
 * @param array
 * @private
 */
function _init(array) {
  for (var i = 0, len = array.length; i < len; i++) {
    var value = array[i];
    if (Array.isArray(value)) {
      _init(value);
    }
    else if (value == undefined) {
      array[i] = 0;
    }
  }
}

/**
 * Resize the matrix
 * @param {Number[]} size
 * @param {*} [defaultValue]        Default value, filled in on new entries.
 *                                  If not provided, the matrix will be filled
 *                                  with zeros.
 */
Matrix.prototype.resize = function (size, defaultValue) {
  array.resize(this._data, size, defaultValue);
  this._size = object.clone(size);
};

/**
 * Create a clone of the matrix
 * @return {Matrix} clone
 */
Matrix.prototype.clone = function () {
  var matrix = new Matrix();
  matrix._data = object.clone(this._data);
  matrix._size = object.clone(this._size);
  return matrix;
};

/**
 * Retrieve the size of the matrix.
 * The size of the matrix will be validated too
 * @returns {Number[]} size
 */
Matrix.prototype.size = function () {
  return this._size;
};

/**
 * Create a new matrix with the results of the callback function executed on
 * each entry of the matrix.
 * @param {function} callback   The callback method is invoked with three
 *                              parameters: the value of the element, the index
 *                              of the element, and the Matrix being traversed.
 * @return {Matrix} matrix
 */
Matrix.prototype.map = function (callback) {
  var me = this;
  var matrix = new Matrix();
  var index = [];
  var recurse = function (value, dim) {
    if (Array.isArray(value)) {
      return value.map(function (child, i) {
        index[dim] = i; // zero-based index
        return recurse(child, dim + 1);
      });
    }
    else {
      return callback(value, index, me);
    }
  };
  matrix._data = recurse(this._data, 0);
  matrix._size = object.clone(this._size);

  return matrix;
};

/**
 * Execute a callback method on each entry of the matrix.
 * @param {function} callback   The callback method is invoked with three
 *                              parameters: the value of the element, the index
 *                              of the element, and the Matrix being traversed.
 */
Matrix.prototype.forEach = function (callback) {
  var me = this;
  var index = [];
  var recurse = function (value, dim) {
    if (Array.isArray(value)) {
      value.forEach(function (child, i) {
        index[dim] = i; // zero-based index
        recurse(child, dim + 1);
      });
    }
    else {
      callback(value, index, me);
    }
  };
  recurse(this._data, 0);
};

/**
 * Create a scalar with a copy of the data of the Matrix
 * Will return null if the matrix does not consist of a scalar value
 * @return {* | null} scalar
 */
Matrix.prototype.toScalar = function () {
  var scalar = this._data;
  while (Array.isArray(scalar) && scalar.length == 1) {
    scalar = scalar[0];
  }

  if (Array.isArray(scalar)) {
    return null;
  }
  else {
    return object.clone(scalar);
  }
};

/**
 * Test whether the matrix is a scalar.
 * @return {boolean} isScalar
 */
Matrix.prototype.isScalar = function () {
  return this._size.every(function (s) {
    return (s <= 1);
  });
};

/**
 * Create a vector with a copy of the data of the Matrix
 * Returns null if the Matrix does not contain a vector
 *
 * A matrix is a vector when it has 0 or 1 dimensions, or has multiple
 * dimensions where maximum one of the dimensions has a size larger than 1.
 * return {Array | null} vector
 */
Matrix.prototype.toVector = function () {
  var count = 0;
  var dim = undefined;
  var index = [];
  this._size.forEach(function (length, i) {
    if (length > 1) {
      count++;
      dim = i;
    }
    index[i] = 0;
  });

  if (count == 0) {
    // scalar or empty
    var scalar = this.toScalar();
    if (scalar) {
      return [scalar];
    }
    else {
      return [];
    }
  }
  else if (count == 1) {
    // valid vector
    var vector = [];
    var recurse = function (data) {
      if (Array.isArray(data)) {
        data.forEach(recurse);
      }
      else {
        vector.push(data);
      }
    };
    recurse(this._data);
    return vector;
  }
  else {
    // count > 1, this is no vector
    return null;
  }
};

/**
 * Test if the matrix contains a vector.
 * A matrix is a vector when it has 0 or 1 dimensions, or has multiple
 * dimensions where maximum one of the dimensions has a size larger than 1.
 * return {boolean} isVector
 */
Matrix.prototype.isVector = function () {
  var count = 0;
  this._size.forEach(function (length) {
    if (length > 1) {
      count++;
    }
  });
  return (count <= 1);
};

/**
 * Create an Array with a copy of the data of the Matrix
 * @returns {Array} array
 */
Matrix.prototype.toArray = function () {
  return object.clone(this._data);
};

/**
 * Get the primitive value of the Matrix: a multidimensional array
 * @returns {Array} array
 */
Matrix.prototype.valueOf = function () {
  return this._data;
};

/**
 * Get a string representation of the matrix
 * @returns {String} str
 */
Matrix.prototype.toString = function () {
  return string.format(this._data);
};

// exports
module.exports = Matrix;

// to trick my IDE which doesn't get it
exports.isMatrix = Matrix.isMatrix;

util.types.addType('matrix', Matrix);
