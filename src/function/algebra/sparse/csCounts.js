'use strict'

function factory (type, config, load) {
  const transpose = load(require('../../matrix/transpose'))

  const csLeaf = load(require('./csLeaf'))

  /**
   * Computes the column counts using the upper triangular part of A.
   * It transposes A internally, none of the input parameters are modified.
   *
   * @param {Matrix} a           The sparse matrix A
   *
   * @param {Matrix} ata         Count the columns of A'A instead
   *
   * @return                     An array of size n of the column counts or null on error
   *
   * Reference: http://faculty.cse.tamu.edu/davis/publications.html
   */
  const csCounts = function (a, parent, post, ata) {
    // check inputs
    if (!a || !parent || !post) { return null }
    // a matrix arrays
    const asize = a._size
    // rows and columns
    const m = asize[0]
    const n = asize[1]
    // variables
    let i, j, k, J, p, p0, p1

    // workspace size
    const s = 4 * n + (ata ? (n + m + 1) : 0)
    // allocate workspace
    const w = [] // (s)
    const ancestor = 0 // first n entries
    const maxfirst = n // next n entries
    const prevleaf = 2 * n // next n entries
    const first = 3 * n // next n entries
    const head = 4 * n // next n + 1 entries (used when ata is true)
    const next = 5 * n + 1 // last entries in workspace
    // clear workspace w[0..s-1]
    for (k = 0; k < s; k++) { w[k] = -1 }

    // allocate result
    const colcount = [] // (n)

    // AT = A'
    const at = transpose(a)
    // at arrays
    const tindex = at._index
    const tptr = at._ptr

    // find w[first + j]
    for (k = 0; k < n; k++) {
      j = post[k]
      // colcount[j]=1 if j is a leaf
      colcount[j] = (w[first + j] === -1) ? 1 : 0
      for (; j !== -1 && w[first + j] === -1; j = parent[j]) { w[first + j] = k }
    }

    // initialize ata if needed
    if (ata) {
      // invert post
      for (k = 0; k < n; k++) { w[post[k]] = k }
      // loop rows (columns in AT)
      for (i = 0; i < m; i++) {
        // values in column i of AT
        for (k = n, p0 = tptr[i], p1 = tptr[i + 1], p = p0; p < p1; p++) { k = Math.min(k, w[tindex[p]]) }
        // place row i in linked list k
        w[next + i] = w[head + k]
        w[head + k] = i
      }
    }

    // each node in its own set
    for (i = 0; i < n; i++) { w[ancestor + i] = i }

    for (k = 0; k < n; k++) {
      // j is the kth node in postordered etree
      j = post[k]
      // check j is not a root
      if (parent[j] !== -1) { colcount[parent[j]]-- }

      // J=j for LL'=A case
      for (J = (ata ? w[head + k] : j); J !== -1; J = (ata ? w[next + J] : -1)) {
        for (p = tptr[J]; p < tptr[J + 1]; p++) {
          i = tindex[p]
          const r = csLeaf(i, j, w, first, maxfirst, prevleaf, ancestor)
          // check A(i,j) is in skeleton
          if (r.jleaf >= 1) { colcount[j]++ }
          // check account for overlap in q
          if (r.jleaf === 2) { colcount[r.q]-- }
        }
      }
      if (parent[j] !== -1) { w[ancestor + j] = parent[j] }
    }
    // sum up colcount's of each child
    for (j = 0; j < n; j++) {
      if (parent[j] !== -1) { colcount[parent[j]] += colcount[j] }
    }
    return colcount
  }

  return csCounts
}

exports.name = 'csCounts'
exports.path = 'algebra.sparse'
exports.factory = factory
