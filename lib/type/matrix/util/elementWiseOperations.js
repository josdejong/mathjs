'use strict';

var util = require('../../../util/index');
var DimensionError = require('../../../error/DimensionError');

var object = util.object;

function factory (type, config, load) {
  
  var equal = load(require('../../../function/relational/equal'));
  
  var DenseMatrix = type.DenseMatrix,
      SparseMatrix = type.SparseMatrix;

  /**
   * Iterates over SparseMatrix nonzero items and invokes the callback function f(Dij, Sij). 
   * Callback function invoked NNZ times (number of nonzero items in SparseMatrix).
   *
   *
   *          ┌  f(Dij, Sij)  ; S(i,j) !== 0
   * C(i,j) = ┤
   *          └  Dij          ; otherwise
   *
   *
   * @param {Matrix}   denseMatrix       The DenseMatrix instance (D)
   * @param {Matrix}   sparseMatrix      The SparseMatrix instance (S)
   * @param {function} callback          The f(Dij,Sij) operation to invoke, where Dij = DenseMatrix(i,j) and Sij = SparseMatrix(i,j)
   * @param {boolean}  inverse           A true value indicates callback should be invoked f(Sij,Dij)
   *
   * @return {Matrix}                    DenseMatrix (C)
   *
   * see https://github.com/josdejong/mathjs/pull/346#issuecomment-97477571
   */
  var algorithm1 = function (denseMatrix, sparseMatrix, callback, inverse) {
    // dense matrix arrays
    var adata = denseMatrix._data;
    var asize = denseMatrix._size;
    var adt = denseMatrix._datatype;
    // sparse matrix arrays
    var bvalues = sparseMatrix._values;
    var bindex = sparseMatrix._index;
    var bptr = sparseMatrix._ptr;
    var bsize = sparseMatrix._size;
    var bdt = sparseMatrix._datatype;
    
    // validate dimensions
    if (asize.length !== bsize.length)
      throw new DimensionError(asize.length, bsize.length);
    
    // check rows & columns
    if (asize[0] !== bsize[0] || asize[1] !== bsize[1])
      throw new RangeError('Dimension mismatch. Matrix A (' + asize + ') must match Matrix B (' + bsize + ')');
    
    // sparse matrix cannot be a Pattern matrix
    if (!bvalues)
      throw new Error('Cannot perform operation on Dense Matrix and Pattern Sparse Matrix');

    // rows & columns
    var rows = asize[0];
    var columns = asize[1];
    
    // process data types
    var dt = adt && bdt && adt === bdt ? adt : undefined;
    // callback implementation
    var cf = dt && callback.signatures ? callback.signatures[dt + ',' + dt] || callback : callback;
    
    // result (DenseMatrix)
    var cdata = object.clone(adata);
    
    // loop columns in b
    for (var j = 0; j < columns; j++) {
      // values in column j
      for (var k0 = bptr[j], k1 = bptr[j + 1], k = k0; k < k1; k++) {
        // row
        var i = bindex[k];
        // update C(i,j)
        cdata[i][j] = inverse ? cf(bvalues[k], cdata[i][j]) : cf(cdata[i][j], bvalues[k]);
      }
    }
    
    // return dense matrix
    return new DenseMatrix({
      data: cdata,
      size: [rows, columns],
      datatype: dt
    });
  };
  
  /**
   * Iterates over SparseMatrix nonzero items and invokes the callback function f(Dij, Sij). 
   * Callback function invoked NNZ times (number of nonzero items in SparseMatrix).
   *
   *
   *          ┌  f(Dij, Sij)  ; S(i,j) !== 0
   * C(i,j) = ┤
   *          └  0            ; otherwise
   *
   *
   * @param {Matrix}   denseMatrix       The DenseMatrix instance (D)
   * @param {Matrix}   sparseMatrix      The SparseMatrix instance (S)
   * @param {function} callback          The f(Dij,Sij) operation to invoke, where Dij = DenseMatrix(i,j) and Sij = SparseMatrix(i,j)
   * @param {boolean}  inverse           A true value indicates callback should be invoked f(Sij,Dij)
   *
   * @return {Matrix}                    SparseMatrix (C)
   *
   * see https://github.com/josdejong/mathjs/pull/346#issuecomment-97477571
   */
  var algorithm2 = function (denseMatrix, sparseMatrix, callback, inverse) {
    // dense matrix arrays
    var adata = denseMatrix._data;
    var asize = denseMatrix._size;
    var adt = denseMatrix._datatype;
    // sparse matrix arrays
    var bvalues = sparseMatrix._values;
    var bindex = sparseMatrix._index;
    var bptr = sparseMatrix._ptr;
    var bsize = sparseMatrix._size;
    var bdt = sparseMatrix._datatype;

    // validate dimensions
    if (asize.length !== bsize.length)
      throw new DimensionError(asize.length, bsize.length);

    // check rows & columns
    if (asize[0] !== bsize[0] || asize[1] !== bsize[1])
      throw new RangeError('Dimension mismatch. Matrix A (' + asize + ') must match Matrix B (' + bsize + ')');
    
    // sparse matrix cannot be a Pattern matrix
    if (!bvalues)
      throw new Error('Cannot perform operation on Dense Matrix and Pattern Sparse Matrix');

    // rows & columns
    var rows = asize[0];
    var columns = asize[1];

    // process data types
    var dt = adt && bdt && adt === bdt ? adt : undefined;
    // callback implementation
    var cf = dt && callback.signatures ? callback.signatures[dt + ',' + dt] || callback : callback;

    // result (SparseMatrix)
    var cvalues = [];
    var cindex = [];
    var cptr = new Array(columns + 1);

    // loop columns in b
    for (var j = 0; j < columns; j++) {
      // update cptr
      cptr[j] = cindex.length;
      // values in column j
      for (var k0 = bptr[j], k1 = bptr[j + 1], k = k0; k < k1; k++) {
        // row
        var i = bindex[k];
        // update C(i,j)
        var cij = inverse ? cf(bvalues[k], adata[i][j]) : cf(adata[i][j], bvalues[k]);
        // check for nonzero
        if (!equal(cij, 0)) {
          // push i & v
          cindex.push(i);
          cvalues.push(cij);
        }
      }
    }
    // update cptr
    cptr[columns] = cindex.length;

    // return sparse matrix
    return new SparseMatrix({
      values: cvalues,
      index: cindex,
      ptr: cptr,
      size: [rows, columns],
      datatype: dt
    });
  };
  
  /**
   * Iterates over SparseMatrix items and invokes the callback function f(Dij, Sij).
   * Callback function invoked M*N times.
   *
   *
   *          ┌  f(Dij, Sij)  ; S(i,j) !== 0
   * C(i,j) = ┤
   *          └  f(Dij, 0)    ; otherwise
   *
   *
   * @param {Matrix}   denseMatrix       The DenseMatrix instance (D)
   * @param {Matrix}   sparseMatrix      The SparseMatrix instance (C)
   * @param {function} callback          The f(Dij,Sij) operation to invoke, where Dij = DenseMatrix(i,j) and Sij = SparseMatrix(i,j)
   * @param {boolean}  inverse           A true value indicates callback should be invoked f(Sij,Dij)
   *
   * @return {Matrix}                    DenseMatrix (C)
   *
   * see https://github.com/josdejong/mathjs/pull/346#issuecomment-97477571
   */
  var algorithm3 = function (denseMatrix, sparseMatrix, callback, inverse) {
    // dense matrix arrays
    var adata = denseMatrix._data;
    var asize = denseMatrix._size;
    var adt = denseMatrix._datatype;
    // sparse matrix arrays
    var bvalues = sparseMatrix._values;
    var bindex = sparseMatrix._index;
    var bptr = sparseMatrix._ptr;
    var bsize = sparseMatrix._size;
    var bdt = sparseMatrix._datatype;
    var bzero = sparseMatrix._zero;
    
    // validate dimensions
    if (asize.length !== bsize.length)
      throw new DimensionError(asize.length, bsize.length);

    // check rows & columns
    if (asize[0] !== bsize[0] || asize[1] !== bsize[1])
      throw new RangeError('Dimension mismatch. Matrix A (' + asize + ') must match Matrix B (' + bsize + ')');

    // sparse matrix cannot be a Pattern matrix
    if (!bvalues)
      throw new Error('Cannot perform operation on Dense Matrix and Pattern Sparse Matrix');

    // rows & columns
    var rows = asize[0];
    var columns = asize[1];

    // process data types (zero value is required!)
    var dt = adt && bdt && typeof(bzero) !== 'undefined' && bzero !== null && adt === bdt ? adt : undefined;
    // callback implementation
    var cf = dt && callback.signatures ? callback.signatures[dt + ',' + dt] || callback : callback;

    // sparse matrix zero value
    var zero = dt ? bzero : 0;
    
    // result (DenseMatrix)
    var cdata = new Array(rows);
    
    // initialize dense matrix
    for (var z = 0; z < rows; z++) {
      // initialize row
      cdata[z] = new Array(columns);
    }
    
    // workspace
    var x = new Array(rows);
    // marks indicating we have a value in x for a given column
    var w = new Array(rows);

    // loop columns in b
    for (var j = 0; j < columns; j++) {
      // column mark
      var mark = j + 1;
      // values in column j
      for (var k0 = bptr[j], k1 = bptr[j + 1], k = k0; k < k1; k++) {
        // row
        var i = bindex[k];
        // update workspace
        x[i] = inverse ? cf(bvalues[k], adata[i][j]) : cf(adata[i][j], bvalues[k]);
        w[i] = mark;
      }
      // process workspace
      for (var y = 0; y < rows; y++) {
        // check we have a calculated value for current row
        if (w[y] === mark) {
          // use calculated value
          cdata[y][j] = x[y];
        }
        else {
          // calculate value
          cdata[y][j] = inverse ? cf(zero, adata[y][j]) : cf(adata[y][j], zero);
        }
      }
    }

    // return dense matrix
    return new DenseMatrix({
      data: cdata,
      size: [rows, columns],
      datatype: dt
    });
  };
  
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
  var algorithm4 = function (a, b, callback) {
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

    // process data types
    var dt = adt && bdt && typeof(azero) !== 'undefined' && azero !== null && typeof(bzero) !== 'undefined' && bzero !== null && adt === bdt ? adt : undefined;
    // callback implementation
    var cf = dt && callback.signatures ? callback.signatures[dt + ',' + dt] || callback : callback;
    // equal
    var ef = dt ? equal.signatures[dt + ',' + dt] || equal : equal;

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
      datatype: dt
    });
    
    // workspace
    var x = avalues && bvalues ? new Array(rows) : undefined;
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
      _scatter(a, j, w, x, u, mark, c, cf, false);
      // scatter the values of B(:,j) into workspace
      _scatter(b, j, w, x, u, mark, c, cf, false);
      // check we need to process values (non pattern matrix)
      if (x) {
        // initialize first index in j
        var k = cptr[j];
        // loop index in j
        while (k < cindex.length) {
          // row
          var i = cindex[k];
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
  
  /**
   * Iterates over SparseMatrix A and SparseMatrix B nonzero items and invokes the callback function f(Aij, Bij). 
   * Callback function invoked MAX(NNZA, NNZB) times
   *
   *
   *          ┌  f(Aij, Bij)  ; A(i,j) !== 0 || B(i,j) !== 0
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
  var algorithm5 = function (a, b, callback) {
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
    var ef = dt ? equal.signatures[dt + ',' + dt] || equal : equal;

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
      _scatter(a, j, w, x, u, mark, c);
      // scatter the values of B(:,j) into workspace
      _scatter(b, j, w, x, u, mark, c, cf, false, true, zero);
      // check we need to process values (non pattern matrix)
      if (x) {
        // initialize first index in j
        var k = cptr[j];
        // loop index in j
        while (k < cindex.length) {
          // row
          var i = cindex[k];
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
  var algorithm6 = function (a, b, callback) {
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
    var ef = dt ? equal.signatures[dt + ',' + dt] || equal : equal;

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
      _scatter(a, j, w, x, u, mark, c, cf);
      // scatter the values of B(:,j) into workspace
      _scatter(b, j, w, x, u, mark, c, cf);
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
  var algorithm7 = function (a, b, callback) {
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
      _scatter(a, j, wa, xa, u, mark, undefined, cf);
      // scatter the values of B(:,j) into workspace
      _scatter(b, j, wb, xb, u, mark, undefined, cf);
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

  /**
   * Iterates over SparseMatrix S nonzero items and invokes the callback function f(Sij, b). 
   * Callback function invoked NZ times (number of nonzero items in S).
   *
   *
   *          ┌  f(Sij, b)  ; S(i,j) !== 0
   * C(i,j) = ┤  
   *          └  b          ; otherwise
   *
   *
   * @param {Matrix}   s                 The SparseMatrix instance (S)
   * @param {Scalar}   b                 The Scalar value
   * @param {function} callback          The f(Aij,b) operation to invoke
   * @param {boolean}  inverse           A true value indicates callback should be invoked f(b,Sij)
   *
   * @return {Matrix}                    DenseMatrix (C)
   *
   * https://github.com/josdejong/mathjs/pull/346#issuecomment-97626813
   */
  var algorithm8 = function (s, b, callback, inverse) {
    // sparse matrix arrays
    var avalues = s._values;
    var aindex = s._index;
    var aptr = s._ptr;
    var asize = s._size;

    // sparse matrix cannot be a Pattern matrix
    if (!avalues)
      throw new Error('Cannot perform operation on Pattern Sparse Matrix and Scalar value');
    
    // rows & columns
    var rows = asize[0];
    var columns = asize[1];

    // result arrays
    var cdata = new Array(rows);
    // matrix
    var c = new DenseMatrix({
      data: cdata,
      size: [rows, columns]
    });

    // workspaces
    var x = new Array(rows);
    // marks indicating we have a value in x for a given column
    var w = new Array(rows);

    // loop columns
    for (var j = 0; j < columns; j++) {
      // columns mark
      var mark = j + 1;
      // values in j
      for (var k0 = aptr[j], k1 = aptr[j + 1], k = k0; k < k1; k++) {
        // row
        var r = aindex[k];
        // update workspace
        x[r] = avalues[k];
        w[r] = mark;
      }
      // loop rows
      for (var i = 0; i < rows; i++) {
        // initialize C on first column
        if (j === 0) {
          // create row array
          cdata[i] = new Array(columns);
        }
        // check sparse matrix has a value @ i,j
        if (w[i] === mark) {
          // invoke callback, update C
          cdata[i][j] = inverse ? callback(b, x[i]) : callback(x[i], b);
        }
        else {
          // dense matrix value @ i, j
          cdata[i][j] = b;
        }
      }
    }

    // return sparse matrix
    return c;
  };

  /**
   * Iterates over SparseMatrix S nonzero items and invokes the callback function f(Sij, b). 
   * Callback function invoked NZ times (number of nonzero items in S).
   *
   *
   *          ┌  f(Sij, b)  ; S(i,j) !== 0
   * C(i,j) = ┤  
   *          └  0          ; otherwise
   *
   *
   * @param {Matrix}   s                 The SparseMatrix instance (S)
   * @param {Scalar}   b                 The Scalar value
   * @param {function} callback          The f(Aij,b) operation to invoke
   * @param {boolean}  inverse           A true value indicates callback should be invoked f(b,Sij)
   *
   * @return {Matrix}                    SparseMatrix (C)
   *
   * https://github.com/josdejong/mathjs/pull/346#issuecomment-97626813
   */
  var algorithm9 = function (s, b, callback, inverse) {
    // sparse matrix arrays
    var avalues = s._values;
    var aindex = s._index;
    var aptr = s._ptr;
    var asize = s._size;

    // sparse matrix cannot be a Pattern matrix
    if (!avalues)
      throw new Error('Cannot perform operation on Pattern Sparse Matrix and Scalar value');

    // rows & columns
    var rows = asize[0];
    var columns = asize[1];

    // result arrays
    var cvalues = [];
    var cindex = [];
    var cptr = new Array(columns + 1);
    // matrix
    var c = new SparseMatrix({
      values: cvalues,
      index: cindex,
      ptr: cptr,
      size: [rows, columns]
    });

    // loop columns
    for (var j = 0; j < columns; j++) {
      // initialize ptr
      cptr[j] = cindex.length;
      // values in j
      for (var k0 = aptr[j], k1 = aptr[j + 1], k = k0; k < k1; k++) {
        // row
        var i = aindex[k];
        // invoke callback
        var v = inverse ? callback(b, avalues[k]) : callback(avalues[k], b);
        // check value is zero
        if (!equal(v, 0)) {
          // push index & value
          cindex.push(i);
          cvalues.push(v);
        }
      }
    }
    // update ptr
    cptr[columns] = cindex.length;

    // return sparse matrix
    return c;
  };

  /**
   * Iterates over SparseMatrix S nonzero items and invokes the callback function f(Sij, b). 
   * Callback function invoked MxN times.
   *
   *
   *          ┌  f(Sij, b)  ; S(i,j) !== 0
   * C(i,j) = ┤  
   *          └  f(0, b)    ; otherwise
   *
   *
   * @param {Matrix}   s                 The SparseMatrix instance (S)
   * @param {Scalar}   b                 The Scalar value
   * @param {function} callback          The f(Aij,b) operation to invoke
   * @param {boolean}  inverse           A true value indicates callback should be invoked f(b,Sij)
   *
   * @return {Matrix}                    DenseMatrix (C)
   *
   * https://github.com/josdejong/mathjs/pull/346#issuecomment-97626813
   */
  var algorithm10 = function (s, b, callback, inverse) {
    // sparse matrix arrays
    var avalues = s._values;
    var aindex = s._index;
    var aptr = s._ptr;
    var asize = s._size;

    // sparse matrix cannot be a Pattern matrix
    if (!avalues)
      throw new Error('Cannot perform operation on Pattern Sparse Matrix and Scalar value');

    // rows & columns
    var rows = asize[0];
    var columns = asize[1];

    // result arrays
    var cdata = new Array(rows);
    // matrix
    var c = new DenseMatrix({
      data: cdata,
      size: [rows, columns]
    });

    // workspaces
    var x = new Array(rows);
    // marks indicating we have a value in x for a given column
    var w = new Array(rows);

    // loop columns
    for (var j = 0; j < columns; j++) {
      // columns mark
      var mark = j + 1;
      // values in j
      for (var k0 = aptr[j], k1 = aptr[j + 1], k = k0; k < k1; k++) {
        // row
        var r = aindex[k];
        // update workspace
        x[r] = avalues[k];
        w[r] = mark;
      }
      // loop rows
      for (var i = 0; i < rows; i++) {
        // initialize C on first column
        if (j === 0) {
          // create row array
          cdata[i] = new Array(columns);
        }
        // check sparse matrix has a value @ i,j
        if (w[i] === mark) {
          // invoke callback, update C
          cdata[i][j] = inverse ? callback(b, x[i]) : callback(x[i], b);
        }
        else {
          // dense matrix value @ i, j
          cdata[i][j] = inverse ? callback(b, 0) : callback(0, b);
        }
      }
    }

    // return sparse matrix
    return c;
  };
  
  /**
   * Iterates over DenseMatrix items and invokes the callback function f(Aij..z, Bij..z). 
   * Callback function invoked MxN times.
   *
   * C(i,j,...z) = f(Aij..z, Bij..z)
   *
   * @param {Matrix}   a                 The DenseMatrix instance (A)
   * @param {Matrix}   b                 The DenseMatrix instance (B)
   * @param {function} callback          The f(Aij..z,Bij..z) operation to invoke
   *
   * @return {Matrix}                    DenseMatrix (C)
   *
   * https://github.com/josdejong/mathjs/pull/346#issuecomment-97658658
   */
  var algorithm11 = function (a, b, callback) {
    // a arrays
    var adata = a._data;
    var asize = a._size;
    var adt = a._datatype;
    // b arrays
    var bdata = b._data;
    var bsize = b._size;
    var bdt = b._datatype;

    // validate dimensions
    if (asize.length !== bsize.length)
      throw new DimensionError(asize.length, bsize.length);

    // validate each one of the dimension sizes
    for (var s = 0; s < asize.length; s++) {
      // must match
      if (asize[s] !== bsize[s])
        throw new RangeError('Dimension mismatch. Matrix A (' + asize + ') must match Matrix B (' + bsize + ')');
    }
    
    // process data types
    var dt = adt && bdt && adt === bdt ? adt : undefined;
    // callback implementation
    var cf = dt && callback.signatures ? callback.signatures[dt + ',' + dt] || callback : callback;

    // c arrays
    var cdata = new Array(asize[0]);
    // c matrix
    var c = new DenseMatrix({
      data: cdata,
      size: object.clone(asize),
      datatype: dt
    });

    // recursive function
    var iterate = function (level, n, av, bv, cv) {
      // check we reach the last level
      if (level === asize.length - 1) {
        // loop arrays in last level
        for (var i = 0; i < n; i++) {
          // invoke callback and store value
          cv[i] = cf(av[i], bv[i]);
        }
      }
      else {
        // iterate current level
        for (var j = 0; j < n; j++) {
          // initialize cv for this level
          var cvl = new Array(n);
          // iterate next level
          iterate(level + 1, asize[level + 1], av[j], bv[j], cvl);
          // store array
          cv[j] = cvl;
        }
      }
    };

    // populate cdata, iterate through dimensions
    iterate(0, cdata.length, adata, bdata, cdata);

    // return matrix
    return c;
  };
  
  /**
   * Iterates over DenseMatrix items and invokes the callback function f(Aij..z, b). 
   * Callback function invoked MxN times.
   *
   * C(i,j,...z) = f(Aij..z, b)
   *
   * @param {Matrix}   a                 The DenseMatrix instance (A)
   * @param {Scalar}   b                 The Scalar value
   * @param {function} callback          The f(Aij..z,b) operation to invoke
   * @param {boolean}  inverse           A true value indicates callback should be invoked f(b,Aij..z)
   *
   * @return {Matrix}                    DenseMatrix (C)
   *
   * https://github.com/josdejong/mathjs/pull/346#issuecomment-97659042
   */
  var algorithm12 = function (a, b, callback, inverse) {
    // a arrays
    var adata = a._data;
    var asize = a._size;

    // c arrays
    var cdata = new Array(asize[0]);
    // c matrix
    var c = new DenseMatrix({
      data: cdata,
      size: object.clone(asize)
    });

    // recursive function
    var iterate = function (level, n, av, cv) {
      // check we reach the last level
      if (level === asize.length - 1) {
        // loop arrays in last level
        for (var i = 0; i < n; i++) {
          // invoke callback and store value
          cv[i] = inverse ? callback(b, av[i]) : callback(av[i], b);
        }
      }
      else {
        // iterate current level
        for (var j = 0; j < n; j++) {
          // initialize cv for this level
          var cvl = new Array(n);
          // iterate next level
          iterate(level + 1, asize[level + 1], av[j], cvl);
          // store array
          cv[j] = cvl;
        }
      }
    };

    // populate cdata, iterate through dimensions
    iterate(0, cdata.length, adata, cdata);

    // return matrix
    return c;
  };

  var _scatter = function (a, j, w, x, u, mark, c, f, inverse, update, value) {
    // a arrays
    var avalues = a._values;
    var aindex = a._index;
    var aptr = a._ptr;
    // c arrays
    var cindex = c ? c._index : undefined;
    
    // vars
    var k, k0, k1, i;
    
    // check we need to process values (pattern matrix)
    if (x) {
      // values in j
      for (k0 = aptr[j], k1 = aptr[j + 1], k = k0; k < k1; k++) {
        // row
        i = aindex[k];
        // check value exists in current j
        if (w[i] !== mark) {
          // i is new entry in j
          w[i] = mark;
          // add i to pattern of C (if C was provided)
          if (cindex)
            cindex.push(i);
          // x(i) = A, check we need to call function this time
          if (update) {
            // copy value to workspace calling callback function
            x[i] = inverse ? f(avalues[k], value) : f(value, avalues[k]);
            // function was called on current row
            u[i] = mark;  
          }
          else {
            // copy value to workspace
            x[i] = avalues[k];
          }
        }
        else {
          // i exists in C already
          x[i] = inverse ? f(avalues[k], x[i]) : f(x[i], avalues[k]);
          // function was called on current row
          u[i] = mark;
        }
      }
    }
    else {
      // values in j
      for (k0 = aptr[j], k1 = aptr[j + 1], k = k0; k < k1; k++) {
        // row
        i = aindex[k];
        // check value exists in current j
        if (w[i] !== mark) {
          // i is new entry in j
          w[i] = mark;
          // add i to pattern of C (if C was provided)
          if (cindex)
            cindex.push(i);
        }
        else {
          // indicate function was called on current row
          u[i] = mark;
        }
      }
    }
  };
  
  // return algorithms
  return {
    // dense, sparse (https://github.com/josdejong/mathjs/pull/346#issuecomment-97477571)
    algorithm1: algorithm1,
    algorithm2: algorithm2,
    algorithm3: algorithm3,
    // sparse, sparse (https://github.com/josdejong/mathjs/pull/346#issuecomment-97620294)
    algorithm4: algorithm4,
    algorithm5: algorithm5,
    algorithm6: algorithm6,
    algorithm7: algorithm7,
    // sparse, scalar (https://github.com/josdejong/mathjs/pull/346#issuecomment-97626813)
    algorithm8: algorithm8,
    algorithm9: algorithm9,
    algorithm10: algorithm10,
    // dense, dense (https://github.com/josdejong/mathjs/pull/346#issuecomment-97658658)
    algorithm11: algorithm11,
    // dense, scalar (https://github.com/josdejong/mathjs/pull/346#issuecomment-97659042)
    algorithm12: algorithm12
  };
}

exports.name = 'elementWiseOperations';
exports.factory = factory;
