'use strict';

var util = require('../../util/index');

var array = util.array;
var object = util.object;
var string = util.string;

var isArray = Array.isArray;
var validateIndex = array.validateIndex;

module.exports = function (math) {
  
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
      this._rows = data.rows;
      this._columns = data.columns;
    }
    else if (isArray(data)) {
      // initialize fields
      this._values = [];
      this._index = [];
      this._ptr = [];
      // discover rows & columns, do not use math.size() to avoid looping array twice
      this._rows = data.length;
      this._columns = 0;

      // loop rows
      for (var i = 0; i < data.length; i++) {
        // current row
        var row = data[i];
        // store value index in ptr
        this._ptr.push(this._values.length);
        // update columns if needed
        if (row.length > this._columns)
          this._columns = row.length;
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
    }
    else
      throw new SyntaxError('data must be an array');
  }

  CrsFormat.prototype.toArray = function () {
    // result
    var a = [];
    // values index
    var k = 0;
    // loop rows
    for (var i = 0; i < this._rows; i++) {
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
      for (var y = p; y < this._columns; y++)
        r[y] = 0;
    }
    return a;
  };

  CrsFormat.prototype.toJSON = function () {
    return {
      mathjs: 'CrsFormat',
      values: this._values,
      index: this._index,
      ptr: this._ptr,
      rows: this._rows,
      columns: this._columns
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

  CrsFormat.prototype.get = function (i, j, d) {
    // check i, j are valid
    validateIndex(i, this._rows);
    validateIndex(j, this._columns);

    // find value index
    var k = _getValueIndex(j, this._ptr[i], this._ptr[i + 1], this._index);
    // check k is prior to next row k and it is in the correct column
    if (k < this._ptr[i + 1] && this._index[k] === j)
      return this._values[k];

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

  CrsFormat.prototype.set = function (i, j, v) {
    // check i, j are valid
    validateIndex(i, this._rows);
    validateIndex(j, this._columns);

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
  };

  CrsFormat.prototype.clone = function () {
    var m = new CrsFormat({
      values: object.clone(this._values),
      index: object.clone(this._index),
      ptr: object.clone(this._ptr),
      rows: object.clone(this._rows),
      columns: object.clone(this._columns)
    });
    return m;
  };

  /**
   * Retrieve the size of the matrix.
   * @returns {Number[]} size
   */
  CrsFormat.prototype.size = function() {
    return [this._rows, this._columns];
  };

  /**
   * Get a string representation of the matrix
   * @returns {String} str
   */
  CrsFormat.prototype.toString = function () {
    // rows & columns
    var str = string.format(this._rows) + ' x ' + string.format(this._columns) + '\n';
    // values index
    var k = 0;
    // loop rows
    for (var i = 0; i < this._rows; i++) {
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
      rows: rows,
      columns: columns
    });
  };

  return CrsFormat;
};