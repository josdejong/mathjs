'use strict'

function factory (type, config, load) {
  const csDfs = load(require('./csDfs'))
  const csMarked = load(require('./csMarked'))
  const csMark = load(require('./csMark'))

  /**
   * The csReach function computes X = Reach(B), where B is the nonzero pattern of the n-by-1
   * sparse column of vector b. The function returns the set of nodes reachable from any node in B. The
   * nonzero pattern xi of the solution x to the sparse linear system Lx=b is given by X=Reach(B).
   *
   * @param {Matrix}  g               The G matrix
   * @param {Matrix}  b               The B matrix
   * @param {Number}  k               The kth column in B
   * @param {Array}   xi              The nonzero pattern xi[top] .. xi[n - 1], an array of size = 2 * n
   *                                  The first n entries is the nonzero pattern, the last n entries is the stack
   * @param {Array}   pinv            The inverse row permutation vector
   *
   * @return {Number}                 The index for the nonzero pattern
   *
   * Reference: http://faculty.cse.tamu.edu/davis/publications.html
   */
  const csReach = function (g, b, k, xi, pinv) {
    // g arrays
    const gptr = g._ptr
    const gsize = g._size
    // b arrays
    const bindex = b._index
    const bptr = b._ptr
    // columns
    const n = gsize[1]
    // vars
    let p, p0, p1
    // initialize top
    let top = n
    // loop column indeces in B
    for (p0 = bptr[k], p1 = bptr[k + 1], p = p0; p < p1; p++) {
      // node i
      const i = bindex[p]
      // check node i is marked
      if (!csMarked(gptr, i)) {
        // start a dfs at unmarked node i
        top = csDfs(i, g, top, xi, pinv)
      }
    }
    // loop columns from top -> n - 1
    for (p = top; p < n; p++) {
      // restore G
      csMark(gptr, xi[p])
    }
    return top
  }

  return csReach
}

exports.name = 'csReach'
exports.path = 'algebra.sparse'
exports.factory = factory
