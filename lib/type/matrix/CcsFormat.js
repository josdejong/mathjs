'use strict';

var util = require('../../util/index');

var array = util.array;
var object = util.object;
var string = util.string;

var isArray = Array.isArray;
var validateIndex = array.validateIndex;

module.exports = function (math) {
  
  function CcsFormat(data) {
    if (!(this instanceof CcsFormat))
      throw new SyntaxError('Constructor must be called with the new operator');

    // initialize format
    this._format = 'ccs';

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

      // column index
      var j = 0;
      do {
        // store pointer to values index
        this._ptr.push(this._values.length);
        // loop rows
        for (var i = 0; i < data.length; i++) {
          // current row
          var row = data[i];
          // update columns
          if (j === 0 && this._columns < row.length)
            this._columns = row.length;
          // check row has column
          if (j < row.length) {
            // value
            var v = row[j];
            // check value != 0
            if (!math.equal(v, 0)) {
              // store value
              this._values.push(v);
              // index
              this._index.push(i);
            }
          }        
        }
        // increment index
        j++;      
      }
      while (j < this._columns);
      // store number of valus in ptr
      this._ptr.push(this._values.length);
    }
    else
      throw new SyntaxError('data must be an array');
  }

  CcsFormat.prototype.toArray = function () {
    // result
    var a = [];
    // values index
    var k = 0;
    // loop columns
    for (var j = 0; j < this._columns; j++) {
      // k0 <= k < k1 where k0 = _ptr[j] && k1 = _ptr[j+1]
      var k0 = this._ptr[j];
      var k1 = this._ptr[j + 1];
      // row pointer
      var p = 0;
      // check k is within [k0, k1[
      while (k >= k0 && k < k1) {
        // row index
        var i = this._index[k];
        // zeros
        for (var x = p; x < i; x++)
          (a[x] = (a[x] || []))[j] = 0;
        // set value
        (a[i] = (a[i] || []))[j] = this._values[k];
        // increment k
        k++;
        // update pointer
        p = i + 1;
      }
      // zero values
      for (var y = p; y < this._rows; y++)
        (a[y] = (a[y] || []))[j] = 0;
    }
    return a;
  };

  CcsFormat.prototype.toJSON = function () {
    return {
      mathjs: 'CcsFormat',
      values: this._values,
      index: this._index,
      ptr: this._ptr,
      rows: this._rows,
      columns: this._columns
    };
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

  CcsFormat.prototype.get = function (i, j, d) {
    // check i, j are valid
    validateIndex(i, this._rows);
    validateIndex(j, this._columns);

    // find value index
    var k = _getValueIndex(i, this._ptr[j], this._ptr[j + 1], this._index);
    // check k is prior to next column k and it is in the correct row
    if (k < this._ptr[j + 1] && this._index[k] === i)
      return this._values[k];

    return d || 0;
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

  CcsFormat.prototype.set = function (i, j, v) {
    // check i, j are valid
    validateIndex(i, this._rows);
    validateIndex(j, this._columns);

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
  };

  CcsFormat.prototype.clone = function () {
    var m = new CcsFormat({
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
  CcsFormat.prototype.size = function() {
    return [this._rows, this._columns];
  };

  /**
   * Get a string representation of the matrix
   * @returns {String} str
   */
  CcsFormat.prototype.toString = function () {
    // rows & columns
    var str = string.format(this._rows) + ' x ' + string.format(this._columns) + '\n';
    // values index
    var k = 0;
    // loop columns
    for (var j = 0; j < this._columns; j++) {
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

  CcsFormat.fromJSON = function (json) {
    return new CcsFormat(json);
  };

  CcsFormat.diagonal = function (rows, columns, value) {
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
    // create CcsFormat
    return new CcsFormat({
      values: values,
      index: index,
      ptr: ptr,
      rows: rows,
      columns: columns
    });
  };

  return CcsFormat;
};