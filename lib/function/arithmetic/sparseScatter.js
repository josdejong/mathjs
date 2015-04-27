'use strict';

function factory(type, config, load) {
  
  var addScalar = load(require('./addScalar'));
  var multiplyScalar = load(require('./multiplyScalar'));

  /**
   * Copies a sparse vector into a dense one. Computes x = x + v * A(:,j)
   *
   * @param {Matrix} a            The source sparse matrix
   * @param {Number} j            The columns in the sparse matrix to copy the values from
   * @param {Scalar} v            The value to use in the calculation
   * @param {Array}  w            Array with marks indicating the column j has been copied for a given row
   * @param {Array}  x            The dense vector of values
   * @param {Number} mark         The value column j must have in w array
   * @param {Matrix} c            The target sparce matrix
   *
   * @return {Number}             The nonzero elements in matrix c
   * @private
   */
  var sparseScatter = function (a, j, v, w, x, mark, c) {
    // a arrays
    var avalues = a._values;
    var aindex = a._index;
    var aptr = a._ptr;
    // c arrays
    var cindex = c._index;

    // values in j
    for (var k0 = aptr[j], k1 = aptr[j + 1], k = k0; k < k1; k++) {
      // row
      var i = aindex[k];
      // check value exists in current j
      if (!w[i] || w[i] < mark) {
        // i is new entry in j
        w[i] = mark;
        // add i to pattern of C
        cindex.push(i);
        // x(i) = A
        if (x)
          x[i] = multiplyScalar(v, avalues[k]);
      }
      else if (x) {
        // i exists in C already
        x[i] = addScalar(x[i], multiplyScalar(v, avalues[k]));
      }
    }
    // number of nonzero elements in C
    return cindex.length;
  };
  
  return sparseScatter;
}

exports.name = 'sparseScatter';
exports.factory = factory;
