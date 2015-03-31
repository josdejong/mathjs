'use strict';

var util = require('../../util/index');
var DimensionError = require('../../error/DimensionError');

var array = util.array;
var object = util.object;
var string = util.string;
var number = util.number;

var isArray = Array.isArray;
var isNumber = util.number.isNumber;
var isInteger = util.number.isInteger;

var validateIndex = array.validateIndex;

module.exports = function (math) {

  var Index = math.type.Index,
      BigNumber = math.type.BigNumber,
      Matrix = math.type.Matrix;

  function CrsMatrix(data) {
    if (!(this instanceof CrsMatrix))
      throw new SyntaxError('Constructor must be called with the new operator');

    if (data instanceof Matrix) {
      // check data is a CrsMatrix
      if (data.type === 'CrsMatrix') {
        // clone arrays
        this._values = object.clone(data._values);
        this._index = object.clone(data._index);
        this._ptr = object.clone(data._ptr);
        this._size = object.clone(data._size);
      }
      else {
        // build from matrix data
        _createFromArray(this, data.valueOf());
      }
    }
    else if (data && isArray(data.values) && isArray(data.index) && isArray(data.ptr) && isArray(data.size)) {
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

    // loop rows
    for (var i = 0; i < rows; i++) {
      // store value index in ptr
      matrix._ptr.push(matrix._values.length);
      // current row
      var row = data[i];      
      // check row is an array
      if (isArray(row)) {
        // update columns if needed
        if (row.length > columns)
          columns = row.length;
        // loop columns
        for (var j = 0; j < row.length; j++) {
          // value at data[i][j]
          var v = row[j];
          // check value != 0
          if (!math.equal(v, 0)) {
            // store value
            matrix._values.push(v);
            // add column index
            matrix._index.push(j);
          }
        }
      }
      else {
        // update columns if needed (only on first row)
        if (i === 0 && columns < 1)
          columns = 1;
        // check value != 0 (row is a scalar)
        if (!math.equal(row, 0)) {
          // store value
          matrix._values.push(row);
          // index
          matrix._index.push(0);
        }
      }
    }
    // store number of values in ptr
    matrix._ptr.push(matrix._values.length);
    // size
    matrix._size = [rows, columns];
  };

  CrsMatrix.prototype = new math.type.Matrix();

  CrsMatrix.prototype.type = 'CrsMatrix';

  /**
   * Get the storage format used by the matrix.
   *
   * Usage:
   *     var format = matrix.storage()                   // retrieve storage format
   *
   * @return {string}           The storage format.
   */
  CrsMatrix.prototype.storage = function () {
    return 'crs';
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
  CrsMatrix.prototype.subset = function (index, replacement, defaultValue) {
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
    if (!(index instanceof Index)) {
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
    if (!(index instanceof Index)) {
      throw new TypeError('Invalid index');
    }

    // get index size and check whether the index contains a single value
    var iSize = index.size(),
        isScalar = index.isScalar();

    // calculate the size of the submatrix, and convert it into an Array if needed
    var sSize;
    if (submatrix instanceof Matrix) {
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
  CrsMatrix.prototype.get = function (index) {
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
    var k = _getValueIndex(j, this._ptr[i], this._ptr[i + 1], this._index);
    // check k is prior to next row k and it is in the correct row
    if (k < this._ptr[i + 1] && this._index[k] === j)
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
   * @return {CrsMatrix} self
   */
  CrsMatrix.prototype.set = function (index, v, defaultValue) {
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
      _resize(this, Math.max(i + 1, rows), Math.max(j + 1, columns), defaultValue);
      // update rows & columns
      rows = this._size[0];
      columns = this._size[1];
    }

    // check i, j are valid
    validateIndex(i, rows);
    validateIndex(j, columns);

    // find value index
    var k = _getValueIndex(j, this._ptr[i], this._ptr[i + 1], this._index);
    // check k is prior to next row k and it is in the correct column
    if (k < this._ptr[i + 1] && this._index[k] === j) {
      // check value != 0
      if (!math.equal(v, 0)) {
        // update value
        this._values[k] = v;
      }
      else {
        // remove value from matrix
        _remove(k, i, this._values, this._index, this._ptr);
      }
    }
    else {
      // insert value @ (i, j)
      _insert(k, i, j, v, this._values, this._index, this._ptr);
    }

    return this;
  };

  var _getValueIndex = function(j, left, right, index) {
    // check column is on the right side
    if (right - left === 0 || j > index[right - 1])
      return right;
    // loop until we find row index
    while (left < right) {
      // point in the middle (fast integer division)
      var p = ~~((left + right) / 2);
      // column @ p
      var c = index[p];
      // check we have to look on the left side, right side or we found the column
      if (j < c)
        right = p;
      else if (j > c)
        left = p + 1;
      else
        return p;
    }
    return left;
  };

  var _remove = function (k, i, values, index, ptr) {
    // remove value @ k
    values.splice(k, 1);
    index.splice(k, 1);
    // update pointers
    for (var x = i + 1; x < ptr.length; x++)
      ptr[x]--;
  };

  var _insert = function (k, i, j, v, values, index, ptr) {
    // insert value
    values.splice(k, 0, v);
    // update column for k
    index.splice(k, 0, j);
    // update row pointers
    for (var x = i + 1; x < ptr.length; x++)
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
  CrsMatrix.prototype.resize = function (size, defaultValue, copy) {    
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
    var ins = !math.equal(value, 0);

    // old columns and rows
    var r = matrix._size[0];
    var c = matrix._size[1];

    var i, j, k;

    // check we need to increase rows
    if (rows > r) {
      // loop new rows
      for (i = r; i < rows; i++) {
        // update matrix._ptr for current column
        matrix._ptr[i] = matrix._values.length;
        // check we need to insert matrix._values
        if (ins) {
          // loop columns
          for (j = 0; j < c; j++) {
            // add new matrix._values
            matrix._values.push(value);
            // update matrix._index
            matrix._index.push(j);
          }
        }        
      }
      // store number of matrix._values in matrix._ptr
      matrix._ptr[rows] = matrix._values.length;
    }
    else if (rows < r) {
      // truncate matrix._ptr
      matrix._ptr.splice(rows + 1, r - rows);
      // truncate matrix._values and matrix._index
      matrix._values.splice(matrix._ptr[rows], matrix._values.length);
      matrix._index.splice(matrix._ptr[rows], matrix._index.length);
    }
    // update rows
    r = rows;

    // check we need to increase columns
    if (columns > c) {
      // check we have to insert values
      if (ins) {
        // inserts
        var n = 0;
        // loop rows
        for (i = 0; i < r; i++) {
          // update matrix._ptr for current row
          matrix._ptr[i] = matrix._ptr[i] + n;
          // where to insert matrix._values
          k = matrix._ptr[i + 1] + n;
          // pointer
          var p = 0;
          // loop new columns, initialize pointer
          for (j = c; j < columns; j++, p++) {
            // add value
            matrix._values.splice(k + p, 0, value);
            // update matrix._index
            matrix._index.splice(k + p, 0, j);
            // increment inserts
            n++;
          }
        }
        // store number of matrix._values in matrix._ptr
        matrix._ptr[r] = matrix._values.length;
      }
    }
    else if (columns < c) {
      // deletes
      var d = 0;
      // loop rows
      for (i = 0; i < r; i++) {
        // update matrix._ptr for current row
        matrix._ptr[i] = matrix._ptr[i] - d;
        // where matrix._values start for next column
        var k0 = matrix._ptr[i];
        var k1 = matrix._ptr[i + 1] - d;
        // loop matrix._index
        for (k = k0; k < k1; k++) {
          // column
          j = matrix._index[k];
          // check we need to delete value and matrix._index
          if (j > columns - 1) {
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
      matrix._ptr[i] = matrix._values.length;
    }
    // update matrix._size
    matrix._size[0] = rows;
    matrix._size[1] = columns;
    // return matrix
    return matrix;
  };

  /**
   * Create a clone of the matrix
   * @return {CrsMatrix} clone
   */
  CrsMatrix.prototype.clone = function () {
    var m = new CrsMatrix({
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
  CrsMatrix.prototype.size = function() {
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
   * @return {Matrix} matrix
   */
  CrsMatrix.prototype.map = function (callback, skipZeros) {
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
      if (!math.equal(v, 0)) {
        // store value
        values.push(v);
        // index
        index.push(y);
      }
    };
    // loop rows
    for (var i = minRow; i <= maxRow; i++) {
      // store pointer to values index
      ptr.push(values.length);
      // k0 <= k < k1 where k0 = _ptr[j] && k1 = _ptr[j+1]
      var k0 = matrix._ptr[i];
      var k1 = matrix._ptr[i + 1];
      // column pointer
      var p = minColumn;
      // loop k within [k0, k1[
      for (var k = k0; k < k1; k++) {
        // column index
        var j = matrix._index[k];
        // check j is in range
        if (j >= minColumn && j <= maxColumn) {
          // zero values
          if (!skipZeros) {
            // write zeros from column p to j
            for (var x = p; x < j; x++)
              invoke(0, i - minRow, x - minColumn);
          }
          // value @ k
          invoke(matrix._values[k], i - minRow, j - minColumn);
        }
        // update pointer
        p = j + 1;
      }
      // zero values
      if (!skipZeros) {
        // write zeros from column p to maxColumn
        for (var y = p; y <= maxColumn; y++)
          invoke(0, i - minRow, y - minColumn);
      }
    }
    // store number of values in ptr
    ptr.push(values.length);
    // return ccs
    return new CrsMatrix({
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
  CrsMatrix.prototype.forEach = function (callback, skipZeros) {
    // matrix instance
    var me = this;
    // rows and columns
    var rows = this._size[0];
    var columns = this._size[1];
    // loop rows
    for (var i = 0; i < rows; i++) {
      // k0 <= k < k1 where k0 = _ptr[i] && k1 = _ptr[i+1]
      var k0 = this._ptr[i];
      var k1 = this._ptr[i + 1];
      // column pointer
      var p = 0;
      // loop k within [k0, k1[
      for (var k = k0; k < k1; k++) {
        // column index
        var j = this._index[k];
        // check we need to process zeros
        if (!skipZeros) {
          // zero values
          for (var x = p; x < j; x++)
            callback(0, [i, x], me);
        }
        // value @ k
        callback(this._values[k], [i, j], me);
        // update pointer
        p = j + 1;
      }
      // check we need to process zeros
      if (!skipZeros) {
        // zero values
        for (var y = p; y < columns; y++)
          callback(0, [i, y], me);
      }
    }
  };

  /**
   * Create an Array with a copy of the data of the CrsMatrix
   * @returns {Array} array
   */
  CrsMatrix.prototype.toArray = function () {
    return _toArray(this, true);
  };

  /**
   * Get the primitive value of the CrsMatrix: a two dimensions array
   * @returns {Array} array
   */
  CrsMatrix.prototype.valueOf = function () {
    return _toArray(this, false);
  };

  var _toArray = function (matrix, copy) {
    // result
    var a = [];
    // rows and columns
    var rows = matrix._size[0];
    var columns = matrix._size[1];
    // loop rows
    for (var i = 0; i < rows; i++) {
      // push row
      var r = a[i] = [];
      // k0 <= k < k1 where k0 = _ptr[i] && k1 = _ptr[i+1]
      var k0 = matrix._ptr[i];
      var k1 = matrix._ptr[i + 1];
      // column pointer
      var p = 0;
      // loop k is within [k0, k1[
      for (var k = k0; k < k1; k++) {
        // column index
        var j = matrix._index[k];
        // zero values
        for (var x = p; x < j; x++)
          r[x] = 0;
        // set value
        r[j] = copy ? object.clone(matrix._values[k]) : matrix._values[k];
        // update pointer
        p = j + 1;
      }
      // zero values
      for (var y = p; y < columns; y++)
        r[y] = 0;
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
  CrsMatrix.prototype.format = function (options) {
    // rows and columns
    var rows = this._size[0];
    var columns = this._size[1];
    // rows & columns
    var str = 'CRS [' + string.format(rows, options) + ' x ' + string.format(columns, options) + '] density: ' + string.format(this._values.length / (rows * columns), options) + '\n';
    // loop rows
    for (var i = 0; i < rows; i++) {
      // k0 <= k < k1 where k0 = _ptr[i] && k1 = _ptr[i+1]
      var k0 = this._ptr[i];
      var k1 = this._ptr[i + 1];
      // loop k within [k0, k1[
      for (var k = k0; k < k1; k++) {
        // column index
        var j = this._index[k];
        // append value
        str += '\n    (' + string.format(i, options) + ', ' + string.format(j, options) + ') ==> ' + string.format(this._values[k], options);
      }
    }
    return str;
  };

  /**
   * Get a string representation of the matrix
   * @returns {String} str
   */
  CrsMatrix.prototype.toString = function () {
    return string.format(this.toArray());
  };

  /**
   * Get a JSON representation of the matrix
   * @returns {Object}
   */
  CrsMatrix.prototype.toJSON = function () {
    return {
      mathjs: 'CrsMatrix',
      values: this._values,
      index: this._index,
      ptr: this._ptr,
      size: this._size
    };
  };

  /**
   * Calculates the transpose of the matrix
   * @returns {Matrix}
   */
  CrsMatrix.prototype.transpose = function () {
    // rows and columns
    var rows = this._size[0];
    var columns = this._size[1];
    // check columns
    if (columns === 0) {
      // throw exception
      throw new RangeError('Cannot transpose a 2D matrix with no columns (size: ' + string.format(this._size) + ')');
    }
    // crs transpose is a ccs matrix with the same structure
    return new math.type.CcsMatrix({
      values: object.clone(this._values),
      index: object.clone(this._index),
      ptr: object.clone(this._ptr),
      size: [columns, rows]
    });
  };

  /**
   * Get the kth Matrix diagonal.
   *
   * @param {Number | BigNumber} [k=0]     The kth diagonal where the vector will retrieved.
   *
   * @returns {Array}                      The array vector with the diagonal values.
   */
  CrsMatrix.prototype.diagonal = function(k) {
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

    // diagonal
    var values = [];
    // loop rows
    for (var i = kSub; i < rows && values.length < n; i++) {
      // k0 <= k < k1 where k0 = _ptr[i] && k1 = _ptr[i+1]
      var k0 = this._ptr[i];
      var k1 = this._ptr[i + 1];
      // row value flag
      var rv = false;
      // loop x within [k0, k1[
      for (var x = k0; x < k1; x++) {
        // column index
        var j = this._index[x];
        // check column
        if (j === i + kSuper - kSub) {
          // set flag
          rv = true;
          // value on this column
          values.push(object.clone(this._values[x]));
          // exit loop
          break;
        }
        else if (j > i + kSuper - kSub) {
          // exit loop, no value on the diagonal for row i
          break;
        }
      }
      // check this row has a value set
      if (!rv && values.length < n) {
        // zero on this column
        values.push(0);
      }
    }
    return values;
  };

  /**
   * Generate a matrix from a JSON object
   * @param {Object} json  An object structured like
   *                       `{"mathjs": "CrsMatrix", "values": [], "index": [], "ptr": [], "size": []}`,
   *                       where mathjs is optional
   * @returns {CrsMatrix}
   */
  CrsMatrix.fromJSON = function (json) {
    return new CrsMatrix(json);
  };

  /**
   * Create a diagonal matrix.
   *
   * @param {Array} size                   The matrix size.
   * @param {Number, Array} value          The values for the diagonal.
   * @param {Number | BigNumber} [k=0]     The kth diagonal where the vector will be filled in.
   *
   * @returns {CrsMatrix}
   */
  CrsMatrix.diagonal = function (size, value, k) {
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

    // create arrays
    var values = [];
    var index = [];
    var ptr = [];

    // loop items
    for (var i = 0; i < rows; i++) {
      // number of rows with value
      ptr.push(values.length);
      // diagonal index
      var j = i - kSub;
      // check we need to set diagonal value
      if (j >= 0 && j < n) {
        // get value @ j
        var v = _value(j);
        // check for zero
        if (!math.equal(v, 0)) {
          // column
          index.push(j + kSuper);
          // add value
          values.push(v);
        }
      }
    }
    // last value should be number of values
    ptr.push(values.length);
    // create CrsMatrix
    return new CrsMatrix({
      values: values,
      index: index,
      ptr: ptr,
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
  CrsMatrix.prototype.trace = function () {
    // size
    var size = this._size;
    // check dimensions
    var rows = size[0];
    var columns = size[1];
    // matrix must be square
    if (rows === columns) {
      // calulate sum
      var sum = 0;
      // check we have data (avoid looping rows)
      if (this._values.length > 0) {
        // loop rows
        for (var i = 0; i < rows; i++) {
          // k0 <= k < k1 where k0 = _ptr[i] && k1 = _ptr[i+1]
          var k0 = this._ptr[i];
          var k1 = this._ptr[i + 1];
          // loop k within [k0, k1[
          for (var k = k0; k < k1; k++) {
            // column index
            var j = this._index[k];
            // check row
            if (i === j) {
              // accumulate value
              sum = math.add(sum, this._values[k]);
              // exit loop
              break;
            }
            if (j > i) {
              // exit loop, no value on the diagonal for column j
              break;
            }
          }
        }
      }
      // return trace
      return sum;
    }
    throw new RangeError('Matrix must be square (size: ' + string.format(size) + ')');        
  };
  
  /**
   * Multiply the matrix values times the argument.
   *
   * @param  {Number | BigNumber | Boolean | Complex | Unit | Array | Matrix | null} Value to multiply.
   *
   * @return {Number | BigNumber | Complex | Unit | Matrix}
   */
  CrsMatrix.prototype.multiply = function (value) {
    // check dimensions
    var rows = this._size[0];
    var columns = this._size[1];

    // check value is a matrix
    if (value instanceof Matrix) {
      // matrix size
      var z = value.size();
      // check value is a vector
      if (z.length === 1) {
        // mutiply matrix x vector array
        return _multiply(this, z[0], 1, function (i) {
          // value[i]
          return value.get([i]);
        });
      }
      // check two dimensions matrix
      if (z.length === 2) {        
        // mutiply matrix x matrix
        return _multiply(this, z[0], z[1], function (i, j) {
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
        // mutiply matrix x vector array
        return _multiply(this, s[0], 1, function (i) {
          // value[i]
          return value[i];
        });
      }
      if (s.length === 2) {
        // mutiply matrix x array
        return _multiply(this, s[0], s[1], function (i, j) {
          // value[i, j]
          return value[i][j];
        });
      }
      throw new Error('Can only multiply a 1 or 2 dimensional matrix ' +
                      '(value has ' + s.length + ' dimensions)');
    }

    var callback = function (v) {
      return math.multiply(v, value);
    };

    // map non zero elements
    return _map(this, 0, rows - 1, 0, columns - 1, callback, false);
  };
  
  var _multiply = function (matrix, r, c, get) {

    // matrix dimensions
    var rows = matrix._size[0];
    var columns = matrix._size[1];

    // check dimensions match
    if (columns !== r) {
      // throw error
      throw new RangeError('Dimension mismatch in multiplication. ' +
                           'Columns of A must match length of B ' +
                           '(A is ' + rows + 'x' + columns +
                           ', B is ' + r + ', ' +
                           columns + ' != ' + r + ')');
    }

    // result arrays
    var values = [];
    var index = [];
    var ptr = [];

    // loop rows
    for (var i = 0; i < rows; i++) {
      // update ptr
      ptr.push(values.length);
      // k0 <= k < k1 where k0 = _ptr[i] && k1 = _ptr[i+1]
      var k0 = matrix._ptr[i];
      var k1 = matrix._ptr[i + 1];
      // loop value columns
      for (var z = 0; z < c; z++) {
        // value @ (i, x)
        var value = 0;
        // loop k within [k0, k1[
        for (var k = k0; k < k1; k++) {
          // column
          var j = matrix._index[k];
          // multiply & aggregate
          value = math.add(value, math.multiply(matrix._values[k], get(j, z)));
        }
        // check value is different than zero
        if (!math.equal(value, 0)) {
          // push value & column
          values.push(value);
          index.push(z);
        }        
      }
    }
    // update ptr
    ptr.push(values.length);

    // check we need to squeeze the result into a scalar
    if (rows === 1 && c === 1)
      return values.length === 1 ? values[0] : 0;

    // return CRS matrix
    return new CrsMatrix({
      values: values,
      index: index,
      ptr: ptr,
      size: [rows, c]
    });
  };

  return CrsMatrix;
};