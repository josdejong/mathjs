'use strict';

var DimensionError = require('../../../error/DimensionError');

function factory (type) {

  var DenseMatrix = type.DenseMatrix;

  /**
   * Iterates over SparseMatrix A and SparseMatrix B items (zero and nonzero) and invokes the callback function f(Aij, Bij). 
   * Callback function invoked MxN times.
   *
   * C(i,j) = f(Aij, Bij)
   *
   * @param {Matrix}   a                 The SparseMatrix instance (A)
   * @param {Matrix}   b                 The SparseMatrix instance (B)
   * @param {function} callback          The f(Aij,Bij) operation to invoke
   *
   * @return {Matrix}                    DenseMatrix (C)
   *
   * see https://github.com/josdejong/mathjs/pull/346#issuecomment-97620294
   */
  var algorithm07 = function (a, b, callback) {
    // sparse matrix arrays
    var asize = a._size;
    var adt = a._datatype;
    var azero = a._zero;
    // sparse matrix arrays
    var bsize = b._size;
    var bdt = b._datatype;
    var bzero = b._zero;

    // validate dimensions
    if (asize.length !== bsize.length)
      throw new DimensionError(asize.length, bsize.length);

    // check rows & columns
    if (asize[0] !== bsize[0] || asize[1] !== bsize[1])
      throw new RangeError('Dimension mismatch. Matrix A (' + asize + ') must match Matrix B (' + bsize + ')');

    // rows & columns
    var rows = asize[0];
    var columns = asize[1];

    // process data types (zero value is required!)
    var dt = adt && bdt && typeof(azero) !== 'undefined' && azero !== null && typeof(bzero) !== 'undefined' && bzero !== null && adt === bdt ? adt : undefined;
    // callback implementation
    var cf = dt && callback.signatures ? callback.signatures[dt + ',' + dt] || callback : callback;

    // sparse matrix zero value
    var zero = dt ? azero : 0;

    // vars
    var i, j;
    
    // result arrays
    var cdata = new Array(rows);
    // initialize c
    for (i = 0; i < rows; i++)
      cdata[i] = new Array(columns);

    // matrix
    var c = new DenseMatrix({
      data: cdata,
      size: [rows, columns],
      datatype: dt
    });

    // workspaces
    var xa = new Array(rows);
    var xb = new Array(rows);
    // marks indicating we have a value in x for a given column
    var wa = new Array(rows);
    var wb = new Array(rows);

    // loop columns
    for (j = 0; j < columns; j++) {
      // columns mark
      var mark = j + 1;
      // scatter the values of A(:,j) into workspace
      _scatter(a, j, wa, xa, mark);
      // scatter the values of B(:,j) into workspace
      _scatter(b, j, wb, xb, mark);
      // loop rows
      for (i = 0; i < rows; i++) {
        // matrix values @ i,j
        var va = wa[i] === mark ? xa[i] : zero;
        var vb = wb[i] === mark ? xb[i] : zero;
        // invoke callback
        cdata[i][j] = cf(va, vb);
      }          
    }

    // return sparse matrix
    return c;
  };
  
  var _scatter = function (m, j, w, x, mark) {
    // a arrays
    var values = m._values;
    var index = m._index;
    var ptr = m._ptr;
    // loop values in column j
    for (var k = ptr[j], k1 = ptr[j + 1]; k < k1; k++) {
      // row
      var i = index[k];
      // update workspace
      w[i] = mark;
      x[i] = values[k];
    }
  };
  
  return algorithm07;
}

exports.name = 'algorithm07';
exports.factory = factory;
