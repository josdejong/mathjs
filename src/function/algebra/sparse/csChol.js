'use strict'

function factory (type, config, load) {
  const divideScalar = load(require('../../arithmetic/divideScalar'))
  const sqrt = load(require('../../arithmetic/sqrt'))
  const subtract = load(require('../../arithmetic/subtract'))
  const multiply = load(require('../../arithmetic/multiply'))
  const im = load(require('../../complex/im'))
  const re = load(require('../../complex/re'))
  const conj = load(require('../../complex/conj'))
  const equal = load(require('../../relational/equal'))
  const smallerEq = load(require('../../relational/smallerEq'))

  const csSymperm = load(require('./csSymperm'))
  const csEreach = load(require('./csEreach'))

  const SparseMatrix = type.SparseMatrix

  /**
   * Computes the Cholesky factorization of matrix A. It computes L and P so
   * L * L' = P * A * P'
   *
   * @param {Matrix}  m               The A Matrix to factorize, only upper triangular part used
   * @param {Object}  s               The symbolic analysis from cs_schol()
   *
   * @return {Number}                 The numeric Cholesky factorization of A or null
   *
   * Reference: http://faculty.cse.tamu.edu/davis/publications.html
   */
  const csChol = function (m, s) {
    // validate input
    if (!m) { return null }
    // m arrays
    const size = m._size
    // columns
    const n = size[1]
    // symbolic analysis result
    const parent = s.parent
    const cp = s.cp
    const pinv = s.pinv
    // L arrays
    const lvalues = []
    const lindex = []
    const lptr = []
    // L
    const L = new SparseMatrix({
      values: lvalues,
      index: lindex,
      ptr: lptr,
      size: [n, n]
    })
    // vars
    const c = [] // (2 * n)
    const x = [] // (n)
    // compute C = P * A * P'
    const cm = pinv ? csSymperm(m, pinv, 1) : m
    // C matrix arrays
    const cvalues = cm._values
    const cindex = cm._index
    const cptr = cm._ptr
    // vars
    let k, p
    // initialize variables
    for (k = 0; k < n; k++) { lptr[k] = c[k] = cp[k] }
    // compute L(k,:) for L*L' = C
    for (k = 0; k < n; k++) {
      // nonzero pattern of L(k,:)
      let top = csEreach(cm, k, parent, c)
      // x (0:k) is now zero
      x[k] = 0
      // x = full(triu(C(:,k)))
      for (p = cptr[k]; p < cptr[k + 1]; p++) {
        if (cindex[p] <= k) { x[cindex[p]] = cvalues[p] }
      }
      // d = C(k,k)
      let d = x[k]
      // clear x for k+1st iteration
      x[k] = 0
      // solve L(0:k-1,0:k-1) * x = C(:,k)
      for (; top < n; top++) {
        // s[top..n-1] is pattern of L(k,:)
        const i = s[top]
        // L(k,i) = x (i) / L(i,i)
        const lki = divideScalar(x[i], lvalues[lptr[i]])
        // clear x for k+1st iteration
        x[i] = 0
        for (p = lptr[i] + 1; p < c[i]; p++) {
          // row
          const r = lindex[p]
          // update x[r]
          x[r] = subtract(x[r], multiply(lvalues[p], lki))
        }
        // d = d - L(k,i)*L(k,i)
        d = subtract(d, multiply(lki, conj(lki)))
        p = c[i]++
        // store L(k,i) in column i
        lindex[p] = k
        lvalues[p] = conj(lki)
      }
      // compute L(k,k)
      if (smallerEq(re(d), 0) || !equal(im(d), 0)) {
        // not pos def
        return null
      }
      p = c[k]++
      //  store L(k,k) = sqrt(d) in column k
      lindex[p] = k
      lvalues[p] = sqrt(d)
    }
    // finalize L
    lptr[n] = cp[n]
    // P matrix
    let P
    // check we need to calculate P
    if (pinv) {
      // P arrays
      const pvalues = []
      const pindex = []
      const pptr = []
      // create P matrix
      for (p = 0; p < n; p++) {
        // initialize ptr (one value per column)
        pptr[p] = p
        // index (apply permutation vector)
        pindex.push(pinv[p])
        // value 1
        pvalues.push(1)
      }
      // update ptr
      pptr[n] = n
      // P
      P = new SparseMatrix({
        values: pvalues,
        index: pindex,
        ptr: pptr,
        size: [n, n]
      })
    }
    // return L & P
    return {
      L: L,
      P: P
    }
  }

  return csChol
}

exports.name = 'csChol'
exports.path = 'algebra.sparse'
exports.factory = factory
