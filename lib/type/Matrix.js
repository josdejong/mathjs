'use strict';

var util = require('../util/index'),
    DimensionError = require('../error/DimensionError'),

    Index = require('./Index'),

    number = util.number,
    string = util.string,
    array = util.array,
    object = util.object,

    isArray = Array.isArray,
    validateIndex = array.validateIndex;

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
 * The internal Array of the Matrix can be accessed using the function valueOf.
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
    throw new SyntaxError('Constructor must be called with the new operator');
  }

  if (data instanceof Matrix) {
    // clone data from a Matrix
    this._data = data.clone()._data;
  }
  else if (isArray(data)) {
    // use array
    // replace nested Matrices with Arrays
    this._data = preprocess(data);
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
Matrix.isMatrix = function (object) {
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
 * @param {*} [defaultValue=0]      Default value, filled in on new entries when
 *                                  the matrix is resized. If not provided,
 *                                  new matrix elements will be filled with zeros.
 */
Matrix.prototype.subset = function (index, replacement, defaultValue) {
  switch (arguments.length) {
    case 1:
      return _get(this, index);

    // intentional fall through
    case 2:
    case 3:
      return _set(this, index, replacement, defaultValue);

    default:
      throw new SyntaxError('Wrong number of arguments');
  }
};

/**
 * Get a single element from the matrix.
 * @param {Number[]} index   Zero-based index
 * @return {*} value
 */
Matrix.prototype.get = function (index) {
  if (!isArray(index)) {
    throw new TypeError('Array expected');
  }
  if (index.length != this._size.length) {
    throw new DimensionError(index.length, this._size.length);
  }

  var data = this._data;
  for (var i = 0, ii = index.length; i < ii; i++) {
    var index_i = index[i];
    validateIndex(index_i, data.length);
    data = data[index_i];
  }

  return object.clone(data);
};

/**
 * Replace a single element in the matrix.
 * @param {Number[]} index   Zero-based index
 * @param {*} value
 * @param {*} [defaultValue]        Default value, filled in on new entries when
 *                                  the matrix is resized. If not provided,
 *                                  new matrix elements will be left undefined.
 * @return {Matrix} self
 */
Matrix.prototype.set = function (index, value, defaultValue) {
  var i, ii;

  // validate input type and dimensions
  if (!isArray(index)) {
    throw new Error('Array expected');
  }
  if (index.length < this._size.length) {
    throw new DimensionError(index.length, this._size.length, '<');
  }

  // enlarge matrix when needed
  var size = index.map(function (i) {
    return i + 1;
  });
  _fit(this, size, defaultValue);

  // traverse over the dimensions
  var data = this._data;
  for (i = 0, ii = index.length - 1; i < ii; i++) {
    var index_i = index[i];
    validateIndex(index_i, data.length);
    data = data[index_i];
  }

  // set new value
  index_i = index[index.length - 1];
  validateIndex(index_i, data.length);
  data[index_i] = value;

  return this;
};

/**
 * Get a submatrix of this matrix
 * @param {Matrix} matrix
 * @param {Index} index   Zero-based index
 * @private
 */
function _get (matrix, index) {
  if (!(index instanceof Index)) {
    throw new TypeError('Invalid index');
  }

  var isScalar = index.isScalar();
  if (isScalar) {
    // return a scalar
    return matrix.get(index.min());
  }
  else {
    // validate dimensions
    var size = index.size();
    if (size.length != matrix._size.length) {
      throw new DimensionError(size.length, matrix._size.length);
    }

    // validate if any of the ranges in the index is out of range
    var min = index.min();
    var max = index.max();
    for (var i = 0, ii = matrix._size.length; i < ii; i++) {
      validateIndex(min[i], matrix._size[i]);
      validateIndex(max[i], matrix._size[i]);
    }

    // retrieve submatrix
    // TODO: more efficient when creating an empty matrix and setting _data and _size manually
    return new Matrix(_getSubmatrix(matrix._data, index, size.length, 0));
  }
}

/**
 * Recursively get a submatrix of a multi dimensional matrix.
 * Index is not checked for correct number or length of dimensions.
 * @param {Array} data
 * @param {Index} index
 * @param {number} dims   Total number of dimensions
 * @param {number} dim    Current dimension
 * @return {Array} submatrix
 * @private
 */
function _getSubmatrix (data, index, dims, dim) {
  var last = (dim == dims - 1);
  var range = index.range(dim);

  if (last) {
    return range.map(function (i) {
      return data[i];
    });
  }
  else {
    return range.map(function (i) {
      var child = data[i];
      return _getSubmatrix(child, index, dims, dim + 1);
    });
  }
}

/**
 * Replace a submatrix in this matrix
 * Indexes are zero-based.
 * @param {Matrix} matrix
 * @param {Index} index
 * @param {Matrix | Array | *} submatrix
 * @param {*} defaultValue          Default value, filled in on new entries when
 *                                  the matrix is resized.
 * @return {Matrix} matrix
 * @private
 */
function _set (matrix, index, submatrix, defaultValue) {
  if (!(index instanceof Index)) {
    throw new TypeError('Invalid index');
  }

  // get index size and check whether the index contains a single value
  var iSize = index.size(),
      isScalar = index.isScalar();

  // calculate the size of the submatrix, and convert it into an Array if needed
  var sSize;
  if (submatrix instanceof Matrix) {
    sSize = submatrix.size();
    submatrix = submatrix.valueOf();
  }
  else {
    sSize = array.size(submatrix);
  }

  if (isScalar) {
    // set a scalar

    // check whether submatrix is a scalar
    if (sSize.length != 0) {
      throw new TypeError('Scalar expected');
    }

    matrix.set(index.min(), submatrix, defaultValue);
  }
  else {
    // set a submatrix

    // validate dimensions
    if (iSize.length < matrix._size.length) {
      throw new DimensionError(iSize.length, matrix._size.length, '<');
    }

    if (sSize.length < iSize.length) {
      // calculate number of missing outer dimensions
      var i = 0;
      var outer = 0;
      while (iSize[i] === 1 && sSize[i] === 1) {
        i++;
      }
      while (iSize[i] === 1) {
        outer++;
        i++;
      }

      // unsqueeze both outer and inner dimensions
      submatrix = array.unsqueeze(submatrix, iSize.length, outer, sSize);
    }

    // check whether the size of the submatrix matches the index size
    if (!object.deepEqual(iSize, sSize)) {
      throw new DimensionError(iSize, sSize, '>');
    }

    // enlarge matrix when needed
    var size = index.max().map(function (i) {
      return i + 1;
    });
    _fit(matrix, size, defaultValue);

    // insert the sub matrix
    var dims = iSize.length,
        dim = 0;
    _setSubmatrix (matrix._data, index, submatrix, dims, dim);
  }

  return matrix;
}

/**
 * Replace a submatrix of a multi dimensional matrix.
 * @param {Array} data
 * @param {Index} index
 * @param {Array} submatrix
 * @param {number} dims   Total number of dimensions
 * @param {number} dim
 * @private
 */
function _setSubmatrix (data, index, submatrix, dims, dim) {
  var last = (dim == dims - 1),
      range = index.range(dim);

  if (last) {
    range.forEach(function (dataIndex, subIndex) {
      validateIndex(dataIndex);
      data[dataIndex] = submatrix[subIndex];
    });
  }
  else {
    range.forEach(function (dataIndex, subIndex) {
      validateIndex(dataIndex);
      _setSubmatrix(data[dataIndex], index, submatrix[subIndex], dims, dim + 1);
    });
  }
}

/**
 * Resize the matrix
 * @param {Number[]} size
 * @param {*} [defaultValue=0]      Default value, filled in on new entries.
 *                                  If not provided, the matrix elements will
 *                                  be filled with zeros.
 * @return {Matrix} self            The matrix itself is returned
 */
Matrix.prototype.resize = function (size, defaultValue) {
  this._size = object.clone(size);
  this._data = array.resize(this._data, this._size, defaultValue);

  // return the matrix itself
  return this;
};

/**
 * Enlarge the matrix when it is smaller than given size.
 * If the matrix is larger or equal sized, nothing is done.
 * @param {Matrix} matrix           The matrix to be resized
 * @param {Number[]} size
 * @param {*} defaultValue          Default value, filled in on new entries.
 * @private
 */
function _fit(matrix, size, defaultValue) {
  var newSize = object.clone(matrix._size),
      changed = false;

  // add dimensions when needed
  while (newSize.length < size.length) {
    newSize.push(0);
    changed = true;
  }

  // enlarge size when needed
  for (var i = 0, ii = size.length; i < ii; i++) {
    if (size[i] > newSize[i]) {
      newSize[i] = size[i];
      changed = true;
    }
  }

  if (changed) {
    // resize only when size is changed
    matrix.resize(newSize, defaultValue);
  }
}

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
 * @returns {Number[]} size
 */
Matrix.prototype.size = function() {
  return this._size;
};

/**
 * Create a new matrix with the results of the callback function executed on
 * each entry of the matrix.
 * @param {function} callback   The callback function is invoked with three
 *                              parameters: the value of the element, the index
 *                              of the element, and the Matrix being traversed.
 * @return {Matrix} matrix
 */
Matrix.prototype.map = function (callback) {
  var me = this;
  var matrix = new Matrix();

  var recurse = function (value, index) {
    if (isArray(value)) {
      return value.map(function (child, i) {
        return recurse(child, index.concat(i));
      });
    }
    else {
      return callback(value, index, me);
    }
  };
  matrix._data = recurse(this._data, []);
  matrix._size = object.clone(this._size);

  return matrix;
};

/**
 * Execute a callback function on each entry of the matrix.
 * @param {function} callback   The callback function is invoked with three
 *                              parameters: the value of the element, the index
 *                              of the element, and the Matrix being traversed.
 */
Matrix.prototype.forEach = function (callback) {
  var me = this;

  var recurse = function (value, index) {
    if (isArray(value)) {
      value.forEach(function (child, i) {
        recurse(child, index.concat(i));
      });
    }
    else {
      callback(value, index, me);
    }
  };
  recurse(this._data, []);
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
 * Get a string representation of the matrix, with optional formatting options.
 * @param {Object | Number | Function} [options]  Formatting options. See
 *                                                lib/util/number:format for a
 *                                                description of the available
 *                                                options.
 * @returns {String} str
 */
Matrix.prototype.format = function (options) {
  return string.format(this._data, options);
};

/**
 * Get a string representation of the matrix
 * @returns {String} str
 */
Matrix.prototype.toString = function () {
  return string.format(this._data);
};

/**
 * Preprocess data, which can be an Array or Matrix with nested Arrays and
 * Matrices. Replaces all nested Matrices with Arrays
 * @param {Array} data
 * @return {Array} data
 */
function preprocess(data) {
  for (var i = 0, ii = data.length; i < ii; i++) {
    var elem = data[i];
    if (isArray(elem)) {
      data[i] = preprocess(elem);
    }
    else if (elem instanceof Matrix) {
      data[i] = preprocess(elem._data);
    }
  }

  return data;
}

// exports
module.exports = Matrix;
