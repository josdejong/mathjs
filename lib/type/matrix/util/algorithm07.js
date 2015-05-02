'use strict';

var DimensionError = require('../../../error/DimensionError');

function factory (type, config, load) {

  var scatter = load(require('./scatter'));

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

    // result arrays
    var cdata = new Array(rows);
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
    // marks indicating value in a given row has been updated (not used in this algorithm)
    var u = new Array(rows);

    // loop columns
    for (var j = 0; j < columns; j++) {
      // columns mark
      var mark = j + 1;
      // scatter the values of A(:,j) into workspace
      scatter(a, j, wa, xa, u, mark, undefined, cf);
      // scatter the values of B(:,j) into workspace
      scatter(b, j, wb, xb, u, mark, undefined, cf);
      // loop rows
      for (var i = 0; i < rows; i++) {
        // check this is the first column
        if (j === 0) {
          // initialize row
          cdata[i] = new Array(columns);
        }
        // matrix values @ i,j
        var va = wa[i] === mark ? xa[i] : zero;
        var vb = wb[i] === mark ? xb[i] : zero;
        // invoke callback
        cdata[i][j] = callback(va, vb);
      }          
    }

    // return sparse matrix
    return c;
  };
  
  return algorithm07;
}

exports.name = 'algorithm07';
exports.factory = factory;
