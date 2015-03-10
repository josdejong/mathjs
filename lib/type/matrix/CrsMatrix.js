'use strict';

var util = require('../../util/index');
var DimensionError = require('../../error/DimensionError');

var array = util.array,
    isNumber = util.number.isNumber,
    isBoolean = util['boolean'].isBoolean,

    object = util.object,
    string = util.string;

var isArray = Array.isArray;
var validateIndex = array.validateIndex;

module.exports = function (math) {
  
  var isComplex = math.type.Complex.isComplex,
      BigNumber = math.type.BigNumber;

  function CrsFormat(data) {
    if (!(this instanceof CrsFormat))
      throw new SyntaxError('Constructor must be called with the new operator');

    // initialize format
    this._format = 'crs';

    // check data is a serialized json
    if (data && isArray(data.values) && isArray(data.index) && isArray(data.ptr)) {
      // initialize fields
      this._values = data.values;
      this._index = data.index;
      this._ptr = data.ptr;
      this._size = data.size;
    }
    else if (isArray(data)) {
      // initialize fields
      this._values = [];
      this._index = [];
      this._ptr = [];
      // discover rows & columns, do not use math.size() to avoid looping array twice
      var rows = data.length;
      var columns = 0;

      // loop rows
      for (var i = 0; i < rows; i++) {
        // current row
        var row = data[i];
        // store value index in ptr
        this._ptr.push(this._values.length);
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
            this._values.push(v);
            // add column index
            this._index.push(j);
          }
        }
      }
      // store number of valus in ptr
      this._ptr.push(this._values.length);
      // size
      this._size = [rows, columns];
    }
    else
      throw new SyntaxError('data must be an array');
  }

  CrsFormat.prototype = new math.type.Matrix();

  CrsFormat.prototype.type = 'CrsFormat';
  
  CrsFormat.prototype.toArray = function () {
    // result
    var a = [];
    // values index
    var k = 0;
    // rows and columns
    var rows = this._size[0];
    var columns = this._size[1];
    // loop rows
    for (var i = 0; i < rows; i++) {
      // push row
      var r = a[i] = [];
      // k0 <= k < k1 where k0 = _ptr[i] && k1 = _ptr[i+1]
      var k0 = this._ptr[i];
      var k1 = this._ptr[i + 1];
      // column pointer
      var p = 0;
      // check k is within [k0, k1[
      while (k >= k0 && k < k1) {
        // column index
        var j = this._index[k];
        // zero values
        for (var x = p; x < j; x++)
          r[x] = 0;
        // set value
        r[j] = this._values[k];
        // increment k
        k++;
        // update pointer
        p = j + 1;
      }
      // zero values
      for (var y = p; y < columns; y++)
        r[y] = 0;
    }
    return a;
  };

  CrsFormat.prototype.toJSON = function () {
    return {
      format: this._format,
      values: this._values,
      index: this._index,
      ptr: this._ptr,
      size: this._size
    };
  };

  var _getValueIndex = function(j, left, right, index) {
    // check column is on the right side
    if (right - left === 0 || j > index[right - 1])
      return right;
    // loop until we find column
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

  CrsFormat.prototype.get = function (index, d) {
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
    // check k is prior to next row k and it is in the correct column
    if (k < this._ptr[i + 1] && this._index[k] === j)
      return object.clone(this._values[k]);

    return d || 0;
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

  CrsFormat.prototype.set = function (index, v) {
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

  CrsFormat.prototype.clone = function () {
    var m = new CrsFormat({
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
  CrsFormat.prototype.size = function() {
    return this._size;
  };

  /**
   * Get a string representation of the matrix
   * @returns {String} str
   */
  CrsFormat.prototype.toString = function () {
    // rows and columns
    var rows = this._size[0];
    var columns = this._size[1];
    // rows & columns
    var str = string.format(rows) + ' x ' + string.format(columns) + '\n';
    // values index
    var k = 0;
    // loop rows
    for (var i = 0; i < rows; i++) {
      // value indexes on current row
      var k0 = this._ptr[i];
      var k1 = this._ptr[i + 1];
      // check k is within [k0, k1[
      while (k >= k0 && k < k1) {
        // column index
        var j = this._index[k];
        // append value
        str += '\n(' + string.format(i) + ', ' + string.format(j) + ') = ' + string.format(this._values[k]);
        // increment k
        k++;
      }
    }
    return str;
  };

  CrsFormat.prototype.multiply = function (x) {
    if (arguments.length != 1) {
      throw new math.error.ArgumentsError('multiply', arguments.length, 1);
    }

    // scalar
    if (isNumber(x) || isComplex(x)|| isBoolean(x) || x instanceof BigNumber) {
      // check it is zero
      if (math.equal(x, 0)) {
        // zero ptr
        var ptr = [];
        for (var i = 0; i < this._ptr.length; i++)
          ptr[i] = 0;
        // empty CRS
        return new CrsFormat({
          mathjs: 'CrsFormat',
          values: [],
          index: [],
          ptr: ptr,
          size: this._size
        });
      }
      // multiply values
      var values = [];
      for (var j = 0; j < this._values.length; j++)
        values[j] = math.multiply(this._values[j], x);
      // create storage
      return new CrsFormat({
        mathjs: 'CrsFormat',
        values: values,
        index: object.clone(this._index),
        ptr: object.clone(this._ptr),
        size: this._size
      });
    }
  };

  CrsFormat.fromJSON = function (json) {
    return new CrsFormat(json);
  };

  CrsFormat.diagonal = function (rows, columns, value) {
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
      // first column with data
      ptr.push(i);
      // column
      index.push(i);
      // add value
      values.push(v);
    }
    // last value should be number of values
    ptr.push(values.length);
    // create CrsFormat
    return new CrsFormat({
      values: values,
      index: index,
      ptr: ptr,
      size: [rows, columns]
    });
  };

  return CrsFormat;
};
