'use strict';

function factory() {

  /**
   * Copies a sparse vector into a dense one. Computes x = x + v * A(:,j)
   *
   * @param {Matrix}   a            The source sparse matrix
   * @param {Number}   j            The columns in the sparse matrix to copy the values from
   * @param {Scalar}   v            The value to use in the calculation
   * @param {Array}    w            Array with marks indicating the column j has been copied for a given row
   * @param {Array}    x            The dense vector of values
   * @param {Number}   mark         The value column j must have in w array
   * @param {Matrix}   c            The target sparse matrix
   * @param {function} multiply     Function to use to mutiply two scalar values
   * @param {function} add          Function to use to add two scalar values
   *
   * @return {Number}             The nonzero elements in matrix c
   * @private
   */
  var sparseScatter = function (a, j, v, w, x, mark, c, multiply, add) {
    // a arrays
    var avalues = a._values;
    var aindex = a._index;
    var aptr = a._ptr;
    // c arrays
    var cindex = c._index;

    // check we need to process values
    if (x) {
      // values in j
      for (var k0 = aptr[j], k1 = aptr[j + 1], k = k0; k < k1; k++) {
        // row
        var i = aindex[k];
        // check value exists in current j
        if (w[i] !== mark) {
          // i is new entry in j
          w[i] = mark;
          // add i to pattern of C
          cindex.push(i);
          // x(i) = A
          x[i] = multiply(v, avalues[k]);
        }
        else {
          // i exists in C already
          x[i] = add(x[i], multiply(v, avalues[k]));
        }
      }
    }
    else {
      // values in j
      for (var k0 = aptr[j], k1 = aptr[j + 1], k = k0; k < k1; k++) {
        // row
        var i = aindex[k];
        // check value exists in current j
        if (w[i] !== mark) {
          // i is new entry in j
          w[i] = mark;
          // add i to pattern of C
          cindex.push(i);
        }
      }
    }
    // number of nonzero elements in C
    return cindex.length;
  };
  
  return sparseScatter;
}

exports.name = 'sparseScatter';
exports.factory = factory;
