'use strict';

function factory (type, config, load, typed) {

  var matrix = load(require('../../construction/matrix'));
  var divideScalar = load(require('../../arithmetic/divideScalar'));
  var multiply = load(require('../../arithmetic/multiply'));
  var subtract = load(require('../../arithmetic/subtract'));
  var equal = load(require('../../relational/equal'));

  var substitutionValidation = load(require('./substitutionValidation'));
  
  var SparseMatrix = type.SparseMatrix;
  var DenseMatrix = type.DenseMatrix;

  /**
   * Solves the linear equation system by backward substitution. Matrix must be an upper triangular matrix.
   *
   * M * x = b
   *
   * @param {Matrix, Array}         A N x N matrix or array
   * @param {Matrix, Array}         A column vector with the b values
   *
   * @return {Matrix}               A column vector with the linear system solution
   */
  var backwardSubstitution = typed('backwardSubstitution', {
    'Matrix, Array | Matrix': function (m, b) {
      // process matrix storage format
      switch (m.storage()) {
        case 'dense':
          return _denseBackwardSubstitution(m, b);
        case 'sparse':
          return _sparseBackwardSubstitution(m, b);
      }
    },
    'Array, Array | Matrix': function (a, b) {
      // create dense matrix from array
      var m = matrix(a);
      // use matrix implementation
      var r = backwardSubstitution(m, b);
      // result
      return r.valueOf();
    }
  });

  var _denseBackwardSubstitution = function (m, b) {
    // validate matrix and vector, return copy of column vector b
    b = substitutionValidation(m, b);
    // rows & columns
    var rows = m._size[0];
    var columns = m._size[1];
    // result
    var x = new Array(rows);
    // arrays
    var data = m._data;
    // backward solve m * x = b, loop columns (backwards)
    for (var j = columns - 1; j >= 0 ; j--) {
      // b[j]
      var bj = b[j] || 0;
      // x[j]
      var xj;
      // backward substitution (outer product) avoids inner looping when bj == 0
      if (!equal(bj, 0)) {
        // value @ [j, j]
        var vjj = data[j][j];
        // check vjj
        if (equal(vjj, 0)) {
          // system cannot be solved
          throw new Error('Linear system cannot be solved since matrix is singular');
        }
        // calculate xj
        xj = divideScalar(bj, vjj);        
        // loop rows
        for (var i = j - 1; i >= 0; i--) {
          // update copy of b
          b[i] = subtract(b[i] || 0, multiply(xj, data[i][j]));
        }
      }
      else {
        // zero value @ j
        xj = 0;
      }
      // update x
      x[j] = [xj];
    }
    // return column vector
    return new DenseMatrix({
      data: x,
      size: [rows, 1]
    });
  };
  
  var _sparseBackwardSubstitution = function (m, b) {
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
    // backward solve m * x = b, loop columns (backwards)
    for (var j = columns - 1; j >= 0 ; j--) {
      // b[j]
      var bj = b[j] || 0;
      // backward substitution (outer product) avoids inner looping when bj == 0
      if (!equal(bj, 0)) {
        // value @ [j, j]
        var vjj = 0;
        // first & last indeces in column
        var f = ptr[j];
        var l = ptr[j + 1];
        // values in column, find value @ [j, j], loop backwards
        for (k = l - 1; k >= f; k--) {
          // row
          i = index[k];
          // check row
          if (i === j) {
            // update vjj
            vjj = values[k];
          }
          else if (i < j) {
            // exit loop
            break;
          }
        }
        // at this point we must have a value @ [j, j]
        if (equal(vjj, 0)) {
          // system cannot be solved, there is no value @ [j, j]
          throw new Error('Linear system cannot be solved since matrix is singular');
        }
        // calculate xj
        var xj = divideScalar(bj, vjj);
        // values in column, continue from last loop
        for (; k >= f; k--) {
          // row
          i = index[k];
          // update copy of b
          b[i] = subtract(b[i] || 0, multiply(xj, values[k]));
        }
        // check for non zero
        if (!equal(xj, 0)) {
          // push to values (at the beginning since we are looping backwards)
          xvalues.unshift(xj);
          // row
          xindex.unshift(j);
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
  
  return backwardSubstitution;
}

exports.name = 'backwardSubstitution';
exports.factory = factory;
