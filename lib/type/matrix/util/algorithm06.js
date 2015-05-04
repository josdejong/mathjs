'use strict';

var DimensionError = require('../../../error/DimensionError');

function factory (type, config, load) {

  var equalScalar = load(require('../../../function/relational/equalScalar'));
  var scatter = load(require('./scatter'));

  var SparseMatrix = type.SparseMatrix;

  /**
   * Iterates over SparseMatrix A and SparseMatrix B nonzero items and invokes the callback function f(Aij, Bij). 
   * Callback function invoked (Anz U Bnz) times, where Anz and Bnz are the nonzero elements in both matrices.
   *
   *
   *          ┌  f(Aij, Bij)  ; A(i,j) !== 0 && B(i,j) !== 0
   * C(i,j) = ┤  
   *          └  0            ; otherwise
   *
   *
   * @param {Matrix}   a                 The SparseMatrix instance (A)
   * @param {Matrix}   b                 The SparseMatrix instance (B)
   * @param {function} callback          The f(Aij,Bij) operation to invoke
   *
   * @return {Matrix}                    SparseMatrix (C)
   *
   * see https://github.com/josdejong/mathjs/pull/346#issuecomment-97620294
   */
  var algorithm06 = function (a, b, callback) {
    // sparse matrix arrays
    var avalues = a._values;
    var asize = a._size;
    var adt = a._datatype;
    var azero = a._zero;
    // sparse matrix arrays
    var bvalues = b._values;
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
    // equal
    var ef = dt ? equalScalar.signatures[dt + ',' + dt] || equalScalar : equalScalar;

    // sparse matrix zero value
    var zero = dt ? azero : 0;

    // result arrays
    var cvalues = avalues && bvalues ? [] : undefined;
    var cindex = [];
    var cptr = new Array(columns + 1);
    // matrix
    var c = new SparseMatrix({
      values: cvalues,
      index: cindex,
      ptr: cptr,
      size: [rows, columns],
      datatype: dt,
      zero: zero
    });

    // workspaces
    var x = cvalues ? new Array(rows) : undefined;
    // marks indicating we have a value in x for a given column
    var w = new Array(rows);
    // marks indicating value in a given row has been updated
    var u = new Array(rows);

    // loop columns
    for (var j = 0; j < columns; j++) {
      // update cptr
      cptr[j] = cindex.length;
      // columns mark
      var mark = j + 1;
      // scatter the values of A(:,j) into workspace
      scatter(a, j, w, x, u, mark, c, cf);
      // scatter the values of B(:,j) into workspace
      scatter(b, j, w, x, u, mark, c, cf);
      // check we need to process values (non pattern matrix)
      if (x) {
        // initialize first index in j
        var k = cptr[j];
        // loop index in j
        while (k < cindex.length) {
          // row
          var i = cindex[k];
          // check function was invoked on current row (Aij !=0 && Bij != 0)
          if (u[i] === mark) {
            // value @ i
            var v = x[i];
            // check for zero value
            if (!ef(v, zero)) {
              // push value
              cvalues.push(v);
              // increment pointer
              k++;
            }
            else {
              // remove value @ i, do not increment pointer
              cindex.splice(k, 1);
            }
          }
          else {
            // remove value @ i, do not increment pointer
            cindex.splice(k, 1);
          }
        }
      }
      else {
        // initialize first index in j
        var p = cptr[j];
        // loop index in j
        while (p < cindex.length) {
          // row
          var r = cindex[p];
          // check function was invoked on current row (Aij !=0 && Bij != 0)
          if (u[r] !== mark) {
            // remove value @ i, do not increment pointer
            cindex.splice(p, 1);
          }
          else {
            // increment pointer
            p++;
          }
        }
      }
    }
    // update cptr
    cptr[columns] = cindex.length;

    // return sparse matrix
    return c;
  };
  
  return algorithm06;
}

exports.name = 'algorithm06';
exports.factory = factory;
