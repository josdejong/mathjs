'use strict';

var util = require('../../../util/index');
var DimensionError = require('../../../error/DimensionError');

var object = util.object;

function factory (type) {

  var DenseMatrix = type.DenseMatrix;

  /**
   * Iterates over SparseMatrix nonzero items and invokes the callback function f(Dij, Sij). 
   * Callback function invoked NNZ times (number of nonzero items in SparseMatrix).
   *
   *
   *          ┌  f(Dij, Sij)  ; S(i,j) !== 0
   * C(i,j) = ┤
   *          └  Dij          ; otherwise
   *
   *
   * @param {Matrix}   denseMatrix       The DenseMatrix instance (D)
   * @param {Matrix}   sparseMatrix      The SparseMatrix instance (S)
   * @param {function} callback          The f(Dij,Sij) operation to invoke, where Dij = DenseMatrix(i,j) and Sij = SparseMatrix(i,j)
   * @param {boolean}  inverse           A true value indicates callback should be invoked f(Sij,Dij)
   *
   * @return {Matrix}                    DenseMatrix (C)
   *
   * see https://github.com/josdejong/mathjs/pull/346#issuecomment-97477571
   */
  var algorithm01 = function (denseMatrix, sparseMatrix, callback, inverse) {
    // dense matrix arrays
    var adata = denseMatrix._data;
    var asize = denseMatrix._size;
    var adt = denseMatrix._datatype;
    // sparse matrix arrays
    var bvalues = sparseMatrix._values;
    var bindex = sparseMatrix._index;
    var bptr = sparseMatrix._ptr;
    var bsize = sparseMatrix._size;
    var bdt = sparseMatrix._datatype;

    // validate dimensions
    if (asize.length !== bsize.length)
      throw new DimensionError(asize.length, bsize.length);

    // check rows & columns
    if (asize[0] !== bsize[0] || asize[1] !== bsize[1])
      throw new RangeError('Dimension mismatch. Matrix A (' + asize + ') must match Matrix B (' + bsize + ')');

    // sparse matrix cannot be a Pattern matrix
    if (!bvalues)
      throw new Error('Cannot perform operation on Dense Matrix and Pattern Sparse Matrix');

    // rows & columns
    var rows = asize[0];
    var columns = asize[1];

    // process data types
    var dt = adt && bdt && adt === bdt ? adt : undefined;
    // callback implementation
    var cf = dt && callback.signatures ? callback.signatures[dt + ',' + dt] || callback : callback;

    // result (DenseMatrix)
    var cdata = object.clone(adata);

    // loop columns in b
    for (var j = 0; j < columns; j++) {
      // values in column j
      for (var k0 = bptr[j], k1 = bptr[j + 1], k = k0; k < k1; k++) {
        // row
        var i = bindex[k];
        // update C(i,j)
        cdata[i][j] = inverse ? cf(bvalues[k], cdata[i][j]) : cf(cdata[i][j], bvalues[k]);
      }
    }

    // return dense matrix
    return new DenseMatrix({
      data: cdata,
      size: [rows, columns],
      datatype: dt
    });
  };
  
  return algorithm01;
}

exports.name = 'algorithm01';
exports.factory = factory;
