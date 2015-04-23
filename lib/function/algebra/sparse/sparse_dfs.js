'use strict';

function factory (type, config, load) {

  var divideScalar = load(require('../../arithmetic/divideScalar'));
  var multiply = load(require('../../arithmetic/multiply'));
  var subtract = load(require('../../arithmetic/subtract'));

  var sparse_reach = load(require('./sparse_reach'));

  /**
   * 
   *
   * @param {Matrix}  g               The G matrix
   * @param {Matrix}  b               The B matrix
   * @param {Number}  k               The kth column in B
   * @param {Array}   xi              The nonzero pattern xi[top] .. xi[n - 1], an array of size = 2 * n
   * @param {Array}   x               The soluton to the linear system G * x = b
   * @param {Array}   pinv            The permutation vector, must be null for L * x = b
   * @param {boolean} lo              The lower (true) upper triangular (false) flag
   *
   * @return {Number}                 The index for the nonzero pattern
   *
   * Reference: http://faculty.cse.tamu.edu/davis/publications.html
   */
  var sparse_dfs = function (j, g, top, xi, CS_INT *pstack, pinv) {
    // g arrays
    var values = g._values;
    var index = g._index;
    var ptr = g._ptr;
    var size = g._size;
    // columns
    var n = size[1];
    // vars
    var p, p0, p1, q;
    
  };

  return sparse_dfs;
}

exports.name = 'sparse_dfs';
exports.path = 'sparse';
exports.factory = factory;
