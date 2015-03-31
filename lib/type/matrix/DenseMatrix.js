'use strict';

var util = require('../../util/index');
var DimensionError = require('../../error/DimensionError');

var string = util.string;
var array = util.array;
var object = util.object;

var isArray = Array.isArray;
var isNumber = util.number.isNumber;
var isInteger = util.number.isInteger;

var validateIndex = array.validateIndex;

module.exports = function (math) {

  var Index = math.type.Index,
      BigNumber = math.type.BigNumber,
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
    else if (data) {
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
   * Get the storage format used by the matrix.
   *
   * Usage:
   *     var format = matrix.storage()                   // retrieve storage format
   *
   * @return {string}           The storage format.
   */
  DenseMatrix.prototype.storage = function () {
    return 'dense';
  };
  
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

    var i, ii, index_i;

    // enlarge matrix when needed
    var size = index.map(function (i) {
      return i + 1;
    });
    _fit(this, size, defaultValue);

    // traverse over the dimensions
    var data = this._data;
    for (i = 0, ii = index.length - 1; i < ii; i++) {
      index_i = index[i];
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
      if (sSize.length !== 0) {
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
   * Resize the matrix to the given size. Returns a copy of the matrix when
   * `copy=true`, otherwise return the matrix itself (resize in place).
   *
   * @param {Number[]} size           The new size the matrix should have.
   * @param {*} [defaultValue=0]      Default value, filled in on new entries.
   *                                  If not provided, the matrix elements will
   *                                  be filled with zeros.
   * @param {boolean} [copy]          Return a resized copy of the matrix
   *
   * @return {Matrix}                 The resized matrix
   */
  DenseMatrix.prototype.resize = function (size, defaultValue, copy) {
    // validate arguments
    if (!isArray(size))
      throw new TypeError('Array expected');

    // matrix to resize
    var m = copy ? this.clone() : this;
    // resize matrix
    return _resize(m, size, defaultValue);
  };
  
  var _resize = function (matrix, size, defaultValue) {
    // check size
    if (size.length === 0) {
      // first value in matrix
      var v = matrix._data;
      // go deep
      while (isArray(v)) {
        v = v[0];
      }
      return object.clone(v);
    }
    // resize matrix
    matrix._size = object.clone(size);
    matrix._data = array.resize(matrix._data, matrix._size, defaultValue);
    // return matrix
    return matrix;
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
      _resize(matrix, newSize, defaultValue);
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
   *
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
   * Get the kth Matrix diagonal.
   *
   * @param {Number | BigNumber} [k=0]     The kth diagonal where the vector will retrieved.
   *
   * @returns {Array}                      The array vector with the diagonal values.
   */
  DenseMatrix.prototype.diagonal = function(k) {
    // validate k if any
    if (k) {
      // convert BigNumber to a number
      if (k instanceof BigNumber) 
        k = k.toNumber();
      // is must be an integer
      if (!isNumber(k) || !isInteger(k)) {
        throw new TypeError ('The parameter k must be an integer number');
      }
    }
    else {
      // default value
      k = 0;
    }

    var kSuper = k > 0 ? k : 0;
    var kSub = k < 0 ? -k : 0;

    // rows & columns
    var rows = this._size[0];
    var columns = this._size[1];

    // number diagonal values
    var n = Math.min(rows - kSub, columns -  kSuper);
    
    // x is a matrix get diagonal from matrix
    var vector = [];
    
    // loop rows
    for (var i = 0; i < n; i++) {
      vector[i] = object.clone(this._data[i + kSub][i + kSuper]);
    }
    return vector;
  };
  
  /**
   * Create a diagonal matrix.
   *
   * @param {Array} size                   The matrix size.
   * @param {Number, Array} value          The values for the diagonal.
   * @param {Number | BigNumber} [k=0]     The kth diagonal where the vector will be filled in.
   * @param {Number} [defaultValue]        The default value for non-diagonal
   *
   * @returns {DenseMatrix}
   */
  DenseMatrix.diagonal = function (size, value, k, defaultValue) {
    if (!isArray(size))
      throw new TypeError('Array expected, size parameter');
    if (size.length !== 2)
      throw new Error('Only two dimensions matrix are supported');

    // map size & validate
    size = size.map(function (s) {
      // check it is a big number
      if (s instanceof BigNumber) {
        // convert it
        s = s.toNumber();
      }
      // validate arguments
      if (!isNumber(s) || !isInteger(s) || s < 1) {
        throw new Error('Size values must be positive integers');
      } 
      return s;
    });

    // validate k if any
    if (k) {
      // convert BigNumber to a number
      if (k instanceof BigNumber) 
        k = k.toNumber();
      // is must be an integer
      if (!isNumber(k) || !isInteger(k)) {
        throw new TypeError ('The parameter k must be an integer number');
      }
    }
    else {
      // default value
      k = 0;
    }

    var kSuper = k > 0 ? k : 0;
    var kSub = k < 0 ? -k : 0;
    
    // rows and columns
    var rows = size[0];
    var columns = size[1];

    // number of non-zero items
    var n = Math.min(rows - kSub, columns -  kSuper);

    // value extraction function
    var _value;

    // check value
    if (isArray(value)) {
      // validate array
      if (value.length !== n) {
        // number of values in array must be n
        throw new Error('Invalid value array length');
      }
      // define function
      _value = function (i) {
        // return value @ i
        return value[i];
      };
    }
    else {
      // define function
      _value = function () {
        // return value
        return value;
      };
    }

    // empty array
    var data = [];

    // check we need to resize array
    if (size.length > 0) {
      // resize array
      data = array.resize(data, size, defaultValue);
      // fill diagonal
      for (var d = 0; d < n; d++) {
        data[d + kSub][d + kSuper] = _value(d);
      }
    }
    
    // create DenseMatrix
    return new DenseMatrix({
      data: data,
      size: [rows, columns]
    });
  };
  
  /**
   * Calculate the trace of a matrix: the sum of the elements on the main
   * diagonal of a square matrix.
   *
   * See also:
   *
   *    diagonal
   *
   * @returns {Number}       The matrix trace
   */
  DenseMatrix.prototype.trace = function () {
    // size & data
    var size = this._size;
    var data = this._data;
    // check dimensions
    switch (size.length) {
      case 1:
        // vector
        if (size[0] == 1) {
          // return data[0]
          return object.clone(data[0]);
        }
        throw new RangeError('Matrix must be square (size: ' + string.format(size) + ')');
      case 2:
        // two dimensional array
        var rows = size[0];
        var cols = size[1];
        if (rows === cols) {
          // calulate sum
          var sum = 0;
          // loop diagonal
          for (var i = 0; i < rows; i++)
            sum = math.add(sum, data[i][i]);
          // return trace
          return sum;
        }
        throw new RangeError('Matrix must be square (size: ' + string.format(size) + ')');        
      default:
        // multi dimensional array
        throw new RangeError('Matrix must be two dimensional (size: ' + string.format(size) + ')');
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
   * Multiply the matrix values times the argument.
   *
   * @param  {Number | BigNumber | Boolean | Complex | Unit | Array | Matrix | null} Value to multiply.
   *
   * @return {Number | BigNumber | Complex | Unit | Matrix}
   */
  DenseMatrix.prototype.multiply = function (value) {
    // process matrix size
    switch(this._size.length) {
      case 1:
        // multiply vector
        return _multiplyVector(this, this._size[0], value);
      case 2:
        // multiply matrix
        return _multiplyMatrix(this, this._size[0], this._size[1], value);
      default:
        throw new Error('Can only multiply a 1 or 2 dimensional matrix ' +
                        '(matrix has ' + this._size.length + ' dimensions)');
    }
  };
  
  var _multiplyVector = function (matrix, m, value) {
    // check value is a matrix
    if (value instanceof Matrix) {
      // matrix size
      var z = value.size();
      // check value is a vector
      if (z.length === 1) {
        // vectors must have same length
        if (z[0] !== m)
          throw new RangeError('Dimension mismatch in multiplication. Vectors must have the same length.');
        // multiply vector x vector
        return _multiplyVectorVector(matrix, m, function (i) {
          // value[i]
          return value.get([i]);
        });
      }
      // check two dimensions matrix
      if (z.length === 2) {        
        // vector length must be equal rows in matrix
        if (z[0] !== m)
          throw new RangeError('Dimension mismatch in multiplication. Matrix rows and Vector length must be equal.');
        // mutiply vector x matrix
        return _multiplyVectorMatrix(matrix, m, z[1], function (i, j) {
          // value[i]
          return value.get([i, j]);
        });
      }
      throw new Error('Can only multiply a 1 or 2 dimensional matrix ' +
                      '(value has ' + z.length + ' dimensions)');
    }

    // check value is an array
    if (isArray(value)) {
      // array size
      var s = array.size(value);
      // check value is a vector
      if (s.length === 1) {
        // vectors must have same length
        if (s[0] !== m)
          throw new RangeError('Dimension mismatch in multiplication. Vectors must have the same length.');
        // multiply vector x vector
        return _multiplyVectorVector(matrix, m, function (i) {
          // value[i]
          return value[i];
        });
      }
      if (s.length === 2) {
        // vector length must be equal rows in matrix
        if (s[0] !== m)
          throw new RangeError('Dimension mismatch in multiplication. Matrix rows and Vector length must be equal.');
        // mutiply vector x matrix
        return _multiplyVectorMatrix(matrix, m, s[1], function (i, j) {
          // value[i]
          return value[i][j];
        });
      }
      throw new Error('Can only multiply a 1 or 2 dimensional matrix ' +
                      '(value has ' + s.length + ' dimensions)');
    }
    
    // value is a scalar
    return matrix.map(function (v) {
      return math.multiply(value, v);
    });
  };
  
  var _multiplyVectorVector = function (matrix, m, get) {
    // check empty vector
    if (m === 0)
      throw new Error('Cannot multiply two empty vectors');
    // result
    var result = 0;
    // loop data
    for (var i = 0; i < m; i++) {
      // multiply and accumulate
      result = math.add(result, math.multiply(matrix._data[i], get(i)));
    }
    return result;
  };
                        
  var _multiplyVectorMatrix = function (matrix, m, n, get) {
    // result
    var result = [];
    // loop columns in matrix
    for (var j = 0; j < n; j++) {
      // sum
      var sum = 0;
      // loop vector
      for (var i = 0; i < m; i++) {
        // multiply and accumulate
        sum = math.add(sum, math.multiply(matrix._data[i], get(i, j)));
      }
      result[j] = sum;
    }
    // check we need to squeeze the result into a scalar
    if (n === 1)
      return result[0];
    // return matrix
    return new DenseMatrix({
      data: result,
      size: [n]
    });
  };
      
  var _multiplyMatrix = function (matrix, m, n, value) {
    // check value is a matrix
    if (value instanceof Matrix) {
      // matrix size
      var z = value.size();
      // check value is a vector
      if (z.length === 1) {
        // vectors must have same length
        if (z[0] !== n)
          throw new RangeError('Dimension mismatch in multiplication. Matrix columns must match vector length.');
        // multiply matrix vector
        return _multiplyMatrixVector(matrix, m, n, function (i) {
          // value[i]
          return value.get([i]);
        });
      }
      // check two dimensions matrix
      if (z.length === 2) {        
        // vector length must be equal rows in matrix
        if (z[0] !== n) {
          throw new RangeError('Dimension mismatch in multiplication. ' +
                               'Columns of A must match length of B ' +
                               '(A is ' + m + 'x' + n +
                               ', B is ' + z[0] + ', ' +
                               n + ' != ' + z[0] + ')');
        }
        // mutiply vector x matrix
        return _multiplyMatrixMatrix(matrix, m, n, z[1], function (i, j) {
          // value[i, j]
          return value.get([i, j]);
        });
      }
      throw new Error('Can only multiply a 1 or 2 dimensional matrix ' +
                      '(value has ' + z.length + ' dimensions)');
    }

    // check value is an array
    if (isArray(value)) {
      // array size
      var s = array.size(value);
      // check value is a vector
      if (s.length === 1) {
        // vectors must have same length
        if (s[0] !== n)
          throw new RangeError('Dimension mismatch in multiplication. Matrix columns must match vector length.');
        // multiply matrix vector
        return _multiplyMatrixVector(matrix, m, n, function (i) {
          // value[i]
          return value[i];
        });
      }
      if (s.length === 2) {
        // vector length must be equal rows in matrix
        if (s[0] !== n) {
          throw new RangeError('Dimension mismatch in multiplication. ' +
                               'Columns of A must match length of B ' +
                               '(A is ' + m + 'x' + n +
                               ', B is ' + s[0] + ', ' +
                               n + ' != ' + s[0] + ')');
        }
        // mutiply vector x matrix
        return _multiplyMatrixMatrix(matrix, m, n, s[1], function (i, j) {
          // value[i, j]
          return value[i][j];
        });
      }
      throw new Error('Can only multiply a 1 or 2 dimensional matrix ' +
                      '(value has ' + s.length + ' dimensions)');
    }

    // value is a scalar
    return matrix.map(function (v) {
      return math.multiply(value, v);
    });
  };
  
  var _multiplyMatrixVector = function (matrix, m, n, get) {
    // result
    var result = [];
    // loop matrix rows
    for (var i = 0; i < m; i++) {
      // current row
      var row = matrix._data[i];
      // sum
      var sum = 0;
      // loop matrix columns
      for (var j = 0; j < n; j++) {
        // multiply & accumulate
        sum = math.add(sum, math.multiply(row[j], get(j)));
      }
      result[i] = sum;
    }
    // check we need to squeeze the result into a scalar
    if (m === 1)
      return result[0];
    // return matrix
    return new DenseMatrix({
      data: result,
      size: [m]
    });
  };
  
  var _multiplyMatrixMatrix = function (matrix, m, n, c, get) {
    // result
    var result = [];
    // loop matrix rows
    for (var i = 0; i < m; i++) {
      // current row
      var row = matrix._data[i];
      // initialize row array
      result[i] = [];
      // loop other matrix columns
      for (var j = 0; j < c; j++) {
        // sum
        var sum = 0;
        // loop matrix columns
        for (var x = 0; x < n; x++) {
          // multiply & accumulate
          sum = math.add(sum, math.multiply(row[x], get(x, j)));
        }
        result[i][j] = sum;
      }
    }
    // check we need to squeeze the result into a scalar
    if (m === 1 && c === 1)
      return result[0][0];
    // return matrix
    return new DenseMatrix({
      data: result,
      size: [m, c]
    });
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
