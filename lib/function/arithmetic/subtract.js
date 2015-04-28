'use strict';

var clone = require('../../util/object').clone;
var DimensionError = require('../../error/DimensionError');

function factory (type, config, load, typed) {

  var unaryMinus = load(require('./unaryMinus'));
  var matrix = load(require('../construction/matrix'));
  var equal = load(require('../relational/equal'));
  var sparseScatter = load(require('./sparseScatter'));
  var addScalar = load(require('./addScalar'));
  var multiplyScalar = load(require('./multiplyScalar'));

  var collection = load(require('../../type/collection'));

  var DenseMatrix = type.DenseMatrix,
      SparseMatrix = type.SparseMatrix;
  
  /**
   * Subtract two values, `x - y`.
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.subtract(x, y)
   *
   * Examples:
   *
   *    math.subtract(5.3, 2);        // returns Number 3.3
   *
   *    var a = math.complex(2, 3);
   *    var b = math.complex(4, 1);
   *    math.subtract(a, b);          // returns Complex -2 + 2i
   *
   *    math.subtract([5, 7, 4], 4);  // returns Array [1, 3, 0]
   *
   *    var c = math.unit('2.1 km');
   *    var d = math.unit('500m');
   *    math.subtract(c, d);          // returns Unit 1.6 km
   *
   * See also:
   *
   *    add
   *
   * @param  {Number | BigNumber | Boolean | Complex | Unit | Array | Matrix | null} x
   *            Initial value
   * @param  {Number | BigNumber | Boolean | Complex | Unit | Array | Matrix | null} y
   *            Value to subtract from `x`
   * @return {Number | BigNumber | Complex | Unit | Array | Matrix}
   *            Subtraction of `x` and `y`
   */
  var subtract = typed('subtract', {

    'number, number': function (x, y) {
      return x - y;
    },

    'Complex, Complex': function (x, y) {
      return new type.Complex (
          x.re - y.re,
          x.im - y.im
      );
    },

    'BigNumber, BigNumber': function (x, y) {
      return x.minus(y);
    },

    'Unit, Unit': function (x, y) {
      if (x.value == null) {
        throw new Error('Parameter x contains a unit with undefined value');
      }

      if (y.value == null) {
        throw new Error('Parameter y contains a unit with undefined value');
      }

      if (!x.equalBase(y)) {
        throw new Error('Units do not match');
      }

      var res = x.clone();
      res.value -= y.value;
      res.fixPrefix = false;

      return res;
    },
    
    'Matrix, Matrix': function (x, y) {
      // matrix sizes
      var xsize = x.size();
      var ysize = y.size();

      // check dimensions
      if (xsize.length !== ysize.length)
        throw new DimensionError(xsize.length, ysize.length);

      // result
      var c;

      // process matrix storage
      switch (x.storage()) {
        case 'sparse':
          switch (y.storage()) {
            case 'sparse':
              // sparse - sparse
              c = _subtractSparseMatrixSparseMatrix(x, y, xsize, ysize);
              break;
            default:
              c = _subtractSparseMatrixMatrix(x, y.valueOf(), xsize, ysize);
              break;
          }
          break;
        default:
          switch (y.storage()) {
            case 'sparse':
              // sparse - sparse
              c = _subtractMatrixSparseMatrix(x.valueOf(), y, xsize, ysize);
              break;
            default:
              c = _subtractMatrixMatrix(x.valueOf(), y.valueOf(), x.storage());
              break;
          }
          break;
      }
      return c;
    },
    
    'Array, Array': function (x, y) {
      // use matrix implementation
      return subtract(matrix(x), matrix(y)).valueOf();
    },

    'Array, Matrix': function (x, y) {
      // use matrix implementation
      return subtract(matrix(x), y);
    },

    'Matrix, Array': function (x, y) {
      // use matrix implementation
      return subtract(x, matrix(y));
    },
    
    'Matrix, any': function (x, y) {
      // result
      var c;
      // check storage format
      switch (x.storage()) {
        case 'sparse':
          c = _subtractSparseMatrixScalar(x, y, x.size());
          break;
        default:
          c = collection.deepMap2(x, y, subtract);
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
          c = _subtractScalarSparseMatrix(x, y, y.size());
          break;
        default:
          c = collection.deepMap2(x, y, subtract);
          break;
      }
      return c;
    },

    'Array, any': function (x, y) {
      return collection.deepMap2(x, y, subtract);
    },

    'any, Array': function (x, y) {
      return collection.deepMap2(x, y, subtract);
    }
  });
  
  /**
   * C = A - B
   *
   * @param {Matrix} a            SparseMatrix  (MxN)
   * @param {Scalar} b            Scalar value
   *
   * @return {Matrix}             SparseMatrix  (MxN)
   */ 
  var _subtractSparseMatrixScalar = function (a, b, asize) {
    // rows and columns
    var m = asize[0];
    var n = asize[1];
    // a arrays
    var avalues = a._values;
    var aindex = a._index;
    var aptr = a._ptr;        
    // check b is zero
    if (!equal(b, 0)) {
      // c arrays
      var cvalues = [];
      var cindex = [];
      var cptr = new Array(n);
      // c matrix
      var c = new SparseMatrix({
        values: cvalues,
        index: cindex,
        ptr: cptr,
        size: [m, n]
      });
      // loop columns
      for (var j = 0; j < n; j++) {
        // ptr for column j
        cptr[j] = cindex.length;
        // loop values for column j
        for (var k0 = aptr[j], k1 = aptr[j + 1], k = k0; k < k1; k++) {
          // subtract values
          var v = subtract(avalues[k], b);
          // compare with zero
          if (!equal(v, 0)) {
            // push to c
            cindex.push(aindex[k]);
            cvalues.push(v);
          }
        }      
      }
      // update ptr
      cptr[n] = cindex.length;
      // return matrix
      return c;
    }
    // return clone
    return a.clone();
  };
  
  /**
   * C = A - B
   *   
   * @param {Scalar} a            Scalar value
   * @param {Matrix} b            SparseMatrix  (MxN)
   *
   * @return {Matrix}             SparseMatrix  (MxN)
   */ 
  var _subtractScalarSparseMatrix = function (a, b, asize) {
    // rows and columns
    var m = asize[0];
    var n = asize[1];
    // b arrays
    var bvalues = b._values;
    var bindex = b._index;
    var bptr = b._ptr;        
    // check a is zero
    if (!equal(a, 0)) {
      // c arrays
      var cvalues = [];
      var cindex = [];
      var cptr = new Array(n);
      // c matrix
      var c = new SparseMatrix({
        values: cvalues,
        index: cindex,
        ptr: cptr,
        size: [m, n]
      });
      // loop columns
      for (var j = 0; j < n; j++) {
        // ptr for column j
        cptr[j] = cindex.length;
        // loop values for column j
        for (var k0 = bptr[j], k1 = bptr[j + 1], k = k0; k < k1; k++) {
          // subtract values
          var v = subtract(a, bvalues[k]);
          // compare with zero
          if (!equal(v, 0)) {
            // push to c
            cindex.push(bindex[k]);
            cvalues.push(v);
          }
        }      
      }
      // update ptr
      cptr[n] = cindex.length;
      // return matrix
      return c;
    }
    // return clone
    return b.clone();
  };

  /**
   * C = A - B
   *
   * @param {Matrix} a            SparseMatrix  (MxN)
   * @param {Matrix} b            SparseMatrix  (MxN)
   *
   * @return {Matrix}             SparseMatrix  (MxN)
   */
  var _subtractSparseMatrixSparseMatrix = function (a, b, asize, bsize) {
    // check dimensions
    if (asize[0] !== bsize[0] || asize[1] !== bsize[1])
      throw new RangeError('Dimension mismatch in add. Matrix A (' + asize + ') must match Matrix B (' + bsize + ')');
    // rows and columns
    var m = asize[0];
    var n = asize[1];
    // a arrays
    var avalues = a._values;
    // b arrays
    var bvalues = b._values;
    // flag indicating both matrices (a & b) contain data
    var values = avalues && bvalues;
    // c arrays
    var cvalues = values ? [] : undefined;
    var cindex = [];
    var cptr = new Array(n);
    // c matrix
    var c = new SparseMatrix({
      values: cvalues,
      index: cindex,
      ptr: cptr,
      size: [m, n]
    });
    // column vector (store matrix values)
    var x = values ? new Array(m) : undefined;
    // column vector to signal row values in column j
    var w = new Array(m);
    // loop columns
    for (var j = 0; j < n; j++) {
      // init ptr for j
      cptr[j] = cindex.length;
      // process column j of a and write it to x
      sparseScatter(a, j, 1, w, x, j + 1, c, multiplyScalar, addScalar);
      // process column j of b and write it to x (multiply value by negative one)
      sparseScatter(b, j, -1, w, x, j + 1, c, multiplyScalar, addScalar);
      // check matrix contains values (pattern matrix)
      if (values) {
        // loop column values in C
        for (var p0 = cptr[j], p1 = cindex.length, p = p0; p < p1; p++) {
          // copy x[i] to c[i, j]
          cvalues.push(x[cindex[p]]);
        }
      }
    }
    // finish cptr
    cptr[n] = cindex.length;
    // return matrix
    return c;
  };

  /**
   * C = A - B
   *
   * @param {Matrix} a            SparseMatrix  (MxN)
   * @param {Matrix} b            DenseMatrix  (MxN)
   *
   * @return {Matrix}             SparseMatrix  (MxN)
   */
  var _subtractSparseMatrixMatrix = function (a, b, asize, bsize) {
    // check dimensions
    if (asize[0] !== bsize[0] || asize[1] !== bsize[1])
      throw new RangeError('Dimension mismatch in add. Matrix A (' + asize + ') must match Matrix B (' + bsize + ')');
    // rows and columns
    var m = asize[0];
    var n = asize[1];
    // b array
    var data = b;
    // c arrays
    var cvalues = [];
    var cindex = [];
    var cptr = new Array(n);
    // c matrix
    var c = new SparseMatrix({
      values: cvalues,
      index: cindex,
      ptr: cptr,
      size: [m, n]
    });
    // column vector (store matrix values)
    var x = new Array(m);
    // column vector to signal row values in column j
    var w = new Array(m);
    // loop columns
    for (var j = 0; j < n; j++) {
      // init ptr for j
      cptr[j] = cindex.length;
      // copy matrix b column to x
      for (var i = 0; i < m; i++) {
        // -value
        var v = unaryMinus(data[i][j]);
        // check for zero
        if (!equal(v, 0)) {
          x[i] = v;
          w[i] = j + 1;
          cindex.push(i);
        }
      }
      // process column j of a and write it to x
      sparseScatter(a, j, 1, w, x, j + 1, c, multiplyScalar, addScalar);
      // loop column values in C
      for (var p0 = cptr[j], p1 = cindex.length, p = p0; p < p1; p++) {
        // copy x[i] to c[i, j]
        cvalues.push(x[cindex[p]]);
      }
    }
    // finish cptr
    cptr[n] = cindex.length;
    // return matrix
    return c;
  };

  /**
   * C = A - B
   *
   * @param {Matrix} a            DenseMatrix  (MxN)
   * @param {Matrix} b            SparseMatrix  (MxN)
   *
   * @return {Matrix}             DenseMatrix  (MxN)
   */
  var _subtractMatrixSparseMatrix = function (a, b, asize, bsize) {
    // check dimensions
    if (asize[0] !== bsize[0] || asize[1] !== bsize[1])
      throw new RangeError('Dimension mismatch in add. Matrix A (' + asize + ') must match Matrix B (' + bsize + ')');
    // rows and columns
    var m = asize[0];
    var n = asize[1];
    // a array
    var data = a;
    // b arrays
    var bvalues = b._values;
    var bindex = b._index;
    var bptr = b._ptr;    
    // c arrays
    var cdata = clone(data);
    // c matrix
    var c = new DenseMatrix({
      data: cdata,
      size: [m, n]
    });
    // loop columns
    for (var j = 0; j < n; j++) {
      // loop values for column j
      for (var k0 = bptr[j], k1 = bptr[j + 1], k = k0; k < k1; k++) {
        // row
        var i = bindex[k];
        // subtract value
        cdata[i][j] = subtract(cdata[i][j], bvalues[k]);
      }      
    }
    // return matrix
    return c;
  };

  /**
   * C = A - B
   *
   * @param {Matrix} a            DenseMatrix  (MxN)
   * @param {Matrix} b            DenseMatrix  (MxN)
   *
   * @return {Matrix}             DenseMatrix  (MxN)
   */
  var _subtractMatrixMatrix = function (a, b, format) {
    // TODO: find a better implementation
    return matrix(collection.deepMap2(a, b, subtract), format);
  };

  return subtract;
}

exports.name = 'subtract';
exports.factory = factory;
