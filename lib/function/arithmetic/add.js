'use strict';

function factory (type, config, load, typed) {

  var collection = load(require('../../type/collection'));
  var matrix = load(require('../construction/matrix'));
  var equal = load(require('../relational/equal'));
  var addScalar = load(require('./addScalar'));
  var elementWiseOperations = load(require('../../type/matrix/util/elementWiseOperations'));
  
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

    'any, any': addScalar,
    
    'Matrix, Matrix': function (x, y) {
      // result
      var c;
      
      // process matrix storage
      switch (x.storage()) {
        case 'sparse':
          switch (y.storage()) {
            case 'sparse':
              // sparse + sparse
              c = elementWiseOperations.algorithm4(x, y, addScalar, false);
              break;
            default:
              // sparse + dense
              c = elementWiseOperations.algorithm1(y, x, addScalar, true);
              break;
          }
          break;
        default:
          switch (y.storage()) {
            case 'sparse':
              // dense + sparse
              c = elementWiseOperations.algorithm1(x, y, addScalar, false);
              break;
            default:
              c = elementWiseOperations.algorithm0(x, y, addScalar, false);
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
    
    'Matrix, any': function (x, y) {
      // result
      var c;
      // check storage format
      switch (x.storage()) {
        case 'sparse':
          c = _addSparseMatrixScalar(x, y, x.size());
          break;
        default:
          c = collection.deepMap2(x, y, add);
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
          c = _addSparseMatrixScalar(y, x, y.size());
          break;
        default:
          c = collection.deepMap2(x, y, add);
          break;
      }
      return c;
    },
    
    'Array, any': function (x, y) {
      return collection.deepMap2(x, y, add);
    },

    'any, Array': function (x, y) {
      return collection.deepMap2(x, y, add);
    }
  });
  
  /**
   * C = A + B
   *
   * @param {Matrix} a            SparseMatrix  (MxN)
   * @param {Scalar} b            Scalar value
   *
   * @return {Matrix}             SparseMatrix  (MxN)
   */ 
  var _addSparseMatrixScalar = function (a, b, asize) {
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
          // sum values
          var v = addScalar(avalues[k], b);
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
  
  return add;
}

exports.name = 'add';
exports.factory = factory;
