'use strict';

function factory (type, config, load, typed) {

  var matrix = load(require('../../construction/matrix'));
  var divideScalar = load(require('../../arithmetic/divideScalar'));
  var multiply = load(require('../../arithmetic/multiply'));
  var subtract = load(require('../../arithmetic/subtract'));
  var equal = load(require('../../relational/equal'));

  var substitutionValidation = load(require('./substitutionValidation'));

  var CcsMatrix = type.CcsMatrix;
  var CrsMatrix = type.CrsMatrix;
  var DenseMatrix = type.DenseMatrix;

  /** 
   * Solves the linear equation system by forwards substitution. Matrix must be a lower triangular matrix.
   *
   * M * x = b
   *
   * @param {Matrix, Array}         A N x N matrix or array
   * @param {Matrix, Array}         A column vector with the b values
   *
   * @return {Matrix}               A column vector with the linear system solution
   */
  var forwardSubstitution = typed('forwardSubstitution', {
    'Matrix, Array | Matrix': function (m, b) {
      // process matrix storage format
      switch (m.storage()) {
        case 'dense':
          return _denseForwardSubstitution(m, b);
        case 'ccs':
          return _ccsForwardSubstitution(m, b);
        case 'crs':
          return _crsForwardSubstitution(m, b);
      }
    },
    'Array, Array | Matrix': function (a, b) {
      // create dense matrix from array
      var m = matrix(a);
      // use matrix implementation
      var r = forwardSubstitution(m, b);
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
    var x = new Array(rows);
    // data
    var data = m._data;
    // forward solve m * x = b, loop columns
    for (var j = 0; j < columns; j++) {
      // b[j]
      var bj = b[j] || 0;
      // x[j]
      var xj;
      // forward substitution (outer product) avoids inner looping when bj == 0
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

  var _ccsForwardSubstitution = function (m, b) {
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
      if (!equal(bj, 0)) {
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
        if (equal(vjj, 0)) {
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
        if (!equal(xj, 0)) {
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
    return new CcsMatrix({
      values: xvalues,
      index: xindex,
      ptr: xptr,
      size: [rows, 1]
    });
  };

  var _crsForwardSubstitution = function (m, b) {
    // validate matrix and vector, initialize x as copy of column vector b
    var x = substitutionValidation(m, b);
    // rows & columns
    var rows = m._size[0];
    // matrix arrays
    var values = m._values;
    var index = m._index;
    var ptr = m._ptr;
    // result arrays
    var xvalues = [];
    var xindex = [];
    var xptr = [];
    // forward solve m * x = b
    for (var i = 0; i < rows; i++) {
      // update ptr
      xptr.push(xvalues.length);
      // initialize x
      var xi = x[i] || 0;
      // value @ [i, i]
      var vii = 0;
      // values in row
      for (var k = ptr[i], l = ptr[i + 1]; k < l; k++) {
        // column
        var j = index[k];
        // check column
        if (j < i) {
          // update x
          xi = subtract(xi, multiply(values[k], x[j]));
        }
        else if (j === i) {
          // set vii value
          vii = values[k];
          // exit loop
          break;          
        }
        else {
          // exit loop, singular matrix
          break;
        }
      }
      // check we have a value @ [i, i]
      if (equal(vii, 0)) {
        // system cannot be solved, there is no value @ [i, i]
        throw new Error('Linear system cannot be solved since matrix is singular');
      }
      // update xi
      xi = divideScalar(xi, vii);
      // check for zero
      if (!equal(xi, 0)) {
        // push to values
        xvalues.push(xi);
        // column vector
        xindex.push(0);
      }
      // update dense vector
      x[i] = xi;
    }
    // update ptr
    xptr.push(xvalues.length);
    // return column vector
    return new CrsMatrix({
      values: xvalues,
      index: xindex,
      ptr: xptr,
      size: [rows, 1]
    });
  };

  return forwardSubstitution;
}

exports.name = 'forwardSubstitution';
exports.factory = factory;
