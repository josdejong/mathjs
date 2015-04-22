'use strict';

var clone = require('../../util/object').clone;
var format = require('../../util/string').format;

function factory (type, config, load, typed) {

  var matrix = load(require('../construction/matrix'));

  var DenseMatrix = type.DenseMatrix,
      CcsMatrix = type.CcsMatrix,
      CrsMatrix = type.CrsMatrix;

  /**
   * Transpose a matrix. All values of the matrix are reflected over its
   * main diagonal. Only two dimensional matrices are supported.
   *
   * Syntax:
   *
   *     math.transpose(x)
   *
   * Examples:
   *
   *     var A = [[1, 2, 3], [4, 5, 6]];
   *     math.transpose(A);               // returns [[1, 4], [2, 5], [3, 6]]
   *
   * See also:
   *
   *     diag, inv, subset, squeeze
   *
   * @param {Array | Matrix} x  Matrix to be transposed
   * @return {Array | Matrix}   The transposed matrix
   */
  var transpose = typed('transpose', {

    'Array': function (x) {
      // use dense matrix implementation
      return transpose(matrix(x)).valueOf();
    },

    'Matrix': function (x) {
      // matrix size
      var size = x.size();

      // result
      var c;
      
      // process dimensions
      switch (size.length) {
        case 1:
          // vector
          c = x.clone();
          break;

        case 2:
          // rows and columns
          var rows = size[0];
          var columns = size[1];

          // check columns
          if (columns === 0) {
            // throw exception
            throw new RangeError('Cannot transpose a 2D matrix with no columns (size: ' + format(size) + ')');
          }

          // process storage format
          switch (x.storage()) {
            case 'dense':
              c = _denseTranspose(x, rows, columns);
              break;
            case 'ccs':
              c = _ccsTranspose(x, rows, columns);
              break;
            case 'crs':
              c = _crsTranspose(x, rows, columns);
              break;
          }
          break;
          
        default:
          // multi dimensional
          throw new RangeError('Matrix must be a vector or two dimensional (size: ' + format(this._size) + ')');
      }
      return c;
    },

    // scalars
    'any': function (x) {
      return clone(x);
    }
  });

  var _denseTranspose = function (m, rows, columns) {
    // matrix array
    var data = m._data;
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
        transposedRow[i] = clone(data[i][j]);
      }
    }
    // return matrix
    return new DenseMatrix({
      data: transposed,
      size: [columns, rows]
    });
  };

  var _ccsTranspose = function (m, rows, columns) {
    // matrix arrays
    var values = m._values;
    var index = m._index;
    var ptr = m._ptr;
        // result matrices
    var cvalues = [];
    var cindex = [];
    var cptr = [];
    // row counts
    var w = new Array(rows);
    for (var x = 0; x < rows; x++)
      w[x] = 0;
    // vars
    var p, l, j;
    // loop values in matrix
    for (p = 0, l = index.length; p < l; p++) {
      // number of values in row
      w[index[p]]++;
    }
    // cumulative sum
    var sum = 0;
    // initialize cptr with the cummulative sum of row counts
    for (var i = 0; i < rows; i++) {
      // update cptr
      cptr.push(sum);
      // update sum
      sum += w[i];
      // update w
      w[i] = cptr[i];
    }
    // update cptr
    cptr.push(sum);
    // loop columns
    for (j = 0; j < columns; j++) {
      // values & index in column
      for (var k0 = ptr[j], k1 = ptr[j + 1], k = k0; k < k1; k++) {
        // C values & index
        var q = w[index[k]]++;
        // C[j, i] = A[i, j]
        cindex[q] = j;
        cvalues[q] = clone(values[k]);
      }
    }
    // return matrix
    return new CcsMatrix({
      values: cvalues,
      index: cindex,
      ptr: cptr,
      size: [columns, rows]
    });
  };
  
  var _crsTranspose = function (m, rows, columns) {
    // matrix arrays
    var values = m._values;
    var index = m._index;
    var ptr = m._ptr;
    // result matrices
    var cvalues = [];
    var cindex = [];
    var cptr = [];
    // column counts
    var w = new Array(columns);
    for (var x = 0; x < columns; x++)
      w[x] = 0;
    // vars
    var p, l, i;
    // loop values in matrix
    for (p = 0, l = index.length; p < l; p++) {
      // number of values in column
      w[index[p]]++;
    }
    // cumulative sum
    var sum = 0;
    // initialize cptr with the cummulative sum of column counts
    for (var j = 0; j < columns; j++) {
      // update cptr
      cptr.push(sum);
      // update sum
      sum += w[j];
      // update w
      w[j] = cptr[j];
    }
    // update cptr
    cptr.push(sum);
    // loop rows
    for (i = 0; i < rows; i++) {
      // values & index in row
      for (var k0 = ptr[i], k1 = ptr[i + 1], k = k0; k < k1; k++) {
        // C values & index
        var q = w[index[k]]++;
        // C[j, i] = A[i, j]
        cindex[q] = i;
        cvalues[q] = clone(values[k]);
      }
    }
    // return matrix
    return new CrsMatrix({
      values: cvalues,
      index: cindex,
      ptr: cptr,
      size: [columns, rows]
    });
  };

  return transpose;
}

exports.name = 'transpose';
exports.factory = factory;
