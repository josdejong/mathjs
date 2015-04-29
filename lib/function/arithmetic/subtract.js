'use strict';

var DimensionError = require('../../error/DimensionError');

function factory (type, config, load, typed) {

  var matrix = load(require('../construction/matrix'));
  var equal = load(require('../relational/equal'));
  var elementWiseOperations = load(require('../../type/matrix/util/elementWiseOperations'));

  var collection = load(require('../../type/collection'));

  var SparseMatrix = type.SparseMatrix;
  
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
              c = elementWiseOperations.algorithm5(x, y, subtract);
              break;
            default:
              // sparse - dense
              c = elementWiseOperations.algorithm3(y, x, subtract, true);
              break;
          }
          break;
        default:
          switch (y.storage()) {
            case 'sparse':
              // dense - sparse
              c = elementWiseOperations.algorithm1(x, y, subtract, false);
              break;
            default:
              // dense - dense
              c = elementWiseOperations.algorithm0(x, y, subtract, false);
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

  return subtract;
}

exports.name = 'subtract';
exports.factory = factory;
