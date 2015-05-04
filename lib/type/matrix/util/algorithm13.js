'use strict';

var DimensionError = require('../../../error/DimensionError');

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
  var algorithm13 = function (a, b, callback) {
    // a arrays
    var adata = a._data;
    var asize = a._size;
    var adt = a._datatype;
    // b arrays
    var bdata = b._data;
    var bsize = b._size;
    var bdt = b._datatype;
    // c arrays
    var cdata = new Array(asize[0]);
    var csize = new Array(asize.length);

    // validate dimensions
    if (asize.length !== bsize.length)
      throw new DimensionError(asize.length, bsize.length);

    // validate each one of the dimension sizes
    for (var s = 0; s < asize.length; s++) {
      // must match
      if (asize[s] !== bsize[s])
        throw new RangeError('Dimension mismatch. Matrix A (' + asize + ') must match Matrix B (' + bsize + ')');
      // update dimension in c
      csize[s] = asize[s];
    }

    // process data types
    var dt = adt && bdt && adt === bdt ? adt : undefined;
    // callback implementation
    var cf = callback; //dt && callback.signatures ? callback.signatures[dt + ',' + dt] || callback : callback;

    // c matrix
    var c = new DenseMatrix({
      data: cdata,
      size: csize,
      datatype: dt
    });

    // populate cdata, iterate through dimensions
    _iterate(cf, 0, asize, cdata.length, adata, bdata, cdata);

    // return matrix
    return c;
  };
  
  // recursive function
  var _iterate = function (f, level, s, n, av, bv, cv) {
    // check we reach the last level
    if (level === s.length - 1) {
      // loop arrays in last level
      for (var i = 0; i < n; i++) {
        // invoke callback and store value
        cv[i] = f(av[i], bv[i]);
      }
    }
    else {
      // iterate current level
      for (var j = 0; j < n; j++) {
        // initialize cv for this level
        var cvl = new Array(n);
        // iterate next level
        _iterate(f, level + 1, s, s[level + 1], av[j], bv[j], cvl);
        // store array
        cv[j] = cvl;
      }
    }
  };
  
  return algorithm13;
}

exports.name = 'algorithm13';
exports.factory = factory;
