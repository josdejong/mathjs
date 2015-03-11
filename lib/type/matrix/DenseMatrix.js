'use strict';

var util = require('../../util/index');
var DimensionError = require('../../error/DimensionError');

var number = util.number;
var string = util.string;
var array = util.array;
var object = util.object;

var isArray = Array.isArray;
var validateIndex = array.validateIndex;

module.exports = function (math) {

  var Index = math.type.Index,
      Matrix = math.type.Matrix;
  
  function DenseMatrix(data) {
    if (!(this instanceof DenseMatrix))
      throw new SyntaxError('Constructor must be called with the new operator');

    if (data instanceof Matrix) {
      // check data is a DenseMatrix
      if (data.type === 'DenseMatrix') {
        // clone data & size
        this._data = object.clone(data._data);
        this._size = object.clone(data._size);
      }
      else {
        // build data from existing matrix
        this._data = data.toArray();
        this._size = data.size();
      }
    }
    else if (data && isArray(data.data) && isArray(data.size)) {
      // initialize fields from JSON representation
      this._data = data.data;
      this._size = data.size;
    }
    else if (isArray(data)) {
      // replace nested Matrices with Arrays
      this._data = preprocess(data);
      // verify the size of the array, TODO: compute size while processing array
      this._size = array.size(this._data);
    }
    else if (data != null) {
      // unsupported type
      throw new TypeError('Unsupported type of data (' + util.types.type(data) + ')');
    }
    else {
      // nothing provided
      this._data = [];
      this._size = [0];
    }
  }
  
  DenseMatrix.prototype = new math.type.Matrix();

  DenseMatrix.prototype.type = 'DenseMatrix';

  /**
   * Get a subset of the matrix, or replace a subset of the matrix.
   *
   * Usage:
   *     var subset = matrix.subset(index)               // retrieve subset
   *     var value = matrix.subset(index, replacement)   // replace subset
   *
   * @param {Index} index
   * @param {Array | DenseMatrix | *} [replacement]
   * @param {*} [defaultValue=0]      Default value, filled in on new entries when
   *                                  the matrix is resized. If not provided,
   *                                  new matrix elements will be filled with zeros.
   */
  DenseMatrix.prototype.subset = function (index, replacement, defaultValue) {
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
  DenseMatrix.prototype.get = function (index) {
    if (!isArray(index))
      throw new TypeError('Array expected');
    if (index.length != this._size.length)
      throw new DimensionError(index.length, this._size.length);

    // check index
    for (var x = 0; x < index.length; x++)
      validateIndex(index[x], this._size[x]);

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
   * @return {DenseMatrix} self
   */
  DenseMatrix.prototype.set = function (index, value, defaultValue) {
    if (!isArray(index))
      throw new TypeError('Array expected');
    if (index.length < this._size.length)
      throw new DimensionError(index.length, this._size.length, '<');

    var i, ii;

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
   * @param {DenseMatrix} matrix
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
      return new DenseMatrix(_getSubmatrix(matrix._data, index, size.length, 0));
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
   * @param {DenseMatrix} matrix
   * @param {Index} index
   * @param {DenseMatrix | Array | *} submatrix
   * @param {*} defaultValue          Default value, filled in on new entries when
   *                                  the matrix is resized.
   * @return {DenseMatrix} matrix
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
    if (submatrix instanceof math.type.Matrix) {
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
   * @return {DenseMatrix} self            The matrix itself is returned
   */
  DenseMatrix.prototype.resize = function (size, defaultValue) {
    this._size = object.clone(size);
    this._data = array.resize(this._data, this._size, defaultValue);

    // return the matrix itself
    return this;
  };
  
  /**
   * Enlarge the matrix when it is smaller than given size.
   * If the matrix is larger or equal sized, nothing is done.
   * @param {DenseMatrix} matrix           The matrix to be resized
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
   * @return {DenseMatrix} clone
   */
  DenseMatrix.prototype.clone = function () {
    var m = new DenseMatrix({
      data: object.clone(this._data),
      size: object.clone(this._size)
    });
    return m;
  };
  
  /**
   * Retrieve the size of the matrix.
   * @returns {Number[]} size
   */
  DenseMatrix.prototype.size = function() {
    return this._size;
  };
  
  /**
   * Create a new matrix with the results of the callback function executed on
   * each entry of the matrix.
   * @param {function} callback   The callback function is invoked with three
   *                              parameters: the value of the element, the index
   *                              of the element, and the Matrix being traversed.
   * @return {DenseMatrix} matrix
   */
  DenseMatrix.prototype.map = function (callback) {
    // matrix instance
    var me = this;
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
    // return dense format
    return new DenseMatrix({
      data: recurse(this._data, []),
      size: object.clone(this._size)
    });
  };
  
  /**
   * Execute a callback function on each entry of the matrix.
   * @param {function} callback   The callback function is invoked with three
   *                              parameters: the value of the element, the index
   *                              of the element, and the Matrix being traversed.
   */
  DenseMatrix.prototype.forEach = function (callback) {
    // matrix instance
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
   * Create an Array with a copy of the data of the DenseMatrix
   * @returns {Array} array
   */
  DenseMatrix.prototype.toArray = function () {
    return object.clone(this._data);
  };
  
  /**
   * Get the primitive value of the DenseMatrix: a multidimensional array
   * @returns {Array} array
   */
  DenseMatrix.prototype.valueOf = function () {
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
  DenseMatrix.prototype.format = function (options) {
    return string.format(this._data, options);
  };
  
  /**
   * Get a string representation of the matrix
   * @returns {String} str
   */
  DenseMatrix.prototype.toString = function () {
    return string.format(this._data);
  };
  
  /**
   * Get a JSON representation of the matrix
   * @returns {Object}
   */
  DenseMatrix.prototype.toJSON = function () {
    return {
      mathjs: 'DenseMatrix',
      data: this._data,
      size: this._size
    };
  };
  
  /**
   * Calculates the transpose of the matrix
   * @returns {Matrix}
   */
  DenseMatrix.prototype.transpose = function () {
    // check dimensions
    switch (this._size.length) {
        case 1:
          // vector
          return this.clone();
        case 2:
          // rows and columns
          var rows = this._size[0];
          var columns = this._size[1];
          // check columns
          if (columns === 0) {
            // throw exception
            throw new RangeError('Cannot transpose a 2D matrix with no columns (size: ' + string.format(this._size) + ')');
          }
          // transposed matrix data
          var transposed = [];
          var transposedRow;
          // loop columns
          for (var j = 0; j < columns; j++) {
            // initialize row
            transposedRow = transposed[j] = [];
            // loop rows
            for (var i = 0; i < rows; i++) {
              // set data
              transposedRow[i] = object.clone(this._data[i][j]);
            }
          }
          // return matrix
          return new DenseMatrix({
            data: transposed,
            size: [columns, rows]
          });
        default:
          // multi dimensional
          throw new RangeError('Matrix must be two dimensional (size: ' + string.format(this._size) + ')');
    }
  };

  /**
   * Generate a matrix from a JSON object
   * @param {Object} json  An object structured like
   *                       `{"mathjs": "DenseMatrix", data: [], size: []}`,
   *                       where mathjs is optional
   * @returns {DenseMatrix}
   */
  DenseMatrix.fromJSON = function (json) {
    return new DenseMatrix(json);
  };
  
  /**
   * Preprocess data, which can be an Array or DenseMatrix with nested Arrays and
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
      else if (elem instanceof math.type.Matrix) {
        data[i] = preprocess(elem.valueOf());
      }
    }

    return data;
  }

  // exports
  return DenseMatrix;
};
