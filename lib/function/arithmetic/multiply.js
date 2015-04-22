'use strict';

var util = require('../../util/index');

var array = util.array;

function factory (type, config, load, typed) {

  var matrix = load(require('../construction/matrix'));
  var add = load(require('./add'));
  var equal = load(require('../relational/equal'));

  var collection = load(require('../../type/collection'));

  var DenseMatrix = type.DenseMatrix;
  var CcsMatrix = type.CcsMatrix;
  var CrsMatrix = type.CrsMatrix;
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

    'number, number': function (x, y) {
      return x * y;
    },

    'BigNumber, BigNumber': function (x, y) {
      return x.times(y);
    },

    'Complex, Complex': function (x, y) {
      return new type.Complex(
        x.re * y.re - x.im * y.im,
        x.re * y.im + x.im * y.re
      );
    },

    'number, Unit': function (x, y) {
      var res = y.clone();
      res.value = (res.value === null) ? res._normalize(x) : (res.value * x);
      return res;
    },

    'Unit, number': function (x, y) {
      var res = x.clone();
      res.value = (res.value === null) ? res._normalize(y) : (res.value * y);
      return res;
    },

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
      c = add(c, multiply(adata[i], bdata[i]));
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
        sum = add(sum, multiply(adata[i], bdata[i][j]));
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
      case 'ccs':
        return _multiplyCcsMatrixVector(a, b);
      case 'crs':
        return _multiplyCrsMatrixVector(a, b);
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
          case 'ccs':
            return _multiplyDenseMatrixCcsMatrix(a, b);
          case 'crs':
            return _multiplyDenseMatrixCrsMatrix(a, b);
        }
        break;
      case 'ccs':
        // process storage
        switch (b.storage()) {
          case 'dense':
            return _multiplyCcsMatrixDenseMatrix(a, b);
          case 'ccs':
            return _multiplyCcsMatrixCcsMatrix(a, b);
          case 'crs':
            return _multiplyCcsMatrixCrsMatrix(a, b);
        }
        break;
      case 'crs':
        // process storage
        switch (b.storage()) {
          case 'dense':
            return _multiplyCrsMatrixDenseMatrix(a, b);
          case 'ccs':
            return _multiplyCrsMatrixCcsMatrix(a, b);
          case 'crs':
            return _multiplyCrsMatrixCrsMatrix(a, b);
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
        sum = add(sum, multiply(row[j], bdata[j]));
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
          sum = add(sum, multiply(row[x], bdata[x][j]));
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
   * @param {Matrix} b            CcsMatrix      (NxC)
   *
   * @return {Matrix}             DenseMatrix    (MxC)
   */
  var _multiplyDenseMatrixCcsMatrix = function (a, b) {
    // a dense
    var adata = a._data;
    var asize = a._size;
    // b ccs
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
          sum = add(sum, multiply(row[x], bvalues[k]));
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
   * @param {Matrix} b            CrsMatrix      (NxC)
   *
   * @return {Matrix}             DenseMatrix    (MxC)
   */
  var _multiplyDenseMatrixCrsMatrix = function (a, b) {
    // a dense
    var adata = a._data;
    var asize = a._size;
    // b crs
    var bvalues = b._values;
    var bindex = b._index;
    var bptr = b._ptr;
    var bsize = b._size;
    // rows & columns
    var arows = asize[0];
    var acolumns = asize[1];
    var bcolumns = bsize[1];

    // result
    var c = new Array(arows);

    // loop a rows
    for (var i = 0; i < arows; i++) {
      // current row
      var row = adata[i];
      // initialize row
      var cr = new Array(bcolumns);
      for (var z = 0; z < bcolumns; z++)
        cr[z] = 0;
      // loop a columns
      for (var j = 0; j < acolumns; j++) {
        // check value A[i, j] != 0, avoid loops
        if (!equal(row[j], 0)) {
          // values and index @ row j
          for (var k0 = bptr[j], k1 = bptr[j + 1], k = k0; k < k1; k++) {
            // b column
            var x = bindex[k];            
            // multiply & accumulate
            cr[x] = add(cr[x], multiply(row[j], bvalues[k]));
          }
        }
      }
      // set row
      c[i] = cr;
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
   * @param {Matrix} a            CcsMatrix    (MxN)
   * @param {Matrix} b            Dense Vector (N)
   *
   * @return {Matrix}             CcsMatrix    (M, 1) 
   */
  var _multiplyCcsMatrixVector = function (a, b) {
    // a ccs
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

    // return CCS matrix
    return new CcsMatrix({
      values : cvalues,
      index: cindex,
      ptr: cptr,
      size: [arows, 1]
    });
  };

  /**
   * C = A * B
   *
   * @param {Matrix} a            CcsMatrix      (MxN)
   * @param {Matrix} b            DenseMatrix    (NxC)
   *
   * @return {Matrix}             CcsMatrix      (MxC)
   */
  var _multiplyCcsMatrixDenseMatrix = function (a, b) {
    // a ccs
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

    // return CCS matrix
    return new CcsMatrix({
      values : cvalues,
      index: cindex,
      ptr: cptr,
      size: [arows, bcolumns]
    });
  };

  /**
   * C = A * B
   *
   * @param {Matrix} a            CcsMatrix      (MxN)
   * @param {Matrix} b            CcsMatrix      (NxC)
   *
   * @return {Matrix}             CcsMatrix      (MxC)
   */
  var _multiplyCcsMatrixCcsMatrix = function (a, b) {
    // a ccs
    var avalues = a._values;
    var aindex = a._index;
    var aptr = a._ptr;
    // b ccs
    var bvalues = b._values;
    var bindex = b._index;
    var bptr = b._ptr;
    // rows & columns
    var arows = a._size[0];
    var bcolumns = b._size[1];
    // result
    var cvalues = [];
    var cindex = [];
    var cptr = [];

    // process column in C
    var processColumn = function (i, v) {
      cindex.push(i);
      cvalues.push(v);
    };

    // loop b columns
    for (var jb = 0; jb < bcolumns; jb++) {
      // update ptr
      cptr.push(cvalues.length);
      // create sparse accumulator
      var spa = new Spa(arows);
      // B values & index in j
      for (var kb0 = bptr[jb], kb1 = bptr[jb + 1], kb = kb0; kb < kb1; kb++) {
        // b row
        var ib = bindex[kb];
        // A values & index in ib column
        for (var ka0 = aptr[ib], ka1 = aptr[ib + 1], ka = ka0; ka < ka1; ka++) {
          // a row
          var ia = aindex[ka];
          // accumulate
          spa.accumulate(ia, multiply(bvalues[kb], avalues[ka]));
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

    // return CCS matrix
    return new CcsMatrix({
      values : cvalues,
      index: cindex,
      ptr: cptr,
      size: [arows, bcolumns]
    });
  };

  /**
   * C = A * B
   *
   * @param {Matrix} a            CcsMatrix      (MxN)
   * @param {Matrix} b            CrsMatrix      (NxC)
   *
   * @return {Matrix}             CcsMatrix      (MxC)
   */
  var _multiplyCcsMatrixCrsMatrix = function (a, b) {
    // it is faster to convert a matrix from CRS to CCS than iterate a CRS by column!
    return _multiplyCcsMatrixCcsMatrix(a, new CcsMatrix(b));
  };

  /**
   * C = A * B
   *
   * @param {Matrix} a            CrsMatrix    (MxN)
   * @param {Matrix} b            Dense Vector (N)
   *
   * @return {Matrix}             CrsMatrix    (M, 1) 
   */
  var _multiplyCrsMatrixVector = function (a, b) {
    // a crs
    var avalues = a._values;
    var aindex = a._index;
    var aptr = a._ptr;
    // b dense
    var bdata = b._data;
    // rows & columns
    var arows = a._size[0];
    // result
    var cvalues = [];
    var cindex = [];
    var cptr = [];

    // rows in a
    for (var ia = 0; ia < arows; ia++) {
      // update ptr
      cptr.push(cvalues.length);
      // sum
      var sum = 0;
      // A values & index in ia column
      for (var ka0 = aptr[ia], ka1 = aptr[ia + 1], ka = ka0; ka < ka1; ka++) {
        // column
        var ja = aindex[ka];
        // accumulate
        sum = add(sum, multiply(avalues[ka], bdata[ja]));
      }
      // check we have a value for ia
      if (!equal(sum, 0)) {
        cvalues.push(sum);
        cindex.push(ia);
      }
    }
    // update ptr
    cptr.push(cvalues.length);

    // check we need to squeeze the result into a scalar
    if (arows === 1)
      return cvalues.length === 1 ? cvalues[0] : 0;

    // return CRS matrix
    return new CrsMatrix({
      values : cvalues,
      index: cindex,
      ptr: cptr,
      size: [arows, 1]
    });
  };

  /**
   * C = A * B
   *
   * @param {Matrix} a            CrsMatrix      (MxN)
   * @param {Matrix} b            DenseMatrix    (NxC)
   *
   * @return {Matrix}             CrsMatrix      (MxC)
   */
  var _multiplyCrsMatrixDenseMatrix = function (a, b) {
    // a crs
    var avalues = a._values;
    var aindex = a._index;
    var aptr = a._ptr;
    // b dense
    var bdata = b._data;
    // rows & columns
    var arows = a._size[0];
    var bcolumns = b._size[1];
    // result
    var cvalues = [];
    var cindex = [];
    var cptr = [];

    // function to process c[i, j]
    var processRow = function (j, v) {
      cindex.push(j);
      cvalues.push(v);
    };

    // loop a rows
    for (var ia = 0; ia < arows; ia++) {
      // update ptr
      cptr.push(cvalues.length);
      // create sparse accumulator
      var spa = new Spa(bcolumns);
      // loop b columns
      for (var jb = 0; jb < bcolumns; jb++) {
        // A values & index in ia row
        for (var ka0 = aptr[ia], ka1 = aptr[ia + 1], ka = ka0; ka < ka1; ka++) {
          // a column
          var ja = aindex[ka];
          // b[ja, jb]
          var vb = bdata[ja][jb];
          // check b value
          if (!equal(vb, 0)) {
            // accumulate value for column jb
            spa.accumulate(jb, multiply(vb, avalues[ka]));
          }
        }
      }
      // process values in row ia
      spa.forEach(0, bcolumns - 1, processRow);
    }
    // update ptr
    cptr.push(cvalues.length);

    // check we need to squeeze the result into a scalar
    if (arows === 1 && bcolumns === 1)
      return cvalues.length === 1 ? cvalues[0] : 0;

    // return CRS matrix
    return new CrsMatrix({
      values : cvalues,
      index: cindex,
      ptr: cptr,
      size: [arows, bcolumns]
    });
  };

  /**
   * C = A * B
   *
   * @param {Matrix} a            CrsMatrix      (MxN)
   * @param {Matrix} b            CrsMatrix      (NxC)
   *
   * @return {Matrix}             CrsMatrix      (MxC)
   */
  var _multiplyCrsMatrixCrsMatrix = function (a, b) {
    // a crs
    var avalues = a._values;
    var aindex = a._index;
    var aptr = a._ptr;
    // b crs
    var bvalues = b._values;
    var bindex = b._index;
    var bptr = b._ptr;
    // rows & columns
    var arows = a._size[0];
    var bcolumns = b._size[1];
    // result
    var cvalues = [];
    var cindex = [];
    var cptr = [];

    // function to process c[i, j]
    var processRow = function (j, v) {
      cindex.push(j);
      cvalues.push(v);
    };

    // loop a rows
    for (var ia = 0; ia < arows; ia++) {
      // update ptr
      cptr.push(cvalues.length);
      // initialize sparse accumulator
      var spa = new Spa(bcolumns);
      // a values & index in ia
      for (var ka0 = aptr[ia], ka1 = aptr[ia + 1], ka = ka0; ka < ka1; ka++) {
        // a column
        var ja = aindex[ka];
        // b values & index in row ja
        for (var kb0 = bptr[ja], kb1 = bptr[ja + 1], kb = kb0; kb < kb1; kb++) {
          // b column
          var jb = bindex[kb];
          // accumulate
          spa.accumulate(jb, multiply(avalues[ka], bvalues[kb]));
        }
      }
      // process sparse accumulator
      spa.forEach(0, bcolumns - 1, processRow);
    }    
    // update ptr
    cptr.push(cvalues.length);

    // check we need to squeeze the result into a scalar
    if (arows === 1 && bcolumns === 1)
      return cvalues.length === 1 ? cvalues[0] : 0;

    // return CRS matrix
    return new CrsMatrix({
      values : cvalues,
      index: cindex,
      ptr: cptr,
      size: [arows, bcolumns]
    });
  };

  /**
   * C = A * B'
   *
   * @param {Matrix} a            CrsMatrix      (MxN)
   * @param {Matrix} b            CrsMatrix      (CxN)
   *
   * @return {Matrix}             CrsMatrix      (MxC)
   */
  var _multiplyCrsMatrixCrsMatrixT = function (a, b) {
    // a crs
    var avalues = a._values;
    var aindex = a._index;
    var aptr = a._ptr;
    // b crs
    var bvalues = b._values;
    var bindex = b._index;
    var bptr = b._ptr;
    // rows & columns
    var arows = a._size[0];
    var brows = b._size[0];
    // result
    var cvalues = [];
    var cindex = [];
    var cptr = [];

    // function to process c[i, j]
    var processRow = function (j, v) {
      cindex.push(j);
      cvalues.push(v);
    };

    // loop a rows
    for (var ia = 0; ia < arows; ia++) {
      // update ptr
      cptr.push(cvalues.length);
      // initialize sparse accumulator
      var spa = new Spa(brows);
      // loop b rows
      for (var ib = 0; ib < brows; ib++) {
        // a values & index in ia
        for (var ka0 = aptr[ia], ka1 = aptr[ia + 1], ka = ka0; ka < ka1; ka++) {
          // a column
          var ja = aindex[ka];
          // b values & index in ib
          for (var kb0 = bptr[ib], kb1 = bptr[ib + 1], kb = kb0; kb < kb1; kb++) {
            // b column
            var jb = bindex[kb];
            // check columns are the same
            if (ja === jb) {
              // accumulate
              spa.accumulate(ib, multiply(avalues[ka], bvalues[kb]));
              // exit loop
              break;
            }
            else if (jb > ja) {
              // exit loop
              break;
            }
          }
        }
      }
      // process sparse accumulator
      spa.forEach(0, brows - 1, processRow);
    }
    // update ptr
    cptr.push(cvalues.length);

    // check we need to squeeze the result into a scalar
    if (arows === 1 && brows === 1)
      return cvalues.length === 1 ? cvalues[0] : 0;

    // return CRS matrix
    return new CrsMatrix({
      values : cvalues,
      index: cindex,
      ptr: cptr,
      size: [arows, brows]
    });
  };

  /**
   * C = A * B
   *
   * @param {Matrix} a            CrsMatrix      (MxN)
   * @param {Matrix} b            CcsMatrix      (NxC)
   *
   * @return {Matrix}             CrsMatrix      (MxC)
   */
  var _multiplyCrsMatrixCcsMatrix = function (a, b) {
    // transpose of a ccs matrix is a crs matrix with the same data
    var crs = new CrsMatrix({
      values: b._values,
      index: b._index,
      ptr: b._ptr,
      size: [b._size[1], b._size[0]]
    });
    // use A * B' implementation
    return _multiplyCrsMatrixCrsMatrixT(a, crs);
  };

  return multiply;
}

exports.name = 'multiply';
exports.factory = factory;
