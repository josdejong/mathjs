'use strict'

function factory (type, config, load) {
  const abs = load(require('../../arithmetic/abs'))
  const divideScalar = load(require('../../arithmetic/divideScalar'))
  const multiply = load(require('../../arithmetic/multiply'))

  const larger = load(require('../../relational/larger'))
  const largerEq = load(require('../../relational/largerEq'))

  const csSpsolve = load(require('./csSpsolve'))

  const SparseMatrix = type.SparseMatrix

  /**
   * Computes the numeric LU factorization of the sparse matrix A. Implements a Left-looking LU factorization
   * algorithm that computes L and U one column at a tume. At the kth step, it access columns 1 to k-1 of L
   * and column k of A. Given the fill-reducing column ordering q (see parameter s) computes L, U and pinv so
   * L * U = A(p, q), where p is the inverse of pinv.
   *
   * @param {Matrix}  m               The A Matrix to factorize
   * @param {Object}  s               The symbolic analysis from csSqr(). Provides the fill-reducing
   *                                  column ordering q
   * @param {Number}  tol             Partial pivoting threshold (1 for partial pivoting)
   *
   * @return {Number}                 The numeric LU factorization of A or null
   *
   * Reference: http://faculty.cse.tamu.edu/davis/publications.html
   */
  const csLu = function (m, s, tol) {
    // validate input
    if (!m) { return null }
    // m arrays
    const size = m._size
    // columns
    const n = size[1]
    // symbolic analysis result
    let q
    let lnz = 100
    let unz = 100
    // update symbolic analysis parameters
    if (s) {
      q = s.q
      lnz = s.lnz || lnz
      unz = s.unz || unz
    }
    // L arrays
    const lvalues = [] // (lnz)
    const lindex = [] // (lnz)
    const lptr = [] // (n + 1)
    // L
    const L = new SparseMatrix({
      values: lvalues,
      index: lindex,
      ptr: lptr,
      size: [n, n]
    })
    // U arrays
    const uvalues = [] // (unz)
    const uindex = [] // (unz)
    const uptr = [] // (n + 1)
    // U
    const U = new SparseMatrix({
      values: uvalues,
      index: uindex,
      ptr: uptr,
      size: [n, n]
    })
    // inverse of permutation vector
    const pinv = [] // (n)
    // vars
    let i, p
    // allocate arrays
    const x = [] // (n)
    const xi = [] // (2 * n)
    // initialize variables
    for (i = 0; i < n; i++) {
      // clear workspace
      x[i] = 0
      // no rows pivotal yet
      pinv[i] = -1
      // no cols of L yet
      lptr[i + 1] = 0
    }
    // reset number of nonzero elements in L and U
    lnz = 0
    unz = 0
    // compute L(:,k) and U(:,k)
    for (let k = 0; k < n; k++) {
      // update ptr
      lptr[k] = lnz
      uptr[k] = unz
      // apply column permutations if needed
      const col = q ? q[k] : k
      // solve triangular system, x = L\A(:,col)
      const top = csSpsolve(L, m, col, xi, x, pinv, 1)
      // find pivot
      let ipiv = -1
      let a = -1
      // loop xi[] from top -> n
      for (p = top; p < n; p++) {
        // x[i] is nonzero
        i = xi[p]
        // check row i is not yet pivotal
        if (pinv[i] < 0) {
          // absolute value of x[i]
          const xabs = abs(x[i])
          // check absoulte value is greater than pivot value
          if (larger(xabs, a)) {
            // largest pivot candidate so far
            a = xabs
            ipiv = i
          }
        } else {
          // x(i) is the entry U(pinv[i],k)
          uindex[unz] = pinv[i]
          uvalues[unz++] = x[i]
        }
      }
      // validate we found a valid pivot
      if (ipiv === -1 || a <= 0) { return null }
      // update actual pivot column, give preference to diagonal value
      if (pinv[col] < 0 && largerEq(abs(x[col]), multiply(a, tol))) { ipiv = col }
      // the chosen pivot
      const pivot = x[ipiv]
      // last entry in U(:,k) is U(k,k)
      uindex[unz] = k
      uvalues[unz++] = pivot
      // ipiv is the kth pivot row
      pinv[ipiv] = k
      // first entry in L(:,k) is L(k,k) = 1
      lindex[lnz] = ipiv
      lvalues[lnz++] = 1
      // L(k+1:n,k) = x / pivot
      for (p = top; p < n; p++) {
        // row
        i = xi[p]
        // check x(i) is an entry in L(:,k)
        if (pinv[i] < 0) {
          // save unpermuted row in L
          lindex[lnz] = i
          // scale pivot column
          lvalues[lnz++] = divideScalar(x[i], pivot)
        }
        // x[0..n-1] = 0 for next k
        x[i] = 0
      }
    }
    // update ptr
    lptr[n] = lnz
    uptr[n] = unz
    // fix row indices of L for final pinv
    for (p = 0; p < lnz; p++) { lindex[p] = pinv[lindex[p]] }
    // trim arrays
    lvalues.splice(lnz, lvalues.length - lnz)
    lindex.splice(lnz, lindex.length - lnz)
    uvalues.splice(unz, uvalues.length - unz)
    uindex.splice(unz, uindex.length - unz)
    // return LU factor
    return {
      L: L,
      U: U,
      pinv: pinv
    }
  }

  return csLu
}

exports.name = 'csLu'
exports.path = 'algebra.sparse'
exports.factory = factory
