import { csMark } from './csMark'
import { csMarked } from './csMarked'

/**
 * Find nonzero pattern of Cholesky L(k,1:k-1) using etree and triu(A(:,k))
 *
 * @param {Matrix}  a               The A matrix
 * @param {Number}  k               The kth column in A
 * @param {Array}   parent          The parent vector from the symbolic analysis result
 * @param {Array}   w               The nonzero pattern xi[top] .. xi[n - 1], an array of size = 2 * n
 *                                  The first n entries is the nonzero pattern, the last n entries is the stack
 *
 * @return {Number}                 The index for the nonzero pattern
 *
 * Reference: http://faculty.cse.tamu.edu/davis/publications.html
 */
export function csEreach (a, k, parent, w) {
  // a arrays
  const aindex = a._index
  const aptr = a._ptr
  const asize = a._size
  // columns
  const n = asize[1]
  // initialize top
  let top = n
  // vars
  let p, p0, p1, len
  // mark node k as visited
  csMark(w, k)
  // loop values & index for column k
  for (p0 = aptr[k], p1 = aptr[k + 1], p = p0; p < p1; p++) {
    // A(i,k) is nonzero
    let i = aindex[p]
    // only use upper triangular part of A
    if (i > k) { continue }
    // traverse up etree
    for (len = 0; !csMarked(w, i); i = parent[i]) {
      // L(k,i) is nonzero, last n entries in w
      w[n + len++] = i
      // mark i as visited
      csMark(w, i)
    }
    while (len > 0) {
      // decrement top & len
      --top
      --len
      // push path onto stack, last n entries in w
      w[n + top] = w[n + len]
    }
  }
  // unmark all nodes
  for (p = top; p < n; p++) {
    // use stack value, last n entries in w
    csMark(w, w[n + p])
  }
  // unmark node k
  csMark(w, k)
  // s[top..n-1] contains pattern of L(k,:)
  return top
}
