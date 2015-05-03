'use strict';

var util = require('../../util/index');
var DimensionError = require('../../error/DimensionError');

var array = util.array;
var object = util.object;
var string = util.string;
var number = util.number;

var isArray = Array.isArray;
var isNumber = number.isNumber;
var isInteger = number.isInteger;
var isString = string.isString;

var validateIndex = array.validateIndex;

function factory (type, config, load) {

  var equalScalar = load(require('../../function/relational/equalScalar'));
  
  var Matrix = type.Matrix;
  
  /**
   * Sparse Matrix implementation. This type implements a Compressed Column Storage format
   * for sparse matrices.
   */
  function SparseMatrix(data, datatype) {
    if (!(this instanceof SparseMatrix))
      throw new SyntaxError('Constructor must be called with the new operator');
    if (datatype && !isString(datatype))
      throw new Error('Invalid datatype: ' + datatype);
    
    if (data instanceof Matrix) {
      // create from matrix
      _createFromMatrix(this, data, datatype);
    }
    else if (data && isArray(data.index) && isArray(data.ptr) && isArray(data.size)) {
      // initialize fields
      this._values = data.values;
      this._index = data.index;
      this._ptr = data.ptr;
      this._size = data.size;
      this._datatype = datatype || data.datatype;
    }
    else if (isArray(data)) {
      // create from array
      _createFromArray(this, data, datatype);
    }
    else if (data) {
      // unsupported type
      throw new TypeError('Unsupported type of data (' + util.types.type(data) + ')');
    }
    else {
      // nothing provided
      this._values = [];
      this._index = [];
      this._ptr = [0];
      this._size = [0];
      this._datatype = datatype;
    }
  }
  
  var _createFromMatrix = function (matrix, source, datatype) {
    // check matrix type
    if (source.type === 'SparseMatrix') {
      // clone arrays
      matrix._values = source._values ? object.clone(source._values) : undefined;
      matrix._index = object.clone(source._index);
      matrix._ptr = object.clone(source._ptr);
      matrix._size = object.clone(source._size);
      matrix._datatype = datatype || source._datatype;
    }
    else {
      // build from matrix data
      _createFromArray(matrix, source.valueOf(), datatype || source._datatype);
    }
  };
  
  var _createFromArray = function (matrix, data, datatype) {
    // initialize fields
    matrix._values = [];
    matrix._index = [];
    matrix._ptr = [];
    matrix._datatype = datatype;
    // discover rows & columns, do not use math.size() to avoid looping array twice
    var rows = data.length;
    var columns = 0;

    // check we have rows (empty array)
    if (rows > 0) {
      // column index
      var j = 0;
      do {
        // store pointer to values index
        matrix._ptr.push(matrix._values.length);
        // loop rows
        for (var i = 0; i < rows; i++) {
          // current row
          var row = data[i];
          // check row is an array
          if (isArray(row)) {
            // update columns if needed (only on first column)
            if (j ===0 && columns < row.length)
              columns = row.length;
            // check row has column
            if (j < row.length) {
              // value
              var v = row[j];
              // check value != 0
              if (!equalScalar(v, 0)) {
                // store value
                matrix._values.push(v);
                // index
                matrix._index.push(i);
              }
            }
          }
          else {
            // update columns if needed (only on first column)
            if (j === 0 && columns < 1)
              columns = 1;
            // check value != 0 (row is a scalar)
            if (!equalScalar(row, 0)) {
              // store value
              matrix._values.push(row);
              // index
              matrix._index.push(i);
            }
          }
        }
        // increment index
        j++;      
      }
      while (j < columns);
    }
    // store number of values in ptr
    matrix._ptr.push(matrix._values.length);
    // size
    matrix._size = [rows, columns];
  };
  
  SparseMatrix.prototype = new type.Matrix();

  SparseMatrix.prototype.type = 'SparseMatrix';
  
  /**
   * Get the storage format used by the matrix.
   *
   * Usage:
   *     var format = matrix.storage()                   // retrieve storage format
   *
   * @return {string}           The storage format.
   */
  SparseMatrix.prototype.storage = function () {
    return 'sparse';
  };

  /**
   * Get the datatype of the data stored in the matrix.
   *
   * Usage:
   *     var format = matrix.datatype()                   // retrieve matrix datatype
   *
   * @return {string}           The datatype.
   */
  SparseMatrix.prototype.datatype = function () {
    return this._datatype;
  };
  
  /**
   * Get the matrix density.
   *
   * Usage:
   *     var density = matrix.density()                   // retrieve matrix density
   *
   * @return {number}           The matrix density.
   */
  SparseMatrix.prototype.density = function () {
    // rows & columns
    var rows = this._size[0];
    var columns = this._size[1];
    // calculate density
    return rows !== 0 && columns !== 0 ? (this._index.length / (rows * columns)) : 0;
  };
  
  /**
   * Get a subset of the matrix, or replace a subset of the matrix.
   *
   * Usage:
   *     var subset = matrix.subset(index)               // retrieve subset
   *     var value = matrix.subset(index, replacement)   // replace subset
   *
   * @param {Index} index
   * @param {Array | Maytrix | *} [replacement]
   * @param {*} [defaultValue=0]      Default value, filled in on new entries when
   *                                  the matrix is resized. If not provided,
   *                                  new matrix elements will be filled with zeros.
   */
  SparseMatrix.prototype.subset = function (index, replacement, defaultValue) {	
	// check it is a pattern matrix
    if (!this._values)
      throw new Error('Cannot invoke subset on a Pattern only matrix');

    // check arguments
    switch (arguments.length) {
      case 1:
        return _getsubset(this, index);

        // intentional fall through
      case 2:
      case 3:
        return _setsubset(this, index, replacement, defaultValue);

      default:
        throw new SyntaxError('Wrong number of arguments');
    }
  };
  
  var _getsubset = function (matrix, index) {
    // check index
    if (!(index instanceof type.Index)) {
      throw new TypeError('Invalid index');
    }

    var isScalar = index.isScalar();
    if (isScalar) {
      // return a scalar
      return matrix.get(index.min());
    }
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

    // map callback
    var callback = function (v) {
      // return value
      return v;
    };
    // get sub-matrix
    return _map(matrix, min[0], max[0], min[1], max[1], callback, false);
  };
  
  var _setsubset = function (matrix, index, submatrix, defaultValue) {
    // check index
    if (!(index instanceof type.Index)) {
      throw new TypeError('Invalid index');
    }
    
    // get index size and check whether the index contains a single value
    var iSize = index.size(),
        isScalar = index.isScalar();
    
    // calculate the size of the submatrix, and convert it into an Array if needed
    var sSize;
    if (submatrix instanceof type.Matrix) {
      // submatrix size
      sSize = submatrix.size();
      // use array representation
      submatrix = submatrix.toArray();
    }
    else {
      // get submatrix size (array, scalar)
      sSize = array.size(submatrix);
    }
    
    // check index is a scalar
    if (isScalar) {
      // verify submatrix is a scalar
      if (sSize.length !== 0) {
        throw new TypeError('Scalar expected');
      }
      // set value
      matrix.set(index.min(), submatrix, defaultValue);
    }
    else {
      // validate dimensions, index size must be one or two dimensions
      if (iSize.length !== 1 && iSize.length !== 2) {
        throw new DimensionError(iSize.length, matrix._size.length, '<');
      }
      
      // check submatrix and index have the same dimensions
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
      
      // offsets
      var x0 = index.min()[0];
      var y0 = index.min()[1];      
      
      // submatrix rows and columns
      var m = sSize[0];
      var n = sSize[1];

      // loop submatrix
      for (var x = 0; x < m; x++) {
        // loop columns
        for (var y = 0; y < n; y++) {
          // value at i, j
          var v = submatrix[x][y];
          // invoke set (zero value will remove entry from matrix)
          matrix.set([x + x0, y + y0], v, defaultValue);
        }
      }
    }
    return matrix;
  };

  /**
   * Get a single element from the matrix.
   * @param {Number[]} index   Zero-based index
   * @return {*} value
   */
  SparseMatrix.prototype.get = function (index) {
    if (!isArray(index))
      throw new TypeError('Array expected');
    if (index.length != this._size.length)
      throw new DimensionError(index.length, this._size.length);

    // check it is a pattern matrix
    if (!this._values)
      throw new Error('Cannot invoke get on a Pattern only matrix');

    // row and column
    var i = index[0];
    var j = index[1];

    // check i, j are valid
    validateIndex(i, this._size[0]);
    validateIndex(j, this._size[1]);

    // find value index
    var k = _getValueIndex(i, this._ptr[j], this._ptr[j + 1], this._index);
    // check k is prior to next column k and it is in the correct row
    if (k < this._ptr[j + 1] && this._index[k] === i)
      return object.clone(this._values[k]);

    return 0;
  };
  
  /**
   * Replace a single element in the matrix.
   * @param {Number[]} index   Zero-based index
   * @param {*} value
   * @param {*} [defaultValue]        Default value, filled in on new entries when
   *                                  the matrix is resized. If not provided,
   *                                  new matrix elements will be set to zero.
   * @return {SparseMatrix} self
   */
  SparseMatrix.prototype.set = function (index, v, defaultValue) {
    if (!isArray(index))
      throw new TypeError('Array expected');
    if (index.length != this._size.length)
      throw new DimensionError(index.length, this._size.length);

    // check it is a pattern matrix
    if (!this._values)
      throw new Error('Cannot invoke set on a Pattern only matrix');
      
    // row and column
    var i = index[0];
    var j = index[1];

    // rows & columns
    var rows = this._size[0];
    var columns = this._size[1];

    // check we need to resize matrix
    if (i > rows - 1 || j > columns - 1) {
      // resize matrix
      _resize(this, Math.max(i + 1, rows), Math.max(j + 1, columns), defaultValue);
      // update rows & columns
      rows = this._size[0];
      columns = this._size[1];
    }

    // check i, j are valid
    validateIndex(i, rows);
    validateIndex(j, columns);

    // find value index
    var k = _getValueIndex(i, this._ptr[j], this._ptr[j + 1], this._index);
    // check k is prior to next column k and it is in the correct row
    if (k < this._ptr[j + 1] && this._index[k] === i) {
      // check value != 0
      if (!equalScalar(v, 0)) {
        // update value
        this._values[k] = v;
      }
      else {
        // remove value from matrix
        _remove(k, j, this._values, this._index, this._ptr);
      }
    }
    else {
      // insert value @ (i, j)
      _insert(k, i, j, v, this._values, this._index, this._ptr);
    }

    return this;
  };
  
  var _getValueIndex = function(i, top, bottom, index) {
    // check row is on the bottom side
    if (bottom - top === 0 || i > index[bottom - 1])
      return bottom;
    // loop until we find row index
    while (top < bottom) {
      // point in the middle (fast integer division)
      var p = ~~((top + bottom) / 2);
      // row @ p
      var r = index[p];
      // check we have to look on the top side, bottom side or we found the row
      if (i < r)
        bottom = p;
      else if (i > r)
        top = p + 1;
      else
        return p;
    }
    return top;
  };

  var _remove = function (k, j, values, index, ptr) {
    // remove value @ k
    values.splice(k, 1);
    index.splice(k, 1);
    // update pointers
    for (var x = j + 1; x < ptr.length; x++)
      ptr[x]--;
  };

  var _insert = function (k, i, j, v, values, index, ptr) {
    // insert value
    values.splice(k, 0, v);
    // update row for k
    index.splice(k, 0, i);
    // update column pointers
    for (var x = j + 1; x < ptr.length; x++)
      ptr[x]++;
  };
  
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
  SparseMatrix.prototype.resize = function (size, defaultValue, copy) {    
    // validate arguments
    if (!isArray(size))
      throw new TypeError('Array expected');
    if (size.length !== 2)
      throw new Error('Only two dimensions matrix are supported');

    // check sizes
    size.forEach(function (value) {
      if (!number.isNumber(value) || !number.isInteger(value) || value < 0) {
        throw new TypeError('Invalid size, must contain positive integers ' +
                            '(size: ' + string.format(size) + ')');
      }
    });
    
    // matrix to resize
    var m = copy ? this.clone() : this;
    // resize matrix
    return _resize(m, size[0], size[1], defaultValue);
  };
  
  var _resize = function (matrix, rows, columns, defaultValue) {
    // value to insert at the time of growing matrix
    var value = defaultValue || 0;
    // should we insert the value?
    var ins = !equalScalar(value, 0);

    // old columns and rows
    var r = matrix._size[0];
    var c = matrix._size[1];

    var i, j, k;

    // check we need to increase columns
    if (columns > c) {
      // loop new columns
      for (j = c; j < columns; j++) {
        // update matrix._ptr for current column
        matrix._ptr[j] = matrix._values.length;
        // check we need to insert matrix._values
        if (ins) {
          // loop rows
          for (i = 0; i < r; i++) {
            // add new matrix._values
            matrix._values.push(value);
            // update matrix._index
            matrix._index.push(i);
          }
        }        
      }
      // store number of matrix._values in matrix._ptr
      matrix._ptr[columns] = matrix._values.length;
    }
    else if (columns < c) {
      // truncate matrix._ptr
      matrix._ptr.splice(columns + 1, c - columns);
      // truncate matrix._values and matrix._index
      matrix._values.splice(matrix._ptr[columns], matrix._values.length);
      matrix._index.splice(matrix._ptr[columns], matrix._index.length);
    }
    // update columns
    c = columns;

    // check we need to increase rows
    if (rows > r) {
      // check we have to insert values
      if (ins) {
        // inserts
        var n = 0;
        // loop columns
        for (j = 0; j < c; j++) {
          // update matrix._ptr for current column
          matrix._ptr[j] = matrix._ptr[j] + n;
          // where to insert matrix._values
          k = matrix._ptr[j + 1] + n;
          // pointer
          var p = 0;
          // loop new rows, initialize pointer
          for (i = r; i < rows; i++, p++) {
            // add value
            matrix._values.splice(k + p, 0, value);
            // update matrix._index
            matrix._index.splice(k + p, 0, i);
            // increment inserts
            n++;
          }
        }
        // store number of matrix._values in matrix._ptr
        matrix._ptr[c] = matrix._values.length;
      }
    }
    else if (rows < r) {
      // deletes
      var d = 0;
      // loop columns
      for (j = 0; j < c; j++) {
        // update matrix._ptr for current column
        matrix._ptr[j] = matrix._ptr[j] - d;
        // where matrix._values start for next column
        var k0 = matrix._ptr[j];
        var k1 = matrix._ptr[j + 1] - d;
        // loop matrix._index
        for (k = k0; k < k1; k++) {
          // row
          i = matrix._index[k];
          // check we need to delete value and matrix._index
          if (i > rows - 1) {
            // remove value
            matrix._values.splice(k, 1);
            // remove item from matrix._index
            matrix._index.splice(k, 1);
            // increase deletes
            d++;
          }
        }
      }
      // update matrix._ptr for current column
      matrix._ptr[j] = matrix._values.length;
    }
    // update matrix._size
    matrix._size[0] = rows;
    matrix._size[1] = columns;
    // return matrix
    return matrix;
  };
  
  /**
   * Create a clone of the matrix
   * @return {SparseMatrix} clone
   */
  SparseMatrix.prototype.clone = function () {
    var m = new SparseMatrix({
      values: this._values ? object.clone(this._values) : undefined,
      index: object.clone(this._index),
      ptr: object.clone(this._ptr),
      size: object.clone(this._size),
      datatype: this._datatype
    });
    return m;
  };
  
  /**
   * Retrieve the size of the matrix.
   * @returns {Number[]} size
   */
  SparseMatrix.prototype.size = function() {
    return object.clone(this._size);
  };
  
  /**
   * Create a new matrix with the results of the callback function executed on
   * each entry of the matrix.
   * @param {function} callback   The callback function is invoked with three
   *                              parameters: the value of the element, the index
   *                              of the element, and the Matrix being traversed.
   * @param {boolean} [skipZeros] Invoke callback function for non-zero values only.
   *
   * @return {SparseMatrix} matrix
   */
  SparseMatrix.prototype.map = function (callback, skipZeros) {
    // check it is a pattern matrix
    if (!this._values)
      throw new Error('Cannot invoke map on a Pattern only matrix');
    // matrix instance
    var me = this;
    // rows and columns
    var rows = this._size[0];
    var columns = this._size[1];
    // invoke callback
    var invoke = function (v, i, j) {
      // invoke callback
      return callback(v, [i, j], me);
    };
    // invoke _map
    return _map(this, 0, rows - 1, 0, columns - 1, invoke, skipZeros);
  };

  /**
   * Create a new matrix with the results of the callback function executed on the interval
   * [minRow..maxRow, minColumn..maxColumn].
   */
  var _map = function (matrix, minRow, maxRow, minColumn, maxColumn, callback, skipZeros) {
    // result arrays
    var values = [];
    var index = [];
    var ptr = [];
    // invoke callback
    var invoke = function (v, x, y) {
      // invoke callback
      v = callback(v, x, y);
      // check value != 0
      if (!equalScalar(v, 0)) {
        // store value
        values.push(v);
        // index
        index.push(x);
      }
    };
    // loop columns
    for (var j = minColumn; j <= maxColumn; j++) {
      // store pointer to values index
      ptr.push(values.length);
      // k0 <= k < k1 where k0 = _ptr[j] && k1 = _ptr[j+1]
      var k0 = matrix._ptr[j];
      var k1 = matrix._ptr[j + 1];
      // row pointer
      var p = minRow;
      // loop k within [k0, k1[
      for (var k = k0; k < k1; k++) {
        // row index
        var i = matrix._index[k];
        // check i is in range
        if (i >= minRow && i <= maxRow) {
          // zero values
          if (!skipZeros) {
           for (var x = p; x < i; x++)
             invoke(0, x - minRow, j - minColumn);
          }
          // value @ k
          invoke(matrix._values[k], i - minRow, j - minColumn);
        }
        // update pointer
        p = i + 1;
      }
      // zero values
      if (!skipZeros) {
        for (var y = p; y <= maxRow; y++)
          invoke(0, y - minRow, j - minColumn);
      }
    }
    // store number of values in ptr
    ptr.push(values.length);
    // return ccs
    return new SparseMatrix({
      values: values,
      index: index,
      ptr: ptr,
      size: [maxRow - minRow + 1, maxColumn - minColumn + 1]
    });
  };
  
  /**
   * Execute a callback function on each entry of the matrix.
   * @param {function} callback   The callback function is invoked with three
   *                              parameters: the value of the element, the index
   *                              of the element, and the Matrix being traversed.
   * @param {boolean} [skipZeros] Invoke callback function for non-zero values only.
   */
  SparseMatrix.prototype.forEach = function (callback, skipZeros) {
    // check it is a pattern matrix
    if (!this._values)
      throw new Error('Cannot invoke forEach on a Pattern only matrix');
    // matrix instance
    var me = this;
    // rows and columns
    var rows = this._size[0];
    var columns = this._size[1];
    // loop columns
    for (var j = 0; j < columns; j++) {
      // k0 <= k < k1 where k0 = _ptr[j] && k1 = _ptr[j+1]
      var k0 = this._ptr[j];
      var k1 = this._ptr[j + 1];
      // column pointer
      var p = 0;
      // loop k within [k0, k1[
      for (var k = k0; k < k1; k++) {
        // row index
        var i = this._index[k];
        // check we need to process zeros
        if (!skipZeros) {
          // zero values
          for (var x = p; x < i; x++)
            callback(0, [x, j], me);
        }
        // value @ k
        callback(this._values[k], [i, j], me);
        // update pointer
        p = i + 1;
      }
      // check we need to process zeros
      if (!skipZeros) {
        // zero values
        for (var y = p; y < rows; y++)
          callback(0, [y, j], me);
      }
    }
  };
  
  /**
   * Create an Array with a copy of the data of the SparseMatrix
   * @returns {Array} array
   */
  SparseMatrix.prototype.toArray = function () {
    return _toArray(this._values, this._index, this._ptr, this._size, true);
  };

  /**
   * Get the primitive value of the SparseMatrix: a two dimensions array
   * @returns {Array} array
   */
  SparseMatrix.prototype.valueOf = function () {
    return _toArray(this._values, this._index, this._ptr, this._size, false);
  };
  
  var _toArray = function (values, index, ptr, size, copy) {
    // rows and columns
    var rows = size[0];
    var columns = size[1];
    // result
    var a = new Array(rows);
    // vars
    var i, j;
    // initialize array
    for (i = 0; i < rows; i++) {
      a[i] = new Array(columns);
      for (j = 0; j < columns; j++)
        a[i][j] = 0;
    }

    // loop columns
    for (j = 0; j < columns; j++) {
      // k0 <= k < k1 where k0 = _ptr[j] && k1 = _ptr[j+1]
      var k0 = ptr[j];
      var k1 = ptr[j + 1];
      // loop k within [k0, k1[
      for (var k = k0; k < k1; k++) {
        // row index
        i = index[k];
        // set value (use one for pattern matrix)
        a[i][j] = values ? (copy ? object.clone(values[k]) : values[k]) : 1;
      }
    }
    return a;
  };
  
  /**
   * Get a string representation of the matrix, with optional formatting options.
   * @param {Object | Number | Function} [options]  Formatting options. See
   *                                                lib/util/number:format for a
   *                                                description of the available
   *                                                options.
   * @returns {String} str
   */
  SparseMatrix.prototype.format = function (options) {
    // rows and columns
    var rows = this._size[0];
    var columns = this._size[1];
    // density
    var density = this.density();
    // rows & columns
    var str = 'Sparse Matrix [' + string.format(rows, options) + ' x ' + string.format(columns, options) + '] density: ' + string.format(density, options) + '\n';
    // loop columns
    for (var j = 0; j < columns; j++) {
      // k0 <= k < k1 where k0 = _ptr[j] && k1 = _ptr[j+1]
      var k0 = this._ptr[j];
      var k1 = this._ptr[j + 1];
      // loop k within [k0, k1[
      for (var k = k0; k < k1; k++) {
        // row index
        var i = this._index[k];
        // append value
        str += '\n    (' + string.format(i, options) + ', ' + string.format(j, options) + ') ==> ' + (this._values ? string.format(this._values[k], options) : 'X');
      }
    }
    return str;
  };
  
  /**
   * Get a string representation of the matrix
   * @returns {String} str
   */
  SparseMatrix.prototype.toString = function () {
    return string.format(this.toArray());
  };
  
  /**
   * Get a JSON representation of the matrix
   * @returns {Object}
   */
  SparseMatrix.prototype.toJSON = function () {
    return {
      mathjs: 'SparseMatrix',
      values: this._values,
      index: this._index,
      ptr: this._ptr,
      size: this._size,
      datatype: this._datatype
    };
  };

  /**
   * Get the kth Matrix diagonal.
   *
   * @param {Number | BigNumber} [k=0]     The kth diagonal where the vector will retrieved.
   *
   * @returns {Matrix}                     The matrix vector with the diagonal values.
   */
  SparseMatrix.prototype.diagonal = function(k) {
    // validate k if any
    if (k) {
      // convert BigNumber to a number
      if (k instanceof type.BigNumber)
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
    
    // diagonal arrays
    var values = [];
    var index = [];
    var ptr = [];
    // initial ptr value
    ptr[0] = 0;
    // loop columns
    for (var j = kSuper; j < columns && values.length < n; j++) {
      // k0 <= k < k1 where k0 = _ptr[j] && k1 = _ptr[j+1]
      var k0 = this._ptr[j];
      var k1 = this._ptr[j + 1];
      // loop x within [k0, k1[
      for (var x = k0; x < k1; x++) {
        // row index
        var i = this._index[x];
        // check row
        if (i === j - kSuper + kSub) {
          // value on this column
          values.push(object.clone(this._values[x]));
          // store row
          index[values.length - 1] = i - kSub;
          // exit loop
          break;
        }
      }
    }
    // close ptr
    ptr.push(values.length);
    // return matrix
    return new SparseMatrix({
      values: values,
      index: index,
      ptr: ptr,
      size: [n, 1]
    });
  };
  
  /**
   * Generate a matrix from a JSON object
   * @param {Object} json  An object structured like
   *                       `{"mathjs": "SparseMatrix", "values": [], "index": [], "ptr": [], "size": []}`,
   *                       where mathjs is optional
   * @returns {SparseMatrix}
   */
  SparseMatrix.fromJSON = function (json) {
    return new SparseMatrix(json);
  };

  /**
   * Create a diagonal matrix.
   *
   * @param {Array} size                       The matrix size.
   * @param {Number | Array | Matrix } value   The values for the diagonal.
   * @param {Number | BigNumber} [k=0]         The kth diagonal where the vector will be filled in.
   *
   * @returns {SparseMatrix}
   */
  SparseMatrix.diagonal = function (size, value, k) {
    if (!isArray(size))
      throw new TypeError('Array expected, size parameter');
    if (size.length !== 2)
      throw new Error('Only two dimensions matrix are supported');
    
    // map size & validate
    size = size.map(function (s) {
      // check it is a big number
      if (s instanceof type.BigNumber) {
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
      if (k instanceof type.BigNumber)
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
    else if (value instanceof type.Matrix) {
      // matrix size
      var ms = value.size();
      // validate matrix
      if (ms.length !== 1 || ms[0] !== n) {
        // number of values in array must be n
        throw new Error('Invalid matrix length');
      }
      // define function
      _value = function (i) {
        // return value @ i
        return value.get([i]);
      };
    }
    else {
      // define function
      _value = function () {
        // return value
        return value;
      };
    }
    
    // create arrays
    var values = [];
    var index = [];
    var ptr = [];
    
    // loop items
    for (var j = 0; j < columns; j++) {
      // number of rows with value
      ptr.push(values.length);
      // diagonal index
      var i = j - kSuper;      
      // check we need to set diagonal value
      if (i >= 0 && i < n) {
        // get value @ i
        var v = _value(i);
        // check for zero
        if (!equalScalar(v, 0)) {
          // column
          index.push(i + kSub);
          // add value
          values.push(v);
        }
      }
    }
    // last value should be number of values
    ptr.push(values.length);
    // create SparseMatrix
    return new SparseMatrix({
      values: values,
      index: index,
      ptr: ptr,
      size: [rows, columns]
    });
  };
  
  /**
   * Swap rows i and j in Matrix.
   *
   * @param {Number} i       Matrix row index 1
   * @param {Number} j       Matrix row index 2
   *
   * @return {Matrix}        The matrix reference
   */
  SparseMatrix.prototype.swapRows = function (i, j) {
    // check index
    if (!isNumber(i) || !isInteger(i) || !isNumber(j) || !isInteger(j)) {
      throw new Error('Row index must be positive integers');
    }
    // check dimensions
    if (this._size.length !== 2) {
      throw new Error('Only two dimensional matrix is supported');
    }
    // validate index
    validateIndex(i, this._size[0]);
    validateIndex(j, this._size[0]);
    
    // swap rows
    SparseMatrix._swapRows(i, j, this._size[1], this._values, this._index, this._ptr);
    // return current instance
    return this;
  };
  
  /**
   * Loop rows with data in column j.
   *
   * @param (Number} j            Column
   * @param {Array} values        Matrix values
   * @param {Array} index         Matrix row indeces
   * @param {Array} ptr           Matrix column pointers
   * @param {function} callback   Callback function invoked for every row in column j
   */
  SparseMatrix._forEachRow = function (j, values, index, ptr, callback) {
    // indeces for column j
    var k0 = ptr[j];
    var k1 = ptr[j + 1];
    // loop
    for (var k = k0; k < k1; k++) {
      // invoke callback
      callback(index[k], values[k]);
    }
  };
  
  /**
   * Swap rows x and y in Sparse Matrix data structures.
   *
   * @param {Number} x         Matrix row index 1
   * @param {Number} y         Matrix row index 2
   * @param {Number} columns   Number of columns in matrix
   * @param {Array} values     Matrix values
   * @param {Array} index      Matrix row indeces
   * @param {Array} ptr        Matrix column pointers
   */
  SparseMatrix._swapRows = function (x, y, columns, values, index, ptr) {
    // loop columns
    for (var j = 0; j < columns; j++) {
      // k0 <= k < k1 where k0 = _ptr[j] && k1 = _ptr[j+1]
      var k0 = ptr[j];
      var k1 = ptr[j + 1];
      // find value index @ x
      var kx = _getValueIndex(x, k0, k1, index);
      // find value index @ x
      var ky = _getValueIndex(y, k0, k1, index);
      // check both rows exist in matrix
      if (kx < k1 && ky < k1 && index[kx] === x && index[ky] === y) {
        // swap values (check for pattern matrix)
        if (values) {
          var v = values[kx];
          values[kx] = values[ky];
          values[ky] = v;
        }
        // next column
        continue;
      }
      // check x row exist & no y row
      if (kx < k1 && index[kx] === x && (ky >= k1 || index[ky] !== y)) {
        // value @ x (check for pattern matrix)
        var vx = values ? values[kx] : undefined;
        // insert value @ y
        index.splice(ky, 0, y);
        if (values)
          values.splice(ky, 0, vx);        
        // remove value @ x (adjust array index if needed)
        index.splice(ky <= kx ? kx + 1 : kx, 1);
        if (values)
          values.splice(ky <= kx ? kx + 1 : kx, 1);
        // next column
        continue;
      }
      // check y row exist & no x row
      if (ky < k1 && index[ky] === y && (kx >= k1 || index[kx] !== x)) {
        // value @ y (check for pattern matrix)
        var vy = values ? values[ky] : undefined;
        // insert value @ x
        index.splice(kx, 0, x);
        if (values)
          values.splice(kx, 0, vy);
        // remove value @ y (adjust array index if needed)
        index.splice(kx <= ky ? ky + 1 : ky, 1);
        if (values)
          values.splice(kx <= ky ? ky + 1 : ky, 1);
      }
    }
  };

  // register this type in the base class Matrix
  type.Matrix._storage.sparse = SparseMatrix;

  return SparseMatrix;
}

exports.name = 'SparseMatrix';
exports.path = 'type';
exports.factory = factory;
