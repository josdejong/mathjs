'use strict';

var util = require('../../util/index');

var array = util.array;

function factory (type, config, load, typed) {

  var matrix = load(require('../construction/matrix'));
  var addScalar = load(require('./addScalar'));
  var multiplyScalar = load(require('./multiplyScalar'));
  var equal = load(require('../relational/equal'));
  var sparseScatter = load(require('./sparseScatter'));

  var collection = load(require('../../type/collection'));

  var DenseMatrix = type.DenseMatrix;
  var SparseMatrix = type.SparseMatrix;
  var Spa = type.Spa;

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

    'Array, any': function (x, y) {
      return collection.deepMap2(x, y, multiply);
    },

    'Matrix, any': function (x, y) {
      // use matrix map, skip zeros since 0 * X = 0
      return x.map(function (v) {
        return multiply(v, y);
      }, true);
    },

    'any, Array | Matrix': function (x, y) {
      // use matrix map, skip zeros since 0 * X = 0
      return y.map(function (v) {
        return multiply(v, x);
      }, true);
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
    // b dense
    var bdata = b._data;

    // result
    var c = 0;
    // loop data
    for (var i = 0; i < n; i++) {
      // multiply and accumulate
      c = addScalar(c, multiply(adata[i], bdata[i]));
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
    // b dense
    var bdata = b._data;
    var bsize = b._size;
    // rows & columns
    var alength = asize[0];
    var bcolumns = bsize[1];

    // result
    var c = new Array(bcolumns);

    // loop matrix columns
    for (var j = 0; j < bcolumns; j++) {
      // sum
      var sum = 0;      
      // loop vector
      for (var i = 0; i < alength; i++) {
        // multiply & accumulate
        sum = addScalar(sum, multiply(adata[i], bdata[i][j]));
      }
      c[j] = sum;
    }

    // check we need to squeeze the result into a scalar
    if (bcolumns === 1)
      return c[0];

    // return matrix
    return new DenseMatrix({
      data: c,
      size: [bcolumns]
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
    // b dense
    var bdata = b._data;
    // rows & columns
    var arows = asize[0];
    var acolumns = asize[1];

    // result
    var c = new Array(arows);

    // loop matrix a rows
    for (var i = 0; i < arows; i++) {
      // current row
      var row = adata[i];
      // sum
      var sum = 0;
      // loop matrix a columns
      for (var j = 0; j < acolumns; j++) {
        // multiply & accumulate
        sum = addScalar(sum, multiply(row[j], bdata[j]));
      }
      c[i] = sum;
    }
    // check we need to squeeze the result into a scalar
    if (arows === 1)
      return c[0];

    // return matrix
    return new DenseMatrix({
      data: c,
      size: [arows]
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
    // b dense
    var bdata = b._data;
    var bsize = b._size;
    // rows & columns
    var arows = asize[0];
    var acolumns = asize[1];
    var bcolumns = bsize[1];

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
        // sum
        var sum = 0;
        // loop matrix a columns
        for (var x = 0; x < acolumns; x++) {
          // multiply & accumulate
          sum = addScalar(sum, multiply(row[x], bdata[x][j]));
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
      size: [arows, bcolumns]
    });
  };

  /**
   * C = A * B
   *
   * @param {Matrix} a            DenseMatrix    (MxN)
   * @param {Matrix} b            SparseMatrix      (NxC)
   *
   * @return {Matrix}             DenseMatrix    (MxC)
   */
  var _multiplyDenseMatrixSparseMatrix = function (a, b) {
    // a dense
    var adata = a._data;
    var asize = a._size;
    // b sparse
    var bvalues = b._values;
    var bindex = b._index;
    var bptr = b._ptr;
    var bsize = b._size;
    // rows & columns
    var arows = asize[0];
    var bcolumns = bsize[1];

    // result
    var c = new Array(arows);

    // loop a rows
    for (var i = 0; i < arows; i++) {
      // initialize row
      c[i] = new Array(bcolumns);
      // current row
      var row = adata[i];
      // loop b columns
      for (var j = 0; j < bcolumns; j++) {
        // sum
        var sum = 0;
        // values & index in column j
        for (var k0 = bptr[j], k1 = bptr[j + 1], k = k0; k < k1; k++) {
          // row
          var x = bindex[k];
          // multiply & accumulate
          sum = addScalar(sum, multiply(row[x], bvalues[k]));
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
      size: [arows, bcolumns]
    });
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
    // b dense
    var bdata = b._data;
    // rows & columns
    var arows = a._size[0];
    var brows = b._size[0];
    // result
    var cvalues = [];
    var cindex = [];
    var cptr = [];

    // create sparse accumulator
    var spa = new Spa(arows);

    // update ptr
    cptr.push(0);
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
          // accumulate
          spa.accumulate(ia, multiply(vbi, avalues[ka]));
        }
      }
    }
    // process spa
    spa.forEach(0, arows - 1, function (x, v) {
      cindex.push(x);
      cvalues.push(v);
    });
    // update ptr
    cptr.push(cvalues.length);

    // check we need to squeeze the result into a scalar
    if (arows === 1)
      return cvalues.length === 1 ? cvalues[0] : 0;

    // return sparse matrix
    return new SparseMatrix({
      values : cvalues,
      index: cindex,
      ptr: cptr,
      size: [arows, 1]
    });
  };

  /**
   * C = A * B
   *
   * @param {Matrix} a            SparseMatrix      (MxN)
   * @param {Matrix} b            DenseMatrix    (NxC)
   *
   * @return {Matrix}             SparseMatrix      (MxC)
   */
  var _multiplySparseMatrixDenseMatrix = function (a, b) {
    // a sparse
    var avalues = a._values;
    var aindex = a._index;
    var aptr = a._ptr;
    // b dense
    var bdata = b._data;
    // rows & columns
    var arows = a._size[0];
    var brows = b._size[0];
    var bcolumns = b._size[1];
    // result
    var cvalues = [];
    var cindex = [];
    var cptr = [];

    // process column
    var processColumn = function (j, v) {
      cindex.push(j);
      cvalues.push(v);
    };

    // loop b columns
    for (var jb = 0; jb < bcolumns; jb++) {
      // update ptr
      cptr.push(cvalues.length);
      // create sparse accumulator
      var spa = new Spa(arows);
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
            // accumulate
            spa.accumulate(ia, multiply(vbij, avalues[ka]));
          }
        }
      }
      // process sparse accumulator
      spa.forEach(0, arows - 1, processColumn);
    }
    // update ptr
    cptr.push(cvalues.length);

    // check we need to squeeze the result into a scalar
    if (arows === 1 && bcolumns === 1)
      return cvalues.length === 1 ? cvalues[0] : 0;

    // return sparse matrix
    return new SparseMatrix({
      values : cvalues,
      index: cindex,
      ptr: cptr,
      size: [arows, bcolumns]
    });
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
    var adt = a._datatype;
    // b sparse
    var bvalues = b._values;
    var bindex = b._index;
    var bptr = b._ptr;
    var bdt = b._datatype;
    // process data types
    var dt = adt && bdt && adt === bdt ? adt : undefined;
    // multiply scalar implementation
    var mf = dt ? multiplyScalar.signatures[dt + ',' + dt] : multiplyScalar;
    var af = dt ? addScalar.signatures[dt + ',' + dt] : addScalar;
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

    // loop b columns
    for (var jb = 0; jb < bcolumns; jb++) {
      // update ptr
      cptr[jb] = cindex.length;
      // B values & index in j
      for (var kb0 = bptr[jb], kb1 = bptr[jb + 1], kb = kb0; kb < kb1; kb++) {
        // b row
        var ib = bindex[kb];
        // multiply both matrices and store results in x
        sparseScatter(a, ib, x ? bvalues[kb] : 1, w, x, jb + 1, c, mf, af);
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
