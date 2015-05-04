'use strict';

var util = require('../../../util/index');

var object = util.object;

function factory (type) {

  var DenseMatrix = type.DenseMatrix;

  /**
   * Iterates over DenseMatrix items and invokes the callback function f(Aij..z, b). 
   * Callback function invoked MxN times.
   *
   * C(i,j,...z) = f(Aij..z, b)
   *
   * @param {Matrix}   a                 The DenseMatrix instance (A)
   * @param {Scalar}   b                 The Scalar value
   * @param {function} callback          The f(Aij..z,b) operation to invoke
   * @param {boolean}  inverse           A true value indicates callback should be invoked f(b,Aij..z)
   *
   * @return {Matrix}                    DenseMatrix (C)
   *
   * https://github.com/josdejong/mathjs/pull/346#issuecomment-97659042
   */
  var algorithm14 = function (a, b, callback, inverse) {
    // a arrays
    var adata = a._data;
    var asize = a._size;

    // c arrays
    var cdata = new Array(asize[0]);
    // c matrix
    var c = new DenseMatrix({
      data: cdata,
      size: object.clone(asize)
    });

    // recursive function
    var iterate = function (level, n, av, cv) {
      // check we reach the last level
      if (level === asize.length - 1) {
        // loop arrays in last level
        for (var i = 0; i < n; i++) {
          // invoke callback and store value
          cv[i] = inverse ? callback(b, av[i]) : callback(av[i], b);
        }
      }
      else {
        // iterate current level
        for (var j = 0; j < n; j++) {
          // initialize cv for this level
          var cvl = new Array(n);
          // iterate next level
          iterate(level + 1, asize[level + 1], av[j], cvl);
          // store array
          cv[j] = cvl;
        }
      }
    };

    // populate cdata, iterate through dimensions
    iterate(0, cdata.length, adata, cdata);

    // return matrix
    return c;
  };

  return algorithm14;
}

exports.name = 'algorithm14';
exports.factory = factory;
