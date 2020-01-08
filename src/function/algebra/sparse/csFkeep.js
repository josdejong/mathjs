/**
 * Keeps entries in the matrix when the callback function returns true, removes the entry otherwise
 *
 * @param {Matrix}   a              The sparse matrix
 * @param {function} callback       The callback function, function will be invoked with the following args:
 *                                    - The entry row
 *                                    - The entry column
 *                                    - The entry value
 *                                    - The state parameter
 * @param {any}      other          The state
 *
 * @return                          The number of nonzero elements in the matrix
 *
 * Reference: http://faculty.cse.tamu.edu/davis/publications.html
 */
export function csFkeep (a, callback, other) {
  // a arrays
  const avalues = a._values
  const aindex = a._index
  const aptr = a._ptr
  const asize = a._size
  // columns
  const n = asize[1]
  // nonzero items
  let nz = 0
  // loop columns
  for (let j = 0; j < n; j++) {
    // get current location of col j
    let p = aptr[j]
    // record new location of col j
    aptr[j] = nz
    for (; p < aptr[j + 1]; p++) {
      // check we need to keep this item
      if (callback(aindex[p], j, avalues ? avalues[p] : 1, other)) {
        // keep A(i,j)
        aindex[nz] = aindex[p]
        // check we need to process values (pattern only)
        if (avalues) { avalues[nz] = avalues[p] }
        // increment nonzero items
        nz++
      }
    }
  }
  // finalize A
  aptr[n] = nz
  // trim arrays
  aindex.splice(nz, aindex.length - nz)
  // check we need to process values (pattern only)
  if (avalues) { avalues.splice(nz, avalues.length - nz) }
  // return number of nonzero items
  return nz
}
