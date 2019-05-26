/**
 * Permutes a sparse matrix C = P * A * Q
 *
 * @param {SparseMatrix}  a         The Matrix A
 * @param {Array}   pinv            The row permutation vector
 * @param {Array}   q               The column permutation vector
 * @param {boolean} values          Create a pattern matrix (false), values and pattern otherwise
 *
 * @return {Matrix}                 C = P * A * Q, null on error
 *
 * Reference: http://faculty.cse.tamu.edu/davis/publications.html
 */
export function csPermute (a, pinv, q, values) {
  // a arrays
  const avalues = a._values
  const aindex = a._index
  const aptr = a._ptr
  const asize = a._size
  const adt = a._datatype
  // rows & columns
  const m = asize[0]
  const n = asize[1]
  // c arrays
  const cvalues = values && a._values ? [] : null
  const cindex = [] // (aptr[n])
  const cptr = [] // (n + 1)
  // initialize vars
  let nz = 0
  // loop columns
  for (let k = 0; k < n; k++) {
    // column k of C is column q[k] of A
    cptr[k] = nz
    // apply column permutation
    const j = q ? (q[k]) : k
    // loop values in column j of A
    for (let t0 = aptr[j], t1 = aptr[j + 1], t = t0; t < t1; t++) {
      // row i of A is row pinv[i] of C
      const r = pinv ? pinv[aindex[t]] : aindex[t]
      // index
      cindex[nz] = r
      // check we need to populate values
      if (cvalues) { cvalues[nz] = avalues[t] }
      // increment number of nonzero elements
      nz++
    }
  }
  // finalize the last column of C
  cptr[n] = nz
  // return C matrix
  return a.createSparseMatrix({
    values: cvalues,
    index: cindex,
    ptr: cptr,
    size: [m, n],
    datatype: adt
  })
}
