import { csReach } from './csReach'
import { factory } from '../../../utils/factory'

const name = 'csSpsolve'
const dependencies = [
  'divideScalar',
  'multiply',
  'subtract'
]

export const createCsSpsolve = /* #__PURE__ */ factory(name, dependencies, ({ divideScalar, multiply, subtract }) => {
  /**
   * The function csSpsolve() computes the solution to G * x = bk, where bk is the
   * kth column of B. When lo is true, the function assumes G = L is lower triangular with the
   * diagonal entry as the first entry in each column. When lo is true, the function assumes G = U
   * is upper triangular with the diagonal entry as the last entry in each column.
   *
   * @param {Matrix}  g               The G matrix
   * @param {Matrix}  b               The B matrix
   * @param {Number}  k               The kth column in B
   * @param {Array}   xi              The nonzero pattern xi[top] .. xi[n - 1], an array of size = 2 * n
   *                                  The first n entries is the nonzero pattern, the last n entries is the stack
   * @param {Array}   x               The soluton to the linear system G * x = b
   * @param {Array}   pinv            The inverse row permutation vector, must be null for L * x = b
   * @param {boolean} lo              The lower (true) upper triangular (false) flag
   *
   * @return {Number}                 The index for the nonzero pattern
   *
   * Reference: http://faculty.cse.tamu.edu/davis/publications.html
   */
  return function csSpsolve (g, b, k, xi, x, pinv, lo) {
    // g arrays
    const gvalues = g._values
    const gindex = g._index
    const gptr = g._ptr
    const gsize = g._size
    // columns
    const n = gsize[1]
    // b arrays
    const bvalues = b._values
    const bindex = b._index
    const bptr = b._ptr
    // vars
    let p, p0, p1, q
    // xi[top..n-1] = csReach(B(:,k))
    const top = csReach(g, b, k, xi, pinv)
    // clear x
    for (p = top; p < n; p++) { x[xi[p]] = 0 }
    // scatter b
    for (p0 = bptr[k], p1 = bptr[k + 1], p = p0; p < p1; p++) { x[bindex[p]] = bvalues[p] }
    // loop columns
    for (let px = top; px < n; px++) {
      // x array index for px
      const j = xi[px]
      // apply permutation vector (U x = b), j maps to column J of G
      const J = pinv ? pinv[j] : j
      // check column J is empty
      if (J < 0) { continue }
      // column value indeces in G, p0 <= p < p1
      p0 = gptr[J]
      p1 = gptr[J + 1]
      // x(j) /= G(j,j)
      x[j] = divideScalar(x[j], gvalues[lo ? p0 : (p1 - 1)])
      // first entry L(j,j)
      p = lo ? (p0 + 1) : p0
      q = lo ? (p1) : (p1 - 1)
      // loop
      for (; p < q; p++) {
        // row
        const i = gindex[p]
        // x(i) -= G(i,j) * x(j)
        x[i] = subtract(x[i], multiply(gvalues[p], x[j]))
      }
    }
    // return top of stack
    return top
  }
})
