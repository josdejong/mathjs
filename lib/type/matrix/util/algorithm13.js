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
    var cdata = [];
    var csize = [];

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
    var cf = dt && callback.signatures ? callback.signatures[dt + ',' + dt] || callback : callback;

    // c matrix
    var c = new DenseMatrix({
      data: cdata,
      size: csize,
      datatype: dt
    });

    // stack
    var stack = [];
    
    // current item in stack
    var current = {
      level: 0,
      a: adata,
      b: bdata,
      c: cdata      
    };
    
    while (current) {      
      // arrays
      var sa = current.a;
      var sb = current.b;
      var sc = current.c;
      // level
      var l = current.level;
      // number of items in current level
      var n = asize[l];
      // check this is the last level
      if (l === asize.length - 1) {        
        // loop arrays in last level
        for (var i = 0; i < n; i++) {
          // invoke callback and store value
          sc[i] = cf(sa[i], sb[i]);
        }
      }
      else {
        // iterate current level
        for (var j = 0; j < n; j++) {
          // initialize c for this level
          sc[j] = [];
          // push stack
          stack.push({
            level: l + 1,
            a: sa[j],
            b: sb[j],
            c: sc[j]
          });
        }
      }
      // current
      current = stack.pop();
    }
    
    // populate cdata, iterate through dimensions
    // _iterate(cf, 0, asize, cdata.length, adata, bdata, cdata);

    // return matrix
    return c;
  };
  
  // recursive function
  var _iterate = function (f, level, s, n, av, bv) {
    // initialize array for this level
    var cv = [];
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
        // iterate next level
        cv[j] = _iterate(f, level + 1, s, s[level + 1], av[j], bv[j]);
      }
    }
    return cv;
  };
  
  return algorithm13;
}

exports.name = 'algorithm13';
exports.factory = factory;
