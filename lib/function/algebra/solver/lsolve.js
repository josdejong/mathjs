'use strict';

function factory (type, config, load, typed) {

  var matrix = load(require('../../../type/matrix/function/matrix'));
  var divideScalar = load(require('../../arithmetic/divideScalar'));
  var multiply = load(require('../../arithmetic/multiply'));
  var subtract = load(require('../../arithmetic/subtract'));
  var equalScalar = load(require('../../relational/equalScalar'));

  var substitutionValidation = load(require('./util/substitutionValidation'));

  var SparseMatrix = type.SparseMatrix;
  var DenseMatrix = type.DenseMatrix;

  /** 
   * Solves the linear equation system by forwards substitution. Matrix must be a lower triangular matrix.
   *
   * L * x = b
   *
   * @param {Matrix, Array}         A N x N matrix or array (L)
   * @param {Matrix, Array}         A column vector with the b values
   *
   * @return {Matrix}               A column vector with the linear system solution (x)
   */
  var lsolve = typed('lsolve', {

    'SparseMatrix, Array | Matrix': function (m, b) {
      // process matrix
      return _sparseForwardSubstitution(m, b);
    },
    
    'DenseMatrix, Array | Matrix': function (m, b) {
      // process matrix
      return _denseForwardSubstitution(m, b);
    },
    
    'Array, Array | Matrix': function (a, b) {
      // create dense matrix from array
      var m = matrix(a);
      // use matrix implementation
      var r = _denseForwardSubstitution(m, b);
      // result
      return r.valueOf();
    }
  });

  var _denseForwardSubstitution = function (m, b) {
    // validate matrix and vector, return copy of column vector b
    b = substitutionValidation(m, b);
    // rows & columns
    var rows = m._size[0];
    var columns = m._size[1];
    // result
    var x = [];
    // data
    var data = m._data;
    // forward solve m * x = b, loop columns
    for (var j = 0; j < columns; j++) {
      // b[j]
      var bj = b[j] || 0;
      // x[j]
      var xj;
      // forward substitution (outer product) avoids inner looping when bj == 0
      if (!equalScalar(bj, 0)) {
        // value @ [j, j]
        var vjj = data[j][j];
        // check vjj
        if (equalScalar(vjj, 0)) {
          // system cannot be solved
          throw new Error('Linear system cannot be solved since matrix is singular');
        }
        // calculate xj
        xj = divideScalar(bj, vjj);
        // loop rows
        for (var i = j + 1; i < rows; i++) {
          // update copy of b
          b[i] = subtract(b[i] || 0, multiply(xj, data[i][j]));
        }
      }
      else {
        // zero @ j
        xj = 0;
      }
      // update x
      x[j] = [xj];
    }
    // return vector
    return new DenseMatrix({
      data: x,
      size: [rows, 1]
    });
  };

  var _sparseForwardSubstitution = function (m, b) {
    // validate matrix and vector, return copy of column vector b
    b = substitutionValidation(m, b);
    // rows & columns
    var rows = m._size[0];
    var columns = m._size[1];
    // matrix arrays
    var values = m._values;
    var index = m._index;
    var ptr = m._ptr;
    // result arrays
    var xvalues = [];
    var xindex = [];
    var xptr = [];
    // vars
    var i, k;
    // init ptr
    xptr.push(0);
    // forward solve m * x = b, loop columns
    for (var j = 0; j < columns; j++) {
      // b[j]
      var bj = b[j] || 0;
      // forward substitution (outer product) avoids inner looping when bj == 0
      if (!equalScalar(bj, 0)) {
        // value @ [j, j]
        var vjj = 0;
        // last index in column
        var l = ptr[j + 1];
        // values in column, find value @ [j, j]
        for (k = ptr[j]; k < l; k++) {
          // row
          i = index[k];
          // check row
          if (i === j) {
            // update vjj
            vjj = values[k];
          }
          else if (i > j) {
            // exit loop
            break;
          }
        }
        // at this point we must have a value @ [j, j]
        if (equalScalar(vjj, 0)) {
          // system cannot be solved, there is no value @ [j, j]
          throw new Error('Linear system cannot be solved since matrix is singular');
        }
        // calculate xj
        var xj = divideScalar(bj, vjj);
        // values in column, continue from last loop
        for (; k < l; k++) {
          // row
          i = index[k];
          // update copy of b
          b[i] = subtract(b[i] || 0, multiply(xj, values[k]));
        }
        // check for non zero
        if (!equalScalar(xj, 0)) {
          // value @ row i
          xvalues.push(xj);
          // row
          xindex.push(j);
        }
      }
    }
    // update ptr
    xptr.push(xvalues.length);
    // return column vector
    return new SparseMatrix({
      values: xvalues,
      index: xindex,
      ptr: xptr,
      size: [rows, 1]
    });
  };

  return lsolve;
}

exports.name = 'lsolve';
exports.factory = factory;
