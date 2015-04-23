'use strict';

function factory (type, config, load) {

  var sparse_dfs = load(require('./sparse_dfs'));
  var sparse_marked = load(require('./sparse_marked'));
  var sparse_mark = load(require('./sparse_mark'));

  /**
   * The sparse_reach function computes X = Reach(B), where B is the nonzero pattern of the n-by-1 
   * sparse column of vector b. The function returns X in the xi array, in the locations top to n - 1,
   * in topological order.
   *
   * @param {Matrix}  g               The G matrix
   * @param {Matrix}  b               The B matrix
   * @param {Number}  k               The kth column in B
   * @param {Array}   xi              The nonzero pattern xi[top] .. xi[n - 1], an array of size = 2 * n
   * @param {Array}   pinv            The permutation vector
   *
   * @return {Number}                 The index for the nonzero pattern
   *
   * Reference: http://faculty.cse.tamu.edu/davis/publications.html
   */
  var sparse_reach = function (g, b, k, xi, pinv) {
    // g arrays
    var index = g._index;
    var ptr = g._ptr;
    var size = g._size;
    // columns
    var n = size[1];
    // vars
    var p, p0, p1;
    // initialize top
    var top = n ;
    // loop column indeces
    for (p0 = ptr[k], p1 = ptr[k + 1], p = p0; p < p1; p++) {
      // node i
      var i = index[p];
      // check node i is marked
      if (!sparse_marked(ptr, i)) {
        // start a dfs at unmarked node i
        top = sparse_dfs(i, g, top, xi, xi + n, pinv); // TODO
      }
    }
    // loop columns from top -> n - 1
    for (p = top; p < n; p++) {
      // restore G
      sparse_mark(ptr, xi[p]);
    }
    return top;
  };

  return sparse_reach;
}

exports.name = 'sparse_reach';
exports.path = 'sparse';
exports.factory = factory;
