'use strict';

var DimensionError = require('../../../error/DimensionError');

function factory (type, config, load) {

  var equalScalar = load(require('../../../function/relational/equalScalar'));

  var SparseMatrix = type.SparseMatrix;

  /**
   * Iterates over SparseMatrix A and SparseMatrix B nonzero items and invokes the callback function f(Aij, Bij). 
   * Callback function invoked MAX(NNZA, NNZB) times
   *
   *
   *          ┌  f(Aij, Bij)  ; A(i,j) !== 0 && B(i,j) !== 0
   * C(i,j) = ┤  A(i,j)       ; A(i,j) !== 0
   *          └  B(i,j)       ; B(i,j) !== 0
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
  var algorithm04 = function (a, b, callback) {
    // sparse matrix arrays
    var avalues = a._values;
    var aindex = a._index;
    var aptr = a._ptr;
    var asize = a._size;
    var adt = a._datatype;
    var azero = a._zero;
    // sparse matrix arrays
    var bvalues = b._values;
    var bindex = b._index;
    var bptr = b._ptr;
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

    // process data types
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
    var cptr = [];
    // matrix
    var c = new SparseMatrix({
      values: cvalues,
      index: cindex,
      ptr: cptr,
      size: [rows, columns],
      datatype: dt
    });

    // workspace
    var x = avalues && bvalues ? [] : undefined;
    // marks indicating we have a value in x for a given column
    var w = [];

    // vars 
    var i, j, k, k0, k1;
    
    // loop columns
    for (j = 0; j < columns; j++) {
      // update cptr
      cptr[j] = cindex.length;
      // columns mark
      var mark = j + 1;
      // loop A(:,j)
      for (k0 = aptr[j], k1 = aptr[j + 1], k = k0; k < k1; k++) {
        // row
        i = aindex[k];
        // update c
        cindex.push(i);
        // update workspace
        w[i] = mark;
        // check we need to process values
        if (x)
          x[i] = avalues[k];
      }
      // loop B(:,j)
      for (k0 = bptr[j], k1 = bptr[j + 1], k = k0; k < k1; k++) {
        // row
        i = bindex[k];
        // check row exists in workspace
        if (w[i] === mark) {
          // check we need to process values
          if (x)
            x[i] = cf(x[i], bvalues[k]);
        }
        else {
          // update c
          cindex.push(i);
          // update workspace
          w[i] = mark;
          // check we need to process values
          if (x)
            x[i] = bvalues[k];
        }
      }
      // check we need to process values (non pattern matrix)
      if (x) {
        // initialize first index in j
        k = cptr[j];
        // loop index in j
        while (k < cindex.length) {
          // row
          i = cindex[k];
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
      }
    }
    // update cptr
    cptr[columns] = cindex.length;

    // return sparse matrix
    return c;
  };
  
  return algorithm04;
}

exports.name = 'algorithm04';
exports.factory = factory;
