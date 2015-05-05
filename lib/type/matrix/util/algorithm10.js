'use strict';

function factory (type) {

  var DenseMatrix = type.DenseMatrix;

  /**
   * Iterates over SparseMatrix S nonzero items and invokes the callback function f(Sij, b). 
   * Callback function invoked NZ times (number of nonzero items in S).
   *
   *
   *          ┌  f(Sij, b)  ; S(i,j) !== 0
   * C(i,j) = ┤  
   *          └  b          ; otherwise
   *
   *
   * @param {Matrix}   s                 The SparseMatrix instance (S)
   * @param {Scalar}   b                 The Scalar value
   * @param {function} callback          The f(Aij,b) operation to invoke
   * @param {boolean}  inverse           A true value indicates callback should be invoked f(b,Sij)
   *
   * @return {Matrix}                    DenseMatrix (C)
   *
   * https://github.com/josdejong/mathjs/pull/346#issuecomment-97626813
   */
  var algorithm10 = function (s, b, callback, inverse) {
    // sparse matrix arrays
    var avalues = s._values;
    var aindex = s._index;
    var aptr = s._ptr;
    var asize = s._size;

    // sparse matrix cannot be a Pattern matrix
    if (!avalues)
      throw new Error('Cannot perform operation on Pattern Sparse Matrix and Scalar value');

    // rows & columns
    var rows = asize[0];
    var columns = asize[1];

    // result arrays
    var cdata = [];
    // matrix
    var c = new DenseMatrix({
      data: cdata,
      size: [rows, columns]
    });

    // workspaces
    var x = [];
    // marks indicating we have a value in x for a given column
    var w = [];

    // loop columns
    for (var j = 0; j < columns; j++) {
      // columns mark
      var mark = j + 1;
      // values in j
      for (var k0 = aptr[j], k1 = aptr[j + 1], k = k0; k < k1; k++) {
        // row
        var r = aindex[k];
        // update workspace
        x[r] = avalues[k];
        w[r] = mark;
      }
      // loop rows
      for (var i = 0; i < rows; i++) {
        // initialize C on first column
        if (j === 0) {
          // create row array
          cdata[i] = [];
        }
        // check sparse matrix has a value @ i,j
        if (w[i] === mark) {
          // invoke callback, update C
          cdata[i][j] = inverse ? callback(b, x[i]) : callback(x[i], b);
        }
        else {
          // dense matrix value @ i, j
          cdata[i][j] = b;
        }
      }
    }

    // return sparse matrix
    return c;
  };

  return algorithm10;
}

exports.name = 'algorithm10';
exports.factory = factory;
