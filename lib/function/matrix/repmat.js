'use strict';

module.exports = function (math) {
  var Matrix = require('../../type/Matrix'),
      collection = require('../../type/collection'),

      isCollection = collection.isCollection;
  /**
   * Creates a large array or matrix consisting of an M-by-N tiling of copies of x.
   *
   * Syntax:
   *     math.repmat(x, m)        // return a large matrix m by m
   *     math.repmat(x, m, n)     // return a large matrix m by n
   *
   * Examples:
   *
   *     var d = [[1, 2], [3, 4]];
   *     math.repmat(d, 2);     // returns [ [1, 2, 1, 2], [3, 4, 3, 4], [1, 2, 1, 2], [3, 4, 3, 4] ]
   *     math.repmat(d, 3, 1);  // returns [ [1, 2], [3, 4], [1, 2], [3, 4], [1, 2], [3, 4] ]
   *
   *
   * See also:
   *
   *     size, subset, index
   *
   * @param {Array | Matrix} x  An array, matrix
   * @param {Number} m          A row tiling number
   * @param {Number} n          A column tiling number
   *                                          
   * @return {Array | Matrix} return a larged array | matrix.
   */
  math.repmat = function repmat (x, m, n) {
    if (!isCollection(x)){
      throw new math.error.UnsupportedTypeError('repmat', math['typeof'](x));
    }
    if (!m) { m = 1; }
    if (!n) { n = m; }
    
    var array = (x instanceof Matrix) ? x.valueOf() : x;
    
    var size = math.size(array);
    var w = size[0], h = size[1];

    var A = math.zeros([w * m, h * n]);

    for(var i=0; i<m; i++){
      for(var j=0; j<n; j++){
        A = math.subset(A, math.index([i*w, i*w + w], [j*h, j*h + h]), array);
      }
    }
    
    if (x instanceof Matrix){
      return new Matrix(A);
    }
    else{
      return A;
    }
  };

};
