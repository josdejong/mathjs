'use strict';

var util = require('../../../util/index');
var DimensionError = require('../../../error/DimensionError');

var object = util.object;

function factory (type) {

  var DenseMatrix = type.DenseMatrix;

  /**
   * Iterates over DenseMatrix items and invokes the callback function f(Aij..z, Bij..z). 
   * Callback function invoked MxN times.
   *
   * C(i,j,...z) = f(Aij..z, Bij..z)
   *
   * @param {Matrix}   a                 The DenseMatrix instance (A)
   * @param {Matrix}   b                 The DenseMatrix instance (B)
   * @param {function} callback          The f(Aij..z,Bij..z) operation to invoke
   *
   * @return {Matrix}                    DenseMatrix (C)
   *
   * https://github.com/josdejong/mathjs/pull/346#issuecomment-97658658
   */
  var algorithm12 = function (a, b, callback) {
    // a arrays
    var adata = a._data;
    var asize = a._size;
    var adt = a._datatype;
    // b arrays
    var bdata = b._data;
    var bsize = b._size;
    var bdt = b._datatype;

    // validate dimensions
    if (asize.length !== bsize.length)
      throw new DimensionError(asize.length, bsize.length);

    // validate each one of the dimension sizes
    for (var s = 0; s < asize.length; s++) {
      // must match
      if (asize[s] !== bsize[s])
        throw new RangeError('Dimension mismatch. Matrix A (' + asize + ') must match Matrix B (' + bsize + ')');
    }

    // process data types
    var dt = adt && bdt && adt === bdt ? adt : undefined;
    // callback implementation
    var cf = dt && callback.signatures ? callback.signatures[dt + ',' + dt] || callback : callback;

    // c arrays
    var cdata = new Array(asize[0]);
    // c matrix
    var c = new DenseMatrix({
      data: cdata,
      size: object.clone(asize),
      datatype: dt
    });

    // recursive function
    var iterate = function (level, n, av, bv, cv) {
      // check we reach the last level
      if (level === asize.length - 1) {
        // loop arrays in last level
        for (var i = 0; i < n; i++) {
          // invoke callback and store value
          cv[i] = cf(av[i], bv[i]);
        }
      }
      else {
        // iterate current level
        for (var j = 0; j < n; j++) {
          // initialize cv for this level
          var cvl = new Array(n);
          // iterate next level
          iterate(level + 1, asize[level + 1], av[j], bv[j], cvl);
          // store array
          cv[j] = cvl;
        }
      }
    };

    // populate cdata, iterate through dimensions
    iterate(0, cdata.length, adata, bdata, cdata);

    // return matrix
    return c;
  };
  
  return algorithm12;
}

exports.name = 'algorithm12';
exports.factory = factory;
