'use strict';

var util = require('../../util/index');

var array = util.array;

function factory (type, config, load, typed) {

  var matrix = load(require('../construction/matrix'));
  var addScalar = load(require('./addScalar'));
  var multiplyScalar = load(require('./multiplyScalar'));
  var equal = load(require('../relational/equal'));

  var algorithm10 = load(require('../../type/matrix/util/algorithm10'));
  var algorithm13 = load(require('../../type/matrix/util/algorithm13'));
  
  var DenseMatrix = type.DenseMatrix;
  var SparseMatrix = type.SparseMatrix;

  /**
   * Multiply two values, `x * y`. The result is squeezed.
   * For matrices, the matrix product is calculated.
   *
   * Syntax:
   *
   *    math.multiply(x, y)
   *
   * Examples:
   *
   *    math.multiply(4, 5.2);        // returns Number 20.8
   *
   *    var a = math.complex(2, 3);
   *    var b = math.complex(4, 1);
   *    math.multiply(a, b);          // returns Complex 5 + 14i
   *
   *    var c = [[1, 2], [4, 3]];
   *    var d = [[1, 2, 3], [3, -4, 7]];
   *    math.multiply(c, d);          // returns Array [[7, -6, 17], [13, -4, 33]]
   *
   *    var e = math.unit('2.1 km');
   *    math.multiply(3, e);          // returns Unit 6.3 km
   *
   * See also:
   *
   *    divide
   *
   * @param  {Number | BigNumber | Boolean | Complex | Unit | Array | Matrix | null} x First value to multiply
   * @param  {Number | BigNumber | Boolean | Complex | Unit | Array | Matrix | null} y Second value to multiply
   * @return {Number | BigNumber | Complex | Unit | Array | Matrix} Multiplication of `x` and `y`
   */
  var multiply = typed('multiply', {

    'any, any': multiplyScalar,

    'Array, Array': function (x, y) {
      // check dimensions
      _validateMatrixDimensions(array.size(x), array.size(y));

      // use dense matrix implementation
      var m = multiply(matrix(x), matrix(y));
      // return array or scalar
      return m instanceof type.Matrix ? m.valueOf() : m;
    },

    'Matrix, Matrix': function (x, y) {
      // dimensions
      var xsize = x.size();
      var ysize = y.size();

      // check dimensions
      _validateMatrixDimensions(xsize, ysize);

      // process dimensions
      if (xsize.length === 1) {
        // process y dimensions
        if (ysize.length === 1) {
          // Vector * Vector
          return _multiplyVectorVector(x, y, xsize[0]);
        }
        // Vector * Matrix
        return _multiplyVectorMatrix(x, y);
      }
      // process y dimensions
      if (ysize.length === 1) {
        // Matrix * Vector
        return _multiplyMatrixVector(x, y);
      }
      // Matrix * Matrix
      return _multiplyMatrixMatrix(x, y);
    },

    'Matrix, Array': function (x, y) {
      // use Matrix * Matrix implementation
      return multiply(x, matrix(y));
    },

    'Array, Matrix': function (x, y) {
      // use Matrix * Matrix implementation
      return multiply(matrix(x, y.storage()), y);
    },

    'Matrix, any': function (x, y) {
      // result
      var c;
      
      // process storage format
      switch (x.storage()) {
        case 'sparse':
          c = algorithm10(x, y, multiplyScalar, false);
          break;
        case 'dense':
          c = algorithm13(x, y, multiplyScalar, false);
          break;
      }
      return c;
    },

    'any, Matrix': function (x, y) {
      // result
      var c;
      // check storage format
      switch (y.storage()) {
        case 'sparse':
          c = algorithm10(y, x, multiplyScalar, true);
          break;
        case 'dense':
          c = algorithm13(y, x, multiplyScalar, true);
          break;
      }
      return c;
    },

    'Array, any': function (x, y) {
      // use matrix implementation
      return algorithm13(matrix(x), y, multiplyScalar, false).valueOf();
    },

    'any, Array': function (x, y) {
      // use matrix implementation
      return algorithm13(matrix(y), x, multiplyScalar, true).valueOf();
    }
  });

  var _validateMatrixDimensions = function (size1, size2) {
    // check left operand dimensions
    switch (size1.length) {
      case 1:
        // check size2
        switch (size2.length) {
          case 1:
            // Vector x Vector
            if (size1[0] !== size2[0]) {
              // throw error
              throw new RangeError('Dimension mismatch in multiplication. Vectors must have the same length');
            }
            break;
          case 2:
            // Vector x Matrix
            if (size1[0] !== size2[0]) {
              // throw error
              throw new RangeError('Dimension mismatch in multiplication. Vector length (' + size1[0] + ') must match Matrix rows (' + size2[0] + ')');
            }
            break;
          default:
            throw new Error('Can only multiply a 1 or 2 dimensional matrix (Matrix B has ' + size2.length + ' dimensions)');
        }
        break;
      case 2:
        // check size2
        switch (size2.length) {
          case 1:
            // Matrix x Vector
            if (size1[1] !== size2[0]) {
              // throw error
              throw new RangeError('Dimension mismatch in multiplication. Matrix columns (' + size1[1] + ') must match Vector length (' + size2[0] + ')');
            }
            break;
          case 2:
            // Matrix x Matrix
            if (size1[1] !== size2[0]) {
              // throw error
              throw new RangeError('Dimension mismatch in multiplication. Matrix A columns (' + size1[1] + ') must match Matrix B rows (' + size2[0] + ')');
            }
            break;
          default:
            throw new Error('Can only multiply a 1 or 2 dimensional matrix (Matrix B has ' + size2.length + ' dimensions)');
        }
        break;
      default:
        throw new Error('Can only multiply a 1 or 2 dimensional matrix (Matrix A has ' + size1.length + ' dimensions)');
    }
  };

  /**
   * C = A * B
   *
   * @param {Matrix} a            Dense Vector   (N)
   * @param {Matrix} b            Dense Vector   (N)
   *
   * @return {Number}             Scalar value
   */
  var _multiplyVectorVector = function (a, b, n) {
    // check empty vector
    if (n === 0)
      throw new Error('Cannot multiply two empty vectors');

    // a dense
    var adata = a._data;
    var adt = a._datatype;
    // b dense
    var bdata = b._data;
    var bdt = b._datatype;

    // process data types
    var dt = adt && bdt && adt === bdt ? adt : undefined;
    // multiply & add scalar implementations
    var mf = dt ? multiplyScalar.signatures[dt + ',' + dt] || multiplyScalar : multiplyScalar;
    var af = dt ? addScalar.signatures[dt + ',' + dt] || addScalar : addScalar;

    // result (do not initialize it with zero)
    var c = mf(adata[0], bdata[0]);
    // loop data
    for (var i = 1; i < n; i++) {
      // multiply and accumulate
      c = af(c, mf(adata[i], bdata[i]));
    }
    return c;
  };

  /**
   * C = A * B
   *
   * @param {Matrix} a            Dense Vector   (M)
   * @param {Matrix} b            Matrix         (MxN)
   *
   * @return {Matrix}             Dense Vector   (N)
   */
  var _multiplyVectorMatrix = function (a, b) {
    // process storage
    switch (b.storage()) {
      case 'dense':
        return _multiplyVectorDenseMatrix(a, b);
    }
    throw new Error('Not implemented');
  };

  /**
   * C = A * B
   *
   * @param {Matrix} a            Dense Vector   (M)
   * @param {Matrix} b            Dense Matrix   (MxN)
   *
   * @return {Matrix}             Dense Vector   (N)
   */
  var _multiplyVectorDenseMatrix = function (a, b) {
    // a dense
    var adata = a._data;
    var asize = a._size;
    var adt = a._datatype;
    // b dense
    var bdata = b._data;
    var bsize = b._size;
    var bdt = b._datatype;
    // rows & columns
    var alength = asize[0];
    var bcolumns = bsize[1];

    // process data types
    var dt = adt && bdt && adt === bdt ? adt : undefined;
    // multiply & add scalar implementations
    var mf = dt ? multiplyScalar.signatures[dt + ',' + dt] || multiplyScalar : multiplyScalar;
    var af = dt ? addScalar.signatures[dt + ',' + dt] || addScalar : addScalar;

    // result
    var c = new Array(bcolumns);

    // loop matrix columns
    for (var j = 0; j < bcolumns; j++) {
      // sum (do not initialize it with zero)
      var sum = mf(adata[0], bdata[0][j]);      
      // loop vector
      for (var i = 1; i < alength; i++) {
        // multiply & accumulate
        sum = af(sum, mf(adata[i], bdata[i][j]));
      }
      c[j] = sum;
    }

    // check we need to squeeze the result into a scalar
    if (bcolumns === 1)
      return c[0];

    // return matrix
    return new DenseMatrix({
      data: c,
      size: [bcolumns],
      datatype: dt
    });
  };

  /**
   * C = A * B
   *
   * @param {Matrix} a            Matrix         (MxN)
   * @param {Matrix} b            Dense Vector   (N)
   *
   * @return {Matrix}             Dense Vector   (M)
   */
  var _multiplyMatrixVector = function (a, b) {
    // process storage
    switch (a.storage()) {
      case 'dense':
        return _multiplyDenseMatrixVector(a, b);
      case 'sparse':
        return _multiplySparseMatrixVector(a, b);
    }
  };

  /**
   * C = A * B
   *
   * @param {Matrix} a            Matrix         (MxN)
   * @param {Matrix} b            Matrix         (NxC)
   *
   * @return {Matrix}             Matrix         (MxC)
   */
  var _multiplyMatrixMatrix = function (a, b) {
    // process storage
    switch (a.storage()) {
      case 'dense':
        // process storage
        switch (b.storage()) {
          case 'dense':
            return _multiplyDenseMatrixDenseMatrix(a, b);
          case 'sparse':
            return _multiplyDenseMatrixSparseMatrix(a, b);
        }
        break;
      case 'sparse':
        // process storage
        switch (b.storage()) {
          case 'dense':
            return _multiplySparseMatrixDenseMatrix(a, b);
          case 'sparse':
            return _multiplySparseMatrixSparseMatrix(a, b);
        }
        break;
    }
  };

  /**
   * C = A * B
   *
   * @param {Matrix} a            DenseMatrix  (MxN)
   * @param {Matrix} b            Dense Vector (N)
   *
   * @return {Matrix}             Dense Vector (M) 
   */ 
  var _multiplyDenseMatrixVector = function (a, b) {
    // a dense
    var adata = a._data;
    var asize = a._size;
    var adt = a._datatype;
    // b dense
    var bdata = b._data;
    var bdt = b._datatype;
    // rows & columns
    var arows = asize[0];
    var acolumns = asize[1];

    // process data types
    var dt = adt && bdt && adt === bdt ? adt : undefined;
    // multiply & add scalar implementations
    var mf = dt ? multiplyScalar.signatures[dt + ',' + dt] || multiplyScalar : multiplyScalar;
    var af = dt ? addScalar.signatures[dt + ',' + dt] || addScalar : addScalar;

    // result
    var c = new Array(arows);

    // loop matrix a rows
    for (var i = 0; i < arows; i++) {
      // current row
      var row = adata[i];
      // sum (do not initialize it with zero)
      var sum = mf(row[0], bdata[0]);
      // loop matrix a columns
      for (var j = 1; j < acolumns; j++) {
        // multiply & accumulate
        sum = af(sum, mf(row[j], bdata[j]));
      }
      c[i] = sum;
    }
    // check we need to squeeze the result into a scalar
    if (arows === 1)
      return c[0];

    // return matrix
    return new DenseMatrix({
      data: c,
      size: [arows],
      datatype: dt
    });
  };

  /**
   * C = A * B
   *
   * @param {Matrix} a            DenseMatrix    (MxN)
   * @param {Matrix} b            DenseMatrix    (NxC)
   *
   * @return {Matrix}             DenseMatrix    (MxC)
   */
  var _multiplyDenseMatrixDenseMatrix = function (a, b) {
    // a dense
    var adata = a._data;
    var asize = a._size;
    var adt = a._datatype;
    // b dense
    var bdata = b._data;
    var bsize = b._size;
    var bdt = b._datatype;
    // rows & columns
    var arows = asize[0];
    var acolumns = asize[1];
    var bcolumns = bsize[1];

    // process data types
    var dt = adt && bdt && adt === bdt ? adt : undefined;
    // multiply & add scalar implementations
    var mf = dt ? multiplyScalar.signatures[dt + ',' + dt] || multiplyScalar : multiplyScalar;
    var af = dt ? addScalar.signatures[dt + ',' + dt] || addScalar : addScalar;
    
    // result
    var c = new Array(arows);

    // loop matrix a rows
    for (var i = 0; i < arows; i++) {
      // current row
      var row = adata[i];
      // initialize row array
      c[i] = new Array(bcolumns);
      // loop matrix b columns
      for (var j = 0; j < bcolumns; j++) {
        // sum (avoid initializing sum to zero)
        var sum = mf(row[0], bdata[0][j]);
        // loop matrix a columns
        for (var x = 1; x < acolumns; x++) {
          // multiply & accumulate
          sum = af(sum, mf(row[x], bdata[x][j]));
        }
        c[i][j] = sum;
      }
    }
    // check we need to squeeze the result into a scalar
    if (arows === 1 && bcolumns === 1)
      return c[0][0];

    // return matrix
    return new DenseMatrix({
      data: c,
      size: [arows, bcolumns],
      datatype: dt
    });
  };

  /**
   * C = A * B
   *
   * @param {Matrix} a            DenseMatrix    (MxN)
   * @param {Matrix} b            SparseMatrix   (NxC)
   *
   * @return {Matrix}             SparseMatrix   (MxC)
   */
  var _multiplyDenseMatrixSparseMatrix = function (a, b) {
    // a dense
    var adata = a._data;
    var asize = a._size;
    var adt = a._datatype;
    // b sparse
    var bvalues = b._values;
    var bindex = b._index;
    var bptr = b._ptr;
    var bsize = b._size;
    var bdt = b._datatype;
    // validate b matrix
    if (!bvalues)
      throw new Error('Cannot multiply Dense Matrix times Pattern only Matrix');
    // rows & columns
    var arows = asize[0];
    var bcolumns = bsize[1];
    // result
    var cvalues = [];
    var cindex = [];
    var cptr = new Array(bcolumns + 1);
    // c matrix
    var c = new SparseMatrix({
      values : cvalues,
      index: cindex,
      ptr: cptr,
      size: [arows, bcolumns],
      datatype: dt
    });
    
    // process data types
    var dt = adt && bdt && adt === bdt ? adt : undefined;
    // multiply & add scalar implementations
    var mf = dt ? multiplyScalar.signatures[dt + ',' + dt] || multiplyScalar : multiplyScalar;
    var af = dt ? addScalar.signatures[dt + ',' + dt] || addScalar : addScalar;

    // loop b columns
    for (var jb = 0; jb < bcolumns; jb++) {
      // update ptr
      cptr[jb] = cindex.length;
      // indeces in column jb
      var kb0 = bptr[jb];
      var kb1 = bptr[jb + 1];
      // do not process column jb if no data exists
      if (kb1 > kb0) {
        // last row mark processed
        var last = 0;
        // loop a rows
        for (var i = 0; i < arows; i++) {
          // column mark
          var mark = i + 1;
          // C[i, jb]
          var cij;
          // values in b column j
          for (var kb = kb0; kb < kb1; kb++) {
            // row
            var ib = bindex[kb];
            // check value has been initialized
            if (last !== mark) {
              // first value in column jb
              cij = mf(adata[i][ib], bvalues[kb]);
              // update mark
              last = mark;
            }
            else {
              // accumulate value
              cij = af(cij, mf(adata[i][ib], bvalues[kb]));
            }
          }
          // check column has been processed and value != 0
          if (last === mark && !equal(cij, 0)) {
            // push row & value
            cindex.push(i);
            cvalues.push(cij);
          }
        }
      }
    }
    // update ptr
    cptr[bcolumns] = cindex.length;

    // check we need to squeeze the result into a scalar
    if (arows === 1 && bcolumns === 1)
      return cvalues.length === 1 ? cvalues[0] : 0;

    // return sparse matrix
    return c;
  };

  /**
   * C = A * B
   *
   * @param {Matrix} a            SparseMatrix    (MxN)
   * @param {Matrix} b            Dense Vector (N)
   *
   * @return {Matrix}             SparseMatrix    (M, 1) 
   */
  var _multiplySparseMatrixVector = function (a, b) {
    // a sparse
    var avalues = a._values;
    var aindex = a._index;
    var aptr = a._ptr;
    var adt = a._datatype;
    // validate a matrix
    if (!avalues)
      throw new Error('Cannot multiply Pattern only Matrix times Dense Matrix');
    // b dense
    var bdata = b._data;
    var bdt = b._datatype;
    // rows & columns
    var arows = a._size[0];
    var brows = b._size[0];
    // result
    var cvalues = [];
    var cindex = [];
    var cptr = new Array(2);
    
    // process data types
    var dt = adt && bdt && adt === bdt ? adt : undefined;
    // multiply & add scalar implementations
    var mf = dt ? multiplyScalar.signatures[dt + ',' + dt] || multiplyScalar : multiplyScalar;
    var af = dt ? addScalar.signatures[dt + ',' + dt] || addScalar : addScalar;

    // workspace
    var x = new Array(arows);
    // vector with marks indicating a value x[i] exists in a given column
    var w = new Array(arows);

    // update ptr
    cptr[0] = 0;
    // rows in b
    for (var ib = 0; ib < brows; ib++) {
      // b[ib]
      var vbi = bdata[ib];
      // check b[ib] != 0, avoid loops
      if (!equal(vbi, 0)) {
        // A values & index in ib column
        for (var ka0 = aptr[ib], ka1 = aptr[ib + 1], ka = ka0; ka < ka1; ka++) {
          // a row
          var ia = aindex[ka];
          // check value exists in current j
          if (!w[ia]) {
            // ia is new entry in j
            w[ia] = true;
            // add i to pattern of C
            cindex.push(ia);
            // x(ia) = A
            x[ia] = mf(vbi, avalues[ka]);
          }
          else {
            // i exists in C already
            x[ia] = af(x[ia], mf(vbi, avalues[ka]));
          }
        }
      }
    }
    // copy values from x to column jb of c
    for (var p1 = cindex.length, p = 0; p < p1; p++) {
      // row
      var ic = cindex[p];
      // copy value
      cvalues[p] = x[ic];
    }
    // update ptr
    cptr[1] = cindex.length;

    // check we need to squeeze the result into a scalar
    if (arows === 1)
      return cvalues.length === 1 ? cvalues[0] : 0;

    // return sparse matrix
    return new SparseMatrix({
      values : cvalues,
      index: cindex,
      ptr: cptr,
      size: [arows, 1],
      datatype: dt
    });
  };

  /**
   * C = A * B
   *
   * @param {Matrix} a            SparseMatrix      (MxN)
   * @param {Matrix} b            DenseMatrix       (NxC)
   *
   * @return {Matrix}             SparseMatrix      (MxC)
   */
  var _multiplySparseMatrixDenseMatrix = function (a, b) {
    // a sparse
    var avalues = a._values;
    var aindex = a._index;
    var aptr = a._ptr;
    var adt = a._datatype;
    // validate a matrix
    if (!avalues)
      throw new Error('Cannot multiply Pattern only Matrix times Dense Matrix');
    // b dense
    var bdata = b._data;
    var bdt = b._datatype;
    // rows & columns
    var arows = a._size[0];
    var brows = b._size[0];
    var bcolumns = b._size[1];

    // process data types
    var dt = adt && bdt && adt === bdt ? adt : undefined;
    // multiply & add scalar implementations
    var mf = dt ? multiplyScalar.signatures[dt + ',' + dt] || multiplyScalar : multiplyScalar;
    var af = dt ? addScalar.signatures[dt + ',' + dt] || addScalar : addScalar;

    // result
    var cvalues = [];
    var cindex = [];
    var cptr = new Array(bcolumns + 1);
    // c matrix
    var c = new SparseMatrix({
      values : cvalues,
      index: cindex,
      ptr: cptr,
      size: [arows, bcolumns],
      datatype: dt
    });
    // workspace
    var x = new Array(arows);
    // vector with marks indicating a value x[i] exists in a given column
    var w = new Array(arows);

    // loop b columns
    for (var jb = 0; jb < bcolumns; jb++) {
      // update ptr
      cptr[jb] = cindex.length;
      // mark in workspace for current column
      var mark = jb + 1;
      // rows in jb
      for (var ib = 0; ib < brows; ib++) {
        // b[ib, jb]
        var vbij = bdata[ib][jb];
        // check b[ib, jb] != 0, avoid loops
        if (!equal(vbij, 0)) {
          // A values & index in ib column
          for (var ka0 = aptr[ib], ka1 = aptr[ib + 1], ka = ka0; ka < ka1; ka++) {
            // a row
            var ia = aindex[ka];
            // check value exists in current j
            if (w[ia] !== mark) {
              // ia is new entry in j
              w[ia] = mark;
              // add i to pattern of C
              cindex.push(ia);
              // x(ia) = A
              x[ia] = mf(vbij, avalues[ka]);
            }
            else {
              // i exists in C already
              x[ia] = af(x[ia], mf(vbij, avalues[ka]));
            }
          }
        }
      }
      // copy values from x to column jb of c
      for (var p0 = cptr[jb], p1 = cindex.length, p = p0; p < p1; p++) {
        // row
        var ic = cindex[p];
        // copy value
        cvalues[p] = x[ic];
      }
    }
    // update ptr
    cptr[bcolumns] = cindex.length;

    // check we need to squeeze the result into a scalar
    if (arows === 1 && bcolumns === 1)
      return cvalues.length === 1 ? cvalues[0] : 0;

    // return sparse matrix
    return c;
  };

  /**
   * C = A * B
   *
   * @param {Matrix} a            SparseMatrix      (MxN)
   * @param {Matrix} b            SparseMatrix      (NxC)
   *
   * @return {Matrix}             SparseMatrix      (MxC)
   */
  var _multiplySparseMatrixSparseMatrix = function (a, b) {
    // a sparse
    var avalues = a._values;
    var aindex = a._index;
    var aptr = a._ptr;
    var adt = a._datatype;
    // b sparse
    var bvalues = b._values;
    var bindex = b._index;
    var bptr = b._ptr;
    var bdt = b._datatype;
    // process data types
    var dt = adt && bdt && adt === bdt ? adt : undefined;
    // multiply & add scalar implementations
    var mf = dt ? multiplyScalar.signatures[dt + ',' + dt] || multiplyScalar : multiplyScalar;
    var af = dt ? addScalar.signatures[dt + ',' + dt] || addScalar : addScalar;
    // rows & columns
    var arows = a._size[0];
    var bcolumns = b._size[1];
    // flag indicating both matrices (a & b) contain data
    var values = avalues && bvalues;
    // result
    var cvalues = values ? [] : undefined;
    var cindex = [];
    var cptr = new Array(bcolumns + 1);
    // c matrix
    var c = new SparseMatrix({
      values : cvalues,
      index: cindex,
      ptr: cptr,
      size: [arows, bcolumns],
      datatype: dt
    });
    // workspace
    var x = values ? new Array(arows) : undefined;
    // vector with marks indicating a value x[i] exists in a given column
    var w = new Array(arows);
    // variables
    var ka, ka0, ka1, kb, kb0, kb1, ia, ib;
    // loop b columns
    for (var jb = 0; jb < bcolumns; jb++) {
      // update ptr
      cptr[jb] = cindex.length;
      // mark in workspace for current column
      var mark = jb + 1;
      // B values & index in j
      for (kb0 = bptr[jb], kb1 = bptr[jb + 1], kb = kb0; kb < kb1; kb++) {
        // b row
        ib = bindex[kb];
        // check we need to process values
        if (values) {
          // loop values in a[:,ib]
          for (ka0 = aptr[ib], ka1 = aptr[ib + 1], ka = ka0; ka < ka1; ka++) {
            // row
            ia = aindex[ka];
            // check value exists in current j
            if (w[ia] !== mark) {
              // ia is new entry in j
              w[ia] = mark;
              // add i to pattern of C
              cindex.push(ia);
              // x(ia) = A
              x[ia] = mf(bvalues[kb], avalues[ka]);
            }
            else {
              // i exists in C already
              x[ia] = af(x[ia], mf(bvalues[kb], avalues[ka]));
            }
          }
        }
        else {
          // loop values in a[:,ib]
          for (ka0 = aptr[ib], ka1 = aptr[ib + 1], ka = ka0; ka < ka1; ka++) {
            // row
            ia = aindex[ka];
            // check value exists in current j
            if (w[ia] !== mark) {
              // ia is new entry in j
              w[ia] = mark;
              // add i to pattern of C
              cindex.push(ia);
            }
          }
        }
      }
      // check we need to process matrix values (pattern matrix)
      if (values) {
        // copy values from x to column jb of c
        for (var p0 = cptr[jb], p1 = cindex.length, p = p0; p < p1; p++) {
          // row
          var ic = cindex[p];
          // copy value
          cvalues[p] = x[ic];
        }
      }
    }
    // update ptr
    cptr[bcolumns] = cindex.length;

    // check we need to squeeze the result into a scalar
    if (arows === 1 && bcolumns === 1 && values)
      return cvalues.length === 1 ? cvalues[0] : 0;

    // return sparse matrix
    return c;
  };

  return multiply;
}

exports.name = 'multiply';
exports.factory = factory;
