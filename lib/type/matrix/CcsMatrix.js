'use strict';

var util = require('../../util/index');
var DimensionError = require('../../error/DimensionError');

var array = util.array;
var object = util.object;
var string = util.string;
var number = util.number;

var isArray = Array.isArray;
var validateIndex = array.validateIndex;

module.exports = function (math) {
  
  var Index = math.type.Index,
      Matrix = math.type.Matrix;
  
  function CcsMatrix(data) {
    if (!(this instanceof CcsMatrix))
      throw new SyntaxError('Constructor must be called with the new operator');

    if (data instanceof Matrix) {
      // check data is a CcsMatrix
      if (data.type === 'CcsMatrix') {
        // clone arrays
        this._values = object.clone(data._values);
        this._index = object.clone(data._index);
        this._ptr = object.clone(data._ptr);
        this._size = object.clone(data._size);
      }
      else {
        // build data from existing matrix
        _createFromArray(this, data.toArray());
      }
    }
    else if (data && isArray(data.values) && isArray(data.index) && isArray(data.ptr)) {
      // initialize fields
      this._values = data.values;
      this._index = data.index;
      this._ptr = data.ptr;
      this._size = data.size;
    }
    else if (isArray(data)) {
      // create from array
      _createFromArray(this, data);
    }
    else if (data != null) {
      // unsupported type
      throw new TypeError('Unsupported type of data (' + util.types.type(data) + ')');
    }
    else {
      // nothing provided
      this._values = [];
      this._index = [];
      this._ptr = [0];
      this._size = [0];
    }
  }
  
  var _createFromArray = function (matrix, data) {
    // initialize fields
    matrix._values = [];
    matrix._index = [];
    matrix._ptr = [];
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
              if (!math.equal(v, 0)) {
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
            if (!math.equal(row, 0)) {
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
  
  CcsMatrix.prototype = new math.type.Matrix();

  CcsMatrix.prototype.type = 'CcsMatrix';
  
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
  CcsMatrix.prototype.subset = function (index, replacement, defaultValue) {
    // check replacement or default value were provided
    if (replacement || defaultValue)
      return _set(this, index, replacement, defaultValue);

    // check index
    if (!(index instanceof Index)) {
      throw new TypeError('Invalid index');
    }

    var isScalar = index.isScalar();
    if (isScalar) {
      // return a scalar
      return this.get(index.min());
    }
    else {
      // validate dimensions
      var size = index.size();
      if (size.length != this._size.length) {
        throw new DimensionError(size.length, this._size.length);
      }

      // validate if any of the ranges in the index is out of range
      var min = index.min();
      var max = index.max();
      for (var i = 0, ii = this._size.length; i < ii; i++) {
        validateIndex(min[i], this._size[i]);
        validateIndex(max[i], this._size[i]);
      }

      // map callback
      var callback = function (v) {
        // return value
        return v;
      };
      // get sub-matrix
      return _map(this, min[0], max[0], min[1], max[1], callback, false);
    }
  };
  
  /**
   * Get a single element from the matrix.
   * @param {Number[]} index   Zero-based index
   * @return {*} value
   */
  CcsMatrix.prototype.get = function (index) {
    if (!isArray(index))
      throw new TypeError('Array expected');
    if (index.length != this._size.length)
      throw new DimensionError(index.length, this._size.length);

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
   * @return {CcsMatrix} self
   */
  CcsMatrix.prototype.set = function (index, v, defaultValue) {
    if (!isArray(index))
      throw new TypeError('Array expected');
    if (index.length != this._size.length)
      throw new DimensionError(index.length, this._size.length);

    // row and column
    var i = index[0];
    var j = index[1];

    // rows & columns
    var rows = this._size[0];
    var columns = this._size[1];

    // check we need to resize matrix
    if (i > rows - 1 || j > columns - 1) {
      // resize matrix
      this.resize([Math.max(i + 1, rows), Math.max(j + 1, columns)], defaultValue);
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
      if (!math.equal(v, 0)) {
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
   * Resize the matrix
   * @param {Number[]} size
   * @param {*} [defaultValue=0]      Default value, filled in on new entries.
   *                                  If not provided, the matrix elements will
   *                                  be filled with zeros.
   * @return {CcsMatrix} self         The matrix itself is returned
   */
  CcsMatrix.prototype.resize = function (size, defaultValue) {
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

    // value to inser at the time of growing matrix
    var value = (defaultValue !== undefined) ? defaultValue : 0;
    // should we insert the value?
    var ins = !math.equal(value, 0);

    // old columns and rows
    var r = this._size[0];
    var c = this._size[1];

    // rows & columns
    var rows = size[0];
    var columns = size[1];

    var i, j, k;

    // check we need to increase columns
    if (columns > c) {
      // loop new columns
      for (j = c; j < columns; j++) {
        // update ptr for current column
        this._ptr[j] = this._values.length;
        // check we need to insert values
        if (ins) {
          // loop rows
          for (i = 0; i < r; i++) {
            // add new values
            this._values.push(value);
            // update index
            this._index.push(i);
          }
        }        
      }
      // store number of values in ptr
      this._ptr[columns] = this._values.length;
    }
    else if (columns < c) {
      // truncate ptr
      this._ptr.splice(columns + 1, c - columns);
      // truncate values and index
      this._values.splice(this._ptr[columns], this._values.length);
      this._index.splice(this._ptr[columns], this._index.length);
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
          // update ptr for current column
          this._ptr[j] = this._ptr[j] + n;
          // where to insert values
          k = this._ptr[j + 1] + n;
          // pointer
          var p = 0;
          // loop new rows, initialize pointer
          for (i = r; i < rows; i++, p++) {
            // add value
            this._values.splice(k + p, 0, value);
            // update index
            this._index.splice(k + p, 0, i);
            // increment inserts
            n++;
          }
        }
        // store number of values in ptr
        this._ptr[c] = this._values.length;
      }
    }
    else if (rows < r) {
      // deletes
      var d = 0;
      // loop columns
      for (j = 0; j < c; j++) {
        // update ptr for current column
        this._ptr[j] = this._ptr[j] - d;
        // where values start for next column
        var k0 = this._ptr[j];
        var k1 = this._ptr[j + 1] - d;
        // loop index
        for (k = k0; k < k1; k++) {
          // row
          i = this._index[k];
          // check we need to delete value and index
          if (i > rows - 1) {
            // remove value
            this._values.splice(k, 1);
            // remove item from index
            this._index.splice(k, 1);
            // increase deletes
            d++;
          }
        }
      }
      // update ptr for current column
      this._ptr[j] = this._values.length;
    }

    // update size
    this._size = [rows, columns];

    // return the matrix itself
    return this;
  };
  
  /**
   * Create a clone of the matrix
   * @return {CcsMatrix} clone
   */
  CcsMatrix.prototype.clone = function () {
    var m = new CcsMatrix({
      values: object.clone(this._values),
      index: object.clone(this._index),
      ptr: object.clone(this._ptr),
      size: object.clone(this._size)
    });
    return m;
  };
  
  /**
   * Retrieve the size of the matrix.
   * @returns {Number[]} size
   */
  CcsMatrix.prototype.size = function() {
    return this._size;
  };
  
  /**
   * Create a new matrix with the results of the callback function executed on
   * each entry of the matrix.
   * @param {function} callback   The callback function is invoked with three
   *                              parameters: the value of the element, the index
   *                              of the element, and the Matrix being traversed.
   * @param {boolean} nonZeros    Invoke callback function for non-zero values only.
   * @return {CcsMatrix} matrix
   */
  CcsMatrix.prototype.map = function (callback, nonZeros) {
    // matrix instance
    var me = this;
    // rows and columns
    var rows = this._size[0];
    var columns = this._size[1];
    // invoke callback
    var invoke = function (v, index) {
      // invoke callback
      return callback(v, index, me);
    };
    // invoke _map
    return _map(this, 0, rows - 1, 0, columns - 1, invoke, !nonZeros);
  };

  /**
   * Create a new matrix with the results of the callback function executed on the interval
   * [minRow..maxRow, minColumn..maxColumn].
   */
  var _map = function (matrix, minRow, maxRow, minColumn, maxColumn, callback, zeros) {
    // result arrays
    var values = [];
    var index = [];
    var ptr = [];
    // invoke callback
    var invoke = function (v, x, y) {
      // invoke callback
      v = callback(v, [x, y]);
      // check value != 0
      if (!math.equal(v, 0)) {
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
          for (var x = p; zeros && x < i; x++)
            invoke(0, x - minRow, j - minColumn);
          // value @ k
          invoke(matrix._values[k], i - minRow, j - minColumn);
        }
        // update pointer
        p = i + 1;
      }
      // zero values
      for (var y = p; zeros && y <= maxRow; y++)
        invoke(0, y - minRow, j - minColumn);
    }
    // store number of values in ptr
    ptr.push(values.length);
    // return ccs
    return new CcsMatrix({
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
   */
  CcsMatrix.prototype.forEach = function (callback) {
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
        // zero values
        for (var x = p; x < i; x++)
          callback(0, [x, j], me);
        // value @ k
        callback(this._values[k], [i, j], me);
        // update pointer
        p = i + 1;
      }
      // zero values
      for (var y = p; y < rows; y++)
        callback(0, [y, j], me);
    }
  };
  
  /**
   * Create an Array with a copy of the data of the CcsMatrix
   * @returns {Array} array
   */
  CcsMatrix.prototype.toArray = function () {
    // result
    var a = [];
    // rows and columns
    var rows = this._size[0];
    var columns = this._size[1];
    // loop columns
    for (var j = 0; j < columns; j++) {
      // k0 <= k < k1 where k0 = _ptr[j] && k1 = _ptr[j+1]
      var k0 = this._ptr[j];
      var k1 = this._ptr[j + 1];
      // row pointer
      var p = 0;
      // loop k within [k0, k1[
      for (var k = k0; k < k1; k++) {
        // row index
        var i = this._index[k];
        // zeros
        for (var x = p; x < i; x++)
          (a[x] = (a[x] || []))[j] = 0;
        // set value
        (a[i] = (a[i] || []))[j] = object.clone(this._values[k]);
        // update pointer
        p = i + 1;
      }
      // zero values
      for (var y = p; y < rows; y++)
        (a[y] = (a[y] || []))[j] = 0;
    }
    return a;
  };

  /**
   * Get the primitive value of the CcsMatrix: a multidimensional array
   * @returns {Array} array
   */
  CcsMatrix.prototype.valueOf = function () {
    // TODO: find a better solution!
    return this.toArray();
  };
  
  /**
   * Get a string representation of the matrix, with optional formatting options.
   * @param {Object | Number | Function} [options]  Formatting options. See
   *                                                lib/util/number:format for a
   *                                                description of the available
   *                                                options.
   * @returns {String} str
   */
  CcsMatrix.prototype.format = function (options) {
    // TODO: find a better solution for sparse matrices!
    return string.format(this.toArray(), options);
  };
  
  /**
   * Get a string representation of the matrix
   * @returns {String} str
   */
  CcsMatrix.prototype.toString = function () {
    // rows and columns
    var rows = this._size[0];
    var columns = this._size[1];
    // rows & columns
    var str = string.format(rows) + ' x ' + string.format(columns) + '\n';
    // values index
    var k = 0;
    // loop columns
    for (var j = 0; j < columns; j++) {
      // k0 <= k < k1 where k0 = _ptr[j] && k1 = _ptr[j+1]
      var k0 = this._ptr[j];
      var k1 = this._ptr[j + 1];
      // check k is within [k0, k1[
      while (k >= k0 && k < k1) {
        // row index
        var i = this._index[k];
        // append value
        str += '\n(' + string.format(i) + ', ' + string.format(j) + ') = ' + string.format(this._values[k]);
        // increment k
        k++;
      }
    }
    return str;
  };
  
  /**
   * Get a JSON representation of the matrix
   * @returns {Object}
   */
  CcsMatrix.prototype.toJSON = function () {
    return {
      mathjs: 'CcsMatrix',
      values: this._values,
      index: this._index,
      ptr: this._ptr,
      size: this._size
    };
  };

  /**
   * Generate a matrix from a JSON object
   * @param {Object} json  An object structured like
   *                       `{"mathjs": "CcsMatrix", "values": [], "index": [], "ptr": [], "size": []}`,
   *                       where mathjs is optional
   * @returns {CcsMatrix}
   */
  CcsMatrix.fromJSON = function (json) {
    return new CcsMatrix(json);
  };

  CcsMatrix.diagonal = function (rows, columns, value) {
    // create arrays
    var values = [];
    var index = [];
    var ptr = [];
    // number of non-zero items
    var n = Math.min(rows, columns);
    // value to store
    var v = value || 1;
    // loop items
    for (var i = 0; i < n; i++) {
      // first row with data
      ptr.push(i);
      // column
      index.push(i);
      // add value
      values.push(v);    
    }
    // last value should be number of values
    ptr.push(values.length);
    // create CcsMatrix
    return new CcsMatrix({
      values: values,
      index: index,
      ptr: ptr,
      size: [rows, columns]
    });
  };

  return CcsMatrix;
};