'use strict';

var DimensionError = require('../../error/DimensionError');

function factory (type, config, load, typed) {

  var collection = load(require('../../type/collection'));
  var matrix = load(require('../construction/matrix'));
  var equal = load(require('../relational/equal'));
  
  var SparseMatrix = type.SparseMatrix;

  /**
   * Add two values, `x + y`.
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.add(x, y)
   *
   * Examples:
   *
   *    math.add(2, 3);               // returns Number 5
   *
   *    var a = math.complex(2, 3);
   *    var b = math.complex(-4, 1);
   *    math.add(a, b);               // returns Complex -2 + 4i
   *
   *    math.add([1, 2, 3], 4);       // returns Array [5, 6, 7]
   *
   *    var c = math.unit('5 cm');
   *    var d = math.unit('2.1 mm');
   *    math.add(c, d);               // returns Unit 52.1 mm
   *
   * See also:
   *
   *    subtract
   *
   * @param  {Number | BigNumber | Boolean | Complex | Unit | String | Array | Matrix | null} x First value to add
   * @param  {Number | BigNumber | Boolean | Complex | Unit | String | Array | Matrix | null} y Second value to add
   * @return {Number | BigNumber | Complex | Unit | String | Array | Matrix} Sum of `x` and `y`
   */
  var add = typed('add', {
    'number, number': function (x, y) {
      return x + y;
    },

    'BigNumber, BigNumber': function (x, y) {
      return x.plus(y);
    },

    'Complex, Complex': function (x, y) {
      return new type.Complex(
          x.re + y.re,
          x.im + y.im
      );
    },

    'Unit, Unit': function (x, y) {
      if (x.value == null) throw new Error('Parameter x contains a unit with undefined value');
      if (y.value == null) throw new Error('Parameter y contains a unit with undefined value');
      if (!x.equalBase(y)) throw new Error('Units do not match');

      var res = x.clone();
      res.value += y.value;
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
              // sparse + sparse
              c = _addSparseMatrixSparseMatrix(x, y, xsize, ysize);
              break;
            default:
              c = _addSparseMatrixMatrix(x, y.valueOf(), xsize, ysize);
              break;
          }
          break;
        default:
          switch (y.storage()) {
            case 'sparse':
              // sparse + sparse
              c = _addMatrixSparseMatrix(x.valueOf(), y, xsize[0], xsize[1]);
              break;
            default:
              c = _addMatrixMatrix(x.valueOf(), y.valueOf(), x.storage());
              break;
          }
          break;
      }
      return c;
    },
    
    'Array, Array': function (x, y) {
      // use matrix implementation
      return add(matrix(x), matrix(y)).valueOf();
    },
    
    'Array, Matrix': function (x, y) {
      // use matrix implementation
      return add(matrix(x), y);
    },
    
    'Matrix, Array': function (x, y) {
      // use matrix implementation
      return add(x, matrix(y));
    },
    
    'Array | Matrix, any': function (x, y) {
      return collection.deepMap2(x, y, add);
    },

    'any, Array | Matrix': function (x, y) {
      return collection.deepMap2(x, y, add);
    },

    'string, string': function (x, y) {
      return x + y;
    }
  });

  var _addSparseMatrixSparseMatrix = function (a, b, asize, bsize) {
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
      _scatter(a, j, w, x, j + 1, c);
      // process column j of b and write it to x
      _scatter(b, j, w, x, j + 1, c);
      // check we are adding the actual values
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
  
  var _addSparseMatrixMatrix = function (a, b, asize, bsize) {
    // check dimensions
    if (asize[0] !== bsize[0] || asize[1] !== bsize[1])
      throw new RangeError('Dimension mismatch in add. Matrix A (' + asize + ') must match Matrix B (' + bsize + ')');
    // rows and columns
    var m = asize[0];
    var n = asize[1];
    // a arrays
    var avalues = a._values;
    var aindex = a._index;
    var aptr = a._ptr;
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
        // value
        var v = data[i][j];
        // check for zero
        if (!equal(v, 0)) {
          x[i] = v;
          w[i] = j + 1;
          cindex.push(i);
        }
      }
      // process column j of a and write it to x
      _scatter(a, j, w, x, j + 1, c);
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
  
  var _addMatrixSparseMatrix = function (a, b, m, n) {
    
  };
  
  var _addMatrixMatrix = function (a, b, format) {
    // TODO: find a better implementation
    return matrix(collection.deepMap2(a, b, add), format);
  };
  
  var _scatter = function (a, j, w, x, mark, c) {
    // a arrays
    var avalues = a._values;
    var aindex = a._index;
    var aptr = a._ptr;
    // c arrays
    var cindex = c._index;

    // values in j
    for (var k0 = aptr[j], k1 = aptr[j + 1], k = k0; k < k1; k++) {
      // index
      var i = aindex[k];
      // check value exists in current j
      if (!w[i] || w[i] < mark) {
        // i is new entry in j
        w[i] = mark;
        // add i to pattern of C
        cindex.push(i);
        // x(i) = A
        if (x)
          x[i] = avalues[k];
      }
      else if (x) {
        // i exists in C already
        x[i] = add(x[i], avalues[k]);
      }
    }
    // number of nonzero elements in C
    return cindex.length;
  };
  
  return add;
}

exports.name = 'add';
exports.factory = factory;
